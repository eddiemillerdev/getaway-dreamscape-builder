
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Plus, Bitcoin, Building } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import TopUpModal from './modals/TopUpModal';

interface UserWallet {
  id: string;
  balance: number;
  preferred_payment_method: string;
}

interface Transaction {
  id: string;
  amount: number;
  transaction_type: string;
  status: string;
  created_at: string;
}

const WalletSection = () => {
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWalletData();
    }
  }, [user]);

  const fetchWalletData = async () => {
    if (!user) return;

    try {
      // Fetch or create wallet
      let { data: walletData } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!walletData) {
        const { data: newWallet, error } = await supabase
          .from('user_wallets')
          .insert({ user_id: user.id })
          .select('*')
          .single();

        if (error) throw error;
        walletData = newWallet;
      }

      setWallet(walletData);

      // Fetch transactions
      const { data: transactionsData } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setTransactions(transactionsData || []);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="h-5 w-5 mr-2" />
            Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="h-5 w-5 mr-2" />
            Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Balance */}
          <div className="text-center py-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Available Balance</p>
            <p className="text-4xl font-bold text-gray-900">${wallet?.balance || '0.00'}</p>
          </div>

          {/* Top Up Options */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Add Funds</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => setTopUpOpen(true)}
                className="flex flex-col items-center p-4 h-auto"
              >
                <Bitcoin className="h-6 w-6 mb-2" />
                <span className="text-sm">Crypto</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setTopUpOpen(true)}
                className="flex flex-col items-center p-4 h-auto"
              >
                <Building className="h-6 w-6 mb-2" />
                <span className="text-sm">Bank Wire</span>
              </Button>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Recent Transactions</h3>
            {transactions.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">No transactions yet</p>
            ) : (
              <div className="space-y-2">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {transaction.transaction_type.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        transaction.transaction_type.includes('topup') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.transaction_type.includes('topup') ? '+' : '-'}${transaction.amount}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{transaction.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <TopUpModal
        open={topUpOpen}
        onClose={() => setTopUpOpen(false)}
        onSuccess={fetchWalletData}
      />
    </>
  );
};

export default WalletSection;
