
import { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface SearchBarProps {
  onSearch?: (destination: string, dateRange: DateRange | undefined, guests: GuestCount) => void;
}

interface GuestCount {
  adults: number;
  children: number;
  infants: number;
}

const destinations = [
  'Malibu, California',
  'Aspen, Colorado',
  'Napa Valley, California',
  'Key West, Florida',
  'Big Sur, California',
  'Santa Monica, California',
  'Scottsdale, Arizona',
  'Lake Tahoe, California',
  'Miami Beach, Florida',
  'Martha\'s Vineyard, Massachusetts',
  'Jackson Hole, Wyoming',
  'Carmel-by-the-Sea, California'
];

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [destination, setDestination] = useState('');
  const [showDestinations, setShowDestinations] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState<GuestCount>({ adults: 2, children: 0, infants: 0 });

  const filteredDestinations = destinations.filter(dest =>
    dest.toLowerCase().includes(destination.toLowerCase())
  );

  const totalGuests = guests.adults + guests.children;

  const updateGuestCount = (type: keyof GuestCount, operation: 'increment' | 'decrement') => {
    setGuests(prev => {
      const newCount = { ...prev };
      if (operation === 'increment') {
        newCount[type] += 1;
      } else if (operation === 'decrement' && prev[type] > 0) {
        if (type === 'adults' && prev[type] <= 1) return prev; // Minimum 1 adult
        newCount[type] -= 1;
      }
      return newCount;
    });
  };

  const handleSearch = () => {
    onSearch?.(destination, dateRange, guests);
  };

  return (
    <div className="bg-white rounded-full shadow-xl border border-gray-200 p-2 flex items-center max-w-4xl mx-auto">
      {/* Destination */}
      <div className="flex-1 relative">
        <div className="flex items-center px-4 py-3">
          <MapPin className="h-5 w-5 text-gray-400 mr-3" />
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-700 block">Where</label>
            <Input
              type="text"
              placeholder="Search destinations"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setShowDestinations(true);
              }}
              onFocus={() => setShowDestinations(true)}
              className="border-0 p-0 text-sm font-medium text-gray-900 placeholder-gray-500 focus:ring-0"
            />
          </div>
        </div>
        
        {showDestinations && destination && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
            {filteredDestinations.map((dest, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                onClick={() => {
                  setDestination(dest);
                  setShowDestinations(false);
                }}
              >
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-900">{dest}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-8 w-px bg-gray-300"></div>

      {/* Date Range */}
      <div className="flex-1">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center px-4 py-3 w-full text-left">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-700 block">When</label>
                <span className="text-sm font-medium text-gray-900">
                  {dateRange?.from ? (
                    dateRange.to ? (
                      `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}`
                    ) : (
                      format(dateRange.from, 'MMM dd')
                    )
                  ) : (
                    'Add dates'
                  )}
                </span>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="h-8 w-px bg-gray-300"></div>

      {/* Guests */}
      <div className="flex-1">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center px-4 py-3 w-full text-left">
              <Users className="h-5 w-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-700 block">Who</label>
                <span className="text-sm font-medium text-gray-900">
                  {totalGuests} guest{totalGuests !== 1 ? 's' : ''}
                  {guests.infants > 0 && `, ${guests.infants} infant${guests.infants !== 1 ? 's' : ''}`}
                </span>
              </div>
            </button>
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
                    -
                  </Button>
                  <span className="w-8 text-center">{guests.adults}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => updateGuestCount('adults', 'increment')}
                  >
                    +
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
                    -
                  </Button>
                  <span className="w-8 text-center">{guests.children}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => updateGuestCount('children', 'increment')}
                  >
                    +
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
                    -
                  </Button>
                  <span className="w-8 text-center">{guests.infants}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => updateGuestCount('infants', 'increment')}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Search Button */}
      <Button 
        onClick={handleSearch}
        className="bg-rose-500 hover:bg-rose-600 text-white rounded-full p-3 ml-2"
      >
        <Search className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default SearchBar;
