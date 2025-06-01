
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  password: string;
}

interface GuestDetailsFormProps {
  guestDetails: GuestDetails;
  setGuestDetails: (details: GuestDetails) => void;
}

const GuestDetailsForm = ({ guestDetails, setGuestDetails }: GuestDetailsFormProps) => {
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.user_metadata) {
      console.log('User metadata:', user.user_metadata);
      console.log('User email:', user.email);
      
      setGuestDetails({
        ...guestDetails,
        firstName: user.user_metadata.first_name || '',
        lastName: user.user_metadata.last_name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof GuestDetails, value: string) => {
    setGuestDetails({
      ...guestDetails,
      [field]: value
    });
  };

  return (
    <Card id="guest-details">
      <CardHeader>
        <CardTitle>Guest details</CardTitle>
        <CardDescription>
          {user 
            ? "Your information has been pre-filled from your account"
            : "Please provide the primary guest's information"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={guestDetails.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="John"
            />
            <div id="firstName-error" className="text-sm text-red-500 mt-1 hidden">First name is required</div>
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={guestDetails.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Doe"
            />
            <div id="lastName-error" className="text-sm text-red-500 mt-1 hidden">Last name is required</div>
          </div>
        </div>
        {!user && (
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={guestDetails.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="john@example.com"
            />
            <div id="email-error" className="text-sm text-red-500 mt-1 hidden">Valid email is required</div>
          </div>
        )}
        {!user && (
          <div>
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={guestDetails.password || ''}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Enter a password for your account"
            />
            <div id="password-error" className="text-sm text-red-500 mt-1 hidden">Password is required</div>
            <p className="text-xs text-gray-500 mt-1">
              We'll create an account for you to manage your bookings
            </p>
          </div>
        )}
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={guestDetails.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={guestDetails.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="123 Main St, City, State"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestDetailsForm;
