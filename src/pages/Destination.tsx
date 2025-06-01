import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Star, MapPin, Loader2 } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  country: string;
  state_province: string;
  description: string;
  image_url: string;
}

interface Property {
  id: string;
  title: string;
  price_per_night: number;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  property_images: {
    image_url: string;
    is_primary: boolean;
  }[];
}

interface Experience {
  id: string;
  title: string;
  price_per_person: number;
  duration_hours: number;
  experience_images: {
    image_url: string;
    is_primary: boolean;
  }[];
}

const Destination = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchDestinationData();
    }
  }, [id]);

  const fetchDestinationData = async () => {
    try {
      // Fetch destination details
      const { data: destinationData, error: destinationError } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', id)
        .single();

      if (destinationError) throw destinationError;
      setDestination(destinationData);

      // Fetch properties in this destination
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          price_per_night,
          bedrooms,
          bathrooms,
          max_guests,
          property_images(image_url, is_primary)
        `)
        .eq('destination_id', id)
        .eq('is_active', true);

      if (propertiesError) throw propertiesError;
      setProperties(propertiesData || []);

      // Fetch experiences in this destination
      const { data: experiencesData, error: experiencesError } = await supabase
        .from('experiences')
        .select(`
          id,
          title,
          price_per_person,
          duration_hours,
          experience_images(image_url, is_primary)
        `)
        .eq('destination_id', id)
        .eq('is_active', true);

      if (experiencesError) throw experiencesError;
      setExperiences(experiencesData || []);
    } catch (error) {
      console.error('Error fetching destination data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Destination not found</h1>
            <p className="text-gray-600">The destination you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-96">
        <img 
          src={destination.image_url}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-8 left-8 text-white">
          <div className="flex items-center mb-2">
            <MapPin className="h-5 w-5 mr-2" />
            <span className="text-sm">
              {destination.state_province ? `${destination.state_province}, ` : ''}{destination.country}
            </span>
          </div>
          <h1 className="text-5xl font-bold">{destination.name}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Description */}
        {destination.description && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About {destination.name}</h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-4xl">
              {destination.description}
            </p>
          </div>
        )}

        {/* Properties Section */}
        {properties.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Villas & Properties</h2>
              <Link 
                to="/villas" 
                className="text-rose-600 hover:text-rose-700 font-medium"
              >
                View all villas
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => {
                const primaryImage = property.property_images?.find(img => img.is_primary) || property.property_images?.[0];
                const imageUrl = primaryImage?.image_url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop';

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
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between">
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
          </div>
        )}

        {/* Experiences Section */}
        {experiences.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Experiences</h2>
              <Link 
                to="/experiences" 
                className="text-rose-600 hover:text-rose-700 font-medium"
              >
                View all experiences
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiences.map((experience) => {
                const primaryImage = experience.experience_images?.find(img => img.is_primary) || experience.experience_images?.[0];
                const imageUrl = primaryImage?.image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';

                return (
                  <Link 
                    key={experience.id}
                    to={`/experience/${experience.id}`}
                    className="group cursor-pointer transform hover:scale-105 transition-transform duration-300"
                  >
                    <div className="relative">
                      <img 
                        src={imageUrl}
                        alt={experience.title}
                        className="w-full h-64 object-cover rounded-xl group-hover:shadow-lg transition-shadow duration-300"
                      />
                      <div className="absolute top-3 left-3 bg-white text-gray-900 px-2 py-1 rounded-md text-xs font-medium">
                        {experience.duration_hours} hours
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-900">4.8</span>
                          <span className="text-sm text-gray-600">(124)</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mt-1">{experience.title}</h3>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        From ${experience.price_per_person} <span className="text-sm font-normal text-gray-600">per person</span>
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* No content message */}
        {properties.length === 0 && experiences.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No properties or experiences available in this destination yet.</p>
            <p className="text-gray-500 mt-2">Check back soon for new offerings!</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Destination;
