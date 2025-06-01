
import { CreditCard, Circle } from 'lucide-react';

interface CreditCardIconProps {
  type: string;
  className?: string;
}

const CreditCardIcons = ({ type, className = "h-6 w-6" }: CreditCardIconProps) => {
  switch (type) {
    case 'visa':
      return (
        <div className={`${className} bg-blue-600 text-white rounded flex items-center justify-center font-bold text-xs`}>
          VISA
        </div>
      );
    case 'mastercard':
      return (
        <div className={`${className} flex items-center justify-center`}>
          <Circle className="h-3 w-3 fill-red-500 text-red-500" />
          <Circle className="h-3 w-3 fill-yellow-500 text-yellow-500 -ml-2" />
        </div>
      );
    case 'amex':
      return (
        <div className={`${className} bg-blue-500 text-white rounded flex items-center justify-center font-bold text-xs`}>
          AMEX
        </div>
      );
    case 'discover':
      return (
        <div className={`${className} bg-orange-500 text-white rounded flex items-center justify-center font-bold text-xs`}>
          DISC
        </div>
      );
    default:
      return <CreditCard className={className} />;
  }
};

export default CreditCardIcons;
