
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Star } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  id: string;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  total_amount: number;
  status: string;
  properties: {
    title: string;
    property_type: string;
    address: string;
  };
}

interface TripDetailsModalProps {
  open: boolean;
  onClose: () => void;
  booking: Booking | null;
}

const TripDetailsModal = ({ open, onClose, booking }: TripDetailsModalProps) => {
  if (!booking) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Trip Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Property Image Placeholder */}
          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Property Image</p>
          </div>
          
          {/* Booking Information */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">{booking.properties.title}</h3>
                <p className="text-gray-600">{booking.properties.property_type}</p>
                <div className="flex items-center text-gray-500 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {booking.properties.address}
                </div>
              </div>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Check-in</p>
                  <p className="font-medium">{format(new Date(booking.check_in_date), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Check-out</p>
                  <p className="font-medium">{format(new Date(booking.check_out_date), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Guests</p>
                  <p className="font-medium">{booking.guests}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-2xl font-bold">${booking.total_amount}</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1">
                Contact Host
              </Button>
              <Button className="flex-1">
                Leave Review
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TripDetailsModal;
