import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth, RideHistoryEntry } from '@/hooks/useAuth';
import { useAppState } from '@/hooks/useAppState';
import EditProfileDialog from './EditProfileDialog';
import HelpSupportDialog from './HelpSupportDialog';
import PaymentMethodsDialog from './PaymentMethodsDialog';
import {
  User,
  Star,
  MapPin,
  Calendar,
  Phone,
  Mail,
  CreditCard,
  Award,
  TrendingUp,
  Clock,
  Route,
  LogOut,
  Edit,
  Shield,
  Heart,
  Car,
  Settings,
  Lock,
  Bell,
  HelpCircle
} from 'lucide-react';

interface UserProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserProfile({ open, onOpenChange }: UserProfileProps) {
  const { authState, logout } = useAuth();
  const { addNotification } = useAppState();
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  if (!authState.user) return null;

  const { user } = authState;

  const handleLogout = () => {
    logout();
    onOpenChange(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getTotalSpent = () => {
    return user.rideHistory.reduce((total, ride) => total + ride.cost, 0);
  };

  const getAverageRating = () => {
    if (user.rideHistory.length === 0) return 0;
    const total = user.rideHistory.reduce((sum, ride) => sum + ride.rating, 0);
    return (total / user.rideHistory.length).toFixed(1);
  };

  const RideHistoryCard = ({ ride }: { ride: RideHistoryEntry }) => (
    <Card className="glass-morphism border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 glass-morphism rounded-full flex items-center justify-center border border-cabinet-yellow/30">
              <Car className="w-5 h-5 text-cabinet-yellow" />
            </div>
            <div>
              <p className="font-accent font-semibold text-white text-sm">{ride.pickup}</p>
              <p className="text-cabinet-grey text-xs">to {ride.destination}</p>
            </div>
          </div>
          <Badge variant="outline" className="border-cabinet-yellow/50 text-cabinet-yellow">
            {ride.rideType}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <p className="text-cabinet-grey">Date & Time</p>
            <p className="text-white font-medium">{formatDate(ride.date)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-cabinet-grey">Driver</p>
            <p className="text-white font-medium">{ride.driver}</p>
          </div>
          <div className="space-y-1">
            <p className="text-cabinet-grey">Distance & Duration</p>
            <p className="text-white font-medium">{ride.distance} • {ride.duration}</p>
          </div>
          <div className="space-y-1">
            <p className="text-cabinet-grey">Cost</p>
            <p className="text-cabinet-yellow font-bold">{formatCurrency(ride.cost)}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-cabinet-yellow/20">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < ride.rating ? 'text-cabinet-yellow fill-current' : 'text-cabinet-grey'
                }`}
              />
            ))}
            <span className="text-xs text-cabinet-grey ml-1">({ride.rating}/5)</span>
          </div>
          <p className="text-xs text-cabinet-grey">#{ride.id}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-morphism border border-cabinet-yellow/30 max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-display font-bold text-cabinet-yellow text-gradient flex items-center space-x-2">
              <User className="w-6 h-6" />
              <span>User Profile</span>
            </DialogTitle>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 glass-morphism border border-cabinet-yellow/20">
              <TabsTrigger value="overview" className="data-[state=active]:bg-cabinet-yellow/20">
                Overview
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-cabinet-yellow/20">
                Ride History
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-cabinet-yellow/20">
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Profile Header */}
              <Card className="glass-morphism border-cabinet-yellow/30">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-6">
                    <div className="relative">
                      <Avatar className="w-24 h-24 border-2 border-cabinet-yellow/50">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-cabinet-yellow/20 text-cabinet-yellow text-xl font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-cabinet-yellow rounded-full flex items-center justify-center">
                        <Shield className="w-3 h-3 text-black" />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <h2 className="text-2xl font-display font-bold text-white">{user.name}</h2>
                        <p className="text-cabinet-grey font-body">{user.email}</p>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Badge className="bg-cabinet-yellow/20 text-cabinet-yellow border-cabinet-yellow/50">
                          <Award className="w-3 h-3 mr-1" />
                          {user.level}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-cabinet-yellow fill-current" />
                          <span className="text-white font-semibold">{user.rating}</span>
                          <span className="text-cabinet-grey text-sm">rating</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Car className="w-4 h-4 text-cabinet-yellow" />
                          <span className="text-white font-semibold">{user.totalRides}</span>
                          <span className="text-cabinet-grey text-sm">rides</span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowEditProfile(true)}
                        className="border-cabinet-yellow/50 text-cabinet-yellow hover:bg-cabinet-yellow/10"
                      >
                        <Edit className="w-3 h-3 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass-morphism border-cabinet-yellow/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 glass-morphism rounded-full flex items-center justify-center border border-cabinet-yellow/30">
                        <TrendingUp className="w-5 h-5 text-cabinet-yellow" />
                      </div>
                      <div>
                        <p className="text-xs text-cabinet-grey">Total Spent</p>
                        <p className="text-lg font-bold text-cabinet-yellow">{formatCurrency(getTotalSpent())}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-morphism border-cabinet-yellow/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 glass-morphism rounded-full flex items-center justify-center border border-cabinet-yellow/30">
                        <Award className="w-5 h-5 text-cabinet-yellow" />
                      </div>
                      <div>
                        <p className="text-xs text-cabinet-grey">Loyalty Points</p>
                        <p className="text-lg font-bold text-cabinet-yellow">{user.loyaltyPoints.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-morphism border-cabinet-yellow/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 glass-morphism rounded-full flex items-center justify-center border border-cabinet-yellow/30">
                        <Star className="w-5 h-5 text-cabinet-yellow" />
                      </div>
                      <div>
                        <p className="text-xs text-cabinet-grey">Avg Rating</p>
                        <p className="text-lg font-bold text-cabinet-yellow">{getAverageRating()}/5</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info */}
              <Card className="glass-morphism border-cabinet-yellow/20">
                <CardHeader>
                  <CardTitle className="text-cabinet-yellow font-accent">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-cabinet-yellow" />
                      <div>
                        <p className="text-xs text-cabinet-grey">Phone</p>
                        <p className="text-white font-medium">{user.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-cabinet-yellow" />
                      <div>
                        <p className="text-xs text-cabinet-grey">Email</p>
                        <p className="text-white font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-cabinet-yellow" />
                      <div>
                        <p className="text-xs text-cabinet-grey">Member Since</p>
                        <p className="text-white font-medium">{formatDate(user.joinedDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-4 h-4 text-cabinet-yellow" />
                      <div>
                        <p className="text-xs text-cabinet-grey">Payment Method</p>
                        <p className="text-white font-medium">{user.preferredPayment}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Favorite Routes */}
              <Card className="glass-morphism border-cabinet-yellow/20">
                <CardHeader>
                  <CardTitle className="text-cabinet-yellow font-accent flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>Favorite Routes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {user.favoriteRoutes.map((route, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 glass-morphism rounded-lg">
                        <Route className="w-4 h-4 text-cabinet-yellow" />
                        <span className="text-white font-medium">{route}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Ride History Tab */}
            <TabsContent value="history" className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-accent font-semibold text-cabinet-yellow">Recent Rides</h3>
                <p className="text-sm text-cabinet-grey">{user.rideHistory.length} total rides</p>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {user.rideHistory.map((ride) => (
                  <RideHistoryCard key={ride.id} ride={ride} />
                ))}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6 mt-6">
              <Card className="glass-morphism border-cabinet-yellow/20">
                <CardHeader>
                  <CardTitle className="text-cabinet-yellow font-accent">Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button
                      onClick={() => setShowEditProfile(true)}
                      variant="outline"
                      className="w-full justify-start border-cabinet-yellow/50 text-cabinet-yellow hover:bg-cabinet-yellow/10"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile Information
                    </Button>
                    <Button
                      onClick={() => {
                        addNotification({
                          type: 'info',
                          message: '🔒 Privacy & Security settings coming soon!'
                        });
                      }}
                      variant="outline"
                      className="w-full justify-start border-cabinet-yellow/50 text-cabinet-yellow hover:bg-cabinet-yellow/10"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Privacy & Security
                    </Button>
                    <Button
                      onClick={() => setShowPaymentMethods(true)}
                      variant="outline"
                      className="w-full justify-start border-cabinet-yellow/50 text-cabinet-yellow hover:bg-cabinet-yellow/10"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Payment Methods
                    </Button>
                    <Button
                      onClick={() => {
                        addNotification({
                          type: 'info',
                          message: '🔔 Notification settings coming soon!'
                        });
                      }}
                      variant="outline"
                      className="w-full justify-start border-cabinet-yellow/50 text-cabinet-yellow hover:bg-cabinet-yellow/10"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                    </Button>
                    <Button
                      onClick={() => setShowHelpSupport(true)}
                      variant="outline"
                      className="w-full justify-start border-cabinet-yellow/50 text-cabinet-yellow hover:bg-cabinet-yellow/10"
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Help & Support
                    </Button>
                    <Separator className="bg-cabinet-yellow/20" />
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full justify-start border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Edit Profile Dialog */}
        <EditProfileDialog
          open={showEditProfile}
          onOpenChange={setShowEditProfile}
        />

        {/* Help & Support Dialog */}
        <HelpSupportDialog
          open={showHelpSupport}
          onOpenChange={setShowHelpSupport}
        />

        {/* Payment Methods Dialog */}
        <PaymentMethodsDialog
          open={showPaymentMethods}
          onOpenChange={setShowPaymentMethods}
        />
      </DialogContent>
    </Dialog>
  );
}
