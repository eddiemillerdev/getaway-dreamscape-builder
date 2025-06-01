
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Users, Minus, Plus } from 'lucide-react';

interface GuestCount {
  adults: number;
  children: number;
  infants: number;
}

interface GuestCounterProps {
  guests: GuestCount;
  maxGuests: number;
  onUpdateGuests: (type: keyof GuestCount, operation: 'increment' | 'decrement') => void;
}

const GuestCounter = ({ guests, maxGuests, onUpdateGuests }: GuestCounterProps) => {
  const totalGuests = guests.adults + guests.children;

  return (
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
                onClick={() => onUpdateGuests('adults', 'decrement')}
                disabled={guests.adults <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center">{guests.adults}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
                onClick={() => onUpdateGuests('adults', 'increment')}
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
                onClick={() => onUpdateGuests('children', 'decrement')}
                disabled={guests.children <= 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center">{guests.children}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
                onClick={() => onUpdateGuests('children', 'increment')}
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
                onClick={() => onUpdateGuests('infants', 'decrement')}
                disabled={guests.infants <= 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center">{guests.infants}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
                onClick={() => onUpdateGuests('infants', 'increment')}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Maximum {maxGuests} guests (excluding infants)
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GuestCounter;
