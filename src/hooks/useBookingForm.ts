
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useBookingState } from '@/hooks/useBookingState';

interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  password: string;
}

export const useBookingForm = () => {
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const { toast } = useToast();
  const { bookingState, clearBookingState } = useBookingState();
  const [loading, setLoading] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');
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

  const scrollToError = (elementId: string, errorId: string, message: string) => {
    const element = document.getElementById(elementId);
    const errorElement = document.getElementById(errorId);
    
    if (element && errorElement) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      errorElement.textContent = message;
      errorElement.classList.remove('hidden');
      
      setTimeout(() => {
        errorElement.classList.add('hidden');
      }, 5000);
    }
  };

  const hideAllErrors = () => {
    const errorElements = document.querySelectorAll('[id$="-error"]');
    errorElements.forEach(el => el.classList.add('hidden'));
  };

  const validateForm = () => {
    hideAllErrors();
    
    if (!paymentMethod) {
      toast({
        title: 'Payment Method Required',
        description: 'Please select a payment method to continue.',
        variant: 'destructive',
      });
      return false;
    }

    if (!guestDetails.firstName) {
      scrollToError('guest-details', 'firstName-error', 'First name is required');
      toast({
        title: 'Guest Details Required',
        description: 'Please fill in all required guest details.',
        variant: 'destructive',
      });
      return false;
    }

    if (!guestDetails.lastName) {
      scrollToError('guest-details', 'lastName-error', 'Last name is required');
      toast({
        title: 'Guest Details Required',
        description: 'Please fill in all required guest details.',
        variant: 'destructive',
      });
      return false;
    }

    if (!user && !guestDetails.email) {
      scrollToError('guest-details', 'email-error', 'Valid email is required');
      toast({
        title: 'Email Required',
        description: 'Please provide your email address.',
        variant: 'destructive',
      });
      return false;
    }

    if (!user && !guestDetails.password) {
      scrollToError('guest-details', 'password-error', 'Password is required');
      toast({
        title: 'Password Required',
        description: 'Please enter a password to create your account.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleBooking = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      let userId = user?.id;

      if (!user) {
        const { error: signUpError } = await signUp(
          guestDetails.email,
          guestDetails.password,
          guestDetails.firstName,
          guestDetails.lastName
        );

        if (signUpError) {
          console.error('Sign up error:', signUpError);
          
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

  return {
    loading,
    specialRequests,
    setSpecialRequests,
    paymentMethod,
    setPaymentMethod,
    guestDetails,
    setGuestDetails,
    handleBooking
  };
};
