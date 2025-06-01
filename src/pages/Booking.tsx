import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { scrollToTop } from '@/utils/scrollToTop';
import { useBookingState } from '@/hooks/useBookingState';
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
  const { bookingState, updateBookingState, clearBookingState } = useBookingState();
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

  // Initialize booking state from route or saved state
  useEffect(() => {
    const routeState = location.state;
    if (routeState && routeState.property) {
      // Use route state and save it
      updateBookingState({
        property: routeState.property,
        checkIn: routeState.checkIn,
        checkOut: routeState.checkOut,
        guests: routeState.guests,
        nights: routeState.nights,
        totalAmount: routeState.totalAmount
      });
    } else if (!bookingState.property) {
      // No saved state and no route state, redirect to home
      navigate('/');
      return;
    }
    
    scrollToTop();
  }, [location.state]);

  // Load default payment method if user is logged in
  useEffect(() => {
    if (user && !paymentMethod) {
      loadDefaultPaymentMethod();
    }
  }, [user]);

  const loadDefaultPaymentMethod = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_default', true)
        .single();

      if (data && !error) {
        setPaymentMethod({
          type: 'Credit Card',
          details: `**** **** **** ${data.card_last_four}`,
          name: data.cardholder_name,
          brand: data.card_brand
        });
      }
    } catch (error) {
      // No default payment method found, that's okay
      console.log('No default payment method found');
    }
  };

  const scrollToError = (elementId: string, errorId: string, message: string) => {
    const element = document.getElementById(elementId);
    const errorElement = document.getElementById(errorId);
    
    if (element && errorElement) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      errorElement.textContent = message;
      errorElement.classList.remove('hidden');
      
      // Hide error after 5 seconds
      setTimeout(() => {
        errorElement.classList.add('hidden');
      }, 5000);
    }
  };

  const hideAllErrors = () => {
    const errorElements = document.querySelectorAll('[id$="-error"]');
    errorElements.forEach(el => el.classList.add('hidden'));
  };

  const handleEditBooking = (checkIn: Date, checkOut: Date, guests: number) => {
    updateBookingState({
      checkIn,
      checkOut,
      guests
    });
  };

  const handlePaymentMethod = (paymentData: any) => {
    setPaymentMethod(paymentData);
  };

  const handleBooking = async () => {
    hideAllErrors();
    
    if (!paymentMethod) {
      toast({
        title: 'Payment Method Required',
        description: 'Please select a payment method to continue.',
        variant: 'destructive',
      });
      return;
    }

    if (!guestDetails.firstName) {
      scrollToError('guest-details', 'firstName-error', 'First name is required');
      toast({
        title: 'Guest Details Required',
        description: 'Please fill in all required guest details.',
        variant: 'destructive',
      });
      return;
    }

    if (!guestDetails.lastName) {
      scrollToError('guest-details', 'lastName-error', 'Last name is required');
      toast({
        title: 'Guest Details Required',
        description: 'Please fill in all required guest details.',
        variant: 'destructive',
      });
      return;
    }

    // Only check email for non-authenticated users
    if (!user && !guestDetails.email) {
      scrollToError('guest-details', 'email-error', 'Valid email is required');
      toast({
        title: 'Email Required',
        description: 'Please provide your email address.',
        variant: 'destructive',
      });
      return;
    }

    if (!user && !guestDetails.password) {
      scrollToError('guest-details', 'password-error', 'Password is required');
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
          console.error('Sign up error:', signUpError);
          
          // Handle specific error cases
          if (signUpError.message.includes('User already registered')) {
            scrollToError('guest-details', 'email-error', 'An account with this email already exists. Please sign in instead.');
            toast({
              title: 'Email Already Registered',
              description: 'An account with this email already exists. Please sign in to continue.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Account Creation Failed',
              description: signUpError.message || 'Failed to create account. Please try again.',
              variant: 'destructive',
            });
          }
          return;
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
          property_id: bookingState.property.id,
          check_in_date: format(bookingState.checkIn!, 'yyyy-MM-dd'),
          check_out_date: format(bookingState.checkOut!, 'yyyy-MM-dd'),
          guests: bookingState.guests,
          total_amount: bookingState.totalAmount,
          nights: bookingState.nights,
          special_requests: specialRequests || null,
        });

      if (error) throw error;

      toast({
        title: 'Booking Confirmed!',
        description: user 
          ? 'Your reservation has been successfully created.'
          : 'Your account has been created and your reservation is confirmed! Please check your email to verify your account.',
      });

      // Clear saved booking state
      clearBookingState();

      navigate('/booking-success', {
        state: {
          property: bookingState.property,
          checkIn: bookingState.checkIn,
          checkOut: bookingState.checkOut,
          guests: bookingState.guests,
          totalAmount: bookingState.totalAmount,
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

  if (!bookingState.property || !bookingState.checkIn || !bookingState.checkOut) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading booking details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <BookingHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <TripDetails
              checkIn={bookingState.checkIn}
              checkOut={bookingState.checkOut}
              guests={bookingState.guests}
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
              property={bookingState.property}
              nights={bookingState.nights}
              totalAmount={bookingState.totalAmount}
              onConfirmBooking={handleBooking}
              loading={loading}
            />
          </div>
        </div>
      </div>

      <EditBookingModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialCheckIn={bookingState.checkIn}
        initialCheckOut={bookingState.checkOut}
        initialGuests={bookingState.guests}
        maxGuests={bookingState.property.max_guests}
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
