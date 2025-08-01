import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingChatbot from '../components/FloatingChatbot';
import JoinRideDialog from '../components/JoinRideDialog';
import MessageUserDialog from '../components/MessageUserDialog';
import { 
  Users, 
  MessageCircle, 
  Share2, 
  Heart, 
  MapPin, 
  Clock, 
  Star,
  TrendingUp,
  UserPlus,
  Calendar,
  Car,
  Coffee,
  Award,
  Zap,
  Target,
  Trophy
} from 'lucide-react';

interface CommunityPost {
  id: string;
  user: {
    name: string;
    avatar: string;
    level: string;
    rating: number;
  };
  content: string;
  type: 'ride_share' | 'tip' | 'experience' | 'event';
  timestamp: string;
  likes: number;
  comments: number;
  location?: string;
  rideDetails?: {
    from: string;
    to: string;
    time: string;
    date: string;
    seats: number;
    cost: number;
  };
}

const mockPosts: CommunityPost[] = [
  {
    id: '1',
    user: {
      name: 'Priya Sharma',
      avatar: '👩‍💼',
      level: 'Gold Member',
      rating: 4.9
    },
    content: "Looking for someone to share a ride to the airport tomorrow morning! Split the cost and travel in comfort 🚗✈️",
    type: 'ride_share',
    timestamp: '2 hours ago',
    likes: 12,
    comments: 5,
    location: 'Koramangala',
    rideDetails: {
      from: 'Koramangala',
      to: 'Kempegowda Airport',
      time: '6:00 AM',
      date: 'Tomorrow',
      seats: 2,
      cost: 450
    }
  },
  {
    id: '2',
    user: {
      name: 'Arjun Reddy',
      avatar: '👨‍💻',
      level: 'Premium',
      rating: 4.8
    },
    content: "Pro tip: Book your rides during off-peak hours (10 AM - 4 PM) to get better rates and faster pickups! Just saved 30% on my regular commute 💡",
    type: 'tip',
    timestamp: '4 hours ago',
    likes: 24,
    comments: 8,
    location: 'Electronic City'
  },
  {
    id: '3',
    user: {
      name: 'Sneha Patel',
      avatar: '👩‍🎨',
      level: 'Diamond',
      rating: 5.0
    },
    content: "Had an amazing experience with driver Rajesh yesterday! Not only was he punctual and friendly, but he also had great music and offered water. Definitely booking him again! ⭐⭐⭐⭐⭐",
    type: 'experience',
    timestamp: '6 hours ago',
    likes: 18,
    comments: 3,
    location: 'Indiranagar'
  },
  {
    id: '4',
    user: {
      name: 'CAB-I-NET Events',
      avatar: '🎉',
      level: 'Official',
      rating: 5.0
    },
    content: "🎊 Community Meetup this Saturday! Join fellow riders for coffee, networking, and exclusive CAB-I-NET merch. Free premium rides for attendees!",
    type: 'event',
    timestamp: '1 day ago',
    likes: 45,
    comments: 12,
    location: 'Brigade Road'
  }
];

