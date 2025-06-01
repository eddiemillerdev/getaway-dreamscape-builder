
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EditBookingModal from '@/components/EditBookingModal';
import PaymentMethodModal from '@/components/PaymentMethodModal';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [guestDetails, setGuestDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    address: ''
  });

  const initialState = location.state || {};
  const [bookingData, setBookingData] = useState({
    property: initialState.property,
    checkIn: initialState.checkIn,
    checkOut: initialState.checkOut,
    guests: initialState.guests,
    nights: initialState.nights,
    totalAmount: initialState.totalAmount
  });

  if (!bookingData.property || !bookingData.checkIn || !bookingData.checkOut) {
    navigate('/');
    return null;
  }

  const handleEditBooking = (checkIn: Date, checkOut: Date, guests: number) => {
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const subtotal = nights * bookingData.property.price_per_night;
    const cleaningFee = bookingData.property.cleaning_fee || 0;
    const serviceFee = bookingData.property.service_fee || 0;
    const totalAmount = subtotal + cleaningFee + serviceFee;

    setBookingData({
      ...bookingData,
      checkIn,
      checkOut,
      guests,
      nights,
      totalAmount
    });
  };

  const handlePaymentMethod = (paymentData: any) => {
    setPaymentMethod(paymentData);
  };

  const handleBooking = async () => {
    if (!paymentMethod) {
      toast({
        title: 'Payment Method Required',
        description: 'Please select a payment method to continue.',
        variant: 'destructive',
      });
      return;
    }

    if (!guestDetails.firstName || !guestDetails.lastName || !guestDetails.email) {
      toast({
        title: 'Guest Details Required',
        description: 'Please fill in all required guest details.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      let userId = user?.id;

      // If user is not logged in, create a new profile
      if (!user) {
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            first_name: guestDetails.firstName,
            last_name: guestDetails.lastName,
            email: guestDetails.email,
            phone: guestDetails.phone
          })
          .select('id')
          .single();

        if (profileError) throw profileError;
        userId = newProfile.id;
      }

      const { error } = await supabase
        .from('bookings')
        .insert({
          guest_id: userId,
          property_id: bookingData.property.id,
          check_in_date: format(bookingData.checkIn, 'yyyy-MM-dd'),
          check_out_date: format(bookingData.checkOut, 'yyyy-MM-dd'),
          guests: bookingData.guests,
          total_amount: bookingData.totalAmount,
          nights: bookingData.nights,
          special_requests: specialRequests || null,
        });

      if (error) throw error;

      toast({
        title: 'Booking Confirmed!',
        description: 'Your reservation has been successfully created.',
      });

      navigate('/booking-success', {
        state: {
          property: bookingData.property,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: bookingData.guests,
          totalAmount: bookingData.totalAmount,
        },
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking Failed',
        description: 'There was an error processing your booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Confirm and pay</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Details */}
            <Card>
              <CardHeader>
                <CardTitle>Your trip</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">Dates</h4>
                    <p className="text-sm text-gray-600">
                      {format(bookingData.checkIn, 'MMM dd')} - {format(bookingData.checkOut, 'MMM dd')}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setEditModalOpen(true)}
                  >
                    Edit
                  </Button>
                </div>
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">Guests</h4>
                    <p className="text-sm text-gray-600">{bookingData.guests} guest{bookingData.guests > 1 ? 's' : ''}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setEditModalOpen(true)}
                  >
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Guest Details */}
            <Card>
              <CardHeader>
                <CardTitle>Guest details</CardTitle>
                <CardDescription>
                  Please provide the primary guest's information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={guestDetails.firstName}
                      onChange={(e) => setGuestDetails({...guestDetails, firstName: e.target.value})}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={guestDetails.lastName}
                      onChange={(e) => setGuestDetails({...guestDetails, lastName: e.target.value})}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={guestDetails.email}
                    onChange={(e) => setGuestDetails({...guestDetails, email: e.target.value})}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={guestDetails.phone}
                    onChange={(e) => setGuestDetails({...guestDetails, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={guestDetails.address}
                    onChange={(e) => setGuestDetails({...guestDetails, address: e.target.value})}
                    placeholder="123 Main St, City, State"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment method</CardTitle>
                <CardDescription>
                  Choose how you'd like to pay
                </CardDescription>
              </CardHeader>
              <CardContent>
                {paymentMethod ? (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{paymentMethod.type}</p>
                      <p className="text-sm text-gray-600">{paymentMethod.details}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setPaymentModalOpen(true)}>
                      Change
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setPaymentModalOpen(true)}
                  >
                    Select Payment Method
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Special Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Special requests</CardTitle>
                <CardDescription>
                  Any special requests for your stay? (Optional)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Let your host know about any special requirements..."
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>

            {/* Cancellation Policy */}
            <Card>
              <CardHeader>
                <CardTitle>Cancellation policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Free cancellation before 48 hours of check-in. After that, cancel before check-in and get a 50% refund, minus service fees.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start space-x-4">
                  <img
                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&h=150&fit=crop"
                    alt={bookingData.property.title}
                    className="w-20 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{bookingData.property.title}</h3>
                    <p className="text-sm text-gray-600">{bookingData.property.property_type}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>${bookingData.property.price_per_night} x {bookingData.nights} nights</span>
                    <span>${(bookingData.property.price_per_night * bookingData.nights).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cleaning fee</span>
                    <span>${(bookingData.property.cleaning_fee || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>${(bookingData.property.service_fee || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total (USD)</span>
                    <span>${bookingData.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleBooking} 
                  className="w-full bg-rose-500 hover:bg-rose-600"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Confirm and pay'}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  You won't be charged yet. This is a demo booking system.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <EditBookingModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialCheckIn={bookingData.checkIn}
        initialCheckOut={bookingData.checkOut}
        initialGuests={bookingData.guests}
        maxGuests={bookingData.property.max_guests}
        onSave={handleEditBooking}
      />

      <PaymentMethodModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSave={handlePaymentMethod}
      />
      
      <Footer />
    </div>
  );
};

export default Booking;
