import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { 
  MessageCircle, 
  Send, 
  X, 
  User,
  CheckCircle,
  Star
} from 'lucide-react';

interface MessageUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  userAvatar: string;
  userRating: number;
  context?: string; // Optional context like "ride sharing"
}

export default function MessageUserDialog({ 
  open, 
  onOpenChange, 
  userName, 
  userAvatar, 
  userRating,
  context 
}: MessageUserDialogProps) {
  const { authState } = useAuth();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setIsSending(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Message sent:', {
        from: authState.user?.name,
        to: userName,
        message: message.trim(),
        context,
        timestamp: new Date().toISOString()
      });

      setIsSent(true);
      
      // Reset and close after success message
      setTimeout(() => {
        setIsSent(false);
        setMessage('');
        onOpenChange(false);
      }, 2500);

    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (isSent) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="glass-morphism border border-cabinet-yellow/30 max-w-md mx-auto">
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-display font-bold text-white mb-2">
              Message Sent!
            </h3>
            <p className="text-cabinet-grey mb-4">
              Your message has been sent to {userName}. They'll get a notification and can reply directly.
            </p>
            <p className="text-cabinet-yellow text-sm">
              Check your messages for their reply
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-morphism border border-cabinet-yellow/30 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold text-cabinet-yellow text-gradient flex items-center space-x-2">
            <MessageCircle className="w-6 h-6" />
            <span>Send Message</span>
          </DialogTitle>
          {context && (
            <p className="text-cabinet-grey text-sm">
              Regarding: {context}
            </p>
          )}
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Recipient Info */}
          <div className="glass-morphism p-4 rounded-xl border border-cabinet-yellow/20">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{userAvatar}</div>
              <div>
                <h4 className="text-white font-semibold text-lg">{userName}</h4>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-cabinet-grey">{userRating} rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Message Composer */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-cabinet-yellow font-semibold">Your Message</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Hi ${userName}, I'm interested in ${context || 'connecting with you'}...`}
                rows={6}
                className="glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white placeholder:text-cabinet-grey resize-none"
                maxLength={500}
              />
              <div className="text-right">
                <span className="text-cabinet-grey text-xs">
                  {message.length}/500 characters
                </span>
              </div>
            </div>

            {/* Quick Message Templates */}
            <div className="space-y-2">
              <label className="text-cabinet-grey text-sm">Quick Templates:</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  `Hi ${userName}, I'm interested in joining your ride. Could we discuss the details?`,
                  `Hello ${userName}, I saw your ride sharing post. Are you still looking for passengers?`,
                  `Hi ${userName}, thanks for sharing your experience! Could you tell me more about it?`
                ].map((template, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(template)}
                    className="text-left p-3 glass-morphism border border-cabinet-yellow/20 rounded-lg hover:border-cabinet-yellow/40 transition-all duration-300 text-cabinet-grey hover:text-white text-sm"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>

            {/* Sender Info */}
            <div className="glass-morphism p-3 rounded-lg border border-cabinet-yellow/10">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-cabinet-yellow" />
                <div>
                  <p className="text-white text-sm font-medium">
                    Sending as: {authState.user?.name}
                  </p>
                  <p className="text-cabinet-grey text-xs">
                    {userName} will see your profile and can reply directly
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-cabinet-yellow/20">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1 border-cabinet-grey/50 text-cabinet-grey hover:bg-cabinet-grey/10"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={isSending || !message.trim()}
              className="flex-1 btn-premium"
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </div>

          {/* Privacy Note */}
          <div className="text-center pt-4 border-t border-cabinet-yellow/20">
            <p className="text-cabinet-grey text-xs">
              Messages are secure and private. Both users will be notified via app and email.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
