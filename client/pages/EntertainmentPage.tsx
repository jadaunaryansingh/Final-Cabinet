import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingChatbot from '../components/FloatingChatbot';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  Volume2,
  Heart,
  Download,
  Share2,
  Clock,
  Star,
  Headphones,
  Music,
  Film,
  Radio,
  Gamepad2,
  Book,
  Mic,
  Shuffle,
  Repeat,
  MonitorPlay
} from 'lucide-react';

interface MediaContent {
  id: string;
  title: string;
  artist?: string;
  duration?: string;
  thumbnail: string;
  type: 'music' | 'video' | 'podcast' | 'audiobook' | 'game';
  platform: 'netflix' | 'spotify' | 'hotstar' | 'youtube' | 'audible';
  rating: number;
  genre: string;
  isPlaying?: boolean;
  progress?: number;
}

const featuredContent: MediaContent[] = [
  {
    id: '1',
    title: 'Stranger Things 4',
    duration: '1h 15m',
    thumbnail: '🎬',
    type: 'video',
    platform: 'netflix',
    rating: 4.8,
    genre: 'Sci-Fi Thriller'
  },
  {
    id: '2',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    duration: '5:55',
    thumbnail: '🎵',
    type: 'music',
    platform: 'spotify',
    rating: 4.9,
    genre: 'Classic Rock',
    isPlaying: true,
    progress: 65
  },
  {
    id: '3',
    title: 'The Family Man 2',
    duration: '45m',
    thumbnail: '📺',
    type: 'video',
    platform: 'hotstar',
    rating: 4.7,
    genre: 'Action Drama'
  },
  {
    id: '4',
    title: 'The Joe Rogan Experience',
    artist: 'Joe Rogan',
    duration: '2h 30m',
    thumbnail: '🎙️',
    type: 'podcast',
    platform: 'spotify',
    rating: 4.6,
    genre: 'Talk Show'
  }
];

const platforms = [
  { name: 'Netflix', icon: '📺', color: 'bg-red-600', active: true },
  { name: 'Spotify', icon: '🎵', color: 'bg-green-500', active: true },
  { name: 'Hotstar', icon: '⭐', color: 'bg-blue-600', active: true },
  { name: 'YouTube', icon: '📱', color: 'bg-red-500', active: false },
  { name: 'Audible', icon: '📚', color: 'bg-orange-500', active: false }
];

