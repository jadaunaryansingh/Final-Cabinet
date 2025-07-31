import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useUnifiedAuth';
import { 
  CreditCard, 
  Plus, 
  X, 
  Trash2,
  Edit,
  Check,
  Smartphone,
  Wallet,
  Banknote,
  Shield,
  Star
} from 'lucide-react';

interface PaymentMethodsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet' | 'bank';
  name: string;
  details: string;
  isDefault: boolean;
  icon: string;
  lastUsed?: string;
  balance?: number;
}

export default function PaymentMethodsDialog({ open, onOpenChange }: PaymentMethodsDialogProps) {
  const { authState, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'methods' | 'add' | 'wallet'>('methods');
  const [isAdding, setIsAdding] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    nickname: ''
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'HDFC Credit Card',
      details: '**** **** **** 1234',
      isDefault: true,
      icon: '💳',
      lastUsed: '2 days ago'
    },
    {
      id: '2',
      type: 'upi',
      name: 'PhonePe UPI',
      details: 'aryan@paytm',
      isDefault: false,
      icon: '📱',
      lastUsed: '1 week ago'
    },
    {
      id: '3',
      type: 'wallet',
      name: 'CAB-I-NET Wallet',
      details: 'Digital Wallet',
      isDefault: false,
      icon: '💰',
      balance: 2450,
      lastUsed: '3 days ago'
    }
  ]);

  const handleAddCard = async () => {
    setIsAdding(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newMethod: PaymentMethod = {
        id: Date.now().toString(),
        type: 'card',
        name: newCard.nickname || 'New Card',
        details: `**** **** **** ${newCard.cardNumber.slice(-4)}`,
        isDefault: false,
        icon: '💳'
      };

      setPaymentMethods(prev => [...prev, newMethod]);
      setNewCard({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardName: '',
        nickname: ''
      });
      setActiveTab('methods');
    } catch (error) {
      console.error('Failed to add payment method:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }))
    );

    const selectedMethod = paymentMethods.find(m => m.id === methodId);
    if (selectedMethod && authState.user) {
      updateUser({ preferredPayment: selectedMethod.name });
    }
  };

  const handleRemoveMethod = (methodId: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ');
    return formatted.trim();
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-morphism border border-cabinet-yellow/30 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold text-cabinet-yellow text-gradient flex items-center space-x-2">
            <CreditCard className="w-6 h-6" />
            <span>Payment Methods</span>
          </DialogTitle>
          <DialogDescription className="text-cabinet-grey">
            Manage your payment methods and wallet balance
          </DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mt-6 glass-morphism rounded-lg p-1 border border-cabinet-yellow/20">
          {[
            { id: 'methods', label: 'My Methods', icon: CreditCard },
            { id: 'add', label: 'Add New', icon: Plus },
            { id: 'wallet', label: 'Wallet', icon: Wallet }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
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

        <div className="mt-6">
          {/* Payment Methods Tab */}
          {activeTab === 'methods' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-accent font-semibold text-white">Saved Payment Methods</h3>
                <Button
                  onClick={() => setActiveTab('add')}
                  size="sm"
                  className="btn-premium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </Button>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      method.isDefault
                        ? 'border-cabinet-yellow bg-cabinet-yellow/10'
                        : 'border-cabinet-yellow/20 hover:border-cabinet-yellow/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{method.icon}</div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{method.name}</span>
                            {method.isDefault && (
                              <span className="bg-cabinet-yellow text-black px-2 py-1 rounded-full text-xs font-bold">
                                DEFAULT
                              </span>
                            )}
                          </div>
                          <div className="text-cabinet-grey text-sm">{method.details}</div>
                          {method.balance && (
                            <div className="text-cabinet-yellow text-sm font-semibold">
                              Balance: ₹{method.balance.toLocaleString()}
                            </div>
                          )}
                          {method.lastUsed && (
                            <div className="text-cabinet-grey text-xs">Last used: {method.lastUsed}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!method.isDefault && (
                          <Button
                            onClick={() => handleSetDefault(method.id)}
                            size="sm"
                            variant="outline"
                            className="border-cabinet-yellow/50 text-cabinet-yellow hover:bg-cabinet-yellow/10"
                          >
                            <Star className="w-3 h-3 mr-1" />
                            Set Default
                          </Button>
                        )}
                        {method.type !== 'wallet' && (
                          <Button
                            onClick={() => handleRemoveMethod(method.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Security Info */}
              <div className="glass-morphism p-4 rounded-xl border border-cabinet-yellow/20 mt-6">
                <div className="flex items-center space-x-3 mb-2">
                  <Shield className="w-5 h-5 text-cabinet-yellow" />
                  <span className="text-cabinet-yellow font-semibold">Security Information</span>
                </div>
                <p className="text-cabinet-grey text-sm">
                  All payment information is encrypted and securely stored. We never store your CVV or full card details.
                  Your default payment method will be used for automatic payments.
                </p>
              </div>
            </div>
          )}

          {/* Add New Payment Method Tab */}
          {activeTab === 'add' && (
            <div className="space-y-6">
              <h3 className="text-lg font-accent font-semibold text-white">Add New Payment Method</h3>

              {/* Quick Add Options */}
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 glass-morphism border border-cabinet-yellow/20 rounded-xl hover:border-cabinet-yellow/40 transition-all duration-300 flex items-center space-x-3">
                  <Smartphone className="w-6 h-6 text-cabinet-yellow" />
                  <div className="text-left">
                    <div className="text-white font-medium">UPI ID</div>
                    <div className="text-cabinet-grey text-sm">Link your UPI</div>
                  </div>
                </button>
                <button className="p-4 glass-morphism border border-cabinet-yellow/20 rounded-xl hover:border-cabinet-yellow/40 transition-all duration-300 flex items-center space-x-3">
                  <Banknote className="w-6 h-6 text-cabinet-yellow" />
                  <div className="text-left">
                    <div className="text-white font-medium">Net Banking</div>
                    <div className="text-cabinet-grey text-sm">Add bank account</div>
                  </div>
                </button>
              </div>

              {/* Add Credit/Debit Card */}
              <div className="space-y-4">
                <h4 className="text-cabinet-yellow font-semibold">Add Credit/Debit Card</h4>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="text-sm text-cabinet-grey">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={newCard.cardNumber}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value);
                        if (formatted.replace(/\s/g, '').length <= 16) {
                          setNewCard({ ...newCard, cardNumber: formatted });
                        }
                      }}
                      placeholder="1234 5678 9012 3456"
                      className="glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate" className="text-sm text-cabinet-grey">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        value={newCard.expiryDate}
                        onChange={(e) => {
                          const formatted = formatExpiryDate(e.target.value);
                          if (formatted.length <= 5) {
                            setNewCard({ ...newCard, expiryDate: formatted });
                          }
                        }}
                        placeholder="MM/YY"
                        className="glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white"
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-sm text-cabinet-grey">CVV</Label>
                      <Input
                        id="cvv"
                        type="password"
                        value={newCard.cvv}
                        onChange={(e) => {
                          if (e.target.value.length <= 4) {
                            setNewCard({ ...newCard, cvv: e.target.value });
                          }
                        }}
                        placeholder="123"
                        className="glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName" className="text-sm text-cabinet-grey">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      value={newCard.cardName}
                      onChange={(e) => setNewCard({ ...newCard, cardName: e.target.value })}
                      placeholder="Name on card"
                      className="glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nickname" className="text-sm text-cabinet-grey">Nickname (Optional)</Label>
                    <Input
                      id="nickname"
                      value={newCard.nickname}
                      onChange={(e) => setNewCard({ ...newCard, nickname: e.target.value })}
                      placeholder="e.g. My HDFC Card"
                      className="glass-morphism border-cabinet-yellow/30 focus:border-cabinet-yellow bg-black/20 text-white"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={() => setActiveTab('methods')}
                    variant="outline"
                    className="flex-1 border-cabinet-grey/50 text-cabinet-grey hover:bg-cabinet-grey/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddCard}
                    disabled={isAdding || !newCard.cardNumber || !newCard.expiryDate || !newCard.cvv || !newCard.cardName}
                    className="flex-1 btn-premium"
                  >
                    {isAdding ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Card
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Wallet Tab */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-cabinet-yellow to-cabinet-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-10 h-10 text-black" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">CAB-I-NET Wallet</h3>
                <div className="text-3xl font-bold text-cabinet-yellow mb-4">
                  ₹{paymentMethods.find(m => m.type === 'wallet')?.balance?.toLocaleString() || '0'}
                </div>
                <p className="text-cabinet-grey">Available Balance</p>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <Button className="btn-premium py-4">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Money
                </Button>
                <Button variant="outline" className="border-cabinet-yellow/50 text-cabinet-yellow hover:bg-cabinet-yellow/10 py-4">
                  <X className="w-5 h-5 mr-2" />
                  Send Money
                </Button>
              </div>

              {/* Recent Transactions */}
              <div className="space-y-4">
                <h4 className="text-cabinet-yellow font-semibold">Recent Transactions</h4>
                <div className="space-y-3">
                  {[
                    { type: 'debit', amount: 450, description: 'Ride Payment - Airport', date: '2 days ago' },
                    { type: 'credit', amount: 1000, description: 'Wallet Top-up', date: '5 days ago' },
                    { type: 'debit', amount: 320, description: 'Ride Payment - Mall', date: '1 week ago' }
                  ].map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 glass-morphism rounded-lg border border-cabinet-yellow/10">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          transaction.type === 'credit' ? 'bg-green-400' : 'bg-red-400'
                        }`} />
                        <div>
                          <div className="text-white text-sm font-medium">{transaction.description}</div>
                          <div className="text-cabinet-grey text-xs">{transaction.date}</div>
                        </div>
                      </div>
                      <div className={`font-semibold ${
                        transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-6 border-t border-cabinet-yellow/20">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="border-cabinet-grey/50 text-cabinet-grey hover:bg-cabinet-grey/10"
          >
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
