
import { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const SearchBar = () => {
  const [activeTab, setActiveTab] = useState('villas');
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(1);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-4xl mx-auto">
      {/* Tab Buttons */}
      <div className="flex border-b border-gray-100 px-6">
        <button
          onClick={() => setActiveTab('villas')}
          className={`px-6 py-4 text-sm font-semibold transition-colors ${
            activeTab === 'villas' 
              ? 'text-gray-900 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Villas
        </button>
        <button
          onClick={() => setActiveTab('experiences')}
          className={`px-6 py-4 text-sm font-semibold transition-colors ${
            activeTab === 'experiences' 
              ? 'text-gray-900 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Experiences
        </button>
      </div>

      {/* Search Fields */}
      <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {/* Where */}
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Where</p>
              <input 
                type="text" 
                placeholder="Search destinations"
                className="text-sm text-gray-600 placeholder-gray-400 border-none outline-none w-full bg-transparent mt-1 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Check in */}
        <div className="p-4">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center space-x-3 cursor-pointer">
                <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Check in</p>
                  <p className="text-sm text-gray-600 mt-1 font-medium">
                    {checkIn ? format(checkIn, 'MMM dd') : 'Add dates'}
                  </p>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check out */}
        <div className="p-4">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center space-x-3 cursor-pointer">
                <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Check out</p>
                  <p className="text-sm text-gray-600 mt-1 font-medium">
                    {checkOut ? format(checkOut, 'MMM dd') : 'Add dates'}
                  </p>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
                disabled={(date) => date < new Date() || (checkIn && date <= checkIn)}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Who */}
        <div className="p-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <Users className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Who</p>
                <p className="text-sm text-gray-600 mt-1 font-medium">
                  {guests} guest{guests !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-12 w-12 p-0 ml-4 flex-shrink-0">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
