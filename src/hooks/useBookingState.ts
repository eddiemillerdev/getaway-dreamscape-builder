
import { useState, useEffect } from 'react';
import { differenceInDays } from 'date-fns';
import { secureStorage } from '@/utils/secureStorage';
import { secureLog } from '@/utils/security';

interface BookingState {
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  property: any;
  nights: number;
  totalAmount: number;
}

const STORAGE_KEY = 'booking_state';

export const useBookingState = () => {
  const [bookingState, setBookingState] = useState<BookingState>({
    checkIn: null,
    checkOut: null,
    guests: 2,
    property: null,
    nights: 0,
    totalAmount: 0
  });

  // Load state from secure storage on mount
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const savedState = await secureStorage.getItem(STORAGE_KEY);
        if (savedState) {
          setBookingState({
            ...savedState,
            checkIn: savedState.checkIn ? new Date(savedState.checkIn) : null,
            checkOut: savedState.checkOut ? new Date(savedState.checkOut) : null,
          });
          secureLog.info('Booking state loaded from secure storage');
        }
      } catch (error) {
        secureLog.error('Error parsing saved booking state:', error);
        await secureStorage.removeItem(STORAGE_KEY);
      }
    };

    loadSavedState();
  }, []);

  // Save state to secure storage whenever it changes
  useEffect(() => {
    const saveState = async () => {
      try {
        await secureStorage.setItem(STORAGE_KEY, bookingState);
      } catch (error) {
        secureLog.error('Error saving booking state:', error);
      }
    };

    saveState();
  }, [bookingState]);

  const updateBookingState = (updates: Partial<BookingState>) => {
    setBookingState(prev => {
      const newState = { ...prev, ...updates };
      
      // Recalculate rates if dates or property change
      if (newState.checkIn && newState.checkOut && newState.property) {
        const nights = differenceInDays(newState.checkOut, newState.checkIn);
        const subtotal = nights * newState.property.price_per_night;
        const cleaningFee = newState.property.cleaning_fee || 0;
        const serviceFee = newState.property.service_fee || 0;
        const totalAmount = subtotal + cleaningFee + serviceFee;
        
        newState.nights = nights;
        newState.totalAmount = totalAmount;
      }
      
      return newState;
    });
  };

  const clearBookingState = async () => {
    setBookingState({
      checkIn: null,
      checkOut: null,
      guests: 2,
      property: null,
      nights: 0,
      totalAmount: 0
    });
    await secureStorage.removeItem(STORAGE_KEY);
    secureLog.info('Booking state cleared');
  };

  return {
    bookingState,
    updateBookingState,
    clearBookingState
  };
};
