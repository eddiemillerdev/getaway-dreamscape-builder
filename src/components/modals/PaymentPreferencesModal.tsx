
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CreditCardIcons from '../CreditCardIcons';

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

const PaymentPreferencesModal = ({ open, onClose }: PaymentPreferencesModalProps) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (open && user) {
      fetchPaymentMethods();
    }
  }, [open, user]);

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
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

      fetchPaymentMethods();
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

      fetchPaymentMethods();
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Preferences</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">No payment methods added yet</p>
              <Button onClick={onClose}>
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
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
              
              <Button variant="outline" className="w-full" onClick={onClose}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Payment Method
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentPreferencesModal;
