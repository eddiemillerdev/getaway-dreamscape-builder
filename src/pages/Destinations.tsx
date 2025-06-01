
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  country: string;
  state_province: string;
  description: string;
  image_url: string;
}

const Destinations = () => {
  const { data: destinations, isLoading, error } = useQuery({
    queryKey: ['destinations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Destination[];
    },
  });

  const handleSearch = (destination: string, dateRange: any, guests: any) => {
    console.log('Search:', { destination, dateRange, guests });
    // Here you could navigate to a search results page or filter destinations
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error loading destinations</h1>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Explore Amazing Destinations</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover breathtaking locations around the world for your next unforgettable getaway
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From bustling cities to serene beaches, find the perfect destination for your next adventure
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {destinations?.map((destination) => (
                <div 
                  key={destination.id}
                  className="group cursor-pointer transform hover:scale-105 transition-all duration-300 bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={destination.image_url}
                      alt={destination.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{destination.name}</h3>
                      <p className="text-sm text-gray-200">
                        {destination.state_province ? `${destination.state_province}, ` : ''}{destination.country}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 text-sm line-clamp-3">{destination.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Destinations;
