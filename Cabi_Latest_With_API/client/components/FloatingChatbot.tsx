import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Mic, MicOff, Car, MapPin, Phone } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isBooking?: boolean;
}

const GEMINI_API_KEY = 'AIzaSyBKD9LS2witnuFT5dEiMHtORiG_UYF63Dc';

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'bot',
    content: "Hello! I'm Cabi, your CAB-I-NET AI assistant. 🚗\n\nI can help you:\n• Book rides with voice commands\n• Check prices and availability  \n• Answer questions about our service\n• Provide support\n\nTry saying: \"Hey Cabi, book me a cab from my current location to home\"",
    timestamp: new Date()
  }
];

const quickReplies = [
  "Book a ride",
  "Check prices", 
  "Track my ride",
  "Cancel booking",
  "Call support"
];

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);
  const { addNotification, updateBooking } = useAppState();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');

        if (event.results[event.results.length - 1].isFinal) {
          handleVoiceCommand(transcript);
          setIsListening(false);
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setIsRecognitionActive(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setIsRecognitionActive(false);
      };
    }

    // Listen for "Hey Cabi" wake word
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key === 'c') {
        startVoiceRecognition();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const startVoiceRecognition = () => {
    if (recognitionRef.current && !isRecognitionActive) {
      setIsListening(true);
      setIsRecognitionActive(true);
      recognitionRef.current.start();
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current && isRecognitionActive) {
      recognitionRef.current.stop();
    }
  };

  const handleVoiceCommand = async (transcript: string) => {
    const command = transcript.toLowerCase();
    
    // Check for "Hey Cabi" wake word
    if (command.includes('hey cabi') || command.includes('hey cabbie')) {
      if (!isOpen) setIsOpen(true);
      
      // Extract the actual command after "hey cabi"
      const actualCommand = command.replace(/hey cabi?e?/gi, '').trim();
      
      if (actualCommand) {
        await handleUserMessage(actualCommand, true);
      } else {
        const botMessage: Message = {
          id: Date.now().toString(),
          type: 'bot',
          content: "I'm listening! How can I help you today? 🎤",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } else {
      await handleUserMessage(transcript, true);
    }
  };

  const callGeminiAPI = async (userMessage: string, isVoiceCommand: boolean = false): Promise<string> => {
    try {
      const context = `You are Cabi, a friendly AI assistant for CAB-I-NET, a premium cab booking service. You can:

1. Book rides when users provide pickup and destination
2. Answer questions about cab services, pricing, features
3. Provide support and help
4. Handle voice commands naturally

Current context:
- This is a ${isVoiceCommand ? 'voice command' : 'text message'}
- User message: "${userMessage}"

If the user wants to book a ride, respond with booking confirmation and include [BOOK_RIDE] at the end.
If they need support, include [CALL_SUPPORT] at the end.
Be helpful, friendly, and concise. Use emojis appropriately.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: context
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || "I'm here to help! How can I assist you with your ride today?";
    } catch (error) {
      console.error('Gemini API error:', error);
      return "I'm having trouble connecting right now, but I'm still here to help! You can book a ride or ask me anything about our service.";
    }
  };

  const handleUserMessage = async (content: string, isVoiceCommand: boolean = false) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const aiResponse = await callGeminiAPI(content, isVoiceCommand);
      
      // Check for special commands
      let finalResponse = aiResponse;
      let isBooking = false;

      if (aiResponse.includes('[BOOK_RIDE]')) {
        finalResponse = aiResponse.replace('[BOOK_RIDE]', '');
        isBooking = true;
        
        // Simulate ride booking
        setTimeout(() => {
          updateBooking({
            pickup: 'Current Location',
            destination: 'Home',
            rideType: 'UberX',
            status: 'confirmed',
            driver: {
              name: 'Rajesh Kumar',
              rating: 4.9,
              eta: '3 min',
              vehicleNumber: 'KA 05 MZ 1234'
            }
          });

          addNotification({
            type: 'success',
            message: '🚗 Ride booked successfully! Rajesh Kumar will arrive in 3 minutes.'
          });

          const bookingConfirm: Message = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: "✅ Ride confirmed! Your driver Rajesh Kumar (KA 05 MZ 1234) will arrive in 3 minutes. You can track your ride in real-time. 🚗",
            timestamp: new Date(),
            isBooking: true
          };
          setMessages(prev => [...prev, bookingConfirm]);
        }, 2000);
      }

      if (aiResponse.includes('[CALL_SUPPORT]')) {
        finalResponse = aiResponse.replace('[CALL_SUPPORT]', '');
        addNotification({
          type: 'info',
          message: '📞 Connecting to support: +91 800-CAB-INET'
        });
      }

      const botResponse: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: finalResponse,
        timestamp: new Date(),
        isBooking
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorResponse: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: "I'm having trouble right now, but I'm still here to help! You can try booking a ride or asking me anything about our service.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = () => {
    handleUserMessage(inputValue);
  };

  const handleQuickReply = (reply: string) => {
    handleUserMessage(reply);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-gradient-gold rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cabinet-light-yellow to-cabinet-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          <MessageCircle className="w-8 h-8 text-black relative z-10" />
          
          {/* Notification Badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[90vw] h-[500px] glass-morphism rounded-3xl border border-cabinet-yellow/30 z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-cabinet-yellow/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-gold rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Cabi AI Assistant</h3>
                  <p className="text-cabinet-grey text-sm">Always here to help 🚗</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-cabinet-yellow/20 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-cabinet-grey" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-cabinet-yellow text-black' 
                      : 'bg-gradient-gold text-black'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`rounded-2xl p-3 ${
                    message.type === 'user'
                      ? 'bg-cabinet-yellow text-black'
                      : message.isBooking
                      ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                      : 'glass-morphism border border-cabinet-yellow/30 text-white'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <span className={`text-xs opacity-70 mt-1 block ${
                      message.type === 'user' ? 'text-black/70' : 'text-cabinet-grey'
                    }`}>
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-gradient-gold rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-black" />
                  </div>
                  <div className="glass-morphism border border-cabinet-yellow/30 rounded-2xl p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-cabinet-yellow rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-cabinet-yellow rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-cabinet-yellow rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="p-3 border-t border-cabinet-yellow/20">
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleQuickReply(reply)}
                  className="px-3 py-1 bg-cabinet-yellow/20 text-cabinet-yellow text-xs rounded-full hover:bg-cabinet-yellow/30 transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-cabinet-yellow/20">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message or try 'Hey Cabi'..."
                  className="w-full px-4 py-3 glass-morphism rounded-2xl border border-cabinet-yellow/30 text-white placeholder-cabinet-grey focus:border-cabinet-yellow focus:outline-none text-sm"
                />
              </div>
              <button
                onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                className={`p-3 rounded-2xl transition-all duration-300 ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'glass-morphism border border-cabinet-yellow/30 text-cabinet-yellow hover:bg-cabinet-yellow hover:text-black'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="p-3 bg-cabinet-yellow text-black rounded-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            {/* Voice Command Hint */}
            <div className="mt-2 text-center">
              <p className="text-cabinet-grey text-xs">
                💡 Press Alt+C or say "Hey Cabi" for voice commands
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
