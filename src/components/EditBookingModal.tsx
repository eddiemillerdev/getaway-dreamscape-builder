
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Users, Minus, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface EditBookingModalProps {
  open: boolean;
  onClose: () => void;
  initialCheckIn: Date;
  initialCheckOut: Date;
  initialGuests: number;
  maxGuests: number;
  onSave: (checkIn: Date, checkOut: Date, guests: number) => void;
}

interface GuestCount {
  adults: number;
  children: number;
  infants: number;
}

const EditBookingModal = ({ 
  open, 
  onClose, 
  initialCheckIn, 
  initialCheckOut, 
  initialGuests, 
  maxGuests, 
  onSave 
}: EditBookingModalProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: initialCheckIn,
    to: initialCheckOut
  });
  const [guests, setGuests] = useState<GuestCount>({ 
    adults: Math.max(1, initialGuests - 1), 
    children: Math.max(0, initialGuests - 1), 
    infants: 0 
  });

  useEffect(() => {
    if (open) {
      setDateRange({
        from: initialCheckIn,
        to: initialCheckOut
      });
      setGuests({ 
        adults: Math.max(1, Math.min(initialGuests, maxGuests - 1)), 
        children: Math.max(0, initialGuests - Math.max(1, Math.min(initialGuests, maxGuests - 1))), 
        infants: 0 
      });
    }
  }, [open, initialCheckIn, initialCheckOut, initialGuests, maxGuests]);

  const updateGuestCount = (type: keyof GuestCount, operation: 'increment' | 'decrement') => {
    setGuests(prev => {
      const newCount = { ...prev };
      const totalGuests = prev.adults + prev.children;
      
      if (operation === 'increment') {
        if ((type === 'adults' || type === 'children') && totalGuests >= maxGuests) {
          return prev;
        }
        newCount[type] += 1;
      } else if (operation === 'decrement' && prev[type] > 0) {
        if (type === 'adults' && prev[type] <= 1) return prev;
        newCount[type] -= 1;
      }
      return newCount;
    });
  };

  const handleSave = () => {
    if (dateRange?.from && dateRange?.to) {
      onSave(dateRange.from, dateRange.to, guests.adults + guests.children);
      onClose();
    }
  };

  const totalGuests = guests.adults + guests.children;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit your reservation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Date Range Picker */}
          <div>
            <h3 className="font-medium mb-3">Dates</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-14"
                >
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
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Guest Picker */}
          <div>
            <h3 className="font-medium mb-3">Guests</h3>
            <div className="border rounded-lg p-4 space-y-4">
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
                    disabled={totalGuests >= maxGuests}
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
                    disabled={totalGuests >= maxGuests}
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
                Maximum {maxGuests} guests (excluding infants)
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!dateRange?.from || !dateRange?.to}
            >
              Save changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditBookingModal;
