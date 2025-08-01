import { useState, useEffect } from 'react';
import { Navigation, MapPin, Clock, Phone } from 'lucide-react';

interface Vehicle {
  id: string;
  type: string;
  position: { lat: number; lng: number };
  icon: string;
  driver: string;
  rating: number;
  eta: string;
}

export default function MapSection() {
  const [activeVehicles, setActiveVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      type: 'Car',
      position: { lat: 12.9716, lng: 77.5946 },
      icon: '🚗',
      driver: 'Rajesh Kumar',
      rating: 4.8,
      eta: '3 min'
    },
    {
      id: '2',
      type: 'Auto',
      position: { lat: 12.9750, lng: 77.5980 },
      icon: '🛺',
      driver: 'Suresh Reddy',
      rating: 4.6,
      eta: '5 min'
    },
    {
      id: '3',
      type: 'Premium',
      position: { lat: 12.9680, lng: 77.5900 },
      icon: '🚙',
      driver: 'Arjun Singh',
      rating: 4.9,
      eta: '2 min'
    },
    {
      id: '4',
      type: 'Bike',
      position: { lat: 12.9800, lng: 77.6000 },
      icon: '🏍️',
      driver: 'Vikram Joshi',
      rating: 4.7,
      eta: '1 min'
    }
  ]);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Simulate real-time vehicle movement
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVehicles(prev => prev.map(vehicle => ({
        ...vehicle,
        position: {
          lat: vehicle.position.lat + (Math.random() - 0.5) * 0.001,
          lng: vehicle.position.lng + (Math.random() - 0.5) * 0.001
        }
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-cabinet font-bold text-white">
            Live Vehicle Tracking
          </h2>
          <p className="text-cabinet-grey text-lg max-w-2xl mx-auto">
            See available vehicles near you in real-time. Our smart routing ensures the fastest pickup times.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Map Container */}
          <div className="lg:col-span-2">
            <div className="glass-morphism rounded-3xl p-2 border border-cabinet-yellow/20 relative overflow-hidden">
              {/* Map Background */}
              <div className="relative w-full h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden">
                {/* Grid Lines for Map Effect */}
                <div className="absolute inset-0 opacity-20">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={`h-${i}`} className="absolute w-full h-px bg-cabinet-yellow/30" style={{ top: `${i * 5}%` }} />
                  ))}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={`v-${i}`} className="absolute h-full w-px bg-cabinet-yellow/30" style={{ left: `${i * 5}%` }} />
                  ))}
                </div>

                {/* City Background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <div className="text-9xl">🏙️</div>
                </div>

                {/* Vehicles on Map */}
                {activeVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="absolute transition-all duration-1000 ease-in-out cursor-pointer group"
                    style={{
                      left: `${((vehicle.position.lng - 77.590) / 0.015) * 100}%`,
                      top: `${((12.980 - vehicle.position.lat) / 0.015) * 100}%`
                    }}
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <div className="relative">
                      {/* Vehicle Icon */}
                      <div className="text-2xl animate-pulse group-hover:scale-125 transition-transform duration-300">
                        {vehicle.icon}
                      </div>
                      
                      {/* Pulse Ring */}
                      <div className="absolute inset-0 -m-2 border-2 border-cabinet-yellow rounded-full animate-ping opacity-75"></div>
                      
                      {/* Hover Info */}
                      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="glass-morphism rounded-lg p-2 text-xs whitespace-nowrap border border-cabinet-yellow/30">
                          <div className="text-white font-medium">{vehicle.driver}</div>
                          <div className="text-cabinet-yellow">{vehicle.type} • {vehicle.eta}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Your Location */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-4 h-4 bg-cabinet-yellow rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 -m-2 border-2 border-cabinet-yellow rounded-full animate-ping"></div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-cabinet-yellow font-medium whitespace-nowrap">
                      Your Location
                    </div>
                  </div>
                </div>

                {/* Route Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {activeVehicles.slice(0, 2).map((vehicle, index) => (
                    <line
                      key={vehicle.id}
                      x1="50%"
                      y1="50%"
                      x2={`${((vehicle.position.lng - 77.590) / 0.015) * 100}%`}
                      y2={`${((12.980 - vehicle.position.lat) / 0.015) * 100}%`}
                      stroke="url(#gradient)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      className="animate-pulse"
                    />
                  ))}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--cabinet-yellow))" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="hsl(var(--cabinet-light-yellow))" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 space-y-2">
                <button className="glass-morphism p-3 rounded-xl border border-cabinet-yellow/20 text-cabinet-yellow hover:bg-cabinet-yellow hover:text-black transition-all duration-300">
                  <Navigation className="w-5 h-5" />
                </button>
                <button className="glass-morphism p-3 rounded-xl border border-cabinet-yellow/20 text-cabinet-yellow hover:bg-cabinet-yellow hover:text-black transition-all duration-300">
                  <MapPin className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Available Vehicles List */}
          <div className="space-y-4">
            <h3 className="text-xl font-cabinet font-bold text-white">Available Nearby</h3>
            
            <div className="space-y-3">
              {activeVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle)}
                  className={`
                    glass-morphism rounded-2xl p-4 cursor-pointer transition-all duration-300 border
                    ${selectedVehicle?.id === vehicle.id 
                      ? 'border-cabinet-yellow bg-cabinet-yellow/10 transform scale-105' 
                      : 'border-cabinet-yellow/20 hover:border-cabinet-yellow/50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl animate-pulse">{vehicle.icon}</div>
                      <div>
                        <div className="text-white font-medium">{vehicle.driver}</div>
                        <div className="text-cabinet-grey text-sm">{vehicle.type}</div>
                        <div className="flex items-center space-x-1 text-xs">
                          <span className="text-yellow-400">★</span>
                          <span className="text-cabinet-grey">{vehicle.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-cabinet-yellow font-bold">{vehicle.eta}</div>
                      <div className="text-xs text-cabinet-grey">ETA</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Vehicle Details */}
            {selectedVehicle && (
              <div className="glass-morphism rounded-2xl p-6 border border-cabinet-yellow/30 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-cabinet font-bold text-white">Selected Vehicle</h4>
                    <div className="text-2xl">{selectedVehicle.icon}</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-cabinet-grey">Driver</span>
                      <span className="text-white font-medium">{selectedVehicle.driver}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cabinet-grey">Vehicle</span>
                      <span className="text-white font-medium">{selectedVehicle.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cabinet-grey">ETA</span>
                      <span className="text-cabinet-yellow font-bold">{selectedVehicle.eta}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cabinet-grey">Rating</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-white font-medium">{selectedVehicle.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-cabinet-yellow/20">
                    <button className="bg-gradient-gold text-black py-2 rounded-xl font-medium hover:scale-105 transition-all duration-300">
                      Book Now
                    </button>
                    <button className="glass-morphism border border-cabinet-yellow/30 text-cabinet-yellow py-2 rounded-xl font-medium hover:bg-cabinet-yellow hover:text-black transition-all duration-300">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Call
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
