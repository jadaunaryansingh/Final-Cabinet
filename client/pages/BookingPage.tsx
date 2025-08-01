import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingChatbot from '../components/FloatingChatbot';
import BumblebeeTransformer from '../components/BumblebeeTransformer';
import GoogleMapsIntegration from '../components/GoogleMapsIntegration';
import UberRideEstimator from '../components/UberRideEstimator';
import RideSelectionDashboard from '../components/RideSelectionDashboard';
import UserProfile from '../components/UserProfile';
import { useAppState } from '../hooks/useAppState';
import { useAuth } from '../hooks/useAuth';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Calendar,
  Star, 
  Car, 
  CreditCard,
  Users,
  Heart,
  Zap,
  Shield,
  Gift,
  ArrowRight,
  Plus,
  Minus,
  Route,
  Timer,
  DollarSign,
  Mic,
  Settings,
  CheckCircle,
  AlertCircle,
  Phone,
  MessageCircle,
  CalendarDays,
  MapPinIcon,
  Locate,
  Tag
} from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  vehicleNumber: string;
  eta: string;
}

const nearbyDrivers: Driver[] = [
  { id: '1', name: 'Rajesh Kumar', avatar: '👨‍💼', rating: 4.9, vehicleNumber: 'KA 05 MZ 1234', eta: '2 min' },
  { id: '2', name: 'Arjun Singh', avatar: '👨‍🚀', rating: 4.8, vehicleNumber: 'KA 03 AB 5678', eta: '4 min' },
  { id: '3', name: 'Suresh Reddy', avatar: '����‍🔧', rating: 4.7, vehicleNumber: 'KA 02 CD 9012', eta: '6 min' }
];

