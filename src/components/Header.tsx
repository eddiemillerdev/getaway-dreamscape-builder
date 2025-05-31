
import { useState } from 'react';
import { Search, User, Menu, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-rose-500">Wanderly</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-rose-500 transition-colors">Stays</a>
            <a href="#" className="text-gray-700 hover:text-rose-500 transition-colors">Experiences</a>
            <a href="#" className="text-gray-700 hover:text-rose-500 transition-colors">Online Experiences</a>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <button className="hidden lg:flex items-center text-sm text-gray-700 hover:text-rose-500 transition-colors">
              Become a Host
            </button>
            
            <button className="p-2 text-gray-700 hover:text-rose-500 transition-colors">
              <Globe className="h-4 w-4" />
            </button>

            <div className="flex items-center border border-gray-300 rounded-full p-2 hover:shadow-md transition-shadow">
              <button 
                className="p-1"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-4 w-4" />
              </button>
              <button className="p-1 ml-2">
                <User className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
