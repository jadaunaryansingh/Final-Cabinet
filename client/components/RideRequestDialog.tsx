import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { 
  Car, 
  MapPin, 
  Clock, 
  Calendar,
  Send, 
  X,
  CheckCircle,
  Users
} from 'lucide-react';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  level: string;
  rating: number;
}

interface RideRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friend: Friend | null;
}

export default function RideRequestDialog({ open, onOpenChange, friend }: RideRequestDialogProps) {
  const { authState } = useAuth();
  const [requestData, setRequestData] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    message: '',
    passengers: 1
  });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSendRequest = async () => {
    if (!requestData.from || !requestData.to || !requestData.date || !requestData.time) return;
    
    setIsSending(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Ride request sent:', {
        from: authState.user?.name,
        to: friend?.name,
        requestData,
        timestamp: new Date().toISOString()
      });

      setIsSent(true);
      
      // Reset and close after success message
      setTimeout(() => {
        setIsSent(false);
        setRequestData({
          from: '',
          to: '',
          date: '',
          time: '',
          message: '',
          passengers: 1
        });
        onOpenChange(false);
      }, 3000);

    } catch (error) {
      console.error('Failed to send ride request:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (!friend) return null;

  if (isSent) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="glass-morphism border border-cabinet-yellow/30 max-w-md mx-auto">
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-display font-bold text-white mb-2">
              Ride Request Sent!
            </h3>
            <p className="text-cabinet-grey mb-4">
              Your ride request has been sent to {friend.name}. They'll receive a notification and can respond.
            </p>
            <p className="text-cabinet-yellow text-sm">
              Check the Ride Requests tab for updates
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-morphism border border-cabinet-yellow/30 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold text-cabinet-yellow text-gradient flex items-center space-x-2">
            <Car className="w-6 h-6" />
            <span>Request Ride</span>
          </DialogTitle>
          <p className="text-cabinet-grey">
            Send a ride request to {friend.name}
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Friend Info */}
          <div className="glass-morphism p-4 rounded-xl border border-cabinet-yellow/20">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{friend.avatar}</div>
              <div>
                <h4 className="text-white font-semibold text-lg">{friend.name}</h4>
                <p className="text-cabinet-yellow text-sm">{friend.level}</p>
              </div>
            </div>
          </div>

          {/* Request Form */}
          <div className="space-y-4">
            <h4 className="text-cabinet-yellow font-semibold">Ride Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-cabinet-grey text-sm">From Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cabinet-grey" />
                  <Input
                    value={requestData.from}
                    onChange={(e) => setRequestData({ ...requestData, from: e.target.value })}
                    placeholder="Pickup location"
                    className="pl-10 glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-cabinet-grey text-sm">To Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cabinet-grey" />
                  <Input
                    value={requestData.to}
                    onChange={(e) => setRequestData({ ...requestData, to: e.target.value })}
                    placeholder="Drop location"
                    className="pl-10 glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-cabinet-grey text-sm">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cabinet-grey" />
                  <Input
                    type="date"
                    value={requestData.date}
                    min={getTomorrowDate()}
                    onChange={(e) => setRequestData({ ...requestData, date: e.target.value })}
                    className="pl-10 glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-cabinet-grey text-sm">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cabinet-grey" />
                  <Input
                    type="time"
                    value={requestData.time}
                    onChange={(e) => setRequestData({ ...requestData, time: e.target.value })}
                    className="pl-10 glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-cabinet-grey text-sm">Number of Passengers</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cabinet-grey" />
                  <select
                    value={requestData.passengers}
                    onChange={(e) => setRequestData({ ...requestData, passengers: Number(e.target.value) })}
                    className="w-full pl-10 pr-4 py-3 glass-morphism border border-cabinet-yellow/30 rounded-lg text-white bg-black/20 focus:border-cabinet-yellow focus:outline-none"
                  >
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num} className="bg-black">
                        {num} passenger{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-cabinet-grey text-sm">Message (Optional)</label>
              <Textarea
                value={requestData.message}
                onChange={(e) => setRequestData({ ...requestData, message: e.target.value })}
                placeholder={`Hi ${friend.name}, would you like to share a ride? Let me know if you're interested!`}
                rows={3}
                className="glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white placeholder:text-cabinet-grey resize-none"
                maxLength={300}
              />
              <div className="text-right">
                <span className="text-cabinet-grey text-xs">
                  {requestData.message.length}/300 characters
                </span>
              </div>
            </div>

            {/* Cost Estimate */}
            <div className="glass-morphism p-4 rounded-xl border border-cabinet-yellow/20">
              <h5 className="text-cabinet-yellow font-semibold mb-2">Estimated Details</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-cabinet-grey">Estimated Cost</div>
                  <div className="text-white font-medium">₹200-400 (split)</div>
                </div>
                <div>
                  <div className="text-cabinet-grey">Savings</div>
                  <div className="text-green-400 font-medium">₹100-200 each</div>
                </div>
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
              onClick={handleSendRequest}
              disabled={isSending || !requestData.from || !requestData.to || !requestData.date || !requestData.time}
              className="flex-1 btn-premium"
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
