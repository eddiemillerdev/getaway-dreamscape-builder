
import { isDevelopment } from './security';

// Simple encryption for client-side data (not for truly sensitive data)
const encryptData = (data: string): string => {
  if (!isDevelopment()) {
    // Simple base64 encoding for obfuscation (not real encryption)
    return btoa(data);
  }
  return data;
};

const decryptData = (data: string): string => {
  if (!isDevelopment()) {
    try {
      return atob(data);
    } catch {
      return data; // Return as-is if decryption fails
    }
  }
  return data;
};

export const secureStorage = {
  setItem: (key: string, value: any): void => {
    try {
      const stringValue = JSON.stringify(value);
      const encrypted = encryptData(stringValue);
      localStorage.setItem(key, encrypted);
      
      // Set expiration (24 hours for booking data)
      const expirationTime = Date.now() + (24 * 60 * 60 * 1000);
      localStorage.setItem(`${key}_expiry`, expirationTime.toString());
    } catch (error) {
      console.error('Failed to store data securely:', error);
    }
  },

  getItem: (key: string): any => {
    try {
      // Check expiration
      const expiryTime = localStorage.getItem(`${key}_expiry`);
      if (expiryTime && Date.now() > parseInt(expiryTime)) {
        secureStorage.removeItem(key);
        return null;
      }

      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;

      const decrypted = decryptData(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Failed to retrieve data securely:', error);
      return null;
    }
  },

  removeItem: (key: string): void => {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_expiry`);
  }
};
