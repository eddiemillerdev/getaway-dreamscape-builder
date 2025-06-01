
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

  // Early return if property is not available
  if (!bookingState.property) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading property details...</div>
      </div>
    );
  }

  // Early return if required booking data is missing
  if (!bookingState.checkIn || !bookingState.checkOut) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading booking details...</div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <TripDetails
            checkIn={bookingState.checkIn}
            checkOut={bookingState.checkOut}
            guests={bookingState.guests}
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
            nights={bookingState.nights}
            totalAmount={bookingState.totalAmount}
            onConfirmBooking={onConfirmBooking}
            loading={loading}
          />
        </div>
      </div>

      <EditBookingModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialCheckIn={bookingState.checkIn}
        initialCheckOut={bookingState.checkOut}
        initialGuests={bookingState.guests}
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
