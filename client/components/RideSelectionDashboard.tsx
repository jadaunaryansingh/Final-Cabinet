import { useState } from 'react';
import { Star, Clock, Users, Zap, Shield, Leaf } from 'lucide-react';
import {
  YellowCarIcon,
  YellowEcoIcon,
  YellowLuxuryIcon,
  YellowXLIcon,
  YellowBikeIcon,
  YellowAutoIcon,
  YellowERickshawIcon
} from './CustomIcons';

interface RideOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  capacity: string;
  features: string[];
}

interface PlatformPrice {
  platform: string;
  logo: string;
  price: number;
  eta: string;
  rating: number;
  surge?: number;
  discount?: string;
  color: string;
}

const vehicleTypes: RideOption[] = [
  {
    id: 'car',
    name: 'Car',
    icon: <YellowCarIcon size={28} className="animate-glow-pulse drop-shadow-lg" />,
    description: 'Comfortable sedans',
    capacity: '4 seats',
    features: ['AC', 'Music', 'Safe']
  },
  {
    id: 'eco',
    name: 'Eco',
    icon: <YellowEcoIcon size={28} className="animate-glow-pulse drop-shadow-lg" />,
    description: 'Environment friendly',
    capacity: '4 seats',
    features: ['Green', 'Fuel Efficient', 'Low Emission']
  },
  {
    id: 'luxury',
    name: 'Luxury',
    icon: <YellowLuxuryIcon size={28} className="animate-glow-pulse drop-shadow-lg" />,
    description: 'Premium vehicles',
    capacity: '4 seats',
    features: ['VIP Service', 'Premium Interior', 'Chauffeur']
  },
  {
    id: 'xl',
    name: 'XL',
    icon: <YellowXLIcon size={28} className="animate-glow-pulse drop-shadow-lg" />,
    description: 'Extra large vehicles',
    capacity: '6-8 seats',
    features: ['Spacious', 'Group Travel', 'Luggage Space']
  },
  {
    id: 'bike',
    name: 'Bike',
    icon: <YellowBikeIcon size={28} className="animate-glow-pulse drop-shadow-lg" />,
    description: 'Quick bike rides',
    capacity: '1 seat',
    features: ['Fastest', 'Traffic-free', 'Solo']
  },
  {
    id: 'auto',
    name: 'Auto',
    icon: <YellowAutoIcon size={28} className="animate-glow-pulse drop-shadow-lg" />,
    description: 'Auto-rickshaw',
    capacity: '3 seats',
    features: ['Quick', 'Affordable', 'Local']
  },
  {
    id: 'e-rickshaw',
    name: 'E-Rickshaw',
    icon: <YellowERickshawIcon size={28} className="animate-glow-pulse drop-shadow-lg" />,
    description: 'Electric rickshaw',
    capacity: '3 seats',
    features: ['Electric', 'Eco-friendly', 'Silent']
  }
];

