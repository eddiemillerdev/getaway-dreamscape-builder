
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Property {
  id: string;
  title: string;
  property_type: string;
  price_per_night: number;
  cleaning_fee: number;
  service_fee: number;
}

interface BookingSummaryProps {
  property: Property;
  nights: number;
  totalAmount: number;
  onConfirmBooking: () => void;
  loading: boolean;
}

const BookingSummary = ({ property, nights, totalAmount, onConfirmBooking, loading }: BookingSummaryProps) => {
  return (
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
            <span>${(property.cleaning_fee || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>${(property.service_fee || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Total (USD)</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <Button 
          onClick={onConfirmBooking} 
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
  );
};

export default BookingSummary;
