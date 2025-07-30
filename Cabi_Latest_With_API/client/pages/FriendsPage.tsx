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
import { useAuth } from '@/hooks/useUnifiedAuth';
import { useAppState } from '@/hooks/useAppState';
import { 
  Users, 
  Search, 
  Plus, 
  MessageSquare, 
  Phone, 
  Star, 
  MoreVertical,
  UserPlus,
  MapPin,
  Calendar,
  Activity,
  Zap,
  Shield,
  Heart,
  Gift,
  Settings,
  Mail,
  CheckCircle,
  Clock,
  X,
  Car,
  DollarSign,
  Filter,
  UserCheck
} from 'lucide-react';

export default function FriendsPage() {
  const { authState, addFriend, acceptFriendRequest } = useAuth();
  const { addNotification } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [selectedTab, setSelectedTab] = useState('friends');
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
  
  if (!authState.user) {
    return null;
  }

  const handleAddFriend = async () => {
    if (!emailSearch.trim()) {
      addNotification({
        type: 'error',
        message: '❌ Please enter an email address'
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

    setIsAddingFriend(true);

    try {
      const success = await addFriend(emailSearch);

      if (success) {
        addNotification({
          type: 'success',
          message: `✅ Friend request sent to ${emailSearch}`
        });
        setEmailSearch('');
      } else {
        addNotification({
          type: 'error',
          message: '❌ User not found or already in your friends list'
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: '❌ Failed to send friend request. Please try again.'
      });
    } finally {
      setIsAddingFriend(false);
    }
  };

  const handleAcceptRequest = async (friendId: string) => {
    setProcessingRequest(friendId);

    try {
      const success = await acceptFriendRequest(friendId);

      if (success) {
        addNotification({
          type: 'success',
          message: '✅ Friend request accepted!'
        });
      } else {
        addNotification({
          type: 'error',
          message: '❌ Failed to accept friend request'
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: '❌ Something went wrong. Please try again.'
      });
    } finally {
      setProcessingRequest(null);
    }
  };

  // Get user's friends list
  const friends = authState.user.friends || [];
  
  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingRequests = friends.filter(f => f.status === 'pending');
  const acceptedFriends = friends.filter(f => f.status === 'accepted');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-5xl font-display font-black text-gradient text-shadow-glow mb-4">
            Friends Network 👫
          </h1>
          <p className="text-cabinet-grey text-xl font-accent font-medium tracking-wide max-w-3xl mx-auto leading-relaxed">
            Connect with other CAB-I-NET users, share rides, and build your social travel network
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-morphism border-cabinet-yellow/20 text-center">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-cabinet-yellow mx-auto mb-3" />
              <div className="text-2xl font-cabinet font-bold text-white">{acceptedFriends.length}</div>
              <div className="text-cabinet-grey text-sm">Friends</div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-cabinet-yellow/20 text-center">
            <CardContent className="p-6">
              <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-2xl font-cabinet font-bold text-white">{pendingRequests.length}</div>
              <div className="text-cabinet-grey text-sm">Pending</div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-cabinet-yellow/20 text-center">
            <CardContent className="p-6">
              <Car className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-2xl font-cabinet font-bold text-white">45</div>
              <div className="text-cabinet-grey text-sm">Shared Rides</div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-cabinet-yellow/20 text-center">
            <CardContent className="p-6">
              <DollarSign className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-cabinet font-bold text-white">₹8,450</div>
              <div className="text-cabinet-grey text-sm">Money Saved</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Left Column - Friends Management */}
          <div className="lg:col-span-3">
            
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
              <TabsList className="grid grid-cols-3 w-full bg-cabinet-dark/50 border border-cabinet-yellow/20">
                <TabsTrigger 
                  value="friends" 
                  className="data-[state=active]:bg-cabinet-yellow data-[state=active]:text-black text-cabinet-grey"
                >
                  <Users className="w-4 h-4 mr-2" />
                  My Friends ({acceptedFriends.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="pending"
                  className="data-[state=active]:bg-cabinet-yellow data-[state=active]:text-black text-cabinet-grey"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Pending ({pendingRequests.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="add"
                  className="data-[state=active]:bg-cabinet-yellow data-[state=active]:text-black text-cabinet-grey"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Friends
                </TabsTrigger>
              </TabsList>

              <TabsContent value="friends" className="space-y-6">
                {/* Search */}
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cabinet-yellow w-5 h-5" />
                    <Input
                      placeholder="Search friends by name or email..."
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

                {/* Friends List */}
                {acceptedFriends.length === 0 ? (
                  <Card className="glass-morphism border-cabinet-yellow/20">
                    <CardContent className="text-center py-12">
                      <Users className="w-16 h-16 text-cabinet-yellow mx-auto mb-4 opacity-50" />
                      <CardTitle className="text-white mb-2">No Friends Yet</CardTitle>
                      <CardDescription className="text-cabinet-grey">
                        Start adding friends by their email addresses to connect and share ride experiences!
                      </CardDescription>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredFriends.filter(f => f.status === 'accepted').map((friend) => (
                      <Card key={friend.id} className="glass-morphism border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300 hover-lift">
                        <CardContent className="p-6">
                          {/* Friend Header */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <img
                                  src={friend.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.name)}&background=d89000&color=000000&size=64`}
                                  alt={friend.name}
                                  className="w-16 h-16 rounded-full object-cover border-2 border-cabinet-yellow/30"
                                />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background bg-green-400" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="text-xl font-cabinet font-bold text-white">{friend.name}</h3>
                                  <CheckCircle className="w-5 h-5 text-cabinet-yellow" />
                                </div>
                                <p className="text-cabinet-grey text-sm">{friend.email}</p>
                                <p className="text-cabinet-yellow text-sm">Added {new Date(friend.addedDate).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" className="border-cabinet-yellow/30 text-cabinet-yellow">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Friend Info */}
                          <div className="text-center mb-6">
                            <Badge variant="outline" className="border-cabinet-yellow text-cabinet-yellow mb-2">
                              Friend since {new Date(friend.addedDate).getFullYear()}
                            </Badge>
                            <p className="text-cabinet-grey text-sm">
                              Status: <span className="text-cabinet-yellow capitalize">{friend.status}</span>
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              onClick={() => {
                                addNotification({
                                  type: 'info',
                                  message: `💬 Opening chat with ${friend.name}... Feature coming soon!`
                                });
                                // In a real app, this would open a messaging interface
                              }}
                              size="sm"
                              className="bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow"
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Message
                            </Button>
                            <Button
                              onClick={() => {
                                // Navigate to booking with friend sharing option
                                localStorage.setItem('share-ride-with', JSON.stringify({
                                  friendId: friend.id,
                                  friendName: friend.name,
                                  friendEmail: friend.email
                                }));
                                window.location.href = '/booking';
                              }}
                              size="sm"
                              variant="outline"
                              className="border-cabinet-yellow/30 text-cabinet-yellow hover:bg-cabinet-yellow hover:text-black"
                            >
                              <Gift className="w-4 h-4 mr-2" />
                              Share Ride
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pending" className="space-y-6">
                {pendingRequests.length === 0 ? (
                  <Card className="glass-morphism border-cabinet-yellow/20">
                    <CardContent className="text-center py-12">
                      <Clock className="w-16 h-16 text-cabinet-yellow mx-auto mb-4 opacity-50" />
                      <CardTitle className="text-white mb-2">No Pending Requests</CardTitle>
                      <CardDescription className="text-cabinet-grey">
                        You don't have any pending friend requests at the moment.
                      </CardDescription>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <Card key={request.id} className="glass-morphism border-yellow-500/30 bg-yellow-500/5">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <img
                                src={request.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(request.name)}&background=d89000&color=000000&size=48`}
                                alt={request.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <h4 className="text-white font-semibold">{request.name}</h4>
                                <p className="text-cabinet-grey text-sm">{request.email}</p>
                                <p className="text-yellow-400 text-xs">Request sent {new Date(request.addedDate).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleAcceptRequest(request.id)}
                                disabled={processingRequest === request.id}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                {processingRequest === request.id ? (
                                  <Clock className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Accept
                                  </>
                                )}
                              </Button>
                              <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                                Pending
                              </Badge>
                            </div>
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
                    <CardTitle className="text-xl font-cabinet text-white">Add New Friend</CardTitle>
                    <CardDescription className="text-cabinet-grey">
                      Connect with other CAB-I-NET users by email
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cabinet-yellow w-5 h-5" />
                        <Input
                          type="email"
                          placeholder="Enter friend's email address"
                          value={emailSearch}
                          onChange={(e) => setEmailSearch(e.target.value)}
                          className="pl-10 glass-morphism border-cabinet-yellow/30 text-white placeholder-cabinet-grey focus:border-cabinet-yellow"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddFriend()}
                        />
                      </div>
                      <Button
                        onClick={handleAddFriend}
                        disabled={isAddingFriend || !emailSearch.trim()}
                        className="w-full bg-cabinet-yellow text-black hover:bg-cabinet-light-yellow font-semibold"
                      >
                        {isAddingFriend ? (
                          <><Clock className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                        ) : (
                          <><UserPlus className="w-4 h-4 mr-2" /> Send Friend Request</>
                        )}
                      </Button>
                    </div>
                    
                    {/* Demo Users Section */}
                    <div className="mt-8 pt-6 border-t border-cabinet-yellow/20">
                      <h4 className="text-white font-semibold mb-4 flex items-center">
                        <Users className="w-4 h-4 mr-2 text-cabinet-yellow" />
                        Suggested Users
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { email: 'priya@example.com', name: 'Priya Sharma' },
                          { email: 'raj@example.com', name: 'Raj Kumar' },
                          { email: 'anita@example.com', name: 'Anita Singh' },
                          { email: 'vikram@example.com', name: 'Vikram Patel' }
                        ].map((user) => (
                          <div key={user.email} className="glass-morphism border border-cabinet-yellow/20 p-3 rounded-xl">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-white font-medium text-sm">{user.name}</div>
                                <div className="text-cabinet-grey text-xs">{user.email}</div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEmailSearch(user.email)}
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
                    Share Ride
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    const email = prompt('Enter your friend\'s email to send invitation:');
                    if (email && email.includes('@')) {
                      addNotification({
                        type: 'success',
                        message: `📧 Invitation sent to ${email}! They'll get ₹200 bonus when they join.`
                      });
                    } else if (email) {
                      addNotification({
                        type: 'error',
                        message: '❌ Please enter a valid email address.'
                      });
                    }
                  }}
                  variant="outline"
                  className="w-full border-cabinet-yellow/30 text-cabinet-yellow hover:bg-cabinet-yellow hover:text-black"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Invite Friends
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="glass-morphism border-cabinet-yellow/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-cabinet-yellow" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <div className="text-white text-sm">New friend added</div>
                    <div className="text-cabinet-grey text-xs">2 hours ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-cabinet-yellow/20 rounded-full flex items-center justify-center">
                    <Car className="w-4 h-4 text-cabinet-yellow" />
                  </div>
                  <div>
                    <div className="text-white text-sm">Shared ride completed</div>
                    <div className="text-cabinet-grey text-xs">Yesterday</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Friend Stats */}
            <Card className="glass-morphism border-cabinet-yellow/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-cabinet-yellow" />
                  Your Network
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-cabinet font-bold text-cabinet-yellow">{acceptedFriends.length + pendingRequests.length}</div>
                  <div className="text-cabinet-grey text-sm">Total Connections</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-white">{acceptedFriends.length}</div>
                    <div className="text-cabinet-grey text-xs">Active</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-yellow-400">{pendingRequests.length}</div>
                    <div className="text-cabinet-grey text-xs">Pending</div>
                  </div>
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
