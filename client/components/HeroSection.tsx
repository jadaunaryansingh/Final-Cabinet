import { useState } from 'react';
import { MapPin, Mic, ArrowRight, Navigation } from 'lucide-react';

export default function HeroSection() {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleVoiceBooking = () => {
    setIsListening(!isListening);
    // Voice booking logic would go here
  };

  const handleBookRide = () => {
    if (pickup && destination) {
      // Booking logic would go here
      console.log('Booking ride from', pickup, 'to', destination);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-cabinet-yellow/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-cabinet-gold/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-cabinet-light-yellow/10 blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Bee Mascot */}
        <div className="flex flex-col items-center lg:items-start space-y-8">
          {/* 3D Animated Bumble Bee */}
          <div className="relative">
            <div className="w-80 h-80 relative group cursor-pointer">
              {/* Bee Body */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Bee Shadow */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-40 h-8 bg-black/20 rounded-full blur-lg"></div>
                  
                  {/* Main Bee */}
                  <div className="relative animate-float group-hover:animate-bounce">
                    {/* Wings */}
                    <div className="absolute -top-6 left-8 w-16 h-8 bg-gradient-to-r from-white/40 to-white/10 rounded-full animate-pulse"></div>
                    <div className="absolute -top-4 right-8 w-16 h-8 bg-gradient-to-r from-white/40 to-white/10 rounded-full animate-pulse delay-200"></div>
                    
                    {/* Body */}
                    <div className="w-32 h-40 gradient-gold rounded-full relative">
                      {/* Stripes */}
                      <div className="absolute top-6 left-0 right-0 h-4 bg-black/30 rounded-full"></div>
                      <div className="absolute top-16 left-0 right-0 h-4 bg-black/30 rounded-full"></div>
                      <div className="absolute top-26 left-0 right-0 h-4 bg-black/30 rounded-full"></div>
                      
                      {/* Face */}
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                        {/* Eyes */}
                        <div className="flex space-x-3">
                          <div className="w-3 h-3 bg-black rounded-full"></div>
                          <div className="w-3 h-3 bg-black rounded-full"></div>
                        </div>
                        {/* Smile */}
                        <div className="w-4 h-2 border-b-2 border-black rounded-full mt-1 ml-1"></div>
                      </div>
                    </div>
                    
                    {/* Glow Effect */}
                    <div className="absolute inset-0 w-32 h-40 gradient-gold rounded-full opacity-50 blur-lg group-hover:opacity-75 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Text */}
            <div className="text-center mt-8 space-y-6">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-cabinet-yellow/60 bg-cabinet-yellow/10 p-2 hover-lift magnetic">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2F39a2607ac6ea47489c1c09edb4355799%2F542a7c303535476981e07aa791111a6b?format=webp&width=800"
                      alt="CAB-I-NET Logo"
                      className="w-full h-full object-contain rounded-full animate-glow-pulse hover:scale-110 transition-all duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 w-40 h-40 bg-cabinet-yellow/20 rounded-full blur-2xl animate-breathe"></div>
                </div>
              </div>

              <h2 className="text-5xl font-display font-black text-gradient text-shadow-glow animate-slide-up">
                Your Luxury Ride
              </h2>
              <p className="text-cabinet-grey text-xl font-accent font-medium tracking-wide animate-fade-in">
                Premium cab service with unmatched style
              </p>
              <div className="flex justify-center space-x-2 pt-2">
                <div className="w-2 h-2 bg-cabinet-yellow rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-cabinet-light-yellow rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-cabinet-gold rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Booking Panel */}
        <div className="space-y-8">
          {/* Main Booking Card */}
          <div className="glass-morphism rounded-3xl p-8 border border-cabinet-yellow/20 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cabinet-yellow/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="text-center space-y-3">
                <h3 className="text-3xl font-heading font-bold text-gradient text-shadow-glow">Book Your Ride</h3>
                <p className="text-cabinet-grey font-accent font-medium tracking-wide">Premium comfort, anytime</p>
              </div>

              {/* Location Inputs */}
              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cabinet-yellow w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Pickup location"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 glass-morphism rounded-2xl border border-cabinet-yellow/30 text-white placeholder-cabinet-grey focus:border-cabinet-yellow focus:outline-none focus:ring-2 focus:ring-cabinet-yellow/20 transition-all duration-300"
                  />
                </div>
                
                <div className="relative">
                  <Navigation className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cabinet-light-yellow w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Where to?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 glass-morphism rounded-2xl border border-cabinet-yellow/30 text-white placeholder-cabinet-grey focus:border-cabinet-yellow focus:outline-none focus:ring-2 focus:ring-cabinet-yellow/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Voice Booking & Book Button */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleVoiceBooking}
                  className={`relative p-5 rounded-2xl transition-all duration-500 hover-lift magnetic group ${
                    isListening
                      ? 'voice-recording'
                      : 'voice-idle'
                  }`}
                  title="Jarvis Voice Booking - Tap and Speak"
                >
                  <Mic className={`w-7 h-7 transition-all duration-300 ${
                    isListening
                      ? 'text-black animate-bounce-gentle'
                      : 'text-cabinet-yellow group-hover:scale-110'
                  }`} />
                  {isListening && (
                    <div className="absolute inset-0 rounded-2xl border-2 border-cabinet-yellow animate-voice-pulse"></div>
                  )}
                </button>
                
                <button
                  onClick={handleBookRide}
                  disabled={!pickup || !destination}
                  className="flex-1 btn-premium py-5 rounded-2xl font-heading font-bold text-lg tracking-wide hover-lift disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-3 relative overflow-hidden group"
                >
                  <span className="relative z-10">Book Now</span>
                  <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-cabinet-light-yellow to-cabinet-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-cabinet-yellow/20">
                <button className="text-cabinet-yellow hover:text-cabinet-light-yellow transition-colors duration-300 text-sm font-medium">
                  📍 Use Current Location
                </button>
                <button className="text-cabinet-yellow hover:text-cabinet-light-yellow transition-colors duration-300 text-sm font-medium">
                  ⭐ Saved Places
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-morphism rounded-2xl p-4 text-center border border-cabinet-yellow/10">
              <div className="text-cabinet-yellow text-2xl mb-2">⚡</div>
              <div className="text-white font-medium text-sm">Instant Booking</div>
            </div>
            <div className="glass-morphism rounded-2xl p-4 text-center border border-cabinet-yellow/10">
              <div className="text-cabinet-yellow text-2xl mb-2">🛡️</div>
              <div className="text-white font-medium text-sm">Safe & Secure</div>
            </div>
          </div>
        </div>
      </div>

      {/* Jarvis Voice Indicator */}
      {isListening && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 glass-morphism-hover rounded-full px-8 py-4 border border-cabinet-yellow/40 z-50 animate-slide-up hover-lift">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-4 h-4 bg-cabinet-yellow rounded-full animate-voice-pulse"></div>
              <div className="absolute inset-0 w-4 h-4 bg-cabinet-light-yellow rounded-full animate-ping"></div>
            </div>
            <span className="text-white font-accent font-semibold text-lg tracking-wide text-gradient">
              🎙️ Jarvis is listening...
            </span>
            <div className="flex space-x-1">
              <div className="w-1 h-4 bg-cabinet-yellow rounded-full animate-pulse"></div>
              <div className="w-1 h-6 bg-cabinet-light-yellow rounded-full animate-pulse delay-100"></div>
              <div className="w-1 h-5 bg-cabinet-gold rounded-full animate-pulse delay-200"></div>
              <div className="w-1 h-7 bg-cabinet-yellow rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
