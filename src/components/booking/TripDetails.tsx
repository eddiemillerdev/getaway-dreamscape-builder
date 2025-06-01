
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface TripDetailsProps {
  checkIn: Date;
  checkOut: Date;
  guests: number;
  onEdit: () => void;
}

const TripDetails = ({ checkIn, checkOut, guests, onEdit }: TripDetailsProps) => {
  return (
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
          <Button variant="ghost" size="sm" onClick={onEdit}>
            Edit
          </Button>
        </div>
        <div className="flex justify-between">
          <div>
            <h4 className="font-medium">Guests</h4>
            <p className="text-sm text-gray-600">{guests} guest{guests > 1 ? 's' : ''}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripDetails;
