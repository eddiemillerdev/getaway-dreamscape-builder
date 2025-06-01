
import { Separator } from '@/components/ui/separator';

interface Property {
  price_per_night: number;
  cleaning_fee: number;
  service_fee: number;
}

interface PricingBreakdownProps {
  property: Property;
  totalNights: number;
}

const PricingBreakdown = ({ property, totalNights }: PricingBreakdownProps) => {
  if (totalNights <= 0) return null;

  const subtotal = totalNights * property.price_per_night;
  const cleaningFee = property.cleaning_fee || 0;
  const serviceFee = property.service_fee || 0;
  const total = subtotal + cleaningFee + serviceFee;

  return (
    <>
      <Separator className="my-6" />
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="underline">${property.price_per_night} x {totalNights} nights</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {cleaningFee > 0 && (
          <div className="flex justify-between">
            <span className="underline">Cleaning fee</span>
            <span>${cleaningFee.toFixed(2)}</span>
          </div>
        )}
        {serviceFee > 0 && (
          <div className="flex justify-between">
            <span className="underline">Service fee</span>
            <span>${serviceFee.toFixed(2)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </>
  );
};

export default PricingBreakdown;
