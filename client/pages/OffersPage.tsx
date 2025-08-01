import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingChatbot from '../components/FloatingChatbot';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { 
  Gift, 
  Star, 
  Clock, 
  Percent, 
  Tag, 
  Users, 
  Calendar,
  CheckCircle,
  Copy,
  Search
} from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: string;
  type: 'percentage' | 'fixed' | 'free_ride' | 'cashback';
  category: 'new_user' | 'loyalty' | 'seasonal' | 'referral' | 'premium';
  validUntil: Date;
  minAmount?: number;
  maxDiscount?: number;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
  terms: string[];
  icon: string;
}

export default function OffersPage() {
  const { authState } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string>('');

  const offers: Offer[] = [
    {
      id: 'NEW50',
      title: 'Welcome Bonus',
      description: 'Get 50% off on your first 3 rides',
      code: 'WELCOME50',
      discount: '50% OFF',
      type: 'percentage',
      category: 'new_user',
      validUntil: new Date('2024-12-31'),
      maxDiscount: 200,
      usageLimit: 3,
      timesUsed: authState.user?.totalRides === 0 ? 0 : 3,
      isActive: authState.user?.totalRides === 0,
      terms: [
        'Valid for new users only',
        'Maximum discount of ₹200 per ride',
        'Valid for first 3 rides only',
        'Cannot be combined with other offers'
      ],
      icon: '🎉'
    },
    {
      id: 'VIP25',
      title: 'VIP Member Exclusive',
      description: '25% off on VIP rides',
      code: 'VIP25',
      discount: '25% OFF',
      type: 'percentage',
      category: 'premium',
      validUntil: new Date('2024-06-30'),
      minAmount: 500,
      maxDiscount: 300,
      usageLimit: 10,
      timesUsed: 2,
      isActive: true,
      terms: [
        'Valid on VIP rides only',
        'Minimum ride amount ₹500',
        'Maximum discount ₹300',
        'Valid 10 times per month'
      ],
      icon: '👑'
    },
    {
      id: 'FRIEND200',
      title: 'Refer & Earn',
      description: 'Get ₹200 for every friend you refer',
      code: 'REFER200',
      discount: '₹200 CASHBACK',
      type: 'cashback',
      category: 'referral',
      validUntil: new Date('2024-12-31'),
      usageLimit: 999,
      timesUsed: 5,
      isActive: true,
      terms: [
        'Both you and your friend get ₹200',
        'Friend must complete their first ride',
        'Cashback credited within 24 hours',
        'No limit on referrals'
      ],
      icon: '🤝'
    },
    {
      id: 'WEEKEND',
      title: 'Weekend Special',
      description: 'Free ride on weekends (up to ₹150)',
      code: 'WEEKEND150',
      discount: 'FREE RIDE',
      type: 'free_ride',
      category: 'seasonal',
      validUntil: new Date('2024-03-31'),
      maxDiscount: 150,
      usageLimit: 4,
      timesUsed: 1,
      isActive: true,
      terms: [
        'Valid on Saturdays and Sundays only',
        'Maximum free ride value ₹150',
        'Valid 4 times per month',
        'Excess amount to be paid by user'
      ],
      icon: '🎯'
    },
    {
      id: 'LOYALTY100',
      title: 'Loyalty Reward',
      description: '₹100 off after 10 rides this month',
      code: 'LOYAL100',
      discount: '₹100 OFF',
      type: 'fixed',
      category: 'loyalty',
      validUntil: new Date('2024-02-29'),
      usageLimit: 1,
      timesUsed: authState.user?.totalRides >= 10 ? 0 : 1,
      isActive: authState.user?.totalRides >= 10,
      terms: [
        'Complete 10 rides to unlock',
        'Valid for one use per month',
        'Automatically applied to next ride',
        'Cannot be transferred'
      ],
      icon: '🏆'
    },
    {
      id: 'STUDENT20',
      title: 'Student Discount',
      description: '20% off for students',
      code: 'STUDENT20',
      discount: '20% OFF',
      type: 'percentage',
      category: 'seasonal',
      validUntil: new Date('2024-08-31'),
      maxDiscount: 100,
      usageLimit: 999,
      timesUsed: 0,
      isActive: true,
      terms: [
        'Valid student ID required',
        'Maximum discount ₹100',
        'Valid on all ride types',
        'Verification may be required'
      ],
      icon: '🎓'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Offers', icon: '🎁' },
    { id: 'new_user', name: 'New User', icon: '🆕' },
    { id: 'loyalty', name: 'Loyalty', icon: '⭐' },
    { id: 'premium', name: 'Premium', icon: '💎' },
    { id: 'referral', name: 'Referral', icon: '👥' },
    { id: 'seasonal', name: 'Seasonal', icon: '🎯' }
  ];

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || offer.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const applyOffer = (offer: Offer) => {
    if (!offer.isActive) {
      alert('This offer is not available for you currently.');
      return;
    }

    if (offer.timesUsed >= offer.usageLimit) {
      alert('You have reached the usage limit for this offer.');
      return;
    }

    // Store the offer code for booking
    localStorage.setItem('applied-promo-code', offer.code);
    localStorage.setItem('applied-offer', JSON.stringify(offer));
    
    alert(`Offer "${offer.code}" applied! It will be used in your next booking.`);
    
    // Navigate to booking page
    window.location.href = '/booking';
  };

  const getOfferStatusBadge = (offer: Offer) => {
    if (!offer.isActive) {
      return <Badge variant="secondary">Not Available</Badge>;
    }
    
    if (offer.timesUsed >= offer.usageLimit) {
      return <Badge variant="destructive">Used Up</Badge>;
    }
    
    const daysLeft = Math.ceil((offer.validUntil.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 3) {
      return <Badge variant="destructive">Expires in {daysLeft} days</Badge>;
    }
    
    if (daysLeft <= 7) {
      return <Badge variant="outline">Expires in {daysLeft} days</Badge>;
    }
    
    return <Badge variant="default" className="bg-green-600">Active</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Gift className="h-8 w-8 text-yellow-500" />
              <h1 className="text-3xl font-bold text-white">Special Offers</h1>
            </div>
            <p className="text-gray-400">Save money on your rides with exclusive deals</p>
          </div>

          {/* User Stats */}
          {authState.user && (
            <Card className="glass-morphism border-yellow-500/20 mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-yellow-500">{authState.user.totalRides}</p>
                    <p className="text-gray-400 text-sm">Total Rides</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-500">{authState.user.loyaltyPoints}</p>
                    <p className="text-gray-400 text-sm">Loyalty Points</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-500">{authState.user.level}</p>
                    <p className="text-gray-400 text-sm">Member Level</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-500">{offers.filter(o => o.isActive).length}</p>
                    <p className="text-gray-400 text-sm">Available Offers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search offers, codes, or descriptions..."
                className="pl-10 bg-black/20 border-gray-600 text-white"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="whitespace-nowrap"
                  size="sm"
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Offers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <Card key={offer.id} className="glass-morphism border-yellow-500/20 hover:border-yellow-500/40 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{offer.icon}</span>
                      <div>
                        <CardTitle className="text-white text-lg">{offer.title}</CardTitle>
                        <p className="text-gray-400 text-sm">{offer.description}</p>
                      </div>
                    </div>
                    {getOfferStatusBadge(offer)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Discount Display */}
                  <div className="text-center py-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <p className="text-yellow-500 text-xl font-bold">{offer.discount}</p>
                  </div>

                  {/* Promo Code */}
                  <div className="flex items-center gap-2 bg-black/30 p-3 rounded-lg">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <code className="text-white font-mono flex-1">{offer.code}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyCode(offer.code)}
                      className="h-8 w-8 p-0"
                    >
                      {copiedCode === offer.code ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Usage Info */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Users className="h-3 w-3" />
                      Used {offer.timesUsed}/{offer.usageLimit}
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Calendar className="h-3 w-3" />
                      Valid until {offer.validUntil.toLocaleDateString()}
                    </div>
                  </div>

                  {/* Terms Preview */}
                  <div className="text-xs text-gray-400">
                    <p>• {offer.terms[0]}</p>
                    {offer.terms.length > 1 && (
                      <p>• +{offer.terms.length - 1} more terms</p>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button 
                    onClick={() => applyOffer(offer)}
                    disabled={!offer.isActive || offer.timesUsed >= offer.usageLimit}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium disabled:bg-gray-600 disabled:text-gray-400"
                  >
                    {offer.isActive && offer.timesUsed < offer.usageLimit ? 'Apply Offer' : 'Not Available'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOffers.length === 0 && (
            <div className="text-center py-12">
              <Gift className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No offers found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* How to Use */}
          <Card className="glass-morphism border-yellow-500/20 mt-8">
            <CardHeader>
              <CardTitle className="text-yellow-500 flex items-center gap-2">
                <Star className="h-5 w-5" />
                How to Use Offers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="text-center">
                  <div className="bg-yellow-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-yellow-500 font-bold">1</span>
                  </div>
                  <h4 className="text-white font-medium mb-2">Choose Offer</h4>
                  <p className="text-gray-400">Browse and select the offer that suits your ride</p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-yellow-500 font-bold">2</span>
                  </div>
                  <h4 className="text-white font-medium mb-2">Apply Code</h4>
                  <p className="text-gray-400">Click "Apply Offer" or enter the promo code manually</p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-yellow-500 font-bold">3</span>
                  </div>
                  <h4 className="text-white font-medium mb-2">Save Money</h4>
                  <p className="text-gray-400">Enjoy discounted rides and cashback rewards</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
      <FloatingChatbot />
    </div>
  );
}
