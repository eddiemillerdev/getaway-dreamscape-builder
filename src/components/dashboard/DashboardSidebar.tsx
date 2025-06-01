
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Settings, CreditCard, UserPlus, Wallet, MessageCircle } from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  bio: string;
  is_host: boolean;
}

interface DashboardSidebarProps {
  profile: Profile | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setPaymentPreferencesOpen: (open: boolean) => void;
  setHostRequestOpen: (open: boolean) => void;
}

const DashboardSidebar = ({
  profile,
  activeTab,
  setActiveTab,
  setPaymentPreferencesOpen,
  setHostRequestOpen
}: DashboardSidebarProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-lg font-medium text-gray-600">
                {profile?.first_name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h3 className="font-medium">{profile?.first_name} {profile?.last_name}</h3>
              <p className="text-sm text-gray-600">{profile?.email}</p>
            </div>
          </div>
        </div>
        
        <nav className="p-2">
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('trips')}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === 'trips' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CalendarDays className="h-5 w-5 mr-3" />
              My Trips
            </button>
            
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === 'messages' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MessageCircle className="h-5 w-5 mr-3" />
              Messages
            </button>
            
            <button
              onClick={() => setActiveTab('wallet')}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === 'wallet' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Wallet className="h-5 w-5 mr-3" />
              Wallet
            </button>
            
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="h-5 w-5 mr-3" />
              My Profile
            </button>
            
            <button
              onClick={() => setPaymentPreferencesOpen(true)}
              className="w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
            >
              <CreditCard className="h-5 w-5 mr-3" />
              Payment Preferences
            </button>
          </div>
        </nav>
      </CardContent>
    </Card>
  );
};

export default DashboardSidebar;
