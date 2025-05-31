
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');

  const { property, checkIn, checkOut, guests, nights, totalAmount } = location.state || {};

  if (!property || !checkIn || !checkOut) {
    navigate('/');
    return null;
  }

  const handleBooking = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          guest_id: user.id,
          property_id: property.id,
          check_in_date: format(checkIn, 'yyyy-MM-dd'),
          check_out_date: format(checkOut, 'yyyy-MM-dd'),
          guests,
          total_amount: totalAmount,
          nights,
          special_requests: specialRequests || null,
        });

      if (error) throw error;

      toast({
        title: 'Booking Confirmed!',
        description: 'Your reservation has been successfully created.',
      });

      navigate('/booking-success', {
        state: {
          property,
          checkIn,
          checkOut,
          guests,
          totalAmount,
        },
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking Failed',
        description: 'There was an error processing your booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Confirm and pay</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Booking Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your trip</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">Dates</h4>
                    <p className="text-sm text-gray-600">
                      {format(checkIn, 'MMM dd')} - {format(checkOut, 'MMM dd')}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">Guests</h4>
                    <p className="text-sm text-gray-600">{guests} guest{guests > 1 ? 's' : ''}</p>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Special requests</CardTitle>
                <CardDescription>
                  Any special requests for your stay? (Optional)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Let your host know about any special requirements..."
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cancellation policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Free cancellation before 48 hours of check-in. After that, cancel before check-in and get a 50% refund, minus service fees.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Price Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start space-x-4">
                  <img
                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&h=150&fit=crop"
                    alt={property.title}
                    className="w-20 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{property.title}</h3>
                    <p className="text-sm text-gray-600">{property.property_type}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
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
                    <span>Total (USD)</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleBooking} 
                  className="w-full bg-rose-500 hover:bg-rose-600"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Confirm and pay'}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  You won't be charged yet. This is a demo booking system.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Booking;
