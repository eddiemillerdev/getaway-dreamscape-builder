
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
}

interface GuestDetailsFormProps {
  guestDetails: GuestDetails;
  setGuestDetails: (details: GuestDetails) => void;
}

const GuestDetailsForm = ({ guestDetails, setGuestDetails }: GuestDetailsFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Guest details</CardTitle>
        <CardDescription>
          Please provide the primary guest's information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={guestDetails.firstName}
              onChange={(e) => setGuestDetails({...guestDetails, firstName: e.target.value})}
              placeholder="John"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={guestDetails.lastName}
              onChange={(e) => setGuestDetails({...guestDetails, lastName: e.target.value})}
              placeholder="Doe"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={guestDetails.email}
            onChange={(e) => setGuestDetails({...guestDetails, email: e.target.value})}
            placeholder="john@example.com"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={guestDetails.phone}
            onChange={(e) => setGuestDetails({...guestDetails, phone: e.target.value})}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={guestDetails.address}
            onChange={(e) => setGuestDetails({...guestDetails, address: e.target.value})}
            placeholder="123 Main St, City, State"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestDetailsForm;
