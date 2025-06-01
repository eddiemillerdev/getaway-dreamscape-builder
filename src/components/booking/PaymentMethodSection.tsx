import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PaymentMethod {
  type: string;
  details: string;
  name: string;
  brand: string;
}

interface PaymentMethodSectionProps {
  paymentMethod: PaymentMethod | null;
  onSelectPayment: () => void;
}

const PaymentMethodSection = ({ paymentMethod, onSelectPayment }: PaymentMethodSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment method</CardTitle>
        <CardDescription>
          Choose how you'd like to pay
        </CardDescription>
      </CardHeader>
      <CardContent>
        {paymentMethod ? (
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">{paymentMethod.type}</p>
              <p className="text-sm text-gray-600">{paymentMethod.details}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onSelectPayment}>
              Change
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onSelectPayment}
          >
            Select Payment Method
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSection;
