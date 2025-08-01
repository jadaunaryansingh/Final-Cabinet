import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingChatbot from '../components/FloatingChatbot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calculator, Clock, Route, DollarSign, Star } from 'lucide-react';

interface CostBreakdown {
  baseFare: number;
  distance: number;
  time: number;
  surge: number;
  total: number;
}

interface RideOption {
  type: string;
  name: string;
  icon: string;
  price: number;
  time: string;
  capacity: string;
  features: string[];
}

export default function CalculatorPage() {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown | null>(null);
  const [rideOptions, setRideOptions] = useState<RideOption[]>([]);

  const calculateRideCost = async () => {
    if (!pickup || !destination) {
      alert('Please enter both pickup and destination locations');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock calculation based on locations
    const mockDistance = Math.random() * 20 + 5; // 5-25 km
    const mockTime = Math.random() * 30 + 15; // 15-45 minutes
    const surge = Math.random() > 0.7 ? 1.5 : 1.0; // 30% chance of surge

    const breakdown: CostBreakdown = {
      baseFare: 50,
      distance: mockDistance * 12, // ₹12 per km
      time: mockTime * 2, // ₹2 per minute
      surge: surge > 1 ? 80 : 0,
      total: 0
    };
    breakdown.total = (breakdown.baseFare + breakdown.distance + breakdown.time + breakdown.surge) * surge;

    const options: RideOption[] = [
      {
        type: 'standard',
        name: 'CAB Standard',
        icon: '🚗',
        price: breakdown.total * 0.8,
        time: `${Math.ceil(mockTime)}`,
        capacity: '4 seats',
        features: ['AC', 'Music', 'Safe Drive']
      },
      {
        type: 'premium',
        name: 'CAB Premium',
        icon: '🚙',
        price: breakdown.total,
        time: `${Math.ceil(mockTime * 0.9)}`,
        capacity: '4 seats',
        features: ['AC', 'Leather Seats', 'Premium Audio', 'Wi-Fi']
      },
      {
        type: 'vip',
        name: 'CAB VIP',
        icon: '🏎️',
        price: breakdown.total * 1.4,
        time: `${Math.ceil(mockTime * 0.8)}`,
        capacity: '4 seats',
        features: ['Luxury Interior', 'Chauffeur', 'Complimentary Water', 'Priority Pickup']
      },
      {
        type: 'suv',
        name: 'CAB SUV',
        icon: '🚕',
        price: breakdown.total * 1.2,
        time: `${Math.ceil(mockTime * 0.95)}`,
        capacity: '6-7 seats',
        features: ['Spacious', 'Extra Luggage', 'Family Friendly', 'Safety Features']
      }
    ];

    setCostBreakdown(breakdown);
    setRideOptions(options);
    setCalculated(true);
    setLoading(false);
  };

  const bookRide = (rideType: string) => {
    // Navigate to booking page with pre-filled data
    const bookingData = {
      pickup,
      destination,
      rideType,
      estimatedCost: rideOptions.find(option => option.type === rideType)?.price
    };
    
    localStorage.setItem('booking-prefill', JSON.stringify(bookingData));
    window.location.href = '/booking';
  };

  const resetCalculator = () => {
    setPickup('');
    setDestination('');
    setCalculated(false);
    setCostBreakdown(null);
    setRideOptions([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calculator className="h-8 w-8 text-yellow-500" />
              <h1 className="text-3xl font-bold text-white">Ride Cost Calculator</h1>
            </div>
            <p className="text-gray-400">Calculate your ride cost before booking</p>
          </div>

          {/* Calculator Form */}
          <Card className="glass-morphism border-yellow-500/20 mb-8">
            <CardHeader>
              <CardTitle className="text-yellow-500 flex items-center gap-2">
                <Route className="h-5 w-5" />
                Trip Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-500" />
                    Pickup Location
                  </label>
                  <Input
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="Enter pickup location"
                    className="bg-black/20 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-red-500" />
                    Destination
                  </label>
                  <Input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter destination"
                    className="bg-black/20 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={calculateRideCost}
                  disabled={loading}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                >
                  {loading ? 'Calculating...' : 'Calculate Cost'}
                </Button>
                {calculated && (
                  <Button 
                    onClick={resetCalculator}
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-800"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {calculated && costBreakdown && (
            <>
              {/* Cost Breakdown */}
              <Card className="glass-morphism border-yellow-500/20 mb-8">
                <CardHeader>
                  <CardTitle className="text-yellow-500 flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">Base Fare</p>
                      <p className="text-white font-semibold">₹{costBreakdown.baseFare}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">Distance</p>
                      <p className="text-white font-semibold">₹{Math.round(costBreakdown.distance)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">Time</p>
                      <p className="text-white font-semibold">₹{Math.round(costBreakdown.time)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">Surge</p>
                      <p className="text-white font-semibold">₹{Math.round(costBreakdown.surge)}</p>
                    </div>
                  </div>
                  {costBreakdown.surge > 0 && (
                    <div className="text-center">
                      <Badge variant="destructive" className="mb-2">
                        Surge Pricing Active (1.5x)
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Ride Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rideOptions.map((option) => (
                  <Card key={option.type} className="glass-morphism border-yellow-500/20 hover:border-yellow-500/40 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{option.icon}</span>
                          <div>
                            <h3 className="text-white font-semibold">{option.name}</h3>
                            <p className="text-gray-400 text-sm">{option.capacity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-yellow-500 text-xl font-bold">₹{Math.round(option.price)}</p>
                          <p className="text-gray-400 text-sm flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {option.time} min
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {option.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button 
                        onClick={() => bookRide(option.type)}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                      >
                        Book {option.name}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Tips */}
              <Card className="glass-morphism border-yellow-500/20 mt-8">
                <CardHeader>
                  <CardTitle className="text-yellow-500 flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Money Saving Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <p className="text-white">• Book during off-peak hours to avoid surge pricing</p>
                      <p className="text-white">• Use CAB Standard for budget-friendly rides</p>
                      <p className="text-white">• Share rides with friends to split costs</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-white">• Check for ongoing offers and discounts</p>
                      <p className="text-white">• Use loyalty points for additional savings</p>
                      <p className="text-white">• Pre-book rides for better rates</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      <Footer />
      <FloatingChatbot />
    </div>
  );
}