export default function BookingPage() {
  const { state, updateBooking, addNotification } = useAppState();
  const { addToHistory } = useAuth();
  const [pickup, setPickup] = useState(state.currentBooking.pickup || '');
  const [destination, setDestination] = useState(state.currentBooking.destination || '');
  const [rideDate, setRideDate] = useState('now');
  const [selectedDate, setSelectedDate] = useState('');
  const [rideTime, setRideTime] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('wallet');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [showTransformer, setShowTransformer] = useState(true);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [isTransformed, setIsTransformed] = useState(false);
  const [routeDistance, setRouteDistance] = useState('');
  const [routeDuration, setRouteDuration] = useState('');
  const [estimatedFare, setEstimatedFare] = useState('');
  const [lastNotificationKey, setLastNotificationKey] = useState('');
  const [pickupCoords, setPickupCoords] = useState<{lat: number, lng: number} | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{lat: number, lng: number} | null>(null);
  const [selectedUberRide, setSelectedUberRide] = useState<any>(null);
  const [finalPrice, setFinalPrice] = useState(0);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedRideFromDashboard, setSelectedRideFromDashboard] = useState<any>(null);
  const [savedLocations] = useState([
    { name: 'Home', address: 'Koramangala, Bangalore', icon: '🏠' },
    { name: 'Office', address: 'Electronic City, Bangalore', icon: '🏢' },
    { name: 'Airport', address: 'Kempegowda Airport, Bangalore', icon: '✈️' }
  ]);

  // Demo promo codes
  const promoCodes = {
    'CABINET20': { discount: 20, description: 'Get 20% off on your ride' },
    'FIRST50': { discount: 50, description: 'First ride 50% discount' },
    'WELCOME10': { discount: 10, description: 'Welcome bonus 10% off' }
  };

  const handleVoiceBooking = () => {
    setIsVoiceListening(!isVoiceListening);

    if (!isVoiceListening) {
      addNotification({
        type: 'info',
        message: '🎙️ Voice recognition activated. Speak your location clearly.'
      });

      // Simulate voice recognition
      setTimeout(() => {
        if (isVoiceListening) {
          const mockLocation = 'Koramangala, Bangalore';
          if (!pickup) {
            setPickup(mockLocation);
            addNotification({
              type: 'success',
              message: `✅ Pickup location set to: ${mockLocation}`
            });
          } else if (!destination) {
            setDestination(mockLocation);
            addNotification({
              type: 'success',
              message: `✅ Destination set to: ${mockLocation}`
            });
          }
          setIsVoiceListening(false);
        }
      }, 3000);
    }
  };

  const handleBookRide = () => {
    if (pickup && destination && selectedUberRide) {
      setShowPaymentOptions(true);
    } else {
      addNotification({
        type: 'error',
        message: '❌ Please select pickup, destination, and a ride option'
      });
    }
  };

  const handleConfirmBooking = () => {
    // Create ride history entry
    const newRide = {
      id: `ride-${Date.now()}`,
      date: new Date(),
      pickup,
      destination,
      cost: finalPrice,
      driver: nearbyDrivers[0].name,
      rating: 0, // Will be set after ride completion
      distance: routeDistance,
      duration: routeDuration,
      rideType: selectedUberRide?.display_name || 'UberX'
    };

    // Add to user's ride history
    addToHistory(newRide);

    // Update booking state
    updateBooking({
      pickup,
      destination,
      rideType: selectedUberRide?.display_name || 'UberX',
      status: 'confirmed',
      driver: {
        name: nearbyDrivers[0].name,
        rating: nearbyDrivers[0].rating,
        eta: nearbyDrivers[0].eta,
        vehicleNumber: nearbyDrivers[0].vehicleNumber
      }
    });

    // Show success notification
    addNotification({
      type: 'success',
      message: `🚗 Ride booked successfully! ${nearbyDrivers[0].name} will arrive in ${nearbyDrivers[0].eta}.`
    });

    // Close payment modal
    setShowPaymentOptions(false);

    // Simulate driver updates
    setTimeout(() => {
      addNotification({
        type: 'info',
        message: '📍 Driver is on the way! Track your ride in real-time.'
      });
    }, 2000);

    setTimeout(() => {
      updateBooking({ status: 'ongoing' });
      addNotification({
        type: 'success',
        message: '🎯 Driver has arrived! Please check your pickup location.'
      });

      // Simulate ride completion after 30 seconds
      setTimeout(() => {
        updateBooking({ status: 'completed' });
        addNotification({
          type: 'success',
          message: '✅ Ride completed! Thank you for choosing CAB-I-NET.'
        });
      }, 30000);
    }, 5000);
  };

  const handleLocationUpdate = (pickupAddr: string, destinationAddr: string, distance: string, duration: string, fare: string, pickupCoordinates?: {lat: number, lng: number}, destinationCoordinates?: {lat: number, lng: number}) => {
    setRouteDistance(distance);
    setRouteDuration(duration);
    setEstimatedFare(fare);
    
    if (pickupCoordinates) setPickupCoords(pickupCoordinates);
    if (destinationCoordinates) setDestinationCoords(destinationCoordinates);
    
    // Only show notification if it's different from the last one to prevent spam
    const notificationKey = `${distance}-${duration}-${fare}`;
    if (notificationKey !== lastNotificationKey) {
      setLastNotificationKey(notificationKey);
      addNotification({
        type: 'success',
        message: `🗺️ Route updated: ${distance}, ${duration}`
      });
    }
  };

  const handleCurrentLocation = () => {
    // This function is now handled by GoogleMapsIntegration component
    setIsLocatingUser(true);
  };

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase();
    if (promoCodes[code as keyof typeof promoCodes]) {
      const promo = promoCodes[code as keyof typeof promoCodes];
      setPromoApplied(true);
      setPromoDiscount(promo.discount);
      addNotification({
        type: 'success',
        message: `🎉 Promo code applied! ${promo.discount}% discount`
      });
    } else {
      addNotification({
        type: 'error',
        message: '❌ Invalid promo code. Try CABINET20, FIRST50, or WELCOME10'
      });
    }
  };

  const removePromo = () => {
    setPromoApplied(false);
    setPromoDiscount(0);
    setPromoCode('');
    addNotification({
      type: 'info',
      message: '🏷️ Promo code removed'
    });
  };

  const handleRideSelection = (rideData: any) => {
    setSelectedUberRide(rideData);
    const basePrice = extractPrice(rideData.price_estimate);
    setFinalPrice(basePrice);
  };

  const extractPrice = (priceEstimate: string): number => {
    const match = priceEstimate.match(/₹(\d+)/);
    return match ? parseInt(match[1]) : 100;
  };

  // Pre-fill data from calculator or offers
  useEffect(() => {
    // Check for pre-filled booking data from calculator
    const bookingPrefill = localStorage.getItem('booking-prefill');
    if (bookingPrefill) {
      try {
        const data = JSON.parse(bookingPrefill);
        if (data.pickup) setPickup(data.pickup);
        if (data.destination) setDestination(data.destination);
        // Clear the prefill data after using it
        localStorage.removeItem('booking-prefill');
      } catch (error) {
        console.error('Error parsing booking prefill data:', error);
      }
    }

    // Check for applied promo code from offers page
    const appliedPromoCode = localStorage.getItem('applied-promo-code');
    const appliedOffer = localStorage.getItem('applied-offer');
    if (appliedPromoCode && appliedOffer) {
      try {
        const offer = JSON.parse(appliedOffer);
        setPromoCode(appliedPromoCode);

        // Auto-apply the promo code
        if (offer.type === 'percentage') {
          const discountPercent = parseInt(offer.discount.replace('%', '').replace(' OFF', ''));
          setPromoApplied(true);
          setPromoDiscount(discountPercent);
        }

        // Clear the applied offer after using it
        localStorage.removeItem('applied-promo-code');
        localStorage.removeItem('applied-offer');
      } catch (error) {
        console.error('Error parsing applied offer data:', error);
      }
    }
  }, []);

  // Calculate final price with promo discount
  useEffect(() => {
    if (selectedUberRide) {
      const basePrice = extractPrice(selectedUberRide.price_estimate);
      const discountAmount = promoApplied ? Math.round(basePrice * (promoDiscount / 100)) : 0;
      setFinalPrice(basePrice - discountAmount);
    }
  }, [selectedUberRide, promoApplied, promoDiscount]);

  // Get tomorrow's date for minimum date selection
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get current time + 30 minutes for minimum time selection
  const getMinTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toTimeString().slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-6xl font-display font-black text-gradient text-shadow-glow mb-6">
            Book Your Ride 🚗
          </h1>
          <p className="text-cabinet-grey text-xl font-accent font-medium tracking-wide max-w-3xl mx-auto leading-relaxed">
            Premium cab booking with real Uber integration and luxury amenities
          </p>
          <div className="flex justify-center space-x-3 mt-6">
            <div className="w-3 h-3 bg-cabinet-yellow rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-cabinet-light-yellow rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-cabinet-gold rounded-full animate-bounce delay-200"></div>
          </div>
        </div>

        {/* Bumble Bee Transformer Section */}
        {showTransformer && (
          <div className="mb-32 relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-display font-black text-gradient text-shadow-glow mb-6 animate-slide-up">
                Meet Bumblebee 🤖
              </h2>
              <p className="text-cabinet-grey text-lg font-accent font-medium tracking-wide max-w-2xl mx-auto leading-relaxed">
                Our magical transformer mascot! Click to see the transformation magic and unlock the booking experience ✨
              </p>
            </div>

            <div className="relative">
              <BumblebeeTransformer
                isTransformed={isTransformed}
                onTransform={() => {
                  setIsTransformed(!isTransformed);
                  // Show booking form after transformation
                  setTimeout(() => setShowTransformer(false), 3000);
                }}
              />

              {/* Magical Background */}
              <div className="absolute -inset-20 bg-gradient-radial from-cabinet-yellow/10 via-cabinet-gold/5 to-transparent rounded-full blur-3xl animate-breathe pointer-events-none"></div>

              {/* Floating Elements */}
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 bg-cabinet-yellow/60 rounded-full animate-float"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 3) * 20}%`,
                      animationDelay: `${i * 0.8}s`,
                      animationDuration: `${4 + i * 0.5}s`
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="text-center mt-24">
              <button
                onClick={() => setShowTransformer(false)}
                className="btn-premium px-10 py-5 rounded-2xl font-heading font-semibold text-xl tracking-wide hover-lift relative overflow-hidden group shadow-2xl"
              >
                <span className="relative z-10">🚀 Continue to Booking Experience</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cabinet-light-yellow to-cabinet-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <p className="text-cabinet-grey text-sm mt-4 opacity-75">
                Ready to experience premium cab booking with real Uber integration
              </p>
            </div>
          </div>
        )}

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Column - Main Booking Flow */}
          <div className="xl:col-span-3 space-y-8">

            {/* Step 1: Location Selection & Map */}
            <GoogleMapsIntegration
              onLocationUpdate={handleLocationUpdate}
              pickupValue={pickup}
              destinationValue={destination}
              onPickupChange={setPickup}
              onDestinationChange={setDestination}
            />

            {/* Step 2: Route Information */}
            {routeDistance && routeDuration && (
              <div className="glass-morphism rounded-3xl p-8 border border-cabinet-yellow/20">
                <h2 className="text-2xl font-cabinet font-bold text-white mb-6 flex items-center space-x-3">
                  <Route className="w-7 h-7 text-cabinet-yellow" />
                  <span>🗺️ Step 2: Route Information</span>
                </h2>
                
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-4 glass-morphism rounded-2xl border border-cabinet-yellow/20">
                    <Route className="w-8 h-8 text-cabinet-yellow mx-auto mb-3" />
                    <div className="text-cabinet-grey text-sm mb-1">Distance</div>
                    <div className="text-white font-bold text-xl">{routeDistance}</div>
                  </div>
                  
                  <div className="text-center p-4 glass-morphism rounded-2xl border border-cabinet-yellow/20">
                    <Timer className="w-8 h-8 text-cabinet-light-yellow mx-auto mb-3" />
                    <div className="text-cabinet-grey text-sm mb-1">Duration</div>
                    <div className="text-white font-bold text-xl">{routeDuration}</div>
                  </div>
                  
                  <div className="text-center p-4 glass-morphism rounded-2xl border border-cabinet-yellow/20">
                    <DollarSign className="w-8 h-8 text-cabinet-gold mx-auto mb-3" />
                    <div className="text-cabinet-grey text-sm mb-1">Estimated Base Fare</div>
                    <div className="text-cabinet-yellow font-bold text-xl">{estimatedFare}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Schedule */}
            <div className="glass-morphism rounded-3xl p-8 border border-cabinet-yellow/20">
              <h2 className="text-2xl font-cabinet font-bold text-white mb-6 flex items-center space-x-3">
                <CalendarDays className="w-7 h-7 text-cabinet-yellow" />
                <span>📅 Step 3: Schedule Your Ride</span>
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="text-cabinet-grey text-sm mb-3 block font-medium">Ride Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setRideDate('now');
                        setSelectedDate('');
                        setRideTime('');
                      }}
                      className={`py-4 px-6 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center space-x-3 text-lg ${
                        rideDate === 'now'
                          ? 'bg-cabinet-yellow text-black'
                          : 'glass-morphism border border-cabinet-yellow/30 text-cabinet-yellow hover:bg-cabinet-yellow/10'
                      }`}
                    >
                      <Zap className="w-5 h-5" />
                      <span>Ride Now</span>
                    </button>
                    <button
                      onClick={() => setRideDate('schedule')}
                      className={`py-4 px-6 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center space-x-3 text-lg ${
                        rideDate === 'schedule'
                          ? 'bg-cabinet-yellow text-black'
                          : 'glass-morphism border border-cabinet-yellow/30 text-cabinet-yellow hover:bg-cabinet-yellow/10'
                      }`}
                    >
                      <Calendar className="w-5 h-5" />
                      <span>Schedule</span>
                    </button>
                  </div>
                </div>

                {rideDate === 'schedule' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-cabinet-grey text-sm mb-3 block font-medium">Select Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cabinet-yellow w-5 h-5" />
                        <input
                          type="date"
                          value={selectedDate}
                          min={getTomorrowDate()}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 glass-morphism rounded-xl border border-cabinet-yellow/30 text-white focus:border-cabinet-yellow focus:outline-none text-lg"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-cabinet-grey text-sm mb-3 block font-medium">Select Time</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cabinet-yellow w-5 h-5" />
                        <input
                          type="time"
                          value={rideTime}
                          min={selectedDate === getTomorrowDate() ? getMinTime() : '00:00'}
                          onChange={(e) => setRideTime(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 glass-morphism rounded-xl border border-cabinet-yellow/30 text-white focus:border-cabinet-yellow focus:outline-none text-lg"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {rideDate === 'schedule' && selectedDate && rideTime && (
                  <div className="glass-morphism p-6 rounded-2xl border border-cabinet-yellow/20">
                    <div className="flex items-center space-x-3 text-cabinet-yellow">
                      <CheckCircle className="w-6 h-6" />
                      <span className="font-medium text-lg">
                        Scheduled for {new Date(selectedDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} at {rideTime}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 4: Passenger Count */}
            <div className="glass-morphism rounded-3xl p-8 border border-cabinet-yellow/20">
              <h2 className="text-2xl font-cabinet font-bold text-white mb-6 flex items-center space-x-3">
                <Users className="w-7 h-7 text-cabinet-yellow" />
                <span>👥 Step 4: Number of Passengers</span>
              </h2>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Users className="w-8 h-8 text-cabinet-yellow" />
                  <span className="text-white font-medium text-lg">Number of passengers</span>
                </div>
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => setPassengers(Math.max(1, passengers - 1))}
                    className="w-12 h-12 glass-morphism border border-cabinet-yellow/30 rounded-xl flex items-center justify-center text-cabinet-yellow hover:bg-cabinet-yellow hover:text-black transition-all duration-300 text-xl"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-3xl font-cabinet font-bold text-white w-12 text-center">
                    {passengers}
                  </span>
                  <button
                    onClick={() => setPassengers(Math.min(6, passengers + 1))}
                    className="w-12 h-12 glass-morphism border border-cabinet-yellow/30 rounded-xl flex items-center justify-center text-cabinet-yellow hover:bg-cabinet-yellow hover:text-black transition-all duration-300 text-xl"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Step 5: Promo Code */}
            <div className="glass-morphism rounded-3xl p-8 border border-cabinet-yellow/20">
              <h2 className="text-2xl font-cabinet font-bold text-white mb-6 flex items-center space-x-3">
                <Tag className="w-7 h-7 text-cabinet-yellow" />
                <span>🏷️ Step 5: Promo Code (Optional)</span>
              </h2>

              {!promoApplied ? (
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <div className="relative flex-1">
                      <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cabinet-yellow w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Enter promo code (try CABINET20)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="w-full pl-12 pr-4 py-4 glass-morphism rounded-xl border border-cabinet-yellow/30 text-white placeholder-cabinet-grey focus:border-cabinet-yellow focus:outline-none text-lg"
                      />
                    </div>
                    <button
                      onClick={handleApplyPromo}
                      disabled={!promoCode}
                      className="px-8 py-4 bg-cabinet-yellow text-black rounded-xl font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                      Apply
                    </button>
                  </div>

                  <div className="text-sm text-cabinet-grey">
                    Available codes: <span className="text-cabinet-yellow">CABINET20</span>, <span className="text-cabinet-yellow">FIRST50</span>, <span className="text-cabinet-yellow">WELCOME10</span>
                  </div>
                </div>
              ) : (
                <div className="glass-morphism p-6 rounded-xl border border-green-500/30 bg-green-500/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <div>
                        <div className="text-green-400 font-semibold text-lg">{promoCode} Applied!</div>
                        <div className="text-green-300">{promoDiscount}% discount applied</div>
                      </div>
                    </div>
                    <button
                      onClick={removePromo}
                      className="text-cabinet-grey hover:text-red-400 transition-colors text-2xl"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 6: Choose Your Ride */}
            {pickupCoords && destinationCoords && (
              <div className="glass-morphism rounded-3xl p-8 border border-cabinet-yellow/20">
                <h2 className="text-2xl font-cabinet font-bold text-white mb-6 flex items-center space-x-3">
                  <Car className="w-7 h-7 text-cabinet-yellow" />
                  <span>🚗 Step 6: Choose Your Ride</span>
                </h2>
                <UberRideEstimator
                  pickupCoords={pickupCoords}
                  destinationCoords={destinationCoords}
                  pickup={pickup}
                  destination={destination}
                  onRideSelect={handleRideSelection}
                />
              </div>
            )}

            {/* Step 7: Final Pricing & Booking */}
            {selectedUberRide && (
              <div className="glass-morphism rounded-3xl p-8 border border-cabinet-yellow/20">
                <h2 className="text-2xl font-cabinet font-bold text-white mb-6 flex items-center space-x-3">
                  <CreditCard className="w-7 h-7 text-cabinet-yellow" />
                  <span>💳 Step 7: Final Pricing & Book</span>
                </h2>

                {/* Selected Ride Summary */}
                <div className="mb-8 p-6 glass-morphism rounded-2xl border border-cabinet-yellow/30">
                  <h3 className="text-lg font-semibold text-white mb-4">Selected Ride</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{selectedUberRide.image}</div>
                      <div>
                        <div className="text-white font-semibold text-lg">{selectedUberRide.display_name}</div>
                        <div className="text-cabinet-grey">{selectedUberRide.description}</div>
                        <div className="text-cabinet-yellow text-sm">ETA: {selectedUberRide.duration_estimate} min</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-cabinet-yellow font-bold text-xl">{selectedUberRide.price_estimate}</div>
                      <div className="text-cabinet-grey text-sm">Original price</div>
                    </div>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="mb-8 space-y-4">
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-cabinet-grey">Base Fare</span>
                    <span className="text-white">{selectedUberRide.price_estimate}</span>
                  </div>
                  
                  {promoApplied && (
                    <div className="flex items-center justify-between text-lg">
                      <span className="text-green-400">Discount ({promoDiscount}%)</span>
                      <span className="text-green-400">-₹{Math.round(extractPrice(selectedUberRide.price_estimate) * (promoDiscount / 100))}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-cabinet-yellow/20 pt-4">
                    <div className="flex items-center justify-between text-2xl">
                      <span className="text-white font-bold">Total Amount</span>
                      <span className="text-cabinet-yellow font-bold">₹{finalPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Book Button */}
                <button
                  onClick={handleBookRide}
                  disabled={!pickup || !destination || !selectedUberRide}
                  className="w-full bg-gradient-gold text-black py-6 rounded-2xl font-cabinet font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-xl"
                >
                  <span>Book Now - ₹{finalPrice}</span>
                  <ArrowRight className="w-6 h-6" />
                </button>

                {/* Nearby Drivers */}
                <div className="mt-8 p-6 glass-morphism rounded-2xl border border-cabinet-yellow/20">
                  <h4 className="text-lg font-semibold text-white mb-4">Nearby Drivers</h4>
                  <div className="space-y-3">
                    {nearbyDrivers.map((driver) => (
                      <div key={driver.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 gradient-gold rounded-full flex items-center justify-center text-xl">
                            {driver.avatar}
                          </div>
                          <div>
                            <div className="text-white font-medium">{driver.name}</div>
                            <div className="text-cabinet-grey text-sm">{driver.vehicleNumber}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-cabinet-yellow font-medium">{driver.eta}</div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-cabinet-grey text-sm">{driver.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Price Summary - Sticky */}
            <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20 sticky top-8" style={{zIndex: 10, position: 'sticky'}}>
              <h3 className="text-xl font-cabinet font-bold text-white mb-6 flex items-center space-x-3">
                <DollarSign className="w-6 h-6 text-cabinet-yellow" />
                <span>Price Summary</span>
              </h3>
              
              {selectedUberRide ? (
                <div className="space-y-4">
                  <div className="text-center p-4 glass-morphism rounded-xl border border-cabinet-yellow/20">
                    <div className="text-2xl mb-2">{selectedUberRide.image}</div>
                    <div className="text-white font-semibold">{selectedUberRide.display_name}</div>
                    <div className="text-cabinet-grey text-sm">{selectedUberRide.description}</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-cabinet-grey">Base Fare</span>
                      <span className="text-white">{selectedUberRide.price_estimate}</span>
                    </div>
                    
                    {promoApplied && (
                      <div className="flex justify-between">
                        <span className="text-green-400">Discount ({promoDiscount}%)</span>
                        <span className="text-green-400">-₹{Math.round(extractPrice(selectedUberRide.price_estimate) * (promoDiscount / 100))}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-cabinet-yellow/20 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-bold text-lg">Total</span>
                        <span className="text-cabinet-yellow font-bold text-2xl">₹{finalPrice}</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-cabinet-grey text-sm">ETA: {selectedUberRide.duration_estimate} min</div>
                      <div className="text-cabinet-grey text-sm">Distance: {routeDistance}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-cabinet-grey text-lg mb-2">No ride selected</div>
                  <div className="text-cabinet-grey text-sm">Choose a ride to see pricing</div>
                </div>
              )}
            </div>



            {/* Recent Locations */}
            <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20">
              <h3 className="text-xl font-cabinet font-bold text-white mb-6 flex items-center space-x-3">
                <Clock className="w-6 h-6 text-cabinet-yellow" />
                <span>Recent</span>
              </h3>
              
              <div className="space-y-3">
                {[
                  { name: 'Electronic City', address: 'Phase 1, Bangalore', time: '2 hours ago' },
                  { name: 'Koramangala', address: '5th Block, Bangalore', time: 'Yesterday' },
                  { name: 'MG Road', address: 'Central Bangalore', time: '2 days ago' }
                ].map((location, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!pickup) setPickup(location.address);
                      else if (!destination) setDestination(location.address);
                    }}
                    className="w-full glass-morphism border border-cabinet-yellow/30 p-3 rounded-xl hover:border-cabinet-yellow/50 transition-all duration-300 text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium text-sm">{location.name}</div>
                        <div className="text-cabinet-grey text-xs">{location.address}</div>
                      </div>
                      <div className="text-cabinet-grey text-xs">{location.time}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Support */}
            <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20">
              <h3 className="text-xl font-cabinet font-bold text-white mb-6 flex items-center space-x-3">
                <MessageCircle className="w-6 h-6 text-cabinet-yellow" />
                <span>Need Help?</span>
              </h3>
              
              <div className="space-y-4">
                <button
                  onClick={() => {
                    addNotification({
                      type: 'info',
                      message: '📞 Connecting to support...'
                    });
                  }}
                  className="w-full btn-premium py-3 rounded-xl font-medium text-center flex items-center justify-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Support</span>
                </button>
                
                <div className="text-center">
                  <div className="text-cabinet-grey text-sm">Available 24/7</div>
                  <div className="text-cabinet-yellow font-medium">+91 800-CAB-INET</div>
                </div>
              </div>
            </div>

            {/* Active Promotions */}
            <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20">
              <h3 className="text-xl font-cabinet font-bold text-white mb-6 flex items-center space-x-3">
                <Gift className="w-6 h-6 text-cabinet-yellow" />
                <span>Active Offers</span>
              </h3>
              
              <div className="space-y-3">
                <div className="glass-morphism border border-green-500/30 bg-green-500/10 p-4 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🎉</div>
                    <div>
                      <div className="text-green-400 font-semibold text-sm">20% OFF</div>
                      <div className="text-green-300 text-xs">Use code: CABINET20</div>
                    </div>
                  </div>
                </div>
                
                <div className="glass-morphism border border-blue-500/30 bg-blue-500/10 p-4 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🚀</div>
                    <div>
                      <div className="text-blue-400 font-semibold text-sm">First Ride Free</div>
                      <div className="text-blue-300 text-xs">Use code: FIRST50</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20">
              <h3 className="text-xl font-cabinet font-bold text-white mb-6 flex items-center space-x-3">
                <Settings className="w-6 h-6 text-cabinet-yellow" />
                <span>Quick Actions</span>
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setShowUserProfile(true)}
                  className="w-full glass-morphism border border-cabinet-yellow/30 p-3 rounded-xl hover:border-cabinet-yellow/50 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 gradient-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-sm">
                      👤
                    </div>
                    <div className="text-white font-medium text-sm">My Profile</div>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    addNotification({
                      type: 'info',
                      message: '📋 Opening ride history...'
                    });
                  }}
                  className="w-full glass-morphism border border-cabinet-yellow/30 p-3 rounded-xl hover:border-cabinet-yellow/50 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 gradient-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-sm">
                      📋
                    </div>
                    <div className="text-white font-medium text-sm">Ride History</div>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    addNotification({
                      type: 'info',
                      message: '⭐ Opening favorite drivers...'
                    });
                  }}
                  className="w-full glass-morphism border border-cabinet-yellow/30 p-3 rounded-xl hover:border-cabinet-yellow/50 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 gradient-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-sm">
                      ⭐
                    </div>
                    <div className="text-white font-medium text-sm">Favorite Drivers</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Voice Listening Indicator */}
        {isVoiceListening && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 glass-morphism-hover rounded-full px-10 py-5 border border-cabinet-yellow/50 z-50 animate-slide-up hover-lift">
            <div className="flex items-center space-x-5">
              <div className="relative">
                <div className="w-5 h-5 bg-cabinet-yellow rounded-full animate-voice-pulse"></div>
                <div className="absolute inset-0 w-5 h-5 bg-cabinet-light-yellow rounded-full animate-ping"></div>
              </div>
              <span className="text-white font-accent font-bold text-lg tracking-wide text-gradient">
                🎙️ Listening for location...
              </span>
              <div className="flex space-x-1">
                <div className="w-1 h-6 bg-cabinet-yellow rounded-full animate-pulse"></div>
                <div className="w-1 h-8 bg-cabinet-light-yellow rounded-full animate-pulse delay-75"></div>
                <div className="w-1 h-5 bg-cabinet-gold rounded-full animate-pulse delay-150"></div>
                <div className="w-1 h-9 bg-cabinet-yellow rounded-full animate-pulse delay-225"></div>
              </div>
              <button
                onClick={() => setIsVoiceListening(false)}
                className="text-cabinet-grey hover:text-white transition-colors duration-300 hover:scale-110 magnetic"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentOptions && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-morphism rounded-3xl p-8 border border-cabinet-yellow/30 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-cabinet font-bold text-white">Payment Options</h3>
                <button
                  onClick={() => setShowPaymentOptions(false)}
                  className="text-cabinet-grey hover:text-white transition-colors duration-300 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4 mb-8">
                {[
                  { id: 'wallet', name: 'CAB-I-NET Wallet', balance: '₹2,450', icon: '💳' },
                  { id: 'card', name: 'Credit/Debit Card', balance: '**** 1234', icon: '💳' },
                  { id: 'upi', name: 'UPI Payment', balance: 'Pay via UPI', icon: '📱' },
                  { id: 'cash', name: 'Cash Payment', balance: 'Pay to driver', icon: '💵' }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedPayment(option.id)}
                    className={`w-full p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                      selectedPayment === option.id
                        ? 'border-cabinet-yellow bg-cabinet-yellow/10'
                        : 'border-cabinet-yellow/20 hover:border-cabinet-yellow/40'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{option.icon}</span>
                      <div className="text-left">
                        <div className="text-white font-medium text-lg">{option.name}</div>
                        <div className="text-cabinet-grey">{option.balance}</div>
                      </div>
                    </div>
                    {selectedPayment === option.id && (
                      <CheckCircle className="w-6 h-6 text-cabinet-yellow" />
                    )}
                  </button>
                ))}
              </div>

              <div className="mb-6 p-6 glass-morphism rounded-2xl border border-cabinet-yellow/20">
                <div className="flex items-center justify-between text-xl">
                  <span className="text-white font-semibold">Total to Pay</span>
                  <span className="text-cabinet-yellow font-bold">₹{finalPrice}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowPaymentOptions(false)}
                  className="glass-morphism border border-cabinet-grey/30 text-cabinet-grey py-4 rounded-xl font-medium hover:bg-cabinet-grey/20 transition-all duration-300 text-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  className="bg-gradient-gold text-black py-4 rounded-xl font-medium hover:scale-105 transition-all duration-300 text-lg"
                >
                  Confirm & Pay
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <FloatingChatbot />
      
      {/* User Profile Modal */}
      <UserProfile
        open={showUserProfile}
        onOpenChange={setShowUserProfile}
      />
    </div>
  );
}
