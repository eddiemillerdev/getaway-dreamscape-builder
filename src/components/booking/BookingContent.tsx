import { useState } from 'react';
import TripDetails from '@/components/booking/TripDetails';
import GuestDetailsForm from '@/components/booking/GuestDetailsForm';
import PaymentMethodSection from '@/components/booking/PaymentMethodSection';
import SpecialRequestsForm from '@/components/booking/SpecialRequestsForm';
import CancellationPolicy from '@/components/booking/CancellationPolicy';
import BookingSummary from '@/components/booking/BookingSummary';
import EditBookingModal from '@/components/EditBookingModal';
import PaymentMethodModal from '@/components/PaymentMethodModal';
import { useBookingState } from '@/hooks/useBookingState';
import { secureLog } from '@/utils/security';

interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  password: string;
}

interface PaymentMethod {
  type: string;
  details: string;
  name: string;
  brand: string;
}

interface BookingContentProps {
  loading: boolean;
  specialRequests: string;
  setSpecialRequests: (value: string) => void;
  paymentMethod: PaymentMethod | null;
  setPaymentMethod: (method: PaymentMethod) => void;
  guestDetails: GuestDetails;
  setGuestDetails: (details: GuestDetails) => void;
  onConfirmBooking: () => void;
}

const BookingContent = ({
  loading,
  specialRequests,
  setSpecialRequests,
  paymentMethod,
  setPaymentMethod,
  guestDetails,
  setGuestDetails,
  onConfirmBooking
}: BookingContentProps) => {
  const { bookingState, updateBookingState } = useBookingState();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const handleEditBooking = (checkIn: Date, checkOut: Date, guests: number) => {
    secureLog.info('Updating booking details');
    updateBookingState({
      checkIn,
      checkOut,
      guests
    });
  };

  const handlePaymentMethod = (paymentData: PaymentMethod) => {
    secureLog.info('Payment method selected');
    setPaymentMethod(paymentData);
  };

  // Safety check - ensure we have property and required data
  if (!bookingState.property) {
    secureLog.error('BookingContent rendered without property data');
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error: Property data missing. Please try again.</div>
      </div>
    );
  }

  // Ensure we have valid dates with fallbacks
  const checkIn = bookingState.checkIn || new Date();
  const checkOut = bookingState.checkOut || new Date(Date.now() + 24 * 60 * 60 * 1000);
  const nights = bookingState.nights || 1;
  const totalAmount = bookingState.totalAmount || 0;
  const guests = bookingState.guests || 2;

  // Ensure property has required fields
  const property = {
    ...bookingState.property,
    cleaning_fee: bookingState.property.cleaning_fee || 0,
    service_fee: bookingState.property.service_fee || 0
  };

  secureLog.debug('BookingContent rendering with valid data', {
    propertyId: property.id,
    nights,
    guests,
    totalAmount
  });

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <TripDetails
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
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
            property={property}
            nights={nights}
            totalAmount={totalAmount}
            onConfirmBooking={onConfirmBooking}
            loading={loading}
          />
        </div>
      </div>

      <EditBookingModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialCheckIn={checkIn}
        initialCheckOut={checkOut}
        initialGuests={guests}
        maxGuests={property.max_guests}
        onSave={handleEditBooking}
      />

      <PaymentMethodModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSave={handlePaymentMethod}
      />
    </>
  );
};

export default BookingContent;
