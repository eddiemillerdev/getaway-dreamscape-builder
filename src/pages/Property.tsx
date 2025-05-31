
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Share, MapPin, Users, Bed, Bath, Wifi, Car } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInDays } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [nights, setNights] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  useEffect(() => {
    if (checkIn && checkOut && property) {
      const nightCount = differenceInDays(checkOut, checkIn);
      setNights(nightCount);
      const subtotal = nightCount * property.price_per_night;
      const total = subtotal + property.cleaning_fee + property.service_fee;
      setTotalAmount(total);
    }
  }, [checkIn, checkOut, property]);

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

  const handleBooking = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!checkIn || !checkOut) {
      toast({
        title: 'Please select dates',
        description: 'You need to select check-in and check-out dates',
        variant: 'destructive',
      });
      return;
    }

    navigate('/booking', {
      state: {
        property,
        checkIn,
        checkOut,
        guests,
        nights,
        totalAmount,
      },
    });
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

  const primaryImage = images.find(img => img.is_primary) || images[0];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span>4.8 (124 reviews)</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{property.address}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8 rounded-xl overflow-hidden">
          <div className="md:col-span-2">
            {primaryImage && (
              <img
                src={primaryImage.image_url}
                alt={property.title}
                className="w-full h-80 md:h-96 object-cover"
              />
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
            {images.slice(1, 5).map((image, index) => (
              <img
                key={index}
                src={image.image_url}
                alt={`${property.title} ${index + 1}`}
                className="w-full h-40 md:h-[11.5rem] object-cover"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Info */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    {property.property_type} hosted by John
                  </h2>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <span>{property.max_guests} guests</span>
                    <span>{property.bedrooms} bedrooms</span>
                    <span>{property.bathrooms} bathrooms</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              </div>

              <div className="border-t border-b py-6 space-y-4">
                <div className="flex items-start space-x-4">
                  <Home className="h-6 w-6 text-gray-400 mt-1" />
                  <div>
                    <h3 className="font-medium">Entire {property.property_type}</h3>
                    <p className="text-gray-600 text-sm">You'll have the {property.property_type} to yourself.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Bed className="h-6 w-6 text-gray-400 mt-1" />
                  <div>
                    <h3 className="font-medium">Enhanced Clean</h3>
                    <p className="text-gray-600 text-sm">This property is committed to our enhanced cleaning protocol.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities?.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Wifi className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>${property.price_per_night} <span className="text-base font-normal">night</span></span>
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>4.8 (124)</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-gray-700 uppercase">Check-in</label>
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 uppercase">Check-out</label>
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      disabled={(date) => date < new Date() || (checkIn && date <= checkIn)}
                      className="rounded-md border"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 uppercase">Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    {Array.from({ length: property.max_guests }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} guest{i > 0 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <Button onClick={handleBooking} className="w-full bg-rose-500 hover:bg-rose-600">
                  Reserve
                </Button>

                {checkIn && checkOut && (
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                      <span>${property.price_per_night} x {nights} nights</span>
                      <span>${(property.price_per_night * nights).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cleaning fee</span>
                      <span>${property.cleaning_fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span>${property.service_fee}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Property;
