
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Star, CreditCard, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import TripDetailsModal from '@/components/modals/TripDetailsModal';
import EditProfileModal from '@/components/modals/EditProfileModal';
import HostRequestModal from '@/components/modals/HostRequestModal';
import PaymentPreferencesModal from '@/components/modals/PaymentPreferencesModal';

interface Booking {
  id: string;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  total_amount: number;
  status: string;
  properties: {
    title: string;
    property_type: string;
    address: string;
  };
}

interface Profile {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  bio: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [tripModalOpen, setTripModalOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [hostRequestModalOpen, setHostRequestModalOpen] = useState(false);
  const [paymentPreferencesModalOpen, setPaymentPreferencesModalOpen] = useState(false);
  const [hostRequestStatus, setHostRequestStatus] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      navigate('/auth');
    }
  }, [user, navigate]);

  const fetchUserData = async () => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      // Fetch bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          properties (
            title,
            property_type,
            address
          )
        `)
        .eq('guest_id', user?.id)
        .order('created_at', { ascending: false });

      // Check host request status
      const { data: hostRequestData } = await supabase
        .from('host_requests')
        .select('status')
        .eq('user_id', user?.id)
        .single();

      setProfile(profileData);
      setBookings(bookingsData || []);
      setHostRequestStatus(hostRequestData?.status || null);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTripDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setTripModalOpen(true);
  };

  const handleHostRequestSubmitted = () => {
    setHostRequestStatus('pending');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.first_name}!
          </h1>
          <p className="text-gray-600">Manage your trips and account settings</p>
        </div>

        <Tabs defaultValue="trips" className="space-y-6">
          <TabsList>
            <TabsTrigger value="trips">My Trips</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="trips" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Reservations</CardTitle>
                <CardDescription>
                  View and manage your upcoming and past trips
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No trips booked yet</p>
                    <Button onClick={() => navigate('/')}>Start Exploring</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="border-l-4 border-l-teal-500">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold text-lg">
                                  {booking.properties.title}
                                </h3>
                                <Badge className={getStatusColor(booking.status)}>
                                  {booking.status}
                                </Badge>
                              </div>
                              <p className="text-gray-600 mb-2">{booking.properties.property_type}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {format(new Date(booking.check_in_date), 'MMM dd')} - {format(new Date(booking.check_out_date), 'MMM dd')}
                                </div>
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {booking.properties.address}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold">${booking.total_amount}</p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-2"
                                onClick={() => handleViewTripDetails(booking)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Your personal details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">First Name</label>
                    <p className="text-lg">{profile?.first_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                    <p className="text-lg">{profile?.last_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-lg">{profile?.email || user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-lg">{profile?.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Bio</label>
                  <p className="text-lg">{profile?.bio || 'No bio provided'}</p>
                </div>
                
                <div className="flex space-x-3">
                  <Button onClick={() => setEditProfileModalOpen(true)}>
                    Edit Profile
                  </Button>
                  
                  {!hostRequestStatus ? (
                    <Button 
                      variant="outline" 
                      onClick={() => setHostRequestModalOpen(true)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Request to be a Host
                    </Button>
                  ) : (
                    <Button variant="outline" disabled>
                      Host Request: {hostRequestStatus}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Payment Preferences</h4>
                    <p className="text-sm text-gray-600 mb-4">Manage your saved payment methods</p>
                    <Button 
                      variant="outline"
                      onClick={() => setPaymentPreferencesModalOpen(true)}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Manage Payment Methods
                    </Button>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Notifications</h4>
                    <p className="text-sm text-gray-600 mb-4">Choose what notifications you'd like to receive</p>
                    <Button variant="outline">Manage Notifications</Button>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Privacy</h4>
                    <p className="text-sm text-gray-600 mb-4">Control your privacy and data sharing preferences</p>
                    <Button variant="outline">Privacy Settings</Button>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2 text-red-600">Danger Zone</h4>
                    <p className="text-sm text-gray-600 mb-4">Sign out of your account</p>
                    <Button variant="destructive" onClick={signOut}>
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <TripDetailsModal
        open={tripModalOpen}
        onClose={() => setTripModalOpen(false)}
        booking={selectedBooking}
      />

      <EditProfileModal
        open={editProfileModalOpen}
        onClose={() => setEditProfileModalOpen(false)}
        onProfileUpdated={fetchUserData}
      />

      <HostRequestModal
        open={hostRequestModalOpen}
        onClose={() => setHostRequestModalOpen(false)}
        onRequestSubmitted={handleHostRequestSubmitted}
      />

      <PaymentPreferencesModal
        open={paymentPreferencesModalOpen}
        onClose={() => setPaymentPreferencesModalOpen(false)}
      />
      
      <Footer />
    </div>
  );
};

export default Dashboard;