const platformPrices: Record<string, PlatformPrice[]> = {
  car: [
    { platform: 'CAB-I-NET', logo: '🚕', price: 180, eta: '5-8 min', rating: 4.8, color: 'bg-cabinet-yellow' },
    { platform: 'Ola', logo: '🟢', price: 195, eta: '6-10 min', rating: 4.6, color: 'bg-green-500' },
    { platform: 'Uber', logo: '⚫', price: 210, eta: '4-9 min', rating: 4.7, surge: 1.2, color: 'bg-black' },
    { platform: 'Rapido', logo: '🔴', price: 175, eta: '7-12 min', rating: 4.5, discount: '10% OFF', color: 'bg-red-500' },
    { platform: 'InDrive', logo: '🔵', price: 165, eta: '8-15 min', rating: 4.4, color: 'bg-blue-500' }
  ],
  eco: [
    { platform: 'CAB-I-NET', logo: '🚕', price: 160, eta: '6-9 min', rating: 4.9, color: 'bg-cabinet-yellow' },
    { platform: 'Ola', logo: '🟢', price: 170, eta: '7-11 min', rating: 4.7, color: 'bg-green-500' },
    { platform: 'Uber', logo: '⚫', price: 185, eta: '5-10 min', rating: 4.6, color: 'bg-black' },
    { platform: 'Rapido', logo: '🔴', price: 155, eta: '8-13 min', rating: 4.5, color: 'bg-red-500' }
  ],
  luxury: [
    { platform: 'CAB-I-NET', logo: '🚕', price: 350, eta: '3-6 min', rating: 4.9, color: 'bg-cabinet-yellow' },
    { platform: 'Ola', logo: '🟢', price: 380, eta: '4-8 min', rating: 4.8, color: 'bg-green-500' },
    { platform: 'Uber', logo: '⚫', price: 420, eta: '3-7 min', rating: 4.8, surge: 1.5, color: 'bg-black' }
  ],
  xl: [
    { platform: 'CAB-I-NET', logo: '🚕', price: 280, eta: '6-10 min', rating: 4.7, color: 'bg-cabinet-yellow' },
    { platform: 'Ola', logo: '🟢', price: 300, eta: '7-12 min', rating: 4.6, color: 'bg-green-500' },
    { platform: 'Uber', logo: '⚫', price: 320, eta: '5-11 min', rating: 4.7, color: 'bg-black' }
  ],
  bike: [
    { platform: 'CAB-I-NET', logo: '🚕', price: 60, eta: '3-6 min', rating: 4.8, color: 'bg-cabinet-yellow' },
    { platform: 'Rapido', logo: '🔴', price: 55, eta: '2-5 min', rating: 4.7, color: 'bg-red-500' },
    { platform: 'Ola', logo: '🟢', price: 65, eta: '4-7 min', rating: 4.6, color: 'bg-green-500' }
  ],
  auto: [
    { platform: 'CAB-I-NET', logo: '🚕', price: 80, eta: '5-8 min', rating: 4.6, color: 'bg-cabinet-yellow' },
    { platform: 'Ola', logo: '🟢', price: 85, eta: '6-10 min', rating: 4.5, color: 'bg-green-500' },
    { platform: 'Rapido', logo: '🔴', price: 75, eta: '7-12 min', rating: 4.4, color: 'bg-red-500' }
  ],
  'e-rickshaw': [
    { platform: 'CAB-I-NET', logo: '🚕', price: 70, eta: '6-9 min', rating: 4.7, color: 'bg-cabinet-yellow' },
    { platform: 'Ola', logo: '🟢', price: 75, eta: '7-11 min', rating: 4.5, color: 'bg-green-500' }
  ]
};

interface RideSelectionDashboardProps {
  onRideSelect?: (platform: string, vehicleType: string, price: number) => void;
}

