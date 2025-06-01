
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { sanitizeInput, sanitizeEmail, sanitizePhone } from '@/utils/security';

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
      setGuestDetails({
        ...guestDetails,
        firstName: sanitizeInput(user.user_metadata.first_name || ''),
        lastName: sanitizeInput(user.user_metadata.last_name || ''),
        email: user.email || '',
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof GuestDetails, value: string) => {
    let sanitizedValue = value;
    
    // Apply appropriate sanitization based on field type
    switch (field) {
      case 'email':
        sanitizedValue = sanitizeEmail(value);
        break;
      case 'phone':
        sanitizedValue = sanitizePhone(value);
        break;
      default:
        sanitizedValue = sanitizeInput(value);
        break;
    }

    setGuestDetails({
      ...guestDetails,
      [field]: sanitizedValue
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
              maxLength={50}
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
              maxLength={50}
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
              maxLength={100}
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
              minLength={8}
              maxLength={100}
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
            maxLength={20}
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={guestDetails.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="123 Main St, City, State"
            maxLength={200}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestDetailsForm;
