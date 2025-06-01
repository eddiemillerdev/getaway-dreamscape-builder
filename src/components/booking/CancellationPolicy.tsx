
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CancellationPolicy = () => {
  return (
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
  );
};

export default CancellationPolicy;
