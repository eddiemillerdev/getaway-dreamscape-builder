
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { differenceInDays } from 'date-fns';

interface Property {
  price_per_night: number;
  cleaning_fee: number;
  service_fee: number;
  max_guests: number;
}

interface BookingCardProps {
  property: Property;
}

const BookingCard = ({ property }: BookingCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [nights, setNights] = useState(0);

  useEffect(() => {
    if (checkIn && checkOut && property) {
      const nightCount = differenceInDays(checkOut, checkIn);
      setNights(nightCount);
      const subtotal = nightCount * property.price_per_night;
      const total = subtotal + property.cleaning_fee + property.service_fee;
      setTotalAmount(total);
    }
  }, [checkIn, checkOut, property]);

  const handleBooking = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!checkIn || !checkOut) {
      toast({
        title: 'Please select dates',
        description: 'You need to select check-in and check-out dates',
        variant: 'destructive',
      });
      return;
    }

    navigate('/booking', {
      state: {
        property,
        checkIn,
        checkOut,
        guests,
        nights,
        totalAmount,
      },
    });
  };

  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>${property.price_per_night} <span className="text-base font-normal">night</span></span>
            <div className="flex items-center text-sm">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span>4.8 (124)</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-gray-700 uppercase">Check-in</label>
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 uppercase">Check-out</label>
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                disabled={(date) => date < new Date() || (checkIn && date <= checkIn)}
                className="rounded-md border"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 uppercase">Guests</label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded-md"
            >
              {Array.from({ length: property.max_guests }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} guest{i > 0 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={handleBooking} className="w-full bg-rose-500 hover:bg-rose-600">
            Reserve
          </Button>

          {checkIn && checkOut && (
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span>${property.price_per_night} x {nights} nights</span>
                <span>${(property.price_per_night * nights).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cleaning fee</span>
                <span>${property.cleaning_fee}</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>${property.service_fee}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingCard;
