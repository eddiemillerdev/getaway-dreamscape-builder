
import { useState, useEffect, useCallback } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import { Skeleton } from '@/components/ui/skeleton';

interface Property {
  id: string;
  title: string;
  price_per_night: number;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  property_type: string;
  destination: {
    name: string;
    country: string;
    state_province: string;
  };
  property_images: {
    image_url: string;
    is_primary: boolean;
  }[];
}

const PROPERTIES_PER_PAGE = 12;

const Homes = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchHomes(0, true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 &&
        !loadingMore &&
        hasMore
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore]);

  const fetchHomes = async (pageNum: number, reset: boolean = false) => {
    try {
      const from = pageNum * PROPERTIES_PER_PAGE;
      const to = from + PROPERTIES_PER_PAGE - 1;

      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          price_per_night,
          bedrooms,
          bathrooms,
          max_guests,
          property_type,
          destination:destinations(name, country, state_province),
          property_images(image_url, is_primary)
        `)
        .eq('is_active', true)
        .in('property_type', ['villa'])
        .range(from, to);

      if (error) throw error;

      const newProperties = data || [];
      
      if (reset) {
        setProperties(newProperties);
      } else {
        setProperties(prev => [...prev, ...newProperties]);
      }
      
      setHasMore(newProperties.length === PROPERTIES_PER_PAGE);
    } catch (error) {
      console.error('Error fetching homes:', error);
    } finally {
      if (reset) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchHomes(nextPage);
    }
  }, [page, loadingMore, hasMore]);

  const handleSearch = (destination: string, dateRange: any, guests: any) => {
    console.log('Search:', { destination, dateRange, guests });
    // Here you could navigate to a search results page or filter homes
  };

  const PropertySkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="h-64 w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">Luxury Homes</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover our collection of premium homes around the world
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(12)].map((_, i) => (
              <PropertySkeleton key={i} />
            ))}
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
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Luxury Homes</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our collection of premium homes around the world
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Homes Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {properties.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No homes available at the moment.</p>
            <p className="text-gray-500 mt-2">Please check back later or browse our other properties.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Homes</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From beachfront escapes to mountain retreats, find your perfect home getaway
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => {
                const primaryImage = property.property_images?.find(img => img.is_primary) || property.property_images?.[0];
                const imageUrl = primaryImage?.image_url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop';
                const location = property.destination ? `${property.destination.name}, ${property.destination.state_province}` : 'Location';

                return (
                  <Link 
                    key={property.id}
                    to={`/home/${property.id}`}
                    className="group cursor-pointer transform hover:scale-105 transition-transform duration-300"
                  >
                    <div className="relative">
                      <img 
                        src={imageUrl}
                        alt={property.title}
                        className="w-full h-64 object-cover rounded-xl group-hover:shadow-lg transition-shadow duration-300"
                      />
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">{location}</p>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-900">4.8</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mt-1">{property.title}</h3>
                      <p className="text-sm text-gray-600">{property.bedrooms} bed · {property.bathrooms} bath · {property.max_guests} guests</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        ${property.price_per_night} <span className="text-sm font-normal text-gray-600">night</span>
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            {/* Loading More */}
            {loadingMore && (
              <div className="mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <PropertySkeleton key={i} />
                  ))}
                </div>
              </div>
            )}
            
            {!hasMore && properties.length > 0 && (
              <div className="text-center mt-12">
                <p className="text-gray-600">You've seen all available homes</p>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Homes;
