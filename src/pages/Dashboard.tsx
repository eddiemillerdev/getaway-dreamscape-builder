import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users, Settings, CreditCard, MessageSquare, UserPlus, Wallet } from 'lucide-react';
import { format } from 'date-fns';
import TripDetailsModal from '@/components/modals/TripDetailsModal';
import EditProfileModal from '@/components/modals/EditProfileModal';
import PaymentPreferencesModal from '@/components/modals/PaymentPreferencesModal';
import HostRequestModal from '@/components/modals/HostRequestModal';
import WalletSection from '@/components/WalletSection';

interface Booking {
  id: string;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  total_amount: number;
  status: string;
  properties: {
    id: string;
    title: string;
    address: string;
  };
}

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  bio: string;
  is_host: boolean;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('trips');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [paymentPreferencesOpen, setPaymentPreferencesOpen] = useState(false);
  const [hostRequestOpen, setHostRequestOpen] = useState(false);
  
  const { user, signOut } = useAuth();

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) {
      console.log('No user found, redirecting to auth');
      return;
    }

    setLoading(true);
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch user bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          check_in_date,
          check_out_date,
          guests,
          total_amount,
          status,
          properties(id, title, address)
        `)
        .eq('user_id', user.id)
        .order('check_in_date', { ascending: false });

      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="h-96 bg-gray-300 rounded"></div>
              <div className="lg:col-span-3 h-96 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.first_name || 'User'}!
          </h1>
          <p className="text-gray-600 mt-2">Manage your bookings and account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
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
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'trips' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2" />
                    My Trips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <CalendarDays className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No trips yet</h3>
                      <p className="text-gray-600 mb-6">When you book your first trip, it will appear here.</p>
                      <Button>Start exploring</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div key={booking.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-medium">{booking.properties.title}</h3>
                                <Badge 
                                  variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                                  className={booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                                >
                                  {booking.status}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center text-gray-600 mb-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span className="text-sm">{booking.properties.address}</span>
                              </div>
                              
                              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                                <div className="flex items-center">
                                  <CalendarDays className="h-4 w-4 mr-1" />
                                  {format(new Date(booking.check_in_date), 'MMM dd')} - {format(new Date(booking.check_out_date), 'MMM dd, yyyy')}
                                </div>
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold">${booking.total_amount}</span>
                                <Button
                                  variant="outline"
                                  onClick={() => setSelectedBooking(booking)}
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'wallet' && <WalletSection />}

            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    My Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <p className="text-gray-900">{profile?.first_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <p className="text-gray-900">{profile?.last_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{profile?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-gray-900">{profile?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  {profile?.bio && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <p className="text-gray-900">{profile.bio}</p>
                    </div>
                  )}
                  
                  <div className="flex space-x-4">
                    <Button onClick={() => setEditProfileOpen(true)}>
                      Edit Profile
                    </Button>
                    
                    {!profile?.is_host && (
                      <Button
                        variant="outline"
                        onClick={() => setHostRequestOpen(true)}
                        className="flex items-center"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Request to be a Host
                      </Button>
                    )}
                    
                    {profile?.is_host && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 py-2 px-4">
                        Host Account
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Modals */}
      <TripDetailsModal
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        booking={selectedBooking}
      />

      <EditProfileModal
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        onSuccess={() => {
          setEditProfileOpen(false);
          fetchData();
        }}
      />

      <PaymentPreferencesModal
        open={paymentPreferencesOpen}
        onClose={() => setPaymentPreferencesOpen(false)}
      />

      <HostRequestModal
        open={hostRequestOpen}
        onClose={() => setHostRequestOpen(false)}
        onSuccess={() => {
          setHostRequestOpen(false);
          fetchData();
        }}
      />
    </div>
  );
};

export default Dashboard;
