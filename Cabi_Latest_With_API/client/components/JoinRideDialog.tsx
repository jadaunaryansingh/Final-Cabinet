import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useUnifiedAuth';
import { 
  Car, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign,
  Phone,
  MessageCircle,
  CheckCircle,
  X,
  Star
} from 'lucide-react';

interface RideDetails {
  from: string;
  to: string;
  time: string;
  date: string;
  seats: number;
  cost: number;
}

interface JoinRideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rideDetails: RideDetails | null;
  hostName: string;
  hostAvatar: string;
  hostRating: number;
}

export default function JoinRideDialog({ 
  open, 
  onOpenChange, 
  rideDetails, 
  hostName, 
  hostAvatar, 
  hostRating 
}: JoinRideDialogProps) {
  const { authState } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [seatsRequested, setSeatsRequested] = useState(1);
  const [pickupLocation, setPickupLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleJoinRide = async () => {
    setIsJoining(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Joining ride:', {
        user: authState.user?.name,
        rideDetails,
        seatsRequested,
        pickupLocation,
        phoneNumber
      });

      setIsJoined(true);
      
      // Reset and close after success message
      setTimeout(() => {
        setIsJoined(false);
        setSeatsRequested(1);
        setPickupLocation('');
        setPhoneNumber('');
        onOpenChange(false);
      }, 3000);

    } catch (error) {
      console.error('Failed to join ride:', error);
    } finally {
      setIsJoining(false);
    }
  };

  if (!rideDetails) return null;

  if (isJoined) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="glass-morphism border border-cabinet-yellow/30 max-w-md mx-auto">
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-display font-bold text-white mb-2">
              Ride Request Sent!
            </h3>
            <p className="text-cabinet-grey mb-4">
              {hostName} will contact you soon to confirm the ride details.
            </p>
            <p className="text-cabinet-yellow text-sm">
              Check your messages for updates
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-morphism border border-cabinet-yellow/30 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold text-cabinet-yellow text-gradient flex items-center space-x-2">
            <Car className="w-6 h-6" />
            <span>Join Ride</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Host Info */}
          <div className="glass-morphism p-4 rounded-xl border border-cabinet-yellow/20">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{hostAvatar}</div>
              <div>
                <h4 className="text-white font-semibold text-lg">{hostName}</h4>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-cabinet-grey">{hostRating} rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ride Details */}
          <div className="glass-morphism p-4 rounded-xl border border-cabinet-yellow/20">
            <h4 className="text-cabinet-yellow font-semibold mb-3">Ride Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-cabinet-yellow" />
                <div>
                  <div className="text-cabinet-grey">Route</div>
                  <div className="text-white font-medium">{rideDetails.from} → {rideDetails.to}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-cabinet-yellow" />
                <div>
                  <div className="text-cabinet-grey">Time</div>
                  <div className="text-white font-medium">{rideDetails.time} • {rideDetails.date}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-cabinet-yellow" />
                <div>
                  <div className="text-cabinet-grey">Available Seats</div>
                  <div className="text-white font-medium">{rideDetails.seats} seats</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-cabinet-yellow" />
                <div>
                  <div className="text-cabinet-grey">Cost per person</div>
                  <div className="text-cabinet-yellow font-bold">₹{Math.round(rideDetails.cost / 2)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Join Form */}
          <div className="space-y-4">
            <h4 className="text-cabinet-yellow font-semibold">Your Details</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-cabinet-grey text-sm">Seats Needed</label>
                <select
                  value={seatsRequested}
                  onChange={(e) => setSeatsRequested(Number(e.target.value))}
                  className="w-full px-4 py-3 glass-morphism border border-cabinet-yellow/30 rounded-lg text-white bg-black/20 focus:border-cabinet-yellow focus:outline-none"
                >
                  {Array.from({ length: rideDetails.seats }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num} className="bg-black">
                      {num} seat{num > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-cabinet-grey text-sm">Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cabinet-grey" />
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Your phone number"
                    className="pl-10 glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-cabinet-grey text-sm">Preferred Pickup Point</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cabinet-grey" />
                <Input
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="Enter your pickup location"
                  className="pl-10 glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white"
                  required
                />
              </div>
            </div>

            {/* Cost Summary */}
            <div className="glass-morphism p-4 rounded-xl border border-cabinet-yellow/20">
              <div className="flex items-center justify-between">
                <span className="text-cabinet-grey">Total Cost ({seatsRequested} seat{seatsRequested > 1 ? 's' : ''})</span>
                <span className="text-cabinet-yellow font-bold text-lg">
                  ₹{Math.round(rideDetails.cost / 2) * seatsRequested}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-cabinet-yellow/20">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1 border-cabinet-grey/50 text-cabinet-grey hover:bg-cabinet-grey/10"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleJoinRide}
              disabled={isJoining || !phoneNumber || !pickupLocation}
              className="flex-1 btn-premium"
            >
              {isJoining ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <Car className="w-4 h-4 mr-2" />
                  Join Ride
                </>
              )}
            </Button>
          </div>

          {/* Contact Options */}
          <div className="text-center pt-4 border-t border-cabinet-yellow/20">
            <p className="text-cabinet-grey text-sm mb-3">Want to discuss first?</p>
            <div className="flex justify-center space-x-4">
              <button className="flex items-center space-x-2 text-cabinet-yellow hover:text-cabinet-light-yellow transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">Message {hostName}</span>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
