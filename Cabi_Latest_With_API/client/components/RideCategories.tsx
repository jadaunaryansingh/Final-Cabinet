import { useState } from 'react';
import { Clock, Star, Users, DollarSign } from 'lucide-react';

interface RideOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  estimatedTime: string;
  price: string;
  capacity: string;
  rating: number;
  features: string[];
}

const rideOptions: RideOption[] = [
  {
    id: 'car',
    name: 'Car',
    icon: '🚗',
    description: 'Comfortable sedan for daily commutes',
    estimatedTime: '5-8 min',
    price: '₹120',
    capacity: '4 seats',
    rating: 4.8,
    features: ['AC', 'Music', 'Safe']
  },
  {
    id: 'car-premium',
    name: 'Car Premium',
    icon: '🚙',
    description: 'Luxury vehicles for premium experience',
    estimatedTime: '3-6 min',
    price: '₹200',
    capacity: '4 seats',
    rating: 4.9,
    features: ['Luxury', 'AC', 'Wi-Fi', 'Entertainment']
  },
  {
    id: 'auto',
    name: 'Auto',
    icon: '🛺',
    description: 'Quick and affordable auto-rickshaw',
    estimatedTime: '4-7 min',
    price: '₹80',
    capacity: '3 seats',
    rating: 4.6,
    features: ['Quick', 'Affordable']
  },
  {
    id: 'toto',
    name: 'Toto',
    icon: '🚐',
    description: 'Shared ride for cost-effective travel',
    estimatedTime: '8-12 min',
    price: '₹45',
    capacity: '6 seats',
    rating: 4.4,
    features: ['Shared', 'Eco-friendly']
  },
  {
    id: 'bike',
    name: 'Bike',
    icon: '🏍️',
    description: 'Fast bike rides through traffic',
    estimatedTime: '2-5 min',
    price: '₹60',
    capacity: '1 seat',
    rating: 4.7,
    features: ['Fastest', 'Traffic-free']
  }
];

export default function RideCategories() {
  const [selectedRide, setSelectedRide] = useState<string>('car');
  const [hoveredRide, setHoveredRide] = useState<string | null>(null);

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-cabinet font-bold text-white">
            Choose Your Ride
          </h2>
          <p className="text-cabinet-grey text-lg max-w-2xl mx-auto">
            Select from our premium fleet of vehicles, each designed to provide comfort and style for your journey
          </p>
        </div>

        {/* Ride Categories Sub-navbar */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {rideOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedRide(option.id)}
              onMouseEnter={() => setHoveredRide(option.id)}
              onMouseLeave={() => setHoveredRide(null)}
              className={`
                relative group px-6 py-4 rounded-2xl transition-all duration-300 transform
                ${selectedRide === option.id 
                  ? 'glass-morphism border-2 border-cabinet-yellow bg-cabinet-yellow/10 scale-105' 
                  : 'glass-morphism border border-cabinet-yellow/20 hover:border-cabinet-yellow/50'
                }
                ${hoveredRide === option.id ? 'scale-105 neon-glow' : ''}
              `}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={`text-3xl transition-all duration-300 ${
                  selectedRide === option.id || hoveredRide === option.id 
                    ? 'animate-bounce scale-110' 
                    : ''
                }`}>
                  {option.icon}
                </div>
                <span className={`font-cabinet font-medium transition-colors duration-300 ${
                  selectedRide === option.id 
                    ? 'text-cabinet-yellow' 
                    : 'text-white group-hover:text-cabinet-light-yellow'
                }`}>
                  {option.name}
                </span>
              </div>
              
              {/* Glow effect on hover */}
              {hoveredRide === option.id && (
                <div className="absolute inset-0 bg-cabinet-yellow/10 rounded-2xl blur-xl transition-opacity duration-300"></div>
              )}
            </button>
          ))}
        </div>

        {/* Selected Ride Details */}
        <div className="grid lg:grid-cols-3 gap-8">
          {rideOptions
            .filter(option => option.id === selectedRide)
            .map((option) => (
              <div key={option.id} className="lg:col-span-2">
                <div className="glass-morphism rounded-3xl p-8 border border-cabinet-yellow/20 relative overflow-hidden">
                  {/* Background Gradient */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cabinet-yellow/20 to-cabinet-gold/20 rounded-full blur-3xl"></div>
                  
                  <div className="relative z-10 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-6xl animate-float">{option.icon}</div>
                        <div>
                          <h3 className="text-3xl font-cabinet font-bold text-white">{option.name}</h3>
                          <p className="text-cabinet-grey">{option.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-cabinet font-bold text-cabinet-yellow">{option.price}</div>
                        <div className="text-sm text-cabinet-grey">Estimated fare</div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center space-y-2">
                        <Clock className="w-8 h-8 text-cabinet-yellow mx-auto" />
                        <div className="text-white font-medium">{option.estimatedTime}</div>
                        <div className="text-sm text-cabinet-grey">Arrival time</div>
                      </div>
                      <div className="text-center space-y-2">
                        <Users className="w-8 h-8 text-cabinet-yellow mx-auto" />
                        <div className="text-white font-medium">{option.capacity}</div>
                        <div className="text-sm text-cabinet-grey">Capacity</div>
                      </div>
                      <div className="text-center space-y-2">
                        <Star className="w-8 h-8 text-cabinet-yellow mx-auto" />
                        <div className="text-white font-medium">{option.rating}</div>
                        <div className="text-sm text-cabinet-grey">Rating</div>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="text-white font-cabinet font-medium mb-3">Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {option.features.map((feature, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-cabinet-yellow/20 border border-cabinet-yellow/30 rounded-full text-cabinet-yellow text-sm font-medium"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Book Button */}
                    <button className="w-full bg-gradient-gold text-black py-4 rounded-2xl font-cabinet font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                      Book {option.name}
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {/* All Ride Options Summary */}
          <div className="space-y-4">
            <h4 className="text-xl font-cabinet font-bold text-white mb-4">Quick Compare</h4>
            {rideOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => setSelectedRide(option.id)}
                className={`
                  glass-morphism rounded-2xl p-4 cursor-pointer transition-all duration-300 border
                  ${selectedRide === option.id 
                    ? 'border-cabinet-yellow bg-cabinet-yellow/10 transform scale-105' 
                    : 'border-cabinet-yellow/10 hover:border-cabinet-yellow/30'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{option.icon}</div>
                    <div>
                      <div className={`font-medium ${
                        selectedRide === option.id ? 'text-cabinet-yellow' : 'text-white'
                      }`}>
                        {option.name}
                      </div>
                      <div className="text-sm text-cabinet-grey">{option.estimatedTime}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${
                      selectedRide === option.id ? 'text-cabinet-yellow' : 'text-white'
                    }`}>
                      {option.price}
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-cabinet-grey">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{option.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
