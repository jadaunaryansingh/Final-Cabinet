import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useUnifiedAuth';
import { Camera, Save, X, Phone, Mail, MapPin, CreditCard } from 'lucide-react';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const { authState, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    emergencyContact: '',
    preferredPayment: '',
    avatar: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (authState.user) {
      setFormData({
        name: authState.user.name,
        email: authState.user.email,
        phone: authState.user.phone,
        emergencyContact: authState.user.emergencyContact || '',
        preferredPayment: authState.user.preferredPayment,
        avatar: authState.user.avatar || ''
      });
    }
  }, [authState.user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUser(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = () => {
    // In a real app, this would open a file picker or camera
    const avatars = [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    ];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    setFormData({ ...formData, avatar: randomAvatar });
  };

  if (!authState.user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-morphism border border-cabinet-yellow/30 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold text-cabinet-yellow text-gradient flex items-center space-x-2">
            <span>Edit Profile</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-2 border-cabinet-yellow/50">
                <AvatarImage src={formData.avatar} alt={formData.name} />
                <AvatarFallback className="bg-cabinet-yellow/20 text-cabinet-yellow text-xl font-bold">
                  {formData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={handleAvatarChange}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-cabinet-yellow rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">{authState.user.name}</h3>
              <p className="text-cabinet-grey text-sm">{authState.user.level}</p>
              <button
                type="button"
                onClick={handleAvatarChange}
                className="text-cabinet-yellow text-sm hover:text-cabinet-light-yellow transition-colors"
              >
                Change photo
              </button>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="text-cabinet-yellow font-accent font-semibold">Personal Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-accent font-medium text-cabinet-yellow">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-accent font-medium text-cabinet-yellow">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cabinet-grey" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-accent font-medium text-cabinet-yellow">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cabinet-grey" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10 glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency" className="text-sm font-accent font-medium text-cabinet-yellow">
                  Emergency Contact
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cabinet-grey" />
                  <Input
                    id="emergency"
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="pl-10 glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Preferences */}
          <div className="space-y-4">
            <h4 className="text-cabinet-yellow font-accent font-semibold">Payment Preferences</h4>
            
            <div className="space-y-2">
              <Label htmlFor="payment" className="text-sm font-accent font-medium text-cabinet-yellow">
                Preferred Payment Method
              </Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cabinet-grey" />
                <select
                  id="payment"
                  value={formData.preferredPayment}
                  onChange={(e) => setFormData({ ...formData, preferredPayment: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 glass-morphism border border-cabinet-yellow/30 rounded-lg text-white bg-black/20 focus:border-cabinet-yellow focus:outline-none"
                >
                  <option value="UPI" className="bg-black text-white">UPI</option>
                  <option value="Card" className="bg-black text-white">Credit/Debit Card</option>
                  <option value="Wallet" className="bg-black text-white">CAB-I-NET Wallet</option>
                  <option value="Cash" className="bg-black text-white">Cash</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4">
            <h4 className="text-cabinet-yellow font-accent font-semibold">Privacy & Security</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 glass-morphism rounded-lg border border-cabinet-yellow/20">
                <div>
                  <p className="text-white font-medium">Share location with drivers</p>
                  <p className="text-cabinet-grey text-sm">Allow drivers to see your location during rides</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-cabinet-yellow" />
              </div>
              
              <div className="flex items-center justify-between p-4 glass-morphism rounded-lg border border-cabinet-yellow/20">
                <div>
                  <p className="text-white font-medium">SMS notifications</p>
                  <p className="text-cabinet-grey text-sm">Receive ride updates via SMS</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-cabinet-yellow" />
              </div>
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
              disabled={isLoading}
              className="flex-1 btn-premium"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