const communityStats = {
  totalMembers: '12.5K',
  activeToday: '2.3K',
  ridesShared: '847',
  moneysSaved: '₹2.4L'
};

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'ride_share' | 'events' | 'leaderboard'>('feed');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [showJoinRide, setShowJoinRide] = useState(false);
  const [showMessageUser, setShowMessageUser] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const renderPost = (post: CommunityPost) => (
    <div key={post.id} className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300">
      {/* User Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 gradient-gold rounded-full flex items-center justify-center text-2xl">
            {post.user.avatar}
          </div>
          <div>
            <div className="text-white font-semibold">{post.user.name}</div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-cabinet-yellow">{post.user.level}</span>
              <span className="text-cabinet-grey">•</span>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-cabinet-grey">{post.user.rating}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-cabinet-grey text-sm">{post.timestamp}</div>
      </div>

      {/* Content */}
      <div className="text-white mb-4 leading-relaxed">{post.content}</div>

      {/* Ride Share Details */}
      {post.type === 'ride_share' && post.rideDetails && (
        <div className="glass-morphism rounded-2xl p-4 border border-cabinet-yellow/20 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-cabinet-grey">Route</div>
              <div className="text-white font-medium">{post.rideDetails.from} → {post.rideDetails.to}</div>
            </div>
            <div>
              <div className="text-cabinet-grey">Time</div>
              <div className="text-white font-medium">{post.rideDetails.time} • {post.rideDetails.date}</div>
            </div>
            <div>
              <div className="text-cabinet-grey">Available Seats</div>
              <div className="text-cabinet-yellow font-medium">{post.rideDetails.seats} seats</div>
            </div>
            <div>
              <div className="text-cabinet-grey">Cost per person</div>
              <div className="text-cabinet-yellow font-medium">₹{post.rideDetails.cost / 2}</div>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedPost(post);
              setShowJoinRide(true);
            }}
            className="w-full mt-4 bg-gradient-gold text-black py-3 rounded-xl font-medium hover:scale-105 transition-all duration-300"
          >
            Join Ride
          </button>
        </div>
      )}

      {/* Location */}
      {post.location && (
        <div className="flex items-center space-x-2 text-cabinet-grey text-sm mb-4">
          <MapPin className="w-4 h-4" />
          <span>{post.location}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-cabinet-yellow/10">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => handleLike(post.id)}
            className={`flex items-center space-x-2 transition-all duration-300 ${
              likedPosts.has(post.id) 
                ? 'text-red-400' 
                : 'text-cabinet-grey hover:text-cabinet-yellow'
            }`}
          >
            <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
            <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
          </button>
          <button className="flex items-center space-x-2 text-cabinet-grey hover:text-cabinet-yellow transition-colors duration-300">
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments}</span>
          </button>
          <button className="flex items-center space-x-2 text-cabinet-grey hover:text-cabinet-yellow transition-colors duration-300">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>
        
        {post.type === 'ride_share' && (
          <button
            onClick={() => {
              setSelectedPost(post);
              setShowMessageUser(true);
            }}
            className="text-cabinet-yellow hover:text-cabinet-light-yellow transition-colors duration-300 text-sm font-medium"
          >
            Message User
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-cabinet font-bold text-white mb-4">
            CAB-I-NET Community 🌟
          </h1>
          <p className="text-cabinet-grey text-lg max-w-2xl mx-auto">
            Connect, share rides, and be part of our premium transport community
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-morphism rounded-2xl p-6 text-center border border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300 hover:scale-105">
            <Users className="w-8 h-8 text-cabinet-yellow mx-auto mb-3" />
            <div className="text-2xl font-cabinet font-bold text-white">{communityStats.totalMembers}</div>
            <div className="text-cabinet-grey text-sm">Total Members</div>
          </div>
          <div className="glass-morphism rounded-2xl p-6 text-center border border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300 hover:scale-105">
            <Zap className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-cabinet font-bold text-white">{communityStats.activeToday}</div>
            <div className="text-cabinet-grey text-sm">Active Today</div>
          </div>
          <div className="glass-morphism rounded-2xl p-6 text-center border border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300 hover:scale-105">
            <Car className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-cabinet font-bold text-white">{communityStats.ridesShared}</div>
            <div className="text-cabinet-grey text-sm">Rides Shared</div>
          </div>
          <div className="glass-morphism rounded-2xl p-6 text-center border border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300 hover:scale-105">
            <Target className="w-8 h-8 text-cabinet-yellow mx-auto mb-3" />
            <div className="text-2xl font-cabinet font-bold text-white">{communityStats.moneysSaved}</div>
            <div className="text-cabinet-grey text-sm">Money Saved</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-8 glass-morphism rounded-2xl p-2 border border-cabinet-yellow/20 w-fit mx-auto">
          {[
            { id: 'feed', label: 'Community Feed', icon: MessageCircle },
            { id: 'ride_share', label: 'Ride Sharing', icon: Car },
            { id: 'events', label: 'Events', icon: Calendar },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
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
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'feed' && (
              <>
                {/* Create Post */}
                <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 gradient-gold rounded-full flex items-center justify-center text-2xl">
                      👤
                    </div>
                    <input
                      type="text"
                      placeholder="Share your ride experience or find ride partners..."
                      className="flex-1 glass-morphism rounded-2xl px-4 py-3 border border-cabinet-yellow/30 text-white placeholder-cabinet-grey focus:border-cabinet-yellow focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4">
                      <button className="flex items-center space-x-2 text-cabinet-grey hover:text-cabinet-yellow transition-colors duration-300">
                        <Car className="w-4 h-4" />
                        <span>Ride Share</span>
                      </button>
                      <button className="flex items-center space-x-2 text-cabinet-grey hover:text-cabinet-yellow transition-colors duration-300">
                        <MapPin className="w-4 h-4" />
                        <span>Location</span>
                      </button>
                    </div>
                    <button className="bg-gradient-gold text-black px-6 py-2 rounded-xl font-medium hover:scale-105 transition-all duration-300">
                      Post
                    </button>
                  </div>
                </div>

                {/* Posts Feed */}
                <div className="space-y-6">
                  {mockPosts.map(renderPost)}
                </div>
              </>
            )}

            {activeTab === 'ride_share' && (
              <div className="space-y-6">
                <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20">
                  <h3 className="text-xl font-cabinet font-bold text-white mb-4">Find Ride Partners</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <input
                      type="text"
                      placeholder="From location"
                      className="glass-morphism rounded-2xl px-4 py-3 border border-cabinet-yellow/30 text-white placeholder-cabinet-grey focus:border-cabinet-yellow focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="To location"
                      className="glass-morphism rounded-2xl px-4 py-3 border border-cabinet-yellow/30 text-white placeholder-cabinet-grey focus:border-cabinet-yellow focus:outline-none"
                    />
                  </div>
                  <button className="w-full bg-gradient-gold text-black py-3 rounded-xl font-medium hover:scale-105 transition-all duration-300">
                    Search Ride Partners
                  </button>
                </div>

                {mockPosts.filter(post => post.type === 'ride_share').map(renderPost)}
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20">
                  <div className="flex items-center space-x-4 mb-6">
                    <Calendar className="w-8 h-8 text-cabinet-yellow" />
                    <div>
                      <h3 className="text-xl font-cabinet font-bold text-white">Upcoming Events</h3>
                      <p className="text-cabinet-grey">Join our community events and meetups</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="glass-morphism rounded-2xl p-4 border border-cabinet-yellow/20">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-semibold">Community Coffee Meetup</h4>
                        <span className="text-cabinet-yellow text-sm">This Saturday</span>
                      </div>
                      <p className="text-cabinet-grey text-sm mb-3">Meet fellow riders, share experiences, and get exclusive merch!</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-cabinet-grey text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>Brigade Road</span>
                        </div>
                        <button className="bg-gradient-gold text-black px-4 py-2 rounded-lg text-sm hover:scale-105 transition-all duration-300">
                          Join Event
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20">
                <h3 className="text-xl font-cabinet font-bold text-white mb-6">Community Leaders</h3>
                <div className="space-y-4">
                  {['Priya Sharma', 'Arjun Reddy', 'Sneha Patel', 'Rahul Singh'].map((name, index) => (
                    <div key={name} className="flex items-center justify-between p-4 glass-morphism rounded-2xl border border-cabinet-yellow/10">
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-400 text-black' :
                          index === 2 ? 'bg-orange-600 text-white' : 
                          'bg-cabinet-yellow/20 text-cabinet-yellow'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-white font-medium">{name}</div>
                          <div className="text-cabinet-grey text-sm">{147 - index * 12} rides shared</div>
                        </div>
                      </div>
                      <div className="text-cabinet-yellow font-bold">{1250 - index * 100} pts</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Quick Actions */}
            <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20">
              <h3 className="text-lg font-cabinet font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-gold text-black py-3 rounded-xl font-medium hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                  <UserPlus className="w-4 h-4" />
                  <span>Find Friends</span>
                </button>
                <Link
                  to="/booking"
                  className="w-full glass-morphism border border-cabinet-yellow/30 text-cabinet-yellow py-3 rounded-xl font-medium hover:bg-cabinet-yellow hover:text-black transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Car className="w-4 h-4" />
                  <span>Book Ride</span>
                </Link>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20">
              <h3 className="text-lg font-cabinet font-bold text-white mb-4">Trending</h3>
              <div className="space-y-3">
                {['#AirportRides', '#MorningCommute', '#WeekendPlans', '#EcoRiding'].map((tag, index) => (
                  <div key={tag} className="flex items-center justify-between">
                    <span className="text-cabinet-yellow text-sm">{tag}</span>
                    <div className="flex items-center space-x-1 text-cabinet-grey text-xs">
                      <TrendingUp className="w-3 h-3" />
                      <span>{45 - index * 5}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Stats */}
            <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20">
              <h3 className="text-lg font-cabinet font-bold text-white mb-4">Your Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-cabinet-grey">Community Level</span>
                  <span className="text-cabinet-yellow font-medium">Gold</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cabinet-grey">Rides Shared</span>
                  <span className="text-white">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cabinet-grey">Friends</span>
                  <span className="text-white">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cabinet-grey">Points Earned</span>
                  <span className="text-cabinet-yellow font-medium">1,240</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <FloatingChatbot />

      {/* Join Ride Dialog */}
      <JoinRideDialog
        open={showJoinRide}
        onOpenChange={setShowJoinRide}
        rideDetails={selectedPost?.rideDetails || null}
        hostName={selectedPost?.user.name || ''}
        hostAvatar={selectedPost?.user.avatar || ''}
        hostRating={selectedPost?.user.rating || 0}
      />

      {/* Message User Dialog */}
      <MessageUserDialog
        open={showMessageUser}
        onOpenChange={setShowMessageUser}
        userName={selectedPost?.user.name || ''}
        userAvatar={selectedPost?.user.avatar || ''}
        userRating={selectedPost?.user.rating || 0}
        context={selectedPost?.type === 'ride_share' ? 'ride sharing' : 'community post'}
      />
    </div>
  );
}
