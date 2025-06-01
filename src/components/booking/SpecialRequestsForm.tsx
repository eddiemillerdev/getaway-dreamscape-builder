
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface SpecialRequestsFormProps {
  specialRequests: string;
  setSpecialRequests: (requests: string) => void;
}

const SpecialRequestsForm = ({ specialRequests, setSpecialRequests }: SpecialRequestsFormProps) => {
  return (
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
  );
};

export default SpecialRequestsForm;
