
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

interface BookingContentProps {
  loading: boolean;
  specialRequests: string;
  setSpecialRequests: (value: string) => void;
  paymentMethod: any;
  setPaymentMethod: (method: any) => void;
  guestDetails: any;
  setGuestDetails: (details: any) => void;
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
    updateBookingState({
      checkIn,
      checkOut,
      guests
    });
  };

  const handlePaymentMethod = (paymentData: any) => {
    setPaymentMethod(paymentData);
  };

  // Safety check - ensure we have property and required data
  if (!bookingState.property) {
    secureLog.error('BookingContent rendered without property');
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Error: Property data missing</div>
      </div>
    );
  }

  // Ensure we have valid dates with fallbacks
  const checkIn = bookingState.checkIn || new Date();
  const checkOut = bookingState.checkOut || new Date(Date.now() + 24 * 60 * 60 * 1000);
  const nights = bookingState.nights || 1;
  const totalAmount = bookingState.totalAmount || 0;
  const guests = bookingState.guests || 2;

  secureLog.info('BookingContent rendering with valid data');

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
            property={bookingState.property}
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
        maxGuests={bookingState.property?.max_guests || 8}
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
