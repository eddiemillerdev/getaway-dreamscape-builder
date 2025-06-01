
// Security utilities for input sanitization and data protection
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove potential XSS characters
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

export const sanitizeEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitized = sanitizeInput(email);
  return emailRegex.test(sanitized) ? sanitized : '';
};

export const sanitizePhone = (phone: string): string => {
  // Allow only numbers, spaces, hyphens, parentheses, and plus sign
  return phone.replace(/[^0-9\s\-\(\)\+]/g, '').trim();
};

// Environment check utilities
export const isDevelopment = () => import.meta.env.DEV;
export const isProduction = () => import.meta.env.PROD;

// Secure logging that respects environment
export const secureLog = {
  info: (message: string, data?: any) => {
    if (isDevelopment()) {
      console.log(`[INFO] ${message}`, data);
    }
  },
  error: (message: string, error?: any) => {
    if (isDevelopment()) {
      console.error(`[ERROR] ${message}`, error);
    } else {
      // In production, you might want to send errors to a logging service
      console.error(`[ERROR] ${message}`);
    }
  },
  warn: (message: string, data?: any) => {
    if (isDevelopment()) {
      console.warn(`[WARN] ${message}`, data);
    }
  }
};
