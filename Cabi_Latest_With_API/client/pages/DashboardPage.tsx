import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingChatbot from '../components/FloatingChatbot';
import FirebaseTest from '../components/FirebaseTest';
import { useAppState } from '../hooks/useAppState';
import { useAuth } from '../hooks/useUnifiedAuth';
import { 
  MapPin, 
  Clock, 
  Star, 
  TrendingUp, 
  Car, 
  CreditCard, 
  Calendar,
  BarChart3,
  Activity,
  Users,
  Heart,
  Navigation,
  Timer,
  DollarSign
} from 'lucide-react';

interface RideHistory {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  amount: number;
  driver: string;
  rating: number;
  status: 'completed' | 'cancelled' | 'ongoing';
  vehicle: string;
  distance: string;
  duration: string;
}

const mockRideHistory: RideHistory[] = [
  {
    id: '1',
    from: 'MG Road Metro',
    to: 'Koramangala',
    date: '2024-01-20',
    time: '2:30 PM',
    amount: 280,
    driver: 'Rajesh Kumar',
    rating: 4.8,
    status: 'completed',
    vehicle: 'Premium Sedan',
    distance: '8.5 km',
    duration: '25 min'
  },
  {
    id: '2',
    from: 'Airport',
    to: 'Whitefield',
    date: '2024-01-18',
    time: '11:15 AM',
    amount: 520,
    driver: 'Arjun Singh',
    rating: 4.9,
    status: 'completed',
    vehicle: 'Luxury SUV',
    distance: '28 km',
    duration: '45 min'
  },
  {
    id: '3',
    from: 'HSR Layout',
    to: 'Electronic City',
    date: '2024-01-17',
    time: '9:45 AM',
    amount: 180,
    driver: 'Suresh Reddy',
    rating: 4.6,
    status: 'completed',
    vehicle: 'Sedan',
    distance: '12 km',
    duration: '30 min'
  }
];

