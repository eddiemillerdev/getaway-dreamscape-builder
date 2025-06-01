
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, University, Bitcoin } from 'lucide-react';

interface PaymentMethodModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (paymentData: any) => void;
}

const PaymentMethodModal = ({ open, onClose, onSave }: PaymentMethodModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState<'credit' | 'wire' | 'crypto'>('credit');
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const handleSave = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let paymentData;
    
    if (selectedMethod === 'credit') {
      paymentData = {
        type: 'Credit Card',
        details: `**** **** **** ${cardData.number.slice(-4)}`,
        name: cardData.name
      };
    } else if (selectedMethod === 'wire') {
      paymentData = {
        type: 'Bank Wire',
        details: 'Wire transfer details will be provided',
        name: 'Bank Transfer'
      };
    } else {
      paymentData = {
        type: 'Cryptocurrency',
        details: 'Bitcoin payment address will be provided',
        name: 'Bitcoin'
      };
    }
    
    onSave(paymentData);
    setLoading(false);
    onClose();
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
              className={`border rounded-lg p-3 cursor-pointer ${selectedMethod === 'credit' ? 'border-rose-500 bg-rose-50' : 'border-gray-200'}`}
              onClick={() => setSelectedMethod('credit')}
            >
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5" />
                <span className="font-medium">Credit Card</span>
              </div>
            </div>
            
            <div 
              className={`border rounded-lg p-3 cursor-pointer ${selectedMethod === 'wire' ? 'border-rose-500 bg-rose-50' : 'border-gray-200'}`}
              onClick={() => setSelectedMethod('wire')}
            >
              <div className="flex items-center space-x-3">
                <University className="h-5 w-5" />
                <span className="font-medium">Bank Wire</span>
              </div>
            </div>
            
            <div 
              className={`border rounded-lg p-3 cursor-pointer ${selectedMethod === 'crypto' ? 'border-rose-500 bg-rose-50' : 'border-gray-200'}`}
              onClick={() => setSelectedMethod('crypto')}
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
                />
              </div>
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={cardData.number}
                  onChange={(e) => setCardData({...cardData, number: e.target.value.replace(/\D/g, '').slice(0, 16)})}
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    value={cardData.cvv}
                    onChange={(e) => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 3)})}
                    placeholder="123"
                  />
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
              disabled={loading || (selectedMethod === 'credit' && (!cardData.name || !cardData.number || !cardData.expiry || !cardData.cvv))}
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