export default function RideSelectionDashboard({ onRideSelect }: RideSelectionDashboardProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('car');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('CAB-I-NET');

  const handleRideSelect = (platform: PlatformPrice) => {
    setSelectedPlatform(platform.platform);
    onRideSelect?.(platform.platform, selectedVehicle, platform.price);
  };

  const currentPrices = platformPrices[selectedVehicle] || [];
  const bestPrice = Math.min(...currentPrices.map(p => p.price));
  const selectedVehicleData = vehicleTypes.find(v => v.id === selectedVehicle);

  return (
    <div className="glass-morphism rounded-3xl p-8 border border-cabinet-yellow/20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-cabinet-yellow/10 rounded-full blur-3xl animate-breathe"></div>
      
      <div className="relative z-10 space-y-8">
        <div className="text-center space-y-3">
          <h3 className="text-3xl font-heading font-bold text-gradient text-shadow-glow">Choose Your Ride</h3>
          <p className="text-cabinet-grey font-accent font-medium tracking-wide">Compare prices across platforms and select the best option</p>
        </div>

        {/* Vehicle Type Navbar */}
        <div className="glass-morphism rounded-2xl p-3 border border-cabinet-yellow/20">
          <div className="flex flex-wrap gap-2 justify-center">
            {vehicleTypes.map((vehicle) => (
              <button
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle.id)}
                className={`flex flex-col items-center px-4 py-3 rounded-xl transition-all duration-300 hover-lift magnetic group ${
                  selectedVehicle === vehicle.id
                    ? 'bg-cabinet-yellow text-black border-2 border-cabinet-yellow'
                    : 'bg-cabinet-yellow/10 border border-cabinet-yellow/30 text-cabinet-yellow hover:bg-cabinet-yellow/20'
                }`}
              >
                <div className={`mb-1 group-hover:animate-bounce-gentle transition-all duration-300 transform ${
                  selectedVehicle === vehicle.id ? 'animate-bounce scale-110' : 'hover:scale-105'
                }`}>
                  {vehicle.icon}
                </div>
                <span className="text-sm font-accent font-semibold">{vehicle.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Vehicle Info */}
        {selectedVehicleData && (
          <div className="glass-morphism rounded-2xl p-6 border border-cabinet-yellow/20">
            <div className="flex items-center space-x-4 mb-4">
              <div className="transform scale-150">{selectedVehicleData.icon}</div>
              <div>
                <h4 className="text-white font-heading font-bold text-xl">{selectedVehicleData.name}</h4>
                <p className="text-cabinet-grey">{selectedVehicleData.description}</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-cabinet-yellow font-bold">{selectedVehicleData.capacity}</div>
                <div className="text-cabinet-grey text-sm">Capacity</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {selectedVehicleData.features.map((feature) => (
                <span
                  key={feature}
                  className="px-3 py-1 bg-cabinet-yellow/20 border border-cabinet-yellow/30 rounded-full text-cabinet-yellow text-sm font-medium"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Platform Price Comparison */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-heading font-bold text-white">Platform Comparison</h4>
            <div className="text-sm text-cabinet-grey">
              Best price: <span className="text-cabinet-yellow font-bold">₹{bestPrice}</span>
            </div>
          </div>

          <div className="grid gap-4">
            {currentPrices.map((platform, index) => (
              <div
                key={platform.platform}
                onClick={() => handleRideSelect(platform)}
                className={`glass-morphism-hover rounded-2xl p-4 border cursor-pointer transition-all duration-300 hover-lift group ${
                  selectedPlatform === platform.platform
                    ? 'border-cabinet-yellow bg-cabinet-yellow/10'
                    : 'border-cabinet-yellow/20 hover:border-cabinet-yellow/40'
                } ${platform.price === bestPrice ? 'ring-2 ring-cabinet-yellow/50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${platform.color} rounded-full flex items-center justify-center text-2xl relative`}>
                      {platform.logo}
                      {platform.price === bestPrice && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h5 className="text-white font-semibold text-lg">{platform.platform}</h5>
                        {platform.platform === 'CAB-I-NET' && (
                          <span className="bg-cabinet-yellow text-black px-2 py-1 rounded-full text-xs font-bold">
                            RECOMMENDED
                          </span>
                        )}
                        {platform.price === bestPrice && platform.platform !== 'CAB-I-NET' && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            BEST PRICE
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-cabinet-yellow" />
                          <span className="text-cabinet-grey">{platform.eta}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-cabinet-grey">{platform.rating}</span>
                        </div>
                        {platform.surge && (
                          <div className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs">
                            {platform.surge}x surge
                          </div>
                        )}
                        {platform.discount && (
                          <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                            {platform.discount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      platform.price === bestPrice ? 'text-green-400' : 'text-cabinet-yellow'
                    }`}>
                      ₹{platform.price}
                    </div>
                    <div className="text-cabinet-grey text-sm">per ride</div>
                  </div>
                </div>

                {/* Hover Action */}
                <div className={`mt-4 text-center transition-all duration-300 ${
                  selectedPlatform === platform.platform ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  <div className="text-cabinet-yellow text-sm font-medium">
                    {selectedPlatform === platform.platform ? '✓ Selected' : 'Click to select this option'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Book Button */}
        <div className="pt-4 border-t border-cabinet-yellow/20">
          <button
            onClick={() => {
              const selectedPlatformData = currentPrices.find(p => p.platform === selectedPlatform);
              if (selectedPlatformData) {
                handleRideSelect(selectedPlatformData);
              }
            }}
            className="w-full btn-premium py-4 rounded-2xl font-heading font-bold text-lg tracking-wide hover-lift relative overflow-hidden group"
          >
            <span className="relative z-10">
              Book with {selectedPlatform} - ₹{currentPrices.find(p => p.platform === selectedPlatform)?.price}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cabinet-light-yellow to-cabinet-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
}
