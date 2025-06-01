
import { useState, useEffect } from 'react';
import { differenceInDays } from 'date-fns';

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

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setBookingState({
          ...parsed,
          checkIn: parsed.checkIn ? new Date(parsed.checkIn) : null,
          checkOut: parsed.checkOut ? new Date(parsed.checkOut) : null,
        });
      } catch (error) {
        console.error('Error parsing saved booking state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookingState));
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

  const clearBookingState = () => {
    setBookingState({
      checkIn: null,
      checkOut: null,
      guests: 2,
      property: null,
      nights: 0,
      totalAmount: 0
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    bookingState,
    updateBookingState,
    clearBookingState
  };
};
