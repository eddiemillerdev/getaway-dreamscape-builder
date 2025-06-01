
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, ChevronDown, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { scrollToTop } from '@/utils/scrollToTop';
import SearchBar from './SearchBar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Show search bar when scrolled past the hero section (around 400px)
      if (location.pathname === '/') {
        setShowSearchBar(window.scrollY > 400);
      } else {
        setShowSearchBar(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    scrollToTop();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    scrollToTop();
    setIsOpen(false);
  };

  const isActivePage = (path: string) => {
    if (path === '/homes') {
      return location.pathname === '/homes' || 
             location.pathname.startsWith('/home/') || 
             location.pathname === '/booking' || 
             location.pathname === '/booking-success';
    }
    return location.pathname === path;
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" onClick={scrollToTop} className="flex items-center">
            <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-bold text-2xl text-gray-900 tracking-tight">
              luxebysea
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavigation('/homes')}
              className={`font-medium relative pb-2 transition-colors ${
                isActivePage('/homes')
                  ? 'text-teal-500'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Homes
              {isActivePage('/homes') && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => handleNavigation('/destinations')}
              className={`font-medium relative pb-2 transition-colors ${
                isActivePage('/destinations')
                  ? 'text-teal-500'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Destinations
              {isActivePage('/destinations') && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => handleNavigation('/experiences')}
              className={`font-medium relative pb-2 transition-colors ${
                isActivePage('/experiences')
                  ? 'text-teal-500'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Experiences
              {isActivePage('/experiences') && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-full" />
              )}
            </button>
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2 px-4 py-2 rounded-full border-gray-300 hover:border-gray-400 hover:shadow-md transition-all"
                  >
                    <Menu className="h-4 w-4" />
                    <User className="h-4 w-4" />
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={() => handleNavigation('/dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation('/dashboard')}>
                    My Trips
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation('/dashboard')}>
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <button onClick={() => handleNavigation('/auth')}>
                  <Button variant="ghost">Sign In</Button>
                </button>
                <button onClick={() => handleNavigation('/auth')}>
                  <Button>Sign Up</Button>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Scroll-triggered Search Bar */}
        {showSearchBar && (
          <div className="pb-4 animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <SearchBar />
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <button
                onClick={() => handleNavigation('/homes')}
                className={`block w-full text-left px-3 py-2 ${
                  isActivePage('/homes')
                    ? 'text-teal-500 font-medium'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Homes
              </button>
              <button
                onClick={() => handleNavigation('/destinations')}
                className={`block w-full text-left px-3 py-2 ${
                  isActivePage('/destinations')
                    ? 'text-teal-500 font-medium'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Destinations
              </button>
              <button
                onClick={() => handleNavigation('/experiences')}
                className={`block w-full text-left px-3 py-2 ${
                  isActivePage('/experiences')
                    ? 'text-teal-500 font-medium'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Experiences
              </button>
              {user ? (
                <>
                  <button
                    onClick={() => handleNavigation('/dashboard')}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigation('/auth')}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleNavigation('/auth')}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
