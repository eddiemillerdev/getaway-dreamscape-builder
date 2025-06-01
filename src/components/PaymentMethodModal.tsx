import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, University, Bitcoin, Calendar, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CreditCardIcons from './CreditCardIcons';
import { 
  getCreditCardType, 
  formatCreditCard, 
  formatExpiryDate, 
  validateCreditCard, 
  validateExpiryDate 
} from '@/utils/creditCard';

interface PaymentMethod {
  type: string;
  details: string;
  name: string;
  brand: string;
}

interface PaymentMethodModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (paymentData: PaymentMethod) => void;
  onSuccess?: () => void;
}

const PaymentMethodModal = ({ open, onClose, onSave, onSuccess }: PaymentMethodModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState<'credit' | 'wire' | 'crypto'>('credit');
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [errors, setErrors] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  
  const { user } = useAuth();
  const { toast } = useToast();
  const cardType = getCreditCardType(cardData.number);

  const validateForm = () => {
    const newErrors = { number: '', expiry: '', cvv: '', name: '' };
    let isValid = true;

    if (selectedMethod === 'credit') {
      if (!cardData.name.trim()) {
        newErrors.name = 'Cardholder name is required';
        isValid = false;
      }

      if (!validateCreditCard(cardData.number)) {
        newErrors.number = 'Invalid credit card number';
        isValid = false;
      }

      if (!validateExpiryDate(cardData.expiry)) {
        newErrors.expiry = 'Invalid expiry date';
        isValid = false;
      }

      if (cardData.cvv.length < 3) {
        newErrors.cvv = 'Invalid CVV';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCreditCard(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 19) {
      setCardData({ ...cardData, number: formatted });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setCardData({ ...cardData, expiry: formatted });
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (selectedMethod === 'credit') {
        // Save credit card to database
        const cleanNumber = cardData.number.replace(/\s/g, '');
        const [month, year] = cardData.expiry.split('/');
        
        const { error } = await supabase
          .from('payment_methods')
          .insert({
            user_id: user?.id,
            card_last_four: cleanNumber.slice(-4),
            card_brand: cardType,
            expiry_month: parseInt(month),
            expiry_year: parseInt(year) + 2000,
            cardholder_name: cardData.name,
            is_default: true
          });

        if (error) throw error;

        toast({
          title: 'Payment Method Saved',
          description: 'Your credit card has been saved for future use.',
        });

        // Call onSave for booking flow or onSuccess for settings flow
        if (onSave) {
          onSave({
            type: 'Credit Card',
            details: `**** **** **** ${cleanNumber.slice(-4)}`,
            name: cardData.name,
            brand: cardType
          });
        }
      }
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error: unknown) {
      console.error('Error saving payment method:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save payment method',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Method</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Payment Method Selection */}
          <div className="space-y-3">
            <div 
              role="button"
              tabIndex={0}
              className={`w-full border rounded-lg p-3 text-left transition-colors cursor-pointer ${selectedMethod === 'credit' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}
              onClick={() => setSelectedMethod('credit')}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedMethod('credit')}
            >
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5" />
                <span className="font-medium">Credit Card</span>
              </div>
            </div>
            
            <div 
              role="button"
              tabIndex={0}
              className={`w-full border rounded-lg p-3 text-left transition-colors cursor-pointer ${selectedMethod === 'wire' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}
              onClick={() => setSelectedMethod('wire')}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedMethod('wire')}
            >
              <div className="flex items-center space-x-3">
                <University className="h-5 w-5" />
                <span className="font-medium">Bank Wire</span>
              </div>
            </div>
            
            <div 
              role="button"
              tabIndex={0}
              className={`w-full border rounded-lg p-3 text-left transition-colors cursor-pointer ${selectedMethod === 'crypto' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}
              onClick={() => setSelectedMethod('crypto')}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedMethod('crypto')}
            >
              <div className="flex items-center space-x-3">
                <Bitcoin className="h-5 w-5" />
                <span className="font-medium">Cryptocurrency</span>
              </div>
            </div>
          </div>

          {/* Credit Card Form */}
          {selectedMethod === 'credit' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  value={cardData.name}
                  onChange={(e) => setCardData({...cardData, name: e.target.value})}
                  placeholder="John Doe"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    value={cardData.number}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    className={`pl-12 ${errors.number ? 'border-red-500' : ''}`}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <CreditCardIcons type={cardType} className="h-6 w-6" />
                  </div>
                </div>
                {errors.number && <p className="text-sm text-red-500 mt-1">{errors.number}</p>}
                {cardType !== 'unknown' && cardData.number && (
                  <p className="text-sm text-gray-600 mt-1 capitalize">{cardType} Card</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <div className="relative">
                    <Input
                      id="expiry"
                      value={cardData.expiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className={`pl-10 ${errors.expiry ? 'border-red-500' : ''}`}
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.expiry && <p className="text-sm text-red-500 mt-1">{errors.expiry}</p>}
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <div className="relative">
                    <Input
                      id="cvv"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4)})}
                      placeholder="123"
                      className={`pl-10 ${errors.cvv ? 'border-red-500' : ''}`}
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.cvv && <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>}
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'wire' && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Bank wire transfer instructions will be provided after booking confirmation.
              </p>
            </div>
          )}

          {selectedMethod === 'crypto' && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Bitcoin payment address will be provided after booking confirmation.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Payment Method'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodModal;