export default function EntertainmentPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'music' | 'video' | 'podcasts' | 'games'>('dashboard');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<MediaContent | null>(
    featuredContent.find(item => item.isPlaying) || null
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(75);
  const [likedContent, setLikedContent] = useState<Set<string>>(new Set(['2']));

  const handlePlay = (content: MediaContent) => {
    setCurrentlyPlaying(content);
    setIsPlaying(true);
  };

  const handleLike = (contentId: string) => {
    setLikedContent(prev => {
      const newSet = new Set(prev);
      if (newSet.has(contentId)) {
        newSet.delete(contentId);
      } else {
        newSet.add(contentId);
      }
      return newSet;
    });
  };

  const MediaCard = ({ content }: { content: MediaContent }) => (
    <div className="glass-morphism rounded-2xl p-4 border border-cabinet-yellow/20 hover:border-cabinet-yellow/40 transition-all duration-300 hover:scale-105 group">
      <div className="relative mb-4">
        <div className="w-full h-32 bg-gradient-to-br from-cabinet-yellow/20 to-cabinet-gold/20 rounded-xl flex items-center justify-center text-4xl">
          {content.thumbnail}
        </div>
        <button
          onClick={() => handlePlay(content)}
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center"
        >
          <Play className="w-8 h-8 text-white" />
        </button>
        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${platforms.find(p => p.name.toLowerCase() === content.platform)?.color}`}>
          <span className="text-xs text-white font-bold">{content.platform[0].toUpperCase()}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-white font-semibold text-sm truncate">{content.title}</h3>
        {content.artist && (
          <p className="text-cabinet-grey text-xs">{content.artist}</p>
        )}
        <div className="flex items-center justify-between text-xs">
          <span className="text-cabinet-grey">{content.duration}</span>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-cabinet-grey">{content.rating}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-cabinet-yellow text-xs px-2 py-1 bg-cabinet-yellow/20 rounded-full">
            {content.genre}
          </span>
          <button
            onClick={() => handleLike(content.id)}
            className={`transition-colors duration-300 ${
              likedContent.has(content.id) ? 'text-red-400' : 'text-cabinet-grey hover:text-cabinet-yellow'
            }`}
          >
            <Heart className={`w-4 h-4 ${likedContent.has(content.id) ? 'fill-current' : ''}`} />
          </button>
        </div>
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
            Entertainment Hub 🎬
          </h1>
          <p className="text-cabinet-grey text-lg max-w-2xl mx-auto">
            Premium entertainment during your rides. Music, movies, podcasts, and more!
          </p>
        </div>

        {/* Platform Status */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-8">
          {platforms.map((platform) => (
            <div key={platform.name} className={`glass-morphism rounded-2xl p-4 text-center border ${
              platform.active 
                ? 'border-cabinet-yellow/30 bg-cabinet-yellow/10' 
                : 'border-cabinet-grey/20'
            } transition-all duration-300 hover:scale-105`}>
              <div className={`w-12 h-12 ${platform.color} rounded-xl flex items-center justify-center text-2xl mx-auto mb-3`}>
                {platform.icon}
              </div>
              <div className="text-white font-medium text-sm mb-1">{platform.name}</div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                platform.active 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-cabinet-grey/20 text-cabinet-grey'
              }`}>
                {platform.active ? 'Connected' : 'Connect'}
              </div>
            </div>
          ))}
        </div>

        {/* Currently Playing */}
        {currentlyPlaying && (
          <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/30 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-cabinet font-bold text-white">Now Playing</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Live</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 items-center">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cabinet-yellow/20 to-cabinet-gold/20 rounded-xl flex items-center justify-center text-3xl">
                  {currentlyPlaying.thumbnail}
                </div>
                <div>
                  <div className="text-white font-semibold">{currentlyPlaying.title}</div>
                  {currentlyPlaying.artist && (
                    <div className="text-cabinet-grey text-sm">{currentlyPlaying.artist}</div>
                  )}
                  <div className="text-cabinet-yellow text-xs">{currentlyPlaying.genre}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-4">
                  <button className="text-cabinet-grey hover:text-cabinet-yellow transition-colors duration-300">
                    <Shuffle className="w-5 h-5" />
                  </button>
                  <button className="text-cabinet-grey hover:text-cabinet-yellow transition-colors duration-300">
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center text-black hover:scale-110 transition-all duration-300"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  <button className="text-cabinet-grey hover:text-cabinet-yellow transition-colors duration-300">
                    <SkipForward className="w-5 h-5" />
                  </button>
                  <button className="text-cabinet-grey hover:text-cabinet-yellow transition-colors duration-300">
                    <Repeat className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full bg-cabinet-dark rounded-full h-2">
                    <div 
                      className="bg-gradient-gold h-2 rounded-full transition-all duration-300"
                      style={{ width: `${currentlyPlaying.progress || 0}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-cabinet-grey">
                    <span>2:45</span>
                    <span>{currentlyPlaying.duration}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={() => handleLike(currentlyPlaying.id)}
                  className={`transition-colors duration-300 ${
                    likedContent.has(currentlyPlaying.id) ? 'text-red-400' : 'text-cabinet-grey hover:text-cabinet-yellow'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${likedContent.has(currentlyPlaying.id) ? 'fill-current' : ''}`} />
                </button>
                <button className="text-cabinet-grey hover:text-cabinet-yellow transition-colors duration-300">
                  <Share2 className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-cabinet-grey" />
                  <div className="w-20 bg-cabinet-dark rounded-full h-2">
                    <div 
                      className="bg-cabinet-yellow h-2 rounded-full"
                      style={{ width: `${volume}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-8 glass-morphism rounded-2xl p-2 border border-cabinet-yellow/20 w-fit">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: MonitorPlay },
            { id: 'music', label: 'Music', icon: Music },
            { id: 'video', label: 'Videos', icon: Film },
            { id: 'podcasts', label: 'Podcasts', icon: Mic },
            { id: 'games', label: 'Games', icon: Gamepad2 }
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

        {/* Content Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-cabinet font-bold text-white mb-6">Featured Content</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {featuredContent.slice(0, 6).map((content) => (
                      <MediaCard key={content.id} content={content} />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-cabinet font-bold text-white mb-6">Continue Watching</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {featuredContent.slice(0, 2).map((content) => (
                      <div key={content.id} className="glass-morphism rounded-2xl p-4 border border-cabinet-yellow/20">
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-20 bg-gradient-to-br from-cabinet-yellow/20 to-cabinet-gold/20 rounded-xl flex items-center justify-center text-3xl">
                            {content.thumbnail}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold">{content.title}</h4>
                            {content.artist && (
                              <p className="text-cabinet-grey text-sm">{content.artist}</p>
                            )}
                            <div className="w-full bg-cabinet-dark rounded-full h-2 mt-2">
                              <div className="bg-gradient-gold h-2 rounded-full w-1/3"></div>
                            </div>
                          </div>
                          <button
                            onClick={() => handlePlay(content)}
                            className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center text-black hover:scale-110 transition-all duration-300"
                          >
                            <Play className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'music' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-cabinet font-bold text-white mb-6">Popular Music</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {featuredContent.filter(c => c.type === 'music').concat([
                      { id: '5', title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20', thumbnail: '🎵', type: 'music', platform: 'spotify', rating: 4.8, genre: 'Pop' },
                      { id: '6', title: 'Levitating', artist: 'Dua Lipa', duration: '3:23', thumbnail: '🎵', type: 'music', platform: 'spotify', rating: 4.7, genre: 'Pop' }
                    ] as MediaContent[]).map((content) => (
                      <MediaCard key={content.id} content={content} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'video' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-cabinet font-bold text-white mb-6">Trending Videos</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {featuredContent.filter(c => c.type === 'video').concat([
                      { id: '7', title: 'Money Heist', duration: '50m', thumbnail: '🎬', type: 'video', platform: 'netflix', rating: 4.9, genre: 'Crime' },
                      { id: '8', title: 'Squid Game', duration: '60m', thumbnail: '📺', type: 'video', platform: 'netflix', rating: 4.8, genre: 'Thriller' }
                    ] as MediaContent[]).map((content) => (
                      <MediaCard key={content.id} content={content} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'podcasts' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-cabinet font-bold text-white mb-6">Popular Podcasts</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {featuredContent.filter(c => c.type === 'podcast').concat([
                      { id: '9', title: 'The Daily', artist: 'NY Times', duration: '25m', thumbnail: '🎙️', type: 'podcast', platform: 'spotify', rating: 4.6, genre: 'News' },
                      { id: '10', title: 'Crime Junkie', artist: 'audiochuck', duration: '45m', thumbnail: '🎙️', type: 'podcast', platform: 'spotify', rating: 4.8, genre: 'True Crime' }
                    ] as MediaContent[]).map((content) => (
                      <MediaCard key={content.id} content={content} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'games' && (
              <div className="glass-morphism rounded-3xl p-8 text-center border border-cabinet-yellow/20">
                <Gamepad2 className="w-16 h-16 text-cabinet-yellow mx-auto mb-4" />
                <h3 className="text-2xl font-cabinet font-bold text-white mb-4">Games Coming Soon!</h3>
                <p className="text-cabinet-grey mb-6">Interactive games will be available during your rides. Stay tuned!</p>
                <button className="bg-gradient-gold text-black px-6 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-300">
                  Get Notified
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Quick Actions */}
            <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20">
              <h3 className="text-lg font-cabinet font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/booking"
                  className="w-full bg-gradient-gold text-black py-3 rounded-xl font-medium hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Book & Watch</span>
                </Link>
                <button
                  onClick={() => {
                    // Simulate download with progress
                    const downloadProgress = (progress: number) => {
                      if (progress <= 100) {
                        addNotification({
                          type: 'info',
                          message: `📥 Downloading... ${progress}% complete`
                        });
                        if (progress < 100) {
                          setTimeout(() => downloadProgress(progress + 20), 500);
                        } else {
                          setTimeout(() => {
                            addNotification({
                              type: 'success',
                              message: '✅ Content downloaded! Available offline in your library.'
                            });
                          }, 500);
                        }
                      }
                    };
                    downloadProgress(20);
                  }}
                  className="w-full glass-morphism border border-cabinet-yellow/30 text-cabinet-yellow py-3 rounded-xl font-medium hover:bg-cabinet-yellow hover:text-black transition-all duration-300"
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Download for Offline
                </button>
              </div>
            </div>

            {/* Recently Played */}
            <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20">
              <h3 className="text-lg font-cabinet font-bold text-white mb-4">Recently Played</h3>
              <div className="space-y-3">
                {featuredContent.slice(0, 3).map((content) => (
                  <div key={content.id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cabinet-yellow/20 to-cabinet-gold/20 rounded-lg flex items-center justify-center text-lg">
                      {content.thumbnail}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{content.title}</div>
                      {content.artist && (
                        <div className="text-cabinet-grey text-xs truncate">{content.artist}</div>
                      )}
                    </div>
                    <button
                      onClick={() => handlePlay(content)}
                      className="text-cabinet-grey hover:text-cabinet-yellow transition-colors duration-300"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Stats */}
            <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20">
              <h3 className="text-lg font-cabinet font-bold text-white mb-4">Your Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-cabinet-grey">Hours Watched</span>
                  <span className="text-cabinet-yellow font-medium">247h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cabinet-grey">Songs Played</span>
                  <span className="text-white">1,456</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cabinet-grey">Favorite Genre</span>
                  <span className="text-white">Pop</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cabinet-grey">Rides with Music</span>
                  <span className="text-cabinet-yellow font-medium">89%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <FloatingChatbot />
    </div>
  );
}
