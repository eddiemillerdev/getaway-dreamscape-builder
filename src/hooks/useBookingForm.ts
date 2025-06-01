
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useBookingState } from '@/hooks/useBookingState';
import { createValidator } from '@/utils/validation';
import { secureLog, createRateLimiter } from '@/utils/security';

interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  password: string;
}

// Rate limiter for booking attempts (max 3 attempts per 10 minutes)
const bookingRateLimiter = createRateLimiter(3, 10 * 60 * 1000);

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
    
    const validator = createValidator();
    
    // Validate guest details
    validator
      .validateField('firstName', guestDetails.firstName, {
        required: true,
        type: 'text',
        minLength: 1,
        maxLength: 50
      })
      .validateField('lastName', guestDetails.lastName, {
        required: true,
        type: 'text',
        minLength: 1,
        maxLength: 50
      });

    if (!user) {
      validator
        .validateField('email', guestDetails.email, {
          required: true,
          type: 'email'
        })
        .validateField('password', guestDetails.password, {
          required: true,
          type: 'password'
        });
    }

    validator
      .validateField('phone', guestDetails.phone, {
        type: 'phone',
        maxLength: 20
      })
      .validateField('address', guestDetails.address, {
        type: 'text',
        maxLength: 200
      });

    const result = validator.getResult();

    if (!result.isValid) {
      // Show first error
      const firstError = Object.keys(result.errors)[0];
      const errorMessage = result.errors[firstError];
      
      scrollToError('guest-details', `${firstError}-error`, errorMessage);
      toast({
        title: 'Validation Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }

    if (!paymentMethod) {
      toast({
        title: 'Payment Method Required',
        description: 'Please select a payment method to continue.',
        variant: 'destructive',
      });
      return false;
    }

    // Update guest details with sanitized data
    setGuestDetails(prev => ({ ...prev, ...result.sanitizedData }));

    return true;
  };

  const handleBooking = async () => {
    // Rate limiting check
    const userKey = user?.id || guestDetails.email || 'anonymous';
    if (!bookingRateLimiter(userKey)) {
      toast({
        title: 'Too Many Attempts',
        description: 'Please wait before trying again.',
        variant: 'destructive',
      });
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    secureLog.info('Starting booking process');

    try {
      let userId = user?.id;

      if (!user) {
        secureLog.info('Creating new user account');
        const { error: signUpError } = await signUp(
          guestDetails.email,
          guestDetails.password,
          guestDetails.firstName,
          guestDetails.lastName
        );

        if (signUpError) {
          secureLog.error('Sign up error', signUpError);
          
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
          secureLog.info('User account created successfully');
        } else {
          throw new Error('Failed to create account');
        }
      }

      if (!userId) {
        throw new Error('User authentication failed');
      }

      secureLog.info('Creating booking record');
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

      secureLog.info('Booking created successfully');
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
      secureLog.error('Booking error', error);
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
