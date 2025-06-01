
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { scrollToTop } from '@/utils/scrollToTop';
import { useBookingState } from '@/hooks/useBookingState';
import { useBookingForm } from '@/hooks/useBookingForm';
import BookingLayout from '@/components/booking/BookingLayout';
import BookingContent from '@/components/booking/BookingContent';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookingState, updateBookingState } = useBookingState();
  const {
    loading,
    specialRequests,
    setSpecialRequests,
    paymentMethod,
    setPaymentMethod,
    guestDetails,
    setGuestDetails,
    handleBooking
  } = useBookingForm();

  // Initialize booking state from route or saved state
  useEffect(() => {
    const routeState = location.state;
    if (routeState && routeState.property) {
      updateBookingState({
        property: routeState.property,
        checkIn: routeState.checkIn,
        checkOut: routeState.checkOut,
        guests: routeState.guests,
        nights: routeState.nights,
        totalAmount: routeState.totalAmount
      });
    } else if (!bookingState.property) {
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
      console.log('No default payment method found');
    }
  };

  if (!bookingState.property || !bookingState.checkIn || !bookingState.checkOut) {
    return (
      <BookingLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading booking details...</div>
        </div>
      </BookingLayout>
    );
  }

  return (
    <BookingLayout>
      <BookingContent
        loading={loading}
        specialRequests={specialRequests}
        setSpecialRequests={setSpecialRequests}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        guestDetails={guestDetails}
        setGuestDetails={setGuestDetails}
        onConfirmBooking={handleBooking}
      />
    </BookingLayout>
  );
};

export default Booking;
