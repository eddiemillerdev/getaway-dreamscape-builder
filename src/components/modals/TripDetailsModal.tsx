
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users, MessageSquare, Star } from 'lucide-react';
import { format } from 'date-fns';
import { TripDetailsBooking } from '@/types/booking';
import ContactHostModal from './ContactHostModal';
import ReviewModal from './ReviewModal';

interface TripDetailsModalProps {
  open: boolean;
  onClose: () => void;
  booking: TripDetailsBooking | null;
}

const TripDetailsModal = ({ open, onClose, booking }: TripDetailsModalProps) => {
  const [contactHostOpen, setContactHostOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  if (!booking) return null;

  const checkInDate = new Date(booking.check_in_date);
  const checkOutDate = new Date(booking.check_out_date);

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Trip Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Property Info */}
            <div>
              <h3 className="text-xl font-semibold mb-2">{booking.properties.title}</h3>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{booking.properties.address}</span>
              </div>
              <Badge 
                variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                className={booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
              >
                {booking.status}
              </Badge>
            </div>

            {/* Trip Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-2 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Check-in</p>
                  <p className="font-medium">{format(checkInDate, 'MMM dd, yyyy')}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-2 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Check-out</p>
                  <p className="font-medium">{format(checkOutDate, 'MMM dd, yyyy')}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Guests</p>
                  <p className="font-medium">{booking.guests}</p>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {booking.special_requests && (
              <div>
                <h4 className="font-medium mb-2">Special Requests</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {booking.special_requests}
                </p>
              </div>
            )}

            {/* Total Amount */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total Amount</span>
                <span className="text-2xl font-bold">${booking.total_amount}</span>
              </div>
              {booking.nights && (
                <p className="text-sm text-gray-600 mt-1">
                  ${(booking.total_amount / booking.nights).toFixed(2)} per night × {booking.nights} nights
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setContactHostOpen(true)}
                className="flex-1 flex items-center justify-center"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Host
              </Button>
              
              {booking.status === 'confirmed' && (
                <Button
                  onClick={() => setReviewModalOpen(true)}
                  className="flex-1 flex items-center justify-center"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Leave Review
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ContactHostModal
        open={contactHostOpen}
        onClose={() => setContactHostOpen(false)}
        hostId={booking.properties.host_id}
        propertyId={booking.properties.id}
        propertyTitle={booking.properties.title}
      />

      <ReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        booking={booking}
      />
    </>
  );
};

export default TripDetailsModal;
