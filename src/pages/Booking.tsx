
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingHeader from '@/components/booking/BookingHeader';
import TripDetails from '@/components/booking/TripDetails';
import GuestDetailsForm from '@/components/booking/GuestDetailsForm';
import PaymentMethodSection from '@/components/booking/PaymentMethodSection';
import SpecialRequestsForm from '@/components/booking/SpecialRequestsForm';
import CancellationPolicy from '@/components/booking/CancellationPolicy';
import BookingSummary from '@/components/booking/BookingSummary';
import EditBookingModal from '@/components/EditBookingModal';
import PaymentMethodModal from '@/components/PaymentMethodModal';

interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  password: string;
}

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    address: '',
    password: ''
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

    if (!guestDetails.firstName || !guestDetails.lastName) {
      toast({
        title: 'Guest Details Required',
        description: 'Please fill in all required guest details.',
        variant: 'destructive',
      });
      return;
    }

    // Only check email for non-authenticated users
    if (!user && !guestDetails.email) {
      toast({
        title: 'Email Required',
        description: 'Please provide your email address.',
        variant: 'destructive',
      });
      return;
    }

    if (!user && !guestDetails.password) {
      toast({
        title: 'Password Required',
        description: 'Please enter a password to create your account.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      let userId = user?.id;

      // If user is not logged in, create a new account
      if (!user) {
        const { error: signUpError } = await signUp(
          guestDetails.email,
          guestDetails.password,
          guestDetails.firstName,
          guestDetails.lastName
        );

        if (signUpError) {
          throw new Error(signUpError.message);
        }

        // Get the newly created user
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          userId = session.user.id;
        } else {
          throw new Error('Failed to create account');
        }
      }

      if (!userId) {
        throw new Error('User authentication failed');
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
        description: user 
          ? 'Your reservation has been successfully created.'
          : 'Your account has been created and your reservation is confirmed! Please check your email to verify your account.',
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
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking Failed',
        description: error.message || 'There was an error processing your booking. Please try again.',
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
        <BookingHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <TripDetails
              checkIn={bookingData.checkIn}
              checkOut={bookingData.checkOut}
              guests={bookingData.guests}
              onEdit={() => setEditModalOpen(true)}
            />

            <GuestDetailsForm
              guestDetails={guestDetails}
              setGuestDetails={setGuestDetails}
            />

            <PaymentMethodSection
              paymentMethod={paymentMethod}
              onSelectPayment={() => setPaymentModalOpen(true)}
            />

            <SpecialRequestsForm
              specialRequests={specialRequests}
              setSpecialRequests={setSpecialRequests}
            />

            <CancellationPolicy />
          </div>

          <div className="space-y-6">
            <BookingSummary
              property={bookingData.property}
              nights={bookingData.nights}
              totalAmount={bookingData.totalAmount}
              onConfirmBooking={handleBooking}
              loading={loading}
            />
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
