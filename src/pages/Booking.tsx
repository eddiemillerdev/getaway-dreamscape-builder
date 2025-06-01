
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { scrollToTop } from '@/utils/scrollToTop';
import { useBookingState } from '@/hooks/useBookingState';
import { useBookingForm } from '@/hooks/useBookingForm';
import BookingLayout from '@/components/booking/BookingLayout';
import BookingContent from '@/components/booking/BookingContent';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { bookingState, updateBookingState } = useBookingState();
  const [propertyLoading, setPropertyLoading] = useState(false);
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
    console.log('Booking page mounted');
    console.log('Location state:', location.state);
    console.log('Params:', params);
    console.log('Current booking state:', bookingState);
    
    const routeState = location.state;
    const propertyId = params.id; // Get property ID from URL params (/booking/:id)
    
    if (routeState && routeState.property) {
      console.log('Using route state property');
      updateBookingState({
        property: routeState.property,
        checkIn: routeState.checkIn,
        checkOut: routeState.checkOut,
        guests: routeState.guests,
        nights: routeState.nights,
        totalAmount: routeState.totalAmount
      });
    } else if (!bookingState.property && propertyId) {
      console.log('Fetching property with ID:', propertyId);
      // Fetch property if we have a property ID in URL params but no state
      fetchProperty(propertyId);
    } else if (!propertyId) {
      console.log('No property ID, redirecting to home');
      // No property ID in URL, redirect to home
      navigate('/');
      return;
    }
    
    scrollToTop();
  }, [location.state, params.id]);

  const fetchProperty = async (propertyId: string) => {
    console.log('Starting property fetch for ID:', propertyId);
    setPropertyLoading(true);
    try {
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      console.log('Property fetch result:', { propertyData, propertyError });

      if (propertyError) {
        console.error('Property fetch error:', propertyError);
        throw propertyError;
      }

      if (propertyData) {
        console.log('Property found, updating state');
        // Set default booking values if not already set
        const checkIn = bookingState.checkIn || new Date();
        const checkOut = bookingState.checkOut || new Date(Date.now() + 24 * 60 * 60 * 1000);
        const guests = bookingState.guests || 2;
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        const totalAmount = (nights * propertyData.price_per_night) + (propertyData.cleaning_fee || 0) + (propertyData.service_fee || 0);
        
        updateBookingState({
          property: propertyData,
          checkIn,
          checkOut,
          guests,
          nights,
          totalAmount
        });
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      toast({
        title: 'Error',
        description: 'Could not load property details. Please try again.',
        variant: 'destructive',
      });
      navigate('/');
    } finally {
      setPropertyLoading(false);
    }
  };

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

  if (propertyLoading) {
    return (
      <BookingLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading property details...</div>
        </div>
      </BookingLayout>
    );
  }

  if (!bookingState.property) {
    return (
      <BookingLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Property not found</div>
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
