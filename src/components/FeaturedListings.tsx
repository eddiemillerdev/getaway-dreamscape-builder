
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Property {
  id: string;
  title: string;
  property_type: string;
  price_per_night: number;
  address: string;
  property_images: { image_url: string; is_primary: boolean }[];
}

const FeaturedListings = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          property_type,
          price_per_night,
          address,
          property_images (
            image_url,
            is_primary
          )
        `)
        .eq('is_active', true)
        .limit(8);

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8">Featured stays</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 h-64 rounded-xl mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // If no properties from database, show sample data
  const sampleProperties = [
    {
      id: 'sample-1',
      title: 'Oceanfront Villa in Malibu',
      property_type: 'Villa',
      price_per_night: 850,
      address: 'Malibu, California',
      property_images: [{ image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop', is_primary: true }]
    },
    {
      id: 'sample-2',
      title: 'Mountain Chalet in Aspen',
      property_type: 'Chalet',
      price_per_night: 1200,
      address: 'Aspen, Colorado',
      property_images: [{ image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop', is_primary: true }]
    },
    {
      id: 'sample-3',
      title: 'Wine Country Estate',
      property_type: 'Estate',
      price_per_night: 950,
      address: 'Napa Valley, California',
      property_images: [{ image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop', is_primary: true }]
    },
    {
      id: 'sample-4',
      title: 'Tropical Paradise Villa',
      property_type: 'Villa',
      price_per_night: 750,
      address: 'Key West, Florida',
      property_images: [{ image_url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop', is_primary: true }]
    },
    {
      id: 'sample-5',
      title: 'Cliffside Retreat',
      property_type: 'House',
      price_per_night: 680,
      address: 'Big Sur, California',
      property_images: [{ image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop', is_primary: true }]
    },
    {
      id: 'sample-6',
      title: 'Modern Beach House',
      property_type: 'House',
      price_per_night: 890,
      address: 'Santa Monica, California',
      property_images: [{ image_url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop', is_primary: true }]
    },
    {
      id: 'sample-7',
      title: 'Desert Oasis Villa',
      property_type: 'Villa',
      price_per_night: 720,
      address: 'Scottsdale, Arizona',
      property_images: [{ image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop', is_primary: true }]
    },
    {
      id: 'sample-8',
      title: 'Lakefront Cabin',
      property_type: 'Cabin',
      price_per_night: 450,
      address: 'Lake Tahoe, California',
      property_images: [{ image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop', is_primary: true }]
    }
  ];

  const displayProperties = properties.length > 0 ? properties : sampleProperties;

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-900 mb-8">Featured stays</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayProperties.map((property) => {
          const primaryImage = property.property_images?.find(img => img.is_primary) || property.property_images?.[0];
          
          return (
            <Link 
              key={property.id}
              to={`/property/${property.id}`}
              className="group cursor-pointer transform hover:scale-105 transition-transform duration-300"
            >
              <div className="relative">
                <img 
                  src={primaryImage?.image_url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop'}
                  alt={property.title}
                  className="w-full h-64 object-cover rounded-xl group-hover:shadow-lg transition-shadow duration-300"
                />
                <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">{property.address}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-900">4.8</span>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-1">{property.title}</h3>
                <p className="text-sm text-gray-600">{property.property_type}</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  ${property.price_per_night} <span className="text-sm font-normal text-gray-600">night</span>
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedListings;
