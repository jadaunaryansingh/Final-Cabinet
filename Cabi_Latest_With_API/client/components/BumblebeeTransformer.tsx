import { useState, useEffect } from 'react';

interface BumblebeeTransformerProps {
  isTransformed?: boolean;
  onTransform?: () => void;
}

export default function BumblebeeTransformer({ isTransformed = false, onTransform }: BumblebeeTransformerProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [transformState, setTransformState] = useState<'robot' | 'transforming' | 'vehicle'>('robot');
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isTransformed && transformState === 'robot') {
      handleTransform();
    }
  }, [isTransformed]);

  const handleTransform = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTransformState('transforming');
    
    setTimeout(() => {
      setTransformState('vehicle');
      setIsAnimating(false);
      onTransform?.();
    }, 3000);
    
    setTimeout(() => {
      if (transformState === 'vehicle') {
        setTransformState('robot');
      }
    }, 7000);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    setRotationX(rotateX);
    setRotationY(rotateY);
  };

  const handleMouseLeave = () => {
    setRotationX(0);
    setRotationY(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div className="relative w-96 h-96 mx-auto perspective-1000 mb-20">
      <div
        className="relative w-full h-full cursor-pointer transform-gpu transition-all duration-700"
        style={{
          transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg) ${isHovered ? 'scale(1.05)' : 'scale(1)'}`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onClick={handleTransform}
      >
        
        {/* Modern 3D Robot Mode */}
        <div className={`absolute inset-0 transition-all duration-3000 transform-gpu ${
          transformState === 'robot' 
            ? 'opacity-100 scale-100 rotate-0' 
            : transformState === 'transforming'
            ? 'opacity-50 scale-110 rotate-180'
            : 'opacity-0 scale-150 rotate-360'
        }`}>
          
          {/* Base Shadow */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-48 h-8 bg-cabinet-yellow/30 rounded-full blur-2xl animate-breathe"></div>
          
          {/* Robot Assembly */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            
            {/* Head Module */}
            <div className="relative mb-4 flex justify-center">
              <div className="w-24 h-24 relative">
                {/* Main Head Cube */}
                <div className="absolute inset-0 bg-gradient-to-br from-cabinet-yellow via-cabinet-gold to-cabinet-light-yellow rounded-2xl border-2 border-cabinet-gold/60 shadow-2xl transform rotate-3"
                     style={{ 
                       boxShadow: `0 0 30px hsl(var(--cabinet-yellow) / 0.6), inset 0 0 20px hsl(var(--cabinet-gold) / 0.3)`,
                       transform: 'perspective(800px) rotateX(-10deg)'
                     }}>
                  
                  {/* Face Panel */}
                  <div className="absolute top-2 left-2 right-2 bottom-6 bg-gradient-to-b from-black/80 to-black/60 rounded-xl border border-cabinet-yellow/40">
                    {/* Digital Eyes */}
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 flex space-x-3">
                      <div className="w-4 h-4 bg-gradient-radial from-cabinet-light-yellow to-cabinet-yellow rounded-full animate-glow-pulse border border-cabinet-gold">
                        <div className="absolute inset-1 bg-white/90 rounded-full"></div>
                      </div>
                      <div className="w-4 h-4 bg-gradient-radial from-cabinet-light-yellow to-cabinet-yellow rounded-full animate-glow-pulse delay-200 border border-cabinet-gold">
                        <div className="absolute inset-1 bg-white/90 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Digital Display Lines */}
                    <div className="absolute bottom-2 left-2 right-2 space-y-1">
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-cabinet-yellow to-transparent animate-shimmer"></div>
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-cabinet-gold to-transparent animate-shimmer delay-300"></div>
                    </div>
                  </div>
                  
                  {/* Side Panels */}
                  <div className="absolute -left-2 top-4 w-4 h-8 bg-gradient-to-r from-cabinet-gold to-cabinet-yellow rounded-l-lg border border-cabinet-gold/60"></div>
                  <div className="absolute -right-2 top-4 w-4 h-8 bg-gradient-to-l from-cabinet-gold to-cabinet-yellow rounded-r-lg border border-cabinet-gold/60"></div>
                </div>
                
                {/* Antenna Array */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  <div className="w-1 h-6 bg-gradient-to-t from-cabinet-gold to-cabinet-yellow rounded-full">
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-cabinet-yellow rounded-full animate-pulse border border-cabinet-gold"></div>
                  </div>
                  <div className="w-1 h-8 bg-gradient-to-t from-cabinet-gold to-cabinet-light-yellow rounded-full">
                    <div className="absolute -top-2 -left-1.5 w-4 h-4 bg-gradient-radial from-cabinet-yellow to-cabinet-gold rounded-full animate-glow-pulse border border-cabinet-gold"></div>
                  </div>
                  <div className="w-1 h-6 bg-gradient-to-t from-cabinet-gold to-cabinet-yellow rounded-full">
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-cabinet-yellow rounded-full animate-pulse delay-400 border border-cabinet-gold"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Torso Module */}
            <div className="w-32 h-40 bg-gradient-to-b from-cabinet-yellow via-cabinet-gold to-cabinet-yellow rounded-3xl relative mx-auto border-2 border-cabinet-gold/60 shadow-2xl"
                 style={{ 
                   boxShadow: `0 0 40px hsl(var(--cabinet-yellow) / 0.5), inset 0 0 20px hsl(var(--cabinet-gold) / 0.2)`,
                   transform: 'perspective(800px) rotateX(-5deg)'
                 }}>
              
              {/* Central Core */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-radial from-cabinet-light-yellow via-cabinet-yellow to-cabinet-gold rounded-2xl border-2 border-cabinet-gold rotate-45">
                <div className="absolute inset-2 bg-gradient-radial from-white/60 via-cabinet-yellow/80 to-transparent rounded-xl animate-spin-slow"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-cabinet-yellow rounded-lg border border-cabinet-gold animate-pulse -rotate-45"></div>
              </div>
              
              {/* Panel Details */}
              <div className="absolute top-24 left-4 right-4 space-y-2">
                <div className="h-1 bg-gradient-to-r from-transparent via-cabinet-gold to-transparent rounded-full"></div>
                <div className="h-1 bg-gradient-to-r from-transparent via-cabinet-yellow to-transparent rounded-full"></div>
                <div className="h-1 bg-gradient-to-r from-transparent via-cabinet-gold to-transparent rounded-full"></div>
              </div>
              
              {/* Shoulder Modules */}
              <div className="absolute top-4 -left-8 w-10 h-20 bg-gradient-to-br from-cabinet-yellow via-cabinet-gold to-cabinet-light-yellow rounded-2xl border border-cabinet-gold/60 rotate-12 transform-gpu"
                   style={{ transform: 'perspective(600px) rotateY(20deg) rotateX(-10deg)' }}>
                <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
              </div>
              <div className="absolute top-4 -right-8 w-10 h-20 bg-gradient-to-bl from-cabinet-yellow via-cabinet-gold to-cabinet-light-yellow rounded-2xl border border-cabinet-gold/60 -rotate-12 transform-gpu"
                   style={{ transform: 'perspective(600px) rotateY(-20deg) rotateX(-10deg)' }}>
                <div className="absolute inset-2 bg-gradient-to-bl from-white/20 to-transparent rounded-xl"></div>
              </div>
              
              {/* Arms */}
              <div className="absolute top-12 -left-12 w-8 h-24 bg-gradient-to-b from-cabinet-gold to-cabinet-yellow rounded-full rotate-15 border border-cabinet-gold/60"></div>
              <div className="absolute top-12 -right-12 w-8 h-24 bg-gradient-to-b from-cabinet-gold to-cabinet-yellow rounded-full -rotate-15 border border-cabinet-gold/60"></div>
              
              {/* Hands */}
              <div className="absolute top-32 -left-14 w-10 h-10 bg-gradient-radial from-cabinet-yellow to-cabinet-gold rounded-xl border border-cabinet-gold/60 rotate-12"
                   style={{ transform: 'perspective(400px) rotateX(15deg)' }}>
                <div className="absolute inset-1 bg-gradient-to-br from-white/30 to-transparent rounded-lg"></div>
              </div>
              <div className="absolute top-32 -right-14 w-10 h-10 bg-gradient-radial from-cabinet-yellow to-cabinet-gold rounded-xl border border-cabinet-gold/60 -rotate-12"
                   style={{ transform: 'perspective(400px) rotateX(15deg)' }}>
                <div className="absolute inset-1 bg-gradient-to-bl from-white/30 to-transparent rounded-lg"></div>
              </div>
            </div>
            
            {/* Leg Modules */}
            <div className="flex justify-center space-x-6 mt-2">
              <div className="w-10 h-28 bg-gradient-to-b from-cabinet-gold via-cabinet-yellow to-cabinet-gold rounded-2xl border border-cabinet-gold/60"
                   style={{ transform: 'perspective(600px) rotateX(-10deg)' }}>
                <div className="absolute inset-1 bg-gradient-to-b from-white/20 to-transparent rounded-xl"></div>
              </div>
              <div className="w-10 h-28 bg-gradient-to-b from-cabinet-gold via-cabinet-yellow to-cabinet-gold rounded-2xl border border-cabinet-gold/60"
                   style={{ transform: 'perspective(600px) rotateX(-10deg)' }}>
                <div className="absolute inset-1 bg-gradient-to-b from-white/20 to-transparent rounded-xl"></div>
              </div>
            </div>
            
            {/* Feet */}
            <div className="flex justify-center space-x-8 mt-1">
              <div className="w-14 h-8 bg-gradient-to-r from-cabinet-yellow to-cabinet-gold rounded-2xl border border-cabinet-gold/60"
                   style={{ transform: 'perspective(400px) rotateX(30deg)' }}>
                <div className="absolute inset-1 bg-gradient-to-r from-white/30 to-transparent rounded-xl"></div>
              </div>
              <div className="w-14 h-8 bg-gradient-to-r from-cabinet-yellow to-cabinet-gold rounded-2xl border border-cabinet-gold/60"
                   style={{ transform: 'perspective(400px) rotateX(30deg)' }}>
                <div className="absolute inset-1 bg-gradient-to-r from-white/30 to-transparent rounded-xl"></div>
              </div>
            </div>
          </div>
          
          {/* Floating Energy Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-radial from-cabinet-yellow to-cabinet-gold rounded-full animate-float border border-cabinet-gold/50"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${30 + (i % 3) * 20}%`,
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: `${3 + i * 0.2}s`,
                  boxShadow: `0 0 10px hsl(var(--cabinet-yellow) / 0.8)`
                }}
              />
            ))}
          </div>
        </div>

        {/* Modern Vehicle Mode */}
        <div className={`absolute inset-0 transition-all duration-3000 transform-gpu ${
          transformState === 'vehicle' 
            ? 'opacity-100 scale-100 rotate-0' 
            : transformState === 'transforming'
            ? 'opacity-50 scale-110 rotate-180'
            : 'opacity-0 scale-0 -rotate-180'
        }`}>
          
          {/* Vehicle Shadow */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-12 bg-cabinet-yellow/40 rounded-full blur-2xl"></div>
          
          {/* Modern Supercar */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              
              {/* Main Body */}
              <div className="w-80 h-32 bg-gradient-to-r from-cabinet-yellow via-cabinet-gold to-cabinet-light-yellow rounded-3xl relative border-2 border-cabinet-gold/60"
                   style={{ 
                     boxShadow: `0 0 50px hsl(var(--cabinet-yellow) / 0.6), inset 0 0 30px hsl(var(--cabinet-gold) / 0.3)`,
                     transform: 'perspective(800px) rotateX(-5deg)'
                   }}>
                
                {/* Cockpit */}
                <div className="absolute top-2 left-16 right-16 h-16 bg-gradient-to-r from-cabinet-gold via-cabinet-yellow to-cabinet-gold rounded-2xl border border-cabinet-gold/60"
                     style={{ transform: 'perspective(600px) rotateX(-15deg)' }}>
                  
                  {/* Windshield */}
                  <div className="absolute top-1 left-2 right-2 bottom-2 bg-gradient-to-b from-cyan-200 via-blue-300 to-cyan-400 rounded-xl opacity-90 border border-cabinet-yellow/30">
                    <div className="absolute inset-1 bg-gradient-to-br from-white/60 via-transparent to-white/40 rounded-lg"></div>
                    <div className="absolute top-1 left-2 w-16 h-4 bg-gradient-to-r from-white/80 via-cabinet-light-yellow/60 to-white/80 rounded-lg animate-shimmer"></div>
                  </div>
                </div>
                
                {/* Front Section */}
                <div className="absolute top-1/2 -left-4 w-10 h-16 bg-gradient-to-r from-cabinet-gold to-cabinet-yellow rounded-r-3xl border border-cabinet-gold/60"
                     style={{ transform: 'perspective(400px) rotateY(15deg)' }}>
                  
                  {/* Headlights */}
                  <div className="absolute top-3 -left-3 w-8 h-4 bg-white rounded-full border-2 border-cabinet-yellow animate-glow-pulse"
                       style={{ boxShadow: '0 0 15px white' }}></div>
                  <div className="absolute bottom-3 -left-3 w-8 h-4 bg-cabinet-light-yellow rounded-full border border-cabinet-gold animate-pulse"></div>
                </div>
                
                {/* Rear Section */}
                <div className="absolute top-1/2 -right-4 w-10 h-16 bg-gradient-to-l from-cabinet-gold to-cabinet-yellow rounded-l-3xl border border-cabinet-gold/60"
                     style={{ transform: 'perspective(400px) rotateY(-15deg)' }}>
                  
                  {/* Taillights */}
                  <div className="absolute top-3 -right-3 w-8 h-4 bg-red-400 rounded-full border-2 border-cabinet-yellow animate-pulse"
                       style={{ boxShadow: '0 0 10px #ff6b6b' }}></div>
                  <div className="absolute bottom-3 -right-3 w-8 h-4 bg-orange-400 rounded-full border border-cabinet-gold animate-pulse delay-300"></div>
                </div>
                
                {/* Side Details */}
                <div className="absolute bottom-4 left-8 right-8 h-2 bg-gradient-to-r from-transparent via-cabinet-gold to-transparent rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black font-bold text-xl tracking-widest">
                  CAB-I-NET
                </div>
                
                {/* Air Vents */}
                <div className="absolute top-8 left-8 w-8 h-10 bg-black/20 rounded-xl border border-cabinet-gold/30"></div>
                <div className="absolute top-8 right-8 w-8 h-10 bg-black/20 rounded-xl border border-cabinet-gold/30"></div>
              </div>
              
              {/* Wheels */}
              <div className="absolute -bottom-8 left-16 w-20 h-20 bg-gradient-radial from-cabinet-dark to-black rounded-full border-4 border-cabinet-gold animate-rotate"
                   style={{ 
                     boxShadow: `0 0 20px hsl(var(--cabinet-yellow) / 0.6)`,
                     transform: 'perspective(600px) rotateX(60deg)'
                   }}>
                <div className="absolute inset-4 bg-gradient-radial from-cabinet-yellow to-cabinet-gold rounded-full border-2 border-cabinet-gold"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-cabinet-gold rounded-full border border-cabinet-yellow"></div>
                <div className="absolute inset-6 border-t-2 border-cabinet-yellow rounded-full animate-spin-slow"></div>
              </div>
              <div className="absolute -bottom-8 right-16 w-20 h-20 bg-gradient-radial from-cabinet-dark to-black rounded-full border-4 border-cabinet-gold animate-rotate"
                   style={{ 
                     boxShadow: `0 0 20px hsl(var(--cabinet-yellow) / 0.6)`,
                     transform: 'perspective(600px) rotateX(60deg)'
                   }}>
                <div className="absolute inset-4 bg-gradient-radial from-cabinet-yellow to-cabinet-gold rounded-full border-2 border-cabinet-gold"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-cabinet-gold rounded-full border border-cabinet-yellow"></div>
                <div className="absolute inset-6 border-t-2 border-cabinet-yellow rounded-full animate-spin-slow"></div>
              </div>
              
              {/* Exhaust Effect */}
              <div className="absolute top-1/2 -right-16 flex space-x-2">
                <div className="w-4 h-4 bg-gradient-radial from-white/90 to-cabinet-yellow/50 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-gradient-radial from-white/70 to-cabinet-yellow/40 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gradient-radial from-white/50 to-cabinet-yellow/30 rounded-full animate-bounce delay-200"></div>
              </div>
              
              {/* Underglow */}
              <div className="absolute -bottom-4 left-12 right-12 h-2 bg-gradient-to-r from-transparent via-cabinet-yellow to-transparent rounded-full blur-sm animate-glow-pulse"></div>
            </div>
          </div>
        </div>

        {/* Transformation Effects */}
        {transformState === 'transforming' && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Energy Rings */}
            <div className="absolute inset-0 border-4 border-cabinet-yellow rounded-full animate-ping" 
                 style={{ boxShadow: `0 0 30px hsl(var(--cabinet-yellow) / 0.8)` }}></div>
            <div className="absolute inset-8 border-3 border-cabinet-gold rounded-full animate-ping delay-400" 
                 style={{ boxShadow: `0 0 20px hsl(var(--cabinet-gold) / 0.6)` }}></div>
            <div className="absolute inset-16 border-2 border-cabinet-light-yellow rounded-full animate-ping delay-800" 
                 style={{ boxShadow: `0 0 15px hsl(var(--cabinet-light-yellow) / 0.4)` }}></div>
            
            {/* Geometric Transformation Particles */}
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-gradient-radial from-cabinet-yellow to-cabinet-gold rounded-sm animate-bounce border border-cabinet-gold/50 rotate-45"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.05}s`,
                  boxShadow: `0 0 12px hsl(var(--cabinet-yellow) / 0.9)`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
            ))}
            
            {/* Energy Beams */}
            <div className="absolute top-1/2 left-1/2 w-2 h-full bg-gradient-to-t from-transparent via-cabinet-yellow to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-0 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 w-2 h-full bg-gradient-to-t from-transparent via-cabinet-gold to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-45 animate-pulse delay-300"></div>
            <div className="absolute top-1/2 left-1/2 w-2 h-full bg-gradient-to-t from-transparent via-cabinet-light-yellow to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-90 animate-pulse delay-600"></div>
          </div>
        )}

        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-radial from-cabinet-yellow/20 via-cabinet-gold/10 to-transparent rounded-full blur-3xl animate-glow-pulse"></div>
      </div>

      {/* Interaction Hint - Positioned safely below */}
      <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-center w-full">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-cabinet-yellow/30">
          <p className="text-cabinet-yellow text-sm font-accent font-medium tracking-wide">
            {transformState === 'robot' ? '🤖 Click to transform into vehicle mode!' :
             transformState === 'transforming' ? '⚡ Transforming systems online...' :
             '🚗 Vehicle mode active - Reverting to robot...'}
          </p>
          <div className="mt-3 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-cabinet-yellow rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-cabinet-gold rounded-full animate-pulse delay-200"></div>
            <div className="w-2 h-2 bg-cabinet-light-yellow rounded-full animate-pulse delay-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
