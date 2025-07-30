import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useUnifiedAuth';
import { 
  HelpCircle, 
  Send, 
  X, 
  Phone, 
  Mail, 
  MessageCircle,
  AlertTriangle,
  Car,
  CreditCard,
  Clock,
  MapPin,
  User,
  CheckCircle
} from 'lucide-react';

interface HelpSupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HelpSupportDialog({ open, onOpenChange }: HelpSupportDialogProps) {
  const { authState } = useAuth();
  const [formData, setFormData] = useState({
    issueType: '',
    journeyDate: '',
    journeyFrom: '',
    journeyTo: '',
    driverName: '',
    paymentMethod: '',
    issueDescription: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const issueTypes = [
    { id: 'driver', label: 'Driver Related Issue', icon: User },
    { id: 'payment', label: 'Payment Problem', icon: CreditCard },
    { id: 'ride', label: 'Ride Experience', icon: Car },
    { id: 'timing', label: 'Timing/Delay Issue', icon: Clock },
    { id: 'location', label: 'Location Problem', icon: MapPin },
    { id: 'other', label: 'Other Issue', icon: AlertTriangle }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Support ticket submitted:', {
        user: authState.user?.name,
        email: authState.user?.email,
        ...formData,
        timestamp: new Date().toISOString()
      });

      setIsSubmitted(true);
      
      // Reset form after showing success
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          issueType: '',
          journeyDate: '',
          journeyFrom: '',
          journeyTo: '',
          driverName: '',
          paymentMethod: '',
          issueDescription: '',
          priority: 'medium'
        });
        onOpenChange(false);
      }, 3000);

    } catch (error) {
      console.error('Failed to submit support ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="glass-morphism border border-cabinet-yellow/30 max-w-md mx-auto">
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-display font-bold text-white mb-2">
              Support Ticket Submitted!
            </h3>
            <p className="text-cabinet-grey mb-4">
              We've received your report and will get back to you within 24 hours.
            </p>
            <p className="text-cabinet-yellow text-sm">
              Ticket ID: #CAB{Date.now().toString().slice(-6)}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-morphism border border-cabinet-yellow/30 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold text-cabinet-yellow text-gradient flex items-center space-x-2">
            <HelpCircle className="w-6 h-6" />
            <span>Help & Support</span>
          </DialogTitle>
          <p className="text-cabinet-grey">
            Report an issue with your journey or get help from our support team
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Issue Type */}
          <div className="space-y-3">
            <Label className="text-cabinet-yellow font-accent font-semibold">What can we help you with?</Label>
            <div className="grid grid-cols-2 gap-3">
              {issueTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, issueType: type.id })}
                  className={`p-4 rounded-xl border transition-all duration-300 flex items-center space-x-3 ${
                    formData.issueType === type.id
                      ? 'border-cabinet-yellow bg-cabinet-yellow/10 text-cabinet-yellow'
                      : 'border-cabinet-yellow/20 hover:border-cabinet-yellow/40 text-cabinet-grey hover:text-white'
                  }`}
                >
                  <type.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Journey Details */}
          <div className="space-y-4">
            <Label className="text-cabinet-yellow font-accent font-semibold">Journey Details</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="journeyDate" className="text-sm text-cabinet-grey">Journey Date</Label>
                <Input
                  id="journeyDate"
                  type="date"
                  value={formData.journeyDate}
                  onChange={(e) => setFormData({ ...formData, journeyDate: e.target.value })}
                  className="glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="driverName" className="text-sm text-cabinet-grey">Driver Name (if applicable)</Label>
                <Input
                  id="driverName"
                  value={formData.driverName}
                  onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                  placeholder="e.g. Rajesh Kumar"
                  className="glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="journeyFrom" className="text-sm text-cabinet-grey">From Location</Label>
                <Input
                  id="journeyFrom"
                  value={formData.journeyFrom}
                  onChange={(e) => setFormData({ ...formData, journeyFrom: e.target.value })}
                  placeholder="Pickup location"
                  className="glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="journeyTo" className="text-sm text-cabinet-grey">To Location</Label>
                <Input
                  id="journeyTo"
                  value={formData.journeyTo}
                  onChange={(e) => setFormData({ ...formData, journeyTo: e.target.value })}
                  placeholder="Drop location"
                  className="glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="paymentMethod" className="text-sm text-cabinet-grey">Payment Method Used</Label>
                <select
                  id="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-4 py-3 glass-morphism border border-cabinet-yellow/30 rounded-lg text-white bg-black/20 focus:border-cabinet-yellow focus:outline-none"
                >
                  <option value="" className="bg-black">Select payment method</option>
                  <option value="wallet" className="bg-black">CAB-I-NET Wallet</option>
                  <option value="card" className="bg-black">Credit/Debit Card</option>
                  <option value="upi" className="bg-black">UPI</option>
                  <option value="cash" className="bg-black">Cash</option>
                </select>
              </div>
            </div>
          </div>

          {/* Issue Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-cabinet-yellow font-accent font-semibold">
              Describe your issue in detail
            </Label>
            <Textarea
              id="description"
              value={formData.issueDescription}
              onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
              placeholder="Please provide as much detail as possible about the issue you experienced..."
              rows={4}
              className="glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white placeholder:text-cabinet-grey resize-none"
              required
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="text-cabinet-yellow font-accent font-semibold">Priority Level</Label>
            <div className="flex space-x-3">
              {['low', 'medium', 'high', 'urgent'].map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority })}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 capitalize ${
                    formData.priority === priority
                      ? priority === 'urgent' ? 'bg-red-500 text-white' :
                        priority === 'high' ? 'bg-orange-500 text-white' :
                        priority === 'medium' ? 'bg-cabinet-yellow text-black' :
                        'bg-green-500 text-white'
                      : 'glass-morphism border border-cabinet-yellow/30 text-cabinet-grey hover:text-white'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="glass-morphism p-4 rounded-xl border border-cabinet-yellow/20">
            <h4 className="text-cabinet-yellow font-semibold mb-2">Your Contact Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-cabinet-grey" />
                <span className="text-white">{authState.user?.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-cabinet-grey" />
                <span className="text-white">{authState.user?.phone}</span>
              </div>
              <p className="text-cabinet-grey text-xs mt-2">
                We'll use this information to follow up on your support request.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-cabinet-yellow/20">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1 border-cabinet-grey/50 text-cabinet-grey hover:bg-cabinet-grey/10"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.issueType || !formData.issueDescription}
              className="flex-1 btn-premium"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Ticket
                </>
              )}
            </Button>
          </div>

          {/* Quick Contact */}
          <div className="text-center pt-4 border-t border-cabinet-yellow/20">
            <p className="text-cabinet-grey text-sm mb-3">Need immediate assistance?</p>
            <div className="flex justify-center space-x-4">
              <a
                href="tel:+911800123456"
                className="flex items-center space-x-2 text-cabinet-yellow hover:text-cabinet-light-yellow transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">Call Support</span>
              </a>
              <a
                href="mailto:support@cabinet.com"
                className="flex items-center space-x-2 text-cabinet-yellow hover:text-cabinet-light-yellow transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">Email Us</span>
              </a>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
