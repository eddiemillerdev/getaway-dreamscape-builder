import { useState, useEffect, useCallback } from 'react';
import { differenceInDays } from 'date-fns';
import { secureStorage } from '@/utils/secureStorage';
import { secureLog } from '@/utils/security';

interface PropertyImage {
  image_url: string;
  is_primary: boolean;
}

export interface Property {
  id: string;
  title: string;
  price_per_night: number;
  cleaning_fee: number;
  service_fee: number;
  created_at?: string;
  updated_at?: string;
  is_active: boolean;
  property_type: string;
  property_images?: PropertyImage[];
  max_guests: number;
  [key: string]: string | number | boolean | string[] | Record<string, unknown> | PropertyImage[] | undefined;
}

interface BookingState {
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  property: Property | null;
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

  const updateBookingState = useCallback(async (updates: Partial<BookingState>) => {
    secureLog.info('Updating booking state', {
      propertyId: updates.property?.id,
      hasProperty: !!updates.property
    });

    // Create new state
    const newState = {
      ...bookingState,
      ...updates,
      property: updates.property || bookingState.property
    };

    // Update state
    setBookingState(newState);

    // Save to storage
    try {
      await secureStorage.setItem(STORAGE_KEY, {
        ...newState,
        property: newState.property ? {
          ...newState.property,
          created_at: newState.property.created_at?.toString(),
          updated_at: newState.property.updated_at?.toString()
        } : null
      });
      secureLog.info('Booking state saved to storage', { 
        propertyId: newState.property?.id 
      });
    } catch (error) {
      secureLog.error('Error saving booking state:', error);
    }
  }, [bookingState]);

  // Remove the separate save effect since we're handling it in updateBookingState
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const savedState = await secureStorage.getItem(STORAGE_KEY);
        if (savedState) {
          // Ensure property data is properly structured
          const property = savedState.property ? {
            ...savedState.property,
            created_at: savedState.property.created_at ? new Date(savedState.property.created_at) : undefined,
            updated_at: savedState.property.updated_at ? new Date(savedState.property.updated_at) : undefined
          } : null;

          setBookingState({
            ...savedState,
            checkIn: savedState.checkIn ? new Date(savedState.checkIn) : null,
            checkOut: savedState.checkOut ? new Date(savedState.checkOut) : null,
            property
          });
          secureLog.info('Booking state loaded from storage', { property });
        }
      } catch (error) {
        secureLog.error('Error loading booking state:', error);
        await secureStorage.removeItem(STORAGE_KEY);
      }
    };

    loadSavedState();
  }, []);

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
