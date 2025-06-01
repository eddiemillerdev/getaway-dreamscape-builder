
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { scrollToTopImmediate } from '@/utils/scrollToTop';
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
  const [isInitialized, setIsInitialized] = useState(false);
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

  // Scroll to top immediately when component mounts
  useEffect(() => {
    scrollToTopImmediate();
  }, []);

  // Initialize booking state from route or fetch property
  useEffect(() => {
    const initializeBooking = async () => {
      console.log('Initializing booking...');
      console.log('Location state:', location.state);
      console.log('Params:', params);
      console.log('Current booking state:', bookingState);
      
      const routeState = location.state;
      const propertyId = params.id;
      
      // If we have route state with property, use it
      if (routeState?.property) {
        console.log('Using route state property:', routeState.property);
        const checkIn = routeState.checkIn ? new Date(routeState.checkIn) : new Date();
        const checkOut = routeState.checkOut ? new Date(routeState.checkOut) : new Date(Date.now() + 24 * 60 * 60 * 1000);
        const guests = routeState.guests || 2;
        const nights = routeState.nights || 1;
        const totalAmount = routeState.totalAmount || (nights * routeState.property.price_per_night);
        
        updateBookingState({
          property: routeState.property,
          checkIn,
          checkOut,
          guests,
          nights,
          totalAmount
        });
        setIsInitialized(true);
        return;
      }
      
      // If we already have a property in state, we're good
      if (bookingState.property) {
        console.log('Using existing property from state:', bookingState.property);
        setIsInitialized(true);
        return;
      }
      
      // If we have a property ID but no property, fetch it
      if (propertyId) {
        console.log('Fetching property with ID:', propertyId);
        await fetchProperty(propertyId);
        return;
      }
      
      // No property ID and no state, redirect to home
      console.log('No property found, redirecting to home');
      toast({
        title: 'Property Not Found',
        description: 'Please select a property to book.',
        variant: 'destructive',
      });
      navigate('/homes');
    };

    if (!isInitialized) {
      initializeBooking();
    }
  }, [location.state, params.id, bookingState.property, isInitialized, updateBookingState, toast, navigate]);

  const fetchProperty = async (propertyId: string) => {
    setPropertyLoading(true);
    try {
      console.log('Fetching property data for ID:', propertyId);
      const { data: propertyData, error } = await supabase
        .from('properties')
        .select(`
          *,
          destination:destinations(name, country, state_province),
          property_images(image_url, is_primary)
        `)
        .eq('id', propertyId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Property fetch error:', error);
        throw error;
      }

      if (!propertyData) {
        throw new Error('Property not found');
      }

      console.log('Property fetched successfully:', propertyData);
      
      // Set default booking values
      const checkIn = new Date();
      const checkOut = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const guests = 2;
      const nights = 1;
      const totalAmount = (nights * propertyData.price_per_night) + 
                         (propertyData.cleaning_fee || 0) + 
                         (propertyData.service_fee || 0);
      
      updateBookingState({
        property: propertyData,
        checkIn,
        checkOut,
        guests,
        nights,
        totalAmount
      });
      
      setIsInitialized(true);
    } catch (error: any) {
      console.error('Error fetching property:', error);
      toast({
        title: 'Error',
        description: 'Could not load property details. Please try again.',
        variant: 'destructive',
      });
      navigate('/homes');
    } finally {
      setPropertyLoading(false);
    }
  };

  // Load default payment method if user is logged in
  useEffect(() => {
    if (user && !paymentMethod) {
      loadDefaultPaymentMethod();
    }
  }, [user, paymentMethod]);

  const loadDefaultPaymentMethod = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_default', true)
        .maybeSingle();

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

  // Show loading state
  if (!isInitialized || propertyLoading) {
    return (
      <BookingLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading property details...</div>
        </div>
      </BookingLayout>
    );
  }

  // Show error state if no property after initialization
  if (!bookingState.property) {
    return (
      <BookingLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg mb-4">Property not found</div>
            <button 
              onClick={() => navigate('/homes')}
              className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700"
            >
              Return to Homes
            </button>
          </div>
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
