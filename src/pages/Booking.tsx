import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { scrollToTopImmediate } from '@/utils/scrollToTop';
import { useBookingState, Property } from '@/hooks/useBookingState';
import { useBookingForm } from '@/hooks/useBookingForm';
import { secureLog } from '@/utils/security';
import BookingLayout from '@/components/booking/BookingLayout';
import BookingContent from '@/components/booking/BookingContent';
import { PostgrestError } from '@supabase/supabase-js';

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

  const fetchProperty = useCallback(async (propertyId: string) => {
    setPropertyLoading(true);
    try {
      secureLog.info('Fetching property data for ID:', propertyId);
      
      // First try to get the property without the is_active filter
      const { data: propertyData, error } = await supabase
        .from('properties')
        .select(`
          *,
          destination:destinations(name, country, state_province),
          property_images(image_url, is_primary)
        `)
        .eq('id', propertyId)
        .single();

      secureLog.info('Supabase response:', { 
        data: propertyData ? {
          id: propertyData.id,
          title: propertyData.title,
          is_active: propertyData.is_active,
          has_destination: !!propertyData.destination,
          has_images: !!propertyData.property_images?.length
        } : null,
        error 
      });

      if (error) {
        secureLog.error('Property fetch error:', error);
        throw error;
      }

      if (!propertyData) {
        secureLog.error('No property data returned for ID:', propertyId);
        throw new Error('Property not found');
      }

      // Check if property is active
      if (!propertyData.is_active) {
        secureLog.warn('Property is not active:', propertyId);
        toast({
          title: 'Property Unavailable',
          description: 'This property is currently not available for booking.',
          variant: 'destructive',
        });
        navigate('/homes');
        return;
      }

      // Ensure we have required fields
      if (!propertyData.title || !propertyData.price_per_night) {
        secureLog.error('Property missing required fields:', propertyData);
        throw new Error('Property data is incomplete');
      }

      secureLog.info('Property fetched successfully:', {
        id: propertyData.id,
        title: propertyData.title,
        price: propertyData.price_per_night
      });
      
      // Set default booking values
      const checkIn = new Date();
      const checkOut = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const guests = 2;
      const nights = 1;
      const totalAmount = (nights * propertyData.price_per_night) + 
                         (propertyData.cleaning_fee || 0) + 
                         (propertyData.service_fee || 0);
      
      // Ensure property data is properly structured
      const property = {
        ...propertyData,
        created_at: propertyData.created_at?.toString(),
        updated_at: propertyData.updated_at?.toString()
      };
      
      await updateBookingState({
        property,
        checkIn,
        checkOut,
        guests,
        nights,
        totalAmount
      });
      
      setIsInitialized(true);
    } catch (error: unknown) {
      secureLog.error('Error fetching property:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Could not load property details. Please try again.',
        variant: 'destructive',
      });
      navigate('/homes');
    } finally {
      setPropertyLoading(false);
    }
  }, [updateBookingState, toast, navigate]);

  // Scroll to top immediately when component mounts
  useEffect(() => {
    scrollToTopImmediate();
  }, []);

  // Initialize booking state from route or fetch property
  useEffect(() => {
    const initializeBooking = async () => {
      secureLog.info('Initializing booking...', { 
        routeState: location.state,
        existingProperty: bookingState.property 
      });
      
      const routeState = location.state;
      
      // If we have route state with property, use it
      if (routeState?.property) {
        secureLog.info('Using route state property:', routeState.property);
        const checkIn = routeState.checkIn ? new Date(routeState.checkIn) : new Date();
        const checkOut = routeState.checkOut ? new Date(routeState.checkOut) : new Date(Date.now() + 24 * 60 * 60 * 1000);
        const guests = routeState.guests || 2;
        const nights = routeState.nights || 1;
        const totalAmount = routeState.totalAmount || (nights * routeState.property.price_per_night);
        
        // Ensure property data is properly structured
        const property = {
          ...routeState.property,
          created_at: routeState.property.created_at?.toString(),
          updated_at: routeState.property.updated_at?.toString()
        };
        
        await updateBookingState({
          property,
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
        secureLog.info('Using existing property from state:', bookingState.property);
        setIsInitialized(true);
        return;
      }
      
      // No property data available, redirect to home
      secureLog.warn('No property found, redirecting to home');
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
  }, [location.state, bookingState.property, isInitialized, updateBookingState, toast, navigate]);

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
        secureLog.info('Default payment method loaded');
      }
    } catch (error) {
      secureLog.info('No default payment method found');
    }
  };

  // Show loading state
  if (!isInitialized || propertyLoading || !bookingState.property) {
    return (
      <BookingLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading property details...</div>
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
