
// Security utilities for input sanitization and data protection
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove potential XSS characters and script injections
  return input
    .replace(/[<>"/]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/data:/gi, '')
    .trim()
    .slice(0, 1000); // Prevent excessively long inputs
};

export const sanitizeEmail = (email: string): string => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const sanitized = sanitizeInput(email).toLowerCase();
  return emailRegex.test(sanitized) ? sanitized : '';
};

export const sanitizePhone = (phone: string): string => {
  // Allow only numbers, spaces, hyphens, parentheses, and plus sign
  return phone.replace(/[^0-9\s\-\(\)\+]/g, '').trim().slice(0, 20);
};

// Enhanced input validation
export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  const sanitized = sanitizeEmail(email);
  if (!sanitized) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  }
  return null;
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
      // In production, log only essential error info without sensitive data
      console.error(`[ERROR] ${message}`);
    }
  },
  warn: (message: string, data?: any) => {
    if (isDevelopment()) {
      console.warn(`[WARN] ${message}`, data);
    }
  },
  debug: (message: string, data?: any) => {
    if (isDevelopment()) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }
};

// Content Security Policy helpers
export const generateNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Rate limiting helper for client-side
export const createRateLimiter = (maxAttempts: number, windowMs: number) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();
  
  return (key: string): boolean => {
    const now = Date.now();
    const record = attempts.get(key);
    
    if (!record || now > record.resetTime) {
      attempts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (record.count >= maxAttempts) {
      return false;
    }
    
    record.count++;
    return true;
  };
};
