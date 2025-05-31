
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BookingSuccess = () => {
  const location = useLocation();
  const { property, checkIn, checkOut, guests, totalAmount } = location.state || {};

  if (!property) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
            <Link to="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Your reservation has been successfully created. You'll receive a confirmation email shortly.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-4">
              <img
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&h=150&fit=crop"
                alt={property.title}
                className="w-24 h-18 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{property.title}</h3>
                <p className="text-gray-600">{property.property_type}</p>
                <p className="text-sm text-gray-500">{property.address}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <h4 className="font-medium text-sm text-gray-700">Check-in</h4>
                <p className="text-lg">{format(checkIn, 'MMM dd, yyyy')}</p>
                <p className="text-sm text-gray-500">After 3:00 PM</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-700">Check-out</h4>
                <p className="text-lg">{format(checkOut, 'MMM dd, yyyy')}</p>
                <p className="text-sm text-gray-500">Before 11:00 AM</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-700">Guests</h4>
                <p className="text-lg">{guests} guest{guests > 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Paid</span>
                <span className="text-2xl font-bold text-green-600">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <div className="space-x-4">
            <Link to="/dashboard">
              <Button>View My Trips</Button>
            </Link>
            <Link to="/">
              <Button variant="outline">Continue Exploring</Button>
            </Link>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Need help? Contact our support team at support@luxebysea.com</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookingSuccess;
