import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyHeader from '@/components/PropertyHeader';
import PropertyImages from '@/components/PropertyImages';
import PropertyInfo from '@/components/PropertyInfo';
import BookingCard from '@/components/BookingCard';
import PropertyReviews from '@/components/PropertyReviews';

interface Property {
  id: string;
  title: string;
  description: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  price_per_night: number;
  cleaning_fee: number;
  service_fee: number;
  address: string;
  amenities: string[];
  house_rules: string[];
}

interface PropertyImage {
  image_url: string;
  is_primary: boolean;
}

const Property = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (propertyError) throw propertyError;

      const { data: imagesData, error: imagesError } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', id)
        .order('display_order');

      if (imagesError) throw imagesError;

      setProperty(propertyData);
      setImages(imagesData || []);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast({
        title: 'Error',
        description: 'Could not load property details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Property not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PropertyHeader title={property.title} address={property.address} />
        <PropertyImages images={images} title={property.title} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <PropertyInfo property={property} />
            <PropertyReviews propertyId={property.id} />
          </div>
          <BookingCard property={property} />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Property;
