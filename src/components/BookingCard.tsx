import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DateRange } from 'react-day-picker';
import DateRangePicker from '@/components/booking/DateRangePicker';
import GuestCounter from '@/components/booking/GuestCounter';
import PricingBreakdown from '@/components/booking/PricingBreakdown';
import { secureLog } from '@/utils/security';

interface Property {
  id: string;
  title: string;
  price_per_night: number;
  cleaning_fee: number;
  service_fee: number;
  max_guests: number;
  created_at?: string;
  updated_at?: string;
}

interface BookingCardProps {
  property: Property;
}

interface GuestCount {
  adults: number;
  children: number;
  infants: number;
}

const BookingCard = ({ property }: BookingCardProps) => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState<GuestCount>({ adults: 2, children: 0, infants: 0 });
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const updateGuestCount = (type: keyof GuestCount, operation: 'increment' | 'decrement') => {
    setGuests(prev => {
      const newCount = { ...prev };
      const totalGuests = prev.adults + prev.children;
      
      if (operation === 'increment') {
        if ((type === 'adults' || type === 'children') && totalGuests >= property.max_guests) {
          return prev; // Don't exceed max guests
        }
        newCount[type] += 1;
      } else if (operation === 'decrement' && prev[type] > 0) {
        if (type === 'adults' && prev[type] <= 1) return prev; // Minimum 1 adult
        newCount[type] -= 1;
      }
      return newCount;
    });
  };

  const totalNights = dateRange?.from && dateRange?.to 
    ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const subtotal = totalNights * property.price_per_night;
  const cleaningFee = property.cleaning_fee || 0;
  const serviceFee = property.service_fee || 0;
  const total = subtotal + cleaningFee + serviceFee;

  const totalGuests = guests.adults + guests.children;

  const handleReserve = () => {
    if (!dateRange?.from || !dateRange?.to) {
      setDatePickerOpen(true);
      return;
    }

    secureLog.info('Navigating to booking with property', property);

    navigate('/booking', {
      state: {
        property: {
          ...property,
          created_at: property.created_at?.toString(),
          updated_at: property.updated_at?.toString()
        },
        checkIn: dateRange.from,
        checkOut: dateRange.to,
        guests: totalGuests,
        nights: totalNights,
        totalAmount: total
      }
    });
  };

  return (
    <Card className="sticky top-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-2xl font-bold">${property.price_per_night}</span>
            <span className="text-gray-600 ml-1">night</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-yellow-400 mr-1">★</span>
            <span>4.8 (124 reviews)</span>
          </div>
        </div>

        <div className="space-y-4">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            isOpen={datePickerOpen}
            onOpenChange={setDatePickerOpen}
          />

          <GuestCounter
            guests={guests}
            maxGuests={property.max_guests}
            onUpdateGuests={updateGuestCount}
          />
        </div>

        <Button 
          onClick={handleReserve}
          className="w-full mt-6 bg-rose-600 hover:bg-rose-700 text-white py-3 text-lg font-semibold"
        >
          Reserve
        </Button>

        <p className="text-center text-sm text-gray-600 mt-2">
          You won't be charged yet
        </p>

        <PricingBreakdown property={property} totalNights={totalNights} />
      </CardContent>
    </Card>
  );
};

export default BookingCard;
