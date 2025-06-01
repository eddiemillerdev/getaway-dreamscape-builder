
export const getCreditCardType = (number: string): string => {
  const cleanNumber = number.replace(/\D/g, '');
  
  if (/^4/.test(cleanNumber)) return 'visa';
  if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
  if (/^3[47]/.test(cleanNumber)) return 'amex';
  if (/^6/.test(cleanNumber)) return 'discover';
  if (/^35/.test(cleanNumber)) return 'jcb';
  if (/^30/.test(cleanNumber)) return 'diners';
  
  return 'unknown';
};

export const formatCreditCard = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  const matches = cleanValue.match(/(\d{1,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
  
  if (!matches) return cleanValue;
  
  return [matches[1], matches[2], matches[3], matches[4]]
    .filter(Boolean)
    .join(' ')
    .trim();
};

export const formatExpiryDate = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length >= 2) {
    return cleanValue.slice(0, 2) + '/' + cleanValue.slice(2, 4);
  }
  return cleanValue;
};

export const validateCreditCard = (number: string): boolean => {
  const cleanNumber = number.replace(/\D/g, '');
  
  if (cleanNumber.length < 13 || cleanNumber.length > 19) return false;
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

export const validateExpiryDate = (expiry: string): boolean => {
  const cleanExpiry = expiry.replace(/\D/g, '');
  if (cleanExpiry.length !== 4) return false;
  
  const month = parseInt(cleanExpiry.slice(0, 2));
  const year = parseInt(cleanExpiry.slice(2, 4)) + 2000;
  
  if (month < 1 || month > 12) return false;
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }
  
  return true;
};
