
import { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SearchBar = () => {
  const [activeTab, setActiveTab] = useState('stays');

  return (
    <div className="bg-white rounded-full shadow-xl border border-gray-200 overflow-hidden">
      {/* Tab Buttons */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('stays')}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'stays' 
              ? 'text-gray-900 border-b-2 border-gray-900' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Stays
        </button>
        <button
          onClick={() => setActiveTab('experiences')}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'experiences' 
              ? 'text-gray-900 border-b-2 border-gray-900' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Experiences
        </button>
      </div>

      {/* Search Fields */}
      <div className="flex items-center divide-x divide-gray-200">
        <div className="flex-1 p-4">
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs font-medium text-gray-900">Where</p>
              <input 
                type="text" 
                placeholder="Search destinations"
                className="text-sm text-gray-500 placeholder-gray-400 border-none outline-none w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs font-medium text-gray-900">Check in</p>
              <p className="text-sm text-gray-500">Add dates</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs font-medium text-gray-900">Check out</p>
              <p className="text-sm text-gray-500">Add dates</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs font-medium text-gray-900">Who</p>
              <p className="text-sm text-gray-500">Add guests</p>
            </div>
          </div>
        </div>

        <div className="p-2">
          <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full p-4 h-12 w-12">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