export default function DashboardPage() {
  const { addNotification } = useAppState();
  const { authState, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'rides' | 'analytics'>('overview');

  if (!authState.user) {
    return null;
  }

  // Calculate dynamic stats based on actual user data
  const stats = {
    totalRides: authState.user.totalRides,
    totalSpent: authState.user.rideHistory?.reduce((sum, ride) => sum + ride.cost, 0) || 0,
    savedAmount: Math.floor((authState.user.rideHistory?.reduce((sum, ride) => sum + ride.cost, 0) || 0) * 0.15), // Estimated 15% savings
    avgRating: authState.user.rating,
    favoriteDriver: authState.user.favoriteDrivers?.[0]?.name || 'No favorite yet',
    totalDistance: authState.user.rideHistory?.reduce((sum, ride) => {
      const distance = parseFloat(ride.distance?.replace(/[^0-9.]/g, '') || '0');
      return sum + distance;
    }, 0).toFixed(1) + ' km',
    carbonSaved: Math.floor((authState.user.rideHistory?.length || 0) * 2.3) + ' kg' // Estimated carbon savings
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-black text-gradient text-shadow-glow mb-3">
                Welcome back, {authState.user.name}! 👋
              </h1>
              <p className="text-cabinet-grey text-xl font-accent font-medium tracking-wide">
                Your premium ride dashboard awaits • {authState.user.level}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-cabinet-yellow font-semibold">{authState.user.rating}</span>
                </div>
                <div className="text-cabinet-grey">•</div>
                <div className="text-cabinet-grey text-sm">{authState.user.totalRides} rides completed</div>
                <div className="text-cabinet-grey">•</div>
                <div className="text-cabinet-grey text-sm">{authState.user.loyaltyPoints} points</div>
              </div>
            </div>
            <div className="hidden md:flex space-x-4">
              <Link
                to="/booking"
                className="bg-gradient-gold text-black px-6 py-3 rounded-2xl font-cabinet font-medium hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <Car className="w-5 h-5" />
                <span>Book Ride</span>
              </Link>
              <button className="glass-morphism border border-cabinet-yellow/30 text-cabinet-yellow px-6 py-3 rounded-2xl font-cabinet font-medium hover:bg-cabinet-yellow hover:text-black transition-all duration-300">
                Quick Actions
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-morphism rounded-2xl p-6 border border-cabinet-yellow/20 group hover:border-cabinet-yellow/50 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-cabinet-yellow/20 rounded-xl flex items-center justify-center group-hover:bg-cabinet-yellow/30 transition-colors duration-300">
                <Car className="w-6 h-6 text-cabinet-yellow" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-2xl font-cabinet font-bold text-white mb-1">{stats.totalRides}</div>
            <div className="text-cabinet-grey text-sm">Total Rides</div>
          </div>

          <div className="glass-morphism rounded-2xl p-6 border border-cabinet-yellow/20 group hover:border-cabinet-yellow/50 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-cabinet-yellow/20 rounded-xl flex items-center justify-center group-hover:bg-cabinet-yellow/30 transition-colors duration-300">
                <DollarSign className="w-6 h-6 text-cabinet-yellow" />
              </div>
              <Activity className="w-5 h-5 text-cabinet-yellow" />
            </div>
            <div className="text-2xl font-cabinet font-bold text-white mb-1">₹{stats.totalSpent.toLocaleString()}</div>
            <div className="text-cabinet-grey text-sm">Total Spent</div>
          </div>

          <div className="glass-morphism rounded-2xl p-6 border border-cabinet-yellow/20 group hover:border-cabinet-yellow/50 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-cabinet-yellow/20 rounded-xl flex items-center justify-center group-hover:bg-cabinet-yellow/30 transition-colors duration-300">
                <Star className="w-6 h-6 text-cabinet-yellow" />
              </div>
              <Heart className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-2xl font-cabinet font-bold text-white mb-1">{stats.avgRating}</div>
            <div className="text-cabinet-grey text-sm">Avg Rating</div>
          </div>

          <div className="glass-morphism rounded-2xl p-6 border border-cabinet-yellow/20 group hover:border-cabinet-yellow/50 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-cabinet-yellow/20 rounded-xl flex items-center justify-center group-hover:bg-cabinet-yellow/30 transition-colors duration-300">
                <Navigation className="w-6 h-6 text-cabinet-yellow" />
              </div>
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-2xl font-cabinet font-bold text-white mb-1">{stats.totalDistance}</div>
            <div className="text-cabinet-grey text-sm">Distance</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 glass-morphism rounded-2xl p-2 border border-cabinet-yellow/20 w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'rides', label: 'Recent Rides', icon: Car },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-cabinet-yellow text-black'
                  : 'text-cabinet-grey hover:text-cabinet-yellow'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Quick Actions */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20">
                <h3 className="text-xl font-cabinet font-bold text-white mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <Link
                    to="/booking"
                    className="w-full bg-gradient-gold text-black py-4 rounded-2xl font-medium hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Car className="w-5 h-5" />
                    <span>Book New Ride</span>
                  </Link>
                  <Link
                    to="/favorite-drivers"
                    className="w-full glass-morphism border border-cabinet-yellow/30 text-cabinet-yellow py-4 rounded-2xl font-medium hover:bg-cabinet-yellow hover:text-black transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Users className="w-5 h-5" />
                    <span>Favorite Drivers</span>
                  </Link>
                  <button className="w-full glass-morphism border border-cabinet-yellow/30 text-cabinet-yellow py-4 rounded-2xl font-medium hover:bg-cabinet-yellow hover:text-black transition-all duration-300 flex items-center justify-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Payment Methods</span>
                  </button>
                </div>
              </div>

              {/* Achievements */}
              <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20">
                <h3 className="text-xl font-cabinet font-bold text-white mb-6">Achievements 🏆</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-cabinet-yellow/10 rounded-xl">
                    <div className="text-2xl">🌟</div>
                    <div>
                      <div className="text-white font-medium">Premium Member</div>
                      <div className="text-cabinet-grey text-sm">50+ rides completed</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-cabinet-yellow/10 rounded-xl">
                    <div className="text-2xl">🌱</div>
                    <div>
                      <div className="text-white font-medium">Eco Warrior</div>
                      <div className="text-cabinet-grey text-sm">Saved {stats.carbonSaved} CO₂</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20">
                <h3 className="text-xl font-cabinet font-bold text-white mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {mockRideHistory.slice(0, 3).map((ride) => (
                    <div key={ride.id} className="flex items-center justify-between p-4 glass-morphism rounded-2xl border border-cabinet-yellow/10 hover:border-cabinet-yellow/30 transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 gradient-gold rounded-full flex items-center justify-center">
                          <Car className="w-6 h-6 text-black" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{ride.from} → {ride.to}</div>
                          <div className="text-cabinet-grey text-sm">{ride.date} • {ride.driver}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-cabinet-yellow font-bold">₹{ride.amount}</div>
                        <div className="flex items-center space-x-1 text-sm">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-cabinet-grey">{ride.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setActiveTab('rides')}
                  className="mt-4 text-cabinet-yellow hover:text-cabinet-light-yellow transition-colors duration-300 text-sm font-medium"
                >
                  View all rides →
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rides' && (
          <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-cabinet font-bold text-white">Ride History</h3>
              <div className="text-cabinet-grey text-sm">
                {authState.user.rideHistory.length} total rides
              </div>
            </div>
            {authState.user.rideHistory.length === 0 ? (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-cabinet-yellow mx-auto mb-4 opacity-50" />
                <h4 className="text-white text-lg font-semibold mb-2">No rides yet</h4>
                <p className="text-cabinet-grey mb-6">Start booking rides to see your history here!</p>
                <Link
                  to="/booking"
                  className="inline-flex items-center space-x-2 bg-cabinet-yellow text-black px-6 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-300"
                >
                  <Car className="w-4 h-4" />
                  <span>Book Your First Ride</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {authState.user.rideHistory.map((ride) => (
                  <div key={ride.id} className="glass-morphism rounded-2xl p-6 border border-cabinet-yellow/10 hover:border-cabinet-yellow/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 gradient-gold rounded-2xl flex items-center justify-center">
                          <Car className="w-8 h-8 text-black" />
                        </div>
                        <div>
                          <div className="text-white font-semibold text-lg">{ride.pickup} → {ride.destination}</div>
                          <div className="text-cabinet-grey">{ride.rideType} • {ride.driver}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-cabinet font-bold text-cabinet-yellow">₹{ride.cost}</div>
                        <div className="text-cabinet-grey text-sm">Completed</div>
                      </div>
                    </div>
                  
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-cabinet-yellow" />
                        <span className="text-cabinet-grey">{new Date(ride.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-cabinet-yellow" />
                        <span className="text-cabinet-grey">{new Date(ride.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Navigation className="w-4 h-4 text-cabinet-yellow" />
                        <span className="text-cabinet-grey">{ride.distance}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Timer className="w-4 h-4 text-cabinet-yellow" />
                        <span className="text-cabinet-grey">{ride.duration}</span>
                      </div>
                    </div>
                  
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-cabinet-yellow/10">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < (ride.rating || 0) ? 'text-yellow-400 fill-current' : 'text-cabinet-grey'
                            }`}
                          />
                        ))}
                        <span className="text-white font-medium ml-1">({ride.rating || 0}/5)</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            // Pre-fill booking page with same route
                            const bookingData = {
                              pickup: ride.pickup,
                              destination: ride.destination,
                              rideType: ride.rideType
                            };
                            localStorage.setItem('booking-prefill', JSON.stringify(bookingData));
                            window.location.href = '/booking';
                          }}
                          className="px-4 py-2 glass-morphism border border-cabinet-yellow/30 text-cabinet-yellow rounded-lg text-sm hover:bg-cabinet-yellow hover:text-black transition-all duration-300"
                        >
                          Book Again
                        </button>
                        <button
                          onClick={() => {
                            const rating = prompt('Rate your ride experience (1-5 stars):');
                            if (rating && parseInt(rating) >= 1 && parseInt(rating) <= 5) {
                              // Update the ride rating
                              const updatedUser = {
                                ...authState.user,
                                rideHistory: authState.user.rideHistory.map(r =>
                                  r.id === ride.id ? { ...r, rating: parseInt(rating) } : r
                                )
                              };
                              updateUser(updatedUser);
                              addNotification({
                                type: 'success',
                                message: `⭐ Thank you! You rated this ride ${rating} stars.`
                              });
                            } else if (rating) {
                              addNotification({
                                type: 'error',
                                message: '❌ Please enter a valid rating between 1 and 5.'
                              });
                            }
                          }}
                          className="px-4 py-2 glass-morphism border border-cabinet-yellow/30 text-cabinet-yellow rounded-lg text-sm hover:bg-cabinet-yellow hover:text-black transition-all duration-300"
                        >
                          Rate Driver
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20">
              <h3 className="text-xl font-cabinet font-bold text-white mb-6">Monthly Spending</h3>
              <div className="space-y-4">
                {['Jan', 'Feb', 'Mar', 'Apr'].map((month, index) => {
                  const amount = [2340, 1890, 2156, 2067][index];
                  const percentage = (amount / 2340) * 100;
                  return (
                    <div key={month} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-cabinet-grey">{month} 2024</span>
                        <span className="text-white font-medium">₹{amount}</span>
                      </div>
                      <div className="w-full bg-cabinet-dark rounded-full h-2">
                        <div 
                          className="bg-gradient-gold h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20">
              <h3 className="text-xl font-cabinet font-bold text-white mb-6">Ride Insights</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-cabinet-grey text-sm mb-2">Most Used Route</div>
                  <div className="text-white font-medium">MG Road ↔ Koramangala</div>
                  <div className="text-cabinet-yellow text-sm">12 rides this month</div>
                </div>
                <div>
                  <div className="text-cabinet-grey text-sm mb-2">Preferred Time</div>
                  <div className="text-white font-medium">Evening (5-8 PM)</div>
                  <div className="text-cabinet-yellow text-sm">67% of rides</div>
                </div>
                <div>
                  <div className="text-cabinet-grey text-sm mb-2">Favorite Vehicle</div>
                  <div className="text-white font-medium">Premium Sedan</div>
                  <div className="text-cabinet-yellow text-sm">45% preference</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Firebase Test Component - Remove this after testing */}
      <div className="max-w-4xl mx-auto mb-8">
        <FirebaseTest />
      </div>

      <Footer />
      <FloatingChatbot />
    </div>
  );
}
