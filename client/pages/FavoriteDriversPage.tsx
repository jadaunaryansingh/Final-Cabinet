import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingChatbot from '../components/FloatingChatbot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useAppState } from '@/hooks/useAppState';
import { 
  Star, 
  Phone, 
  MessageCircle, 
  Car, 
  Clock, 
  MapPin, 
  Calendar,
  Heart,
  Award,
  Shield,
  Zap,
  ThumbsUp,
  Navigation,
  User,
  Filter,
  Search,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Route,
  DollarSign,
  Mail,
  UserPlus,
  Plus
} from 'lucide-react';

export default function FavoriteDriversPage() {
  const { authState, addFavoriteDriver } = useAuth();
  const { addNotification } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [selectedTab, setSelectedTab] = useState('favorites');
  const [isAddingDriver, setIsAddingDriver] = useState(false);
  
  if (!authState.user) {
    return null;
  }

  const handleAddDriver = async () => {
    if (!emailSearch.trim()) {
      addNotification({
        type: 'error',
        message: '❌ Please enter a driver email address'
      });
      return;
    }

    if (!emailSearch.includes('@')) {
      addNotification({
        type: 'error',
        message: '❌ Please enter a valid email address'
      });
      return;
    }

    setIsAddingDriver(true);
    
    try {
      const success = await addFavoriteDriver(emailSearch);
      
      if (success) {
        addNotification({
          type: 'success',
          message: `⭐ Driver ${emailSearch} added to favorites`
        });
        setEmailSearch('');
      } else {
        addNotification({
          type: 'error',
          message: '❌ Driver not found or already in your favorites'
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: '❌ Failed to add driver to favorites. Please try again.'
      });
    } finally {
      setIsAddingDriver(false);
    }
  };

  // Get user's favorite drivers list
  const favoriteDrivers = authState.user.favoriteDrivers || [];
  
  const filteredDrivers = favoriteDrivers.filter(driver =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-5xl font-display font-black text-gradient text-shadow-glow mb-4">
            Favorite Drivers ⭐
          </h1>
          <p className="text-cabinet-grey text-xl font-accent font-medium tracking-wide max-w-3xl mx-auto leading-relaxed">
            Your trusted drivers for premium, personalized service every time
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-morphism border-cabinet-yellow/20 text-center">
            <CardContent className="p-6">
              <Heart className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <div className="text-2xl font-cabinet font-bold text-white">{favoriteDrivers.length}</div>
              <div className="text-cabinet-grey text-sm">Favorite Drivers</div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-cabinet-yellow/20 text-center">
            <CardContent className="p-6">
              <Car className="w-8 h-8 text-cabinet-yellow mx-auto mb-3" />
              <div className="text-2xl font-cabinet font-bold text-white">
                {favoriteDrivers.reduce((sum, d) => sum + d.totalRides, 0)}
              </div>
              <div className="text-cabinet-grey text-sm">Total Rides</div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-cabinet-yellow/20 text-center">
            <CardContent className="p-6">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-2xl font-cabinet font-bold text-white">
                {favoriteDrivers.length > 0 
                  ? (favoriteDrivers.reduce((sum, d) => sum + d.rating, 0) / favoriteDrivers.length).toFixed(1)
                  : '0.0'
                }
              </div>
              <div className="text-cabinet-grey text-sm">Avg Rating</div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-cabinet-yellow/20 text-center">
            <CardContent className="p-6">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-2xl font-cabinet font-bold text-white">{favoriteDrivers.length}</div>
              <div className="text-cabinet-grey text-sm">Available</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Left Column - Drivers Management */}
          <div className="lg:col-span-3">
            
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
              <TabsList className="grid grid-cols-3 w-full bg-cabinet-dark/50 border border-cabinet-yellow/20">
                <TabsTrigger 
                  value="favorites" 
                  className="data-[state=active]:bg-cabinet-yellow data-[state=active]:text-black text-cabinet-grey"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  My Favorites ({favoriteDrivers.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="add"
                  className="data-[state=active]:bg-cabinet-yellow data-[state=active]:text-black text-cabinet-grey"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Driver
                </TabsTrigger>
                <TabsTrigger 
                  value="history"
                  className="data-[state=active]:bg-cabinet-yellow data-[state=active]:text-black text-cabinet-grey"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="favorites" className="space-y-6">
                {/* Search */}
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cabinet-yellow w-5 h-5" />
                    <Input
                      placeholder="Search drivers by name, email, or vehicle..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 glass-morphism border-cabinet-yellow/30 text-white placeholder-cabinet-grey focus:border-cabinet-yellow"
                    />
                  </div>
                  <Button variant="outline" className="border-cabinet-yellow/30 text-cabinet-yellow">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>

                {/* Drivers List */}
                {favoriteDrivers.length === 0 ? (
                  <Card className="glass-morphism border-cabinet-yellow/20">
                    <CardContent className="text-center py-12">
                      <Heart className="w-16 h-16 text-cabinet-yellow mx-auto mb-4 opacity-50" />
                      <CardTitle className="text-white mb-2">No Favorite Drivers Yet</CardTitle>
                      <CardDescription className="text-cabinet-grey">
                        Start adding drivers by their email addresses to create your preferred driver network!
                      </CardDescription>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredDrivers.map((driver) => (
                      <Card key={driver.id} className="glass-morphism border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300 hover-lift">
                        <CardContent className="p-6">
                          {/* Driver Header */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <img
                                  src={driver.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(driver.name)}&background=d89000&color=000000&size=64`}
                                  alt={driver.name}
                                  className="w-16 h-16 rounded-full object-cover border-2 border-cabinet-yellow/30"
                                />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background bg-green-400" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="text-xl font-cabinet font-bold text-white">{driver.name}</h3>
                                  <Star className="w-5 h-5 text-cabinet-yellow" />
                                </div>
                                <p className="text-cabinet-grey text-sm">{driver.email}</p>
                                <p className="text-cabinet-yellow text-sm">{driver.vehicleType} • {driver.vehicleNumber}</p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" className="border-cabinet-yellow/30 text-cabinet-yellow">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Driver Stats */}
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center p-3 glass-morphism rounded-xl border border-cabinet-yellow/20">
                              <div className="flex items-center justify-center space-x-1 mb-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-white font-bold">{driver.rating}</span>
                              </div>
                              <div className="text-cabinet-grey text-xs">Rating</div>
                            </div>
                            
                            <div className="text-center p-3 glass-morphism rounded-xl border border-cabinet-yellow/20">
                              <div className="text-white font-bold mb-1">{driver.totalRides}</div>
                              <div className="text-cabinet-grey text-xs">Total Rides</div>
                            </div>
                            
                            <div className="text-center p-3 glass-morphism rounded-xl border border-cabinet-yellow/20">
                              <div className="text-cabinet-yellow font-bold mb-1">{driver.vehicleType}</div>
                              <div className="text-cabinet-grey text-xs">Vehicle</div>
                            </div>
                          </div>

                          {/* Driver Info */}
                          <div className="text-center mb-6">
                            <Badge variant="outline" className="border-cabinet-yellow text-cabinet-yellow mb-2">
                              Added {new Date(driver.addedDate).toLocaleDateString()}
                            </Badge>
                            <p className="text-cabinet-grey text-sm">
                              Vehicle: <span className="text-white">{driver.vehicleNumber}</span>
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-3 gap-2">
                            <Button
                              onClick={() => {
                                // Pre-fill booking page with preferred driver
                                localStorage.setItem('preferred-driver', JSON.stringify({
                                  driverId: driver.id,
                                  driverName: driver.name,
                                  driverEmail: driver.email,
                                  vehicleNumber: driver.vehicleNumber
                                }));
                                window.location.href = '/booking';
                              }}
                              size="sm"
                              className="bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow"
                            >
                              <Car className="w-4 h-4 mr-1" />
                              Book
                            </Button>
                            <Button
                              onClick={() => {
                                // Simulate call functionality
                                addNotification({
                                  type: 'info',
                                  message: `📞 Calling ${driver.name}... (${driver.vehicleNumber})`
                                });
                                setTimeout(() => {
                                  addNotification({
                                    type: 'success',
                                    message: `✅ Connected to ${driver.name}. Enjoy your conversation!`
                                  });
                                }, 2000);
                              }}
                              size="sm"
                              variant="outline"
                              className="border-cabinet-yellow/30 text-cabinet-yellow hover:bg-cabinet-yellow hover:text-black"
                            >
                              <Phone className="w-4 h-4 mr-1" />
                              Call
                            </Button>
                            <Button
                              onClick={() => {
                                addNotification({
                                  type: 'info',
                                  message: `💬 Opening chat with ${driver.name}... Feature coming soon!`
                                });
                              }}
                              size="sm"
                              variant="outline"
                              className="border-cabinet-yellow/30 text-cabinet-yellow hover:bg-cabinet-yellow hover:text-black"
                            >
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Chat
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="add" className="space-y-6">
                <Card className="glass-morphism border-cabinet-yellow/20">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 gradient-gold rounded-full flex items-center justify-center hover-lift cursor-pointer">
                      <UserPlus className="w-8 h-8 text-black" />
                    </div>
                    <CardTitle className="text-xl font-cabinet text-white">Add Favorite Driver</CardTitle>
                    <CardDescription className="text-cabinet-grey">
                      Add drivers to your favorites by their email address
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cabinet-yellow w-5 h-5" />
                        <Input
                          type="email"
                          placeholder="Enter driver's email address"
                          value={emailSearch}
                          onChange={(e) => setEmailSearch(e.target.value)}
                          className="pl-10 glass-morphism border-cabinet-yellow/30 text-white placeholder-cabinet-grey focus:border-cabinet-yellow"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddDriver()}
                        />
                      </div>
                      <Button
                        onClick={handleAddDriver}
                        disabled={isAddingDriver || !emailSearch.trim()}
                        className="w-full bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow font-semibold"
                      >
                        {isAddingDriver ? (
                          <><Clock className="w-4 h-4 mr-2 animate-spin" /> Adding...</>
                        ) : (
                          <><Heart className="w-4 h-4 mr-2" /> Add to Favorites</>
                        )}
                      </Button>
                    </div>
                    
                    {/* Demo Drivers Section */}
                    <div className="mt-8 pt-6 border-t border-cabinet-yellow/20">
                      <h4 className="text-white font-semibold mb-4 flex items-center">
                        <Car className="w-4 h-4 mr-2 text-cabinet-yellow" />
                        Suggested Drivers
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { email: 'rajesh.driver@cabinet.com', name: 'Rajesh Kumar', vehicle: 'KA 05 MZ 1234' },
                          { email: 'suresh.driver@cabinet.com', name: 'Suresh Sharma', vehicle: 'KA 03 AB 5678' },
                          { email: 'amit.driver@cabinet.com', name: 'Amit Singh', vehicle: 'KA 02 CD 9012' },
                          { email: 'vinod.driver@cabinet.com', name: 'Vinod Kumar', vehicle: 'KA 01 EF 3456' }
                        ].map((driver) => (
                          <div key={driver.email} className="glass-morphism border border-cabinet-yellow/20 p-3 rounded-xl">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-white font-medium text-sm">{driver.name}</div>
                                <div className="text-cabinet-grey text-xs">{driver.email}</div>
                                <div className="text-cabinet-yellow text-xs">{driver.vehicle}</div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEmailSearch(driver.email)}
                                className="border-cabinet-yellow/30 text-cabinet-yellow hover:bg-cabinet-yellow hover:text-black text-xs"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                {authState.user.rideHistory.length === 0 ? (
                  <Card className="glass-morphism border-cabinet-yellow/20">
                    <CardContent className="text-center py-12">
                      <Clock className="w-16 h-16 text-cabinet-yellow mx-auto mb-4 opacity-50" />
                      <CardTitle className="text-white mb-2">No Ride History</CardTitle>
                      <CardDescription className="text-cabinet-grey">
                        Your ride history with favorite drivers will appear here.
                      </CardDescription>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {authState.user.rideHistory.slice(0, 10).map((ride) => (
                      <Card key={ride.id} className="glass-morphism border-cabinet-yellow/20">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 gradient-gold rounded-full flex items-center justify-center text-xl">
                                🚗
                              </div>
                              <div>
                                <h4 className="text-white font-semibold">{ride.driver}</h4>
                                <div className="text-cabinet-grey text-sm">{new Date(ride.date).toLocaleDateString()}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-cabinet-yellow font-bold">₹{ride.cost}</div>
                              <div className="text-cabinet-grey text-sm">{ride.rideType}</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-cabinet-grey">From</div>
                              <div className="text-white">{ride.pickup}</div>
                            </div>
                            <div>
                              <div className="text-cabinet-grey">To</div>
                              <div className="text-white">{ride.destination}</div>
                            </div>
                            <div>
                              <div className="text-cabinet-grey">Distance</div>
                              <div className="text-white">{ride.distance}</div>
                            </div>
                            <div>
                              <div className="text-cabinet-grey">Duration</div>
                              <div className="text-white">{ride.duration}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Quick Actions */}
            <Card className="glass-morphism border-cabinet-yellow/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-cabinet-yellow" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/booking">
                  <Button className="w-full bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow">
                    <Car className="w-4 h-4 mr-2" />
                    Book Ride
                  </Button>
                </Link>
                <Button variant="outline" className="w-full border-cabinet-yellow/30 text-cabinet-yellow hover:bg-cabinet-yellow hover:text-black">
                  <Search className="w-4 h-4 mr-2" />
                  Find Drivers
                </Button>
              </CardContent>
            </Card>

            {/* Driver Insights */}
            {favoriteDrivers.length > 0 && (
              <Card className="glass-morphism border-cabinet-yellow/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-cabinet-yellow" />
                    Driver Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-cabinet font-bold text-cabinet-yellow mb-1">
                      {(favoriteDrivers.reduce((sum, d) => sum + d.rating, 0) / favoriteDrivers.length).toFixed(1)}
                    </div>
                    <div className="text-cabinet-grey text-sm">Average Rating</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-cabinet-grey">Total Favorites</span>
                      <span className="text-white">{favoriteDrivers.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-cabinet-grey">Total Rides</span>
                      <span className="text-white">{favoriteDrivers.reduce((sum, d) => sum + d.totalRides, 0)}</span>
                    </div>
                    {favoriteDrivers.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-cabinet-grey">Top Driver</span>
                        <span className="text-white">{favoriteDrivers.sort((a, b) => b.rating - a.rating)[0].name}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Premium Benefits */}
            <Card className="glass-morphism border-cabinet-yellow/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-cabinet-yellow" />
                  Premium Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-cabinet-yellow" />
                  <span className="text-white text-sm">Favorite driver priority</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-cabinet-yellow" />
                  <span className="text-white text-sm">Instant booking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-cabinet-yellow" />
                  <span className="text-white text-sm">Personalized service</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
      <FloatingChatbot />
    </div>
  );
}
