
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Plus, CreditCard, Wallet } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CreditCardIcons from '../CreditCardIcons';
import PaymentMethodModal from '../PaymentMethodModal';

interface PaymentPreferencesModalProps {
  open: boolean;
  onClose: () => void;
}

interface PaymentMethod {
  id: string;
  card_last_four: string;
  card_brand: string;
  expiry_month: number;
  expiry_year: number;
  cardholder_name: string;
  is_default: boolean;
}

interface UserWallet {
  id: string;
  balance: number;
  preferred_payment_method: string;
}

const PaymentPreferencesModal = ({ open, onClose }: PaymentPreferencesModalProps) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [loading, setLoading] = useState(false);
  const [addCardOpen, setAddCardOpen] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (open && user) {
      fetchPaymentData();
    }
  }, [open, user]);

  const fetchPaymentData = async () => {
    try {
      // Fetch payment methods
      const { data: methods, error: methodsError } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (methodsError) throw methodsError;
      setPaymentMethods(methods || []);

      // Fetch or create wallet
      let { data: walletData } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (!walletData) {
        const { data: newWallet, error } = await supabase
          .from('user_wallets')
          .insert({ user_id: user?.id })
          .select('*')
          .single();

        if (error) throw error;
        walletData = newWallet;
      }

      setWallet(walletData);
    } catch (error) {
      console.error('Error fetching payment data:', error);
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Payment Method Deleted',
        description: 'The payment method has been removed.',
      });

      fetchPaymentData();
    } catch (error: any) {
      console.error('Error deleting payment method:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete payment method',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    setLoading(true);
    
    try {
      // First, unset all default flags
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', user?.id);

      // Then set the selected one as default
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Default Payment Method Updated',
        description: 'This payment method is now your default.',
      });

      fetchPaymentData();
    } catch (error: any) {
      console.error('Error setting default payment method:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update default payment method',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetWalletAsDefault = async () => {
    setLoading(true);
    
    try {
      // Unset all payment method defaults
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', user?.id);

      // Set wallet as preferred
      const { error } = await supabase
        .from('user_wallets')
        .update({ preferred_payment_method: 'wallet' })
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: 'Wallet Set as Default',
        description: 'Your wallet is now your default payment method.',
      });

      fetchPaymentData();
    } catch (error: any) {
      console.error('Error setting wallet as default:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update payment preference',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Preferences</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="cards" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cards">Credit Cards</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cards" className="space-y-4">
              {paymentMethods.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">No payment methods added yet</p>
                  <Button onClick={() => setAddCardOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Credit Card
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <Card key={method.id} className={method.is_default ? 'border-teal-500' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <CreditCardIcons type={method.card_brand} className="h-8 w-8" />
                            <div>
                              <p className="font-medium">**** **** **** {method.card_last_four}</p>
                              <p className="text-sm text-gray-500">
                                {method.cardholder_name} • {method.expiry_month.toString().padStart(2, '0')}/{method.expiry_year.toString().slice(-2)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {method.is_default && (
                              <Badge variant="secondary">Default</Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePaymentMethod(method.id)}
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {!method.is_default && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => handleSetDefault(method.id)}
                            disabled={loading}
                          >
                            Set as Default
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button variant="outline" className="w-full" onClick={() => setAddCardOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Credit Card
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="wallet" className="space-y-4">
              <Card className={wallet?.preferred_payment_method === 'wallet' ? 'border-teal-500' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Wallet className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Account Wallet</p>
                        <p className="text-sm text-gray-500">Balance: ${wallet?.balance || '0.00'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {wallet?.preferred_payment_method === 'wallet' && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                  </div>
                  {wallet?.preferred_payment_method !== 'wallet' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={handleSetWalletAsDefault}
                      disabled={loading}
                    >
                      Set as Default Payment Method
                    </Button>
                  )}
                </CardContent>
              </Card>
              
              <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                <p><strong>Note:</strong> When wallet is selected as your default payment method, 
                payments will be deducted from your wallet balance. Make sure you have sufficient funds.</p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <PaymentMethodModal
        open={addCardOpen}
        onClose={() => setAddCardOpen(false)}
        onSuccess={() => {
          setAddCardOpen(false);
          fetchPaymentData();
        }}
      />
    </>
  );
};

export default PaymentPreferencesModal;
