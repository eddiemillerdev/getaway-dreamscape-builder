
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
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

const PropertySkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    {/* Header Skeleton */}
    <div className="mb-6">
      <Skeleton className="h-8 w-2/3 mb-2" />
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>

    {/* Images Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8 rounded-xl overflow-hidden">
      <div className="md:col-span-2">
        <Skeleton className="w-full h-80 md:h-96" />
      </div>
      <div className="md:col-span-2">
        <Skeleton className="w-full h-80 md:h-96" />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* Property Info Skeleton */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <Skeleton className="h-6 w-64 mb-2" />
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-18" />
              </div>
            </div>
            <Skeleton className="w-12 h-12 rounded-full" />
          </div>

          <div className="border-t border-b py-6 space-y-4">
            <div className="flex items-start space-x-4">
              <Skeleton className="h-6 w-6" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Skeleton className="h-6 w-6" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Amenities Skeleton */}
        <div>
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Skeleton */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-20" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, j) => (
                      <Skeleton key={j} className="h-4 w-4" />
                    ))}
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Card Skeleton */}
      <div className="space-y-6">
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          
          <div className="mb-4">
            <Skeleton className="h-4 w-12 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          
          <Skeleton className="h-12 w-full mb-4" />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex justify-between border-t pt-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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
        <PropertySkeleton />
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
