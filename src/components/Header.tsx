
import { useState } from 'react';
import { Search, User, Menu, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="bg-blue-600 text-white px-3 py-2 rounded-md">
              <h1 className="text-xl font-bold tracking-wide">LUXEBYSEA</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/villas" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Villas</Link>
            <Link to="/destinations" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Destinations</Link>
            <Link to="/experiences" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Experiences</Link>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <Link to="/auth" className="hidden lg:flex items-center text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Become a Host
            </Link>
            
            <button className="p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <Globe className="h-4 w-4" />
            </button>

            <div className="flex items-center border border-gray-300 rounded-full p-2 hover:shadow-md transition-shadow">
              <button 
                className="p-1"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-4 w-4" />
              </button>
              <Link to="/auth" className="p-1 ml-2">
                <User className="h-5 w-5 text-gray-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
