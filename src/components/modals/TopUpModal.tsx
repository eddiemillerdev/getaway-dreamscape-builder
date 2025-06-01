
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bitcoin, Building, Copy, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TopUpModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TopUpModal = ({ open, onClose, onSuccess }: TopUpModalProps) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const cryptoAddress = "1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S";
  const bankDetails = {
    bankName: "Demo Bank",
    accountName: "Lovable Homes Ltd",
    accountNumber: "123456789",
    routingNumber: "987654321",
    swift: "DEMOLRUS"
  };

  const handleCryptoTopUp = async () => {
    if (!amount || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          amount: parseFloat(amount),
          transaction_type: 'topup_crypto',
          status: 'pending',
          reference_id: `crypto_${Date.now()}`
        });

      if (error) throw error;

      toast({
        title: 'Top-up Request Submitted',
        description: 'Your crypto top-up request has been submitted. It will be processed once the payment is confirmed.',
      });

      setAmount('');
      onClose();
      onSuccess();
    } catch (error: any) {
      console.error('Error creating crypto top-up:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit top-up request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBankWireTopUp = async () => {
    if (!amount || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          amount: parseFloat(amount),
          transaction_type: 'topup_wire',
          status: 'pending',
          reference_id: `wire_${Date.now()}`
        });

      if (error) throw error;

      toast({
        title: 'Top-up Request Submitted',
        description: 'Your bank wire top-up request has been submitted. Please use the provided banking details for the transfer.',
      });

      setAmount('');
      onClose();
      onSuccess();
    } catch (error: any) {
      console.error('Error creating bank wire top-up:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit top-up request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Funds to Wallet</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="crypto" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="crypto" className="flex items-center">
              <Bitcoin className="h-4 w-4 mr-2" />
              Crypto
            </TabsTrigger>
            <TabsTrigger value="wire" className="flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Bank Wire
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="crypto" className="space-y-4">
            <div>
              <Label htmlFor="crypto-amount">Amount (USD)</Label>
              <Input
                id="crypto-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
                min="10"
                step="0.01"
              />
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium mb-2">Send payment to:</p>
              <div className="flex items-center justify-between bg-white p-3 rounded border">
                <code className="text-xs flex-1 mr-2">{cryptoAddress}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(cryptoAddress)}
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Send exactly ${amount || '0.00'} worth of Bitcoin to this address. 
                Your wallet will be credited once the transaction is confirmed.
              </p>
            </div>
            
            <Button 
              onClick={handleCryptoTopUp}
              disabled={!amount || loading}
              className="w-full"
            >
              {loading ? 'Processing...' : 'Submit Crypto Top-up'}
            </Button>
          </TabsContent>
          
          <TabsContent value="wire" className="space-y-4">
            <div>
              <Label htmlFor="wire-amount">Amount (USD)</Label>
              <Input
                id="wire-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
                min="10"
                step="0.01"
              />
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <p className="text-sm font-medium mb-2">Wire transfer details:</p>
              <div className="space-y-1 text-sm">
                <p><strong>Bank:</strong> {bankDetails.bankName}</p>
                <p><strong>Account Name:</strong> {bankDetails.accountName}</p>
                <p><strong>Account Number:</strong> {bankDetails.accountNumber}</p>
                <p><strong>Routing Number:</strong> {bankDetails.routingNumber}</p>
                <p><strong>SWIFT:</strong> {bankDetails.swift}</p>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Please include your user ID ({user?.id}) in the wire transfer reference.
                Processing time: 1-3 business days.
              </p>
            </div>
            
            <Button 
              onClick={handleBankWireTopUp}
              disabled={!amount || loading}
              className="w-full"
            >
              {loading ? 'Processing...' : 'Submit Wire Transfer Request'}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TopUpModal;
