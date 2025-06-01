import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, Users, Minus, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface Property {
  id: string;
  title: string;
  price_per_night: number;
  cleaning_fee: number;
  service_fee: number;
  max_guests: number;
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

    navigate(`/booking/${property.id}`, {
      state: {
        property,
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
          {/* Date Range Picker */}
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal h-14"
              >
                <div className="flex items-center w-full">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <div className="flex-1">
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          <div className="text-xs text-gray-600">CHECK-IN / CHECK-OUT</div>
                          <div className="font-medium">
                            {format(dateRange.from, 'MMM dd')} - {format(dateRange.to, 'MMM dd')}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-xs text-gray-600">CHECK-IN</div>
                          <div className="font-medium">{format(dateRange.from, 'MMM dd')}</div>
                        </>
                      )
                    ) : (
                      <>
                        <div className="text-xs text-gray-600">CHECK-IN / CHECK-OUT</div>
                        <div className="text-gray-500">Add dates</div>
                      </>
                    )}
                  </div>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range);
                  if (range?.from && range?.to) {
                    setDatePickerOpen(false);
                  }
                }}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {/* Guest Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal h-14"
              >
                <div className="flex items-center w-full">
                  <Users className="mr-2 h-4 w-4" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-600">GUESTS</div>
                    <div className="font-medium">
                      {totalGuests} guest{totalGuests !== 1 ? 's' : ''}
                      {guests.infants > 0 && `, ${guests.infants} infant${guests.infants !== 1 ? 's' : ''}`}
                    </div>
                  </div>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="space-y-4">
                {/* Adults */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Adults</div>
                    <div className="text-sm text-gray-500">Ages 13 or above</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={() => updateGuestCount('adults', 'decrement')}
                      disabled={guests.adults <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{guests.adults}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={() => updateGuestCount('adults', 'increment')}
                      disabled={totalGuests >= property.max_guests}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Children</div>
                    <div className="text-sm text-gray-500">Ages 2-12</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={() => updateGuestCount('children', 'decrement')}
                      disabled={guests.children <= 0}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{guests.children}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={() => updateGuestCount('children', 'increment')}
                      disabled={totalGuests >= property.max_guests}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Infants */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Infants</div>
                    <div className="text-sm text-gray-500">Under 2</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={() => updateGuestCount('infants', 'decrement')}
                      disabled={guests.infants <= 0}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{guests.infants}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={() => updateGuestCount('infants', 'increment')}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Maximum {property.max_guests} guests (excluding infants)
                </div>
              </div>
            </PopoverContent>
          </Popover>
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

        {totalNights > 0 && (
          <>
            <Separator className="my-6" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="underline">${property.price_per_night} x {totalNights} nights</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {cleaningFee > 0 && (
                <div className="flex justify-between">
                  <span className="underline">Cleaning fee</span>
                  <span>${cleaningFee.toFixed(2)}</span>
                </div>
              )}
              {serviceFee > 0 && (
                <div className="flex justify-between">
                  <span className="underline">Service fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingCard;
