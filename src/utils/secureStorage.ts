import { isDevelopment, secureLog, isProduction } from './security';

// Enhanced encryption using Web Crypto API
class SecureStorageManager {
  private keyPromise: Promise<CryptoKey> | null = null;

  private async getOrCreateKey(): Promise<CryptoKey> {
    if (!this.keyPromise) {
      this.keyPromise = this.initializeKey();
    }
    return this.keyPromise;
  }

  private async initializeKey(): Promise<CryptoKey> {
    try {
      // In production, use proper key derivation
      if (isProduction()) {
        const keyMaterial = await crypto.subtle.importKey(
          'raw',
          new TextEncoder().encode('luxebysea-app-key-2024'),
          'PBKDF2',
          false,
          ['deriveKey']
        );

        return await crypto.subtle.deriveKey(
          {
            name: 'PBKDF2',
            salt: new TextEncoder().encode('luxebysea-salt'),
            iterations: 100000,
            hash: 'SHA-256'
          },
          keyMaterial,
          { name: 'AES-GCM', length: 256 },
          false,
          ['encrypt', 'decrypt']
        );
      } else {
        // In development, use a simpler key for performance
        return await crypto.subtle.generateKey(
          { name: 'AES-GCM', length: 256 },
          false,
          ['encrypt', 'decrypt']
        );
      }
    } catch (error) {
      secureLog.error('Failed to initialize encryption key', error);
      throw new Error('Encryption initialization failed');
    }
  }

  private async encryptData(data: string): Promise<string> {
    try {
      if (isDevelopment()) {
        // Simple base64 in development for easier debugging
        return btoa(data);
      }

      const key = await this.getOrCreateKey();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedData = new TextEncoder().encode(data);

      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encodedData
      );

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);

      // Convert to base64 for storage
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      secureLog.error('Encryption failed', error);
      return btoa(data); // Fallback to simple encoding
    }
  }

  private async decryptData(encryptedData: string): Promise<string> {
    try {
      if (isDevelopment()) {
        return atob(encryptedData);
      }

      const key = await this.getOrCreateKey();
      const combined = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );

      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      secureLog.error('Decryption failed', error);
      try {
        return atob(encryptedData); // Fallback to simple decoding
      } catch {
        return encryptedData; // Return as-is if all fails
      }
    }
  }

  async setItem(key: string, value: any, expirationHours: number = 24): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      const encrypted = await this.encryptData(stringValue);
      
      localStorage.setItem(key, encrypted);
      
      // Set expiration
      const expirationTime = Date.now() + (expirationHours * 60 * 60 * 1000);
      localStorage.setItem(`${key}_expiry`, expirationTime.toString());
      localStorage.setItem(`${key}_integrity`, await this.generateIntegrityHash(stringValue));
      
      secureLog.debug(`Securely stored item: ${key}`);
    } catch (error) {
      secureLog.error('Failed to store data securely', error);
      throw new Error('Storage operation failed');
    }
  }

  async getItem(key: string): Promise<any> {
    try {
      // Check expiration
      const expiryTime = localStorage.getItem(`${key}_expiry`);
      if (expiryTime && Date.now() > parseInt(expiryTime)) {
        await this.removeItem(key);
        return null;
      }

      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;

      const decrypted = await this.decryptData(encrypted);
      const parsed = JSON.parse(decrypted);

      // Verify integrity
      const storedHash = localStorage.getItem(`${key}_integrity`);
      const currentHash = await this.generateIntegrityHash(decrypted);
      
      if (storedHash && storedHash !== currentHash) {
        secureLog.warn(`Integrity check failed for item: ${key}`);
        await this.removeItem(key);
        return null;
      }

      return parsed;
    } catch (error) {
      secureLog.error('Failed to retrieve data securely', error);
      await this.removeItem(key);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_expiry`);
    localStorage.removeItem(`${key}_integrity`);
    secureLog.debug(`Removed secure item: ${key}`);
  }

  async clear(): Promise<void> {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.includes('_expiry') || key.includes('_integrity')) {
        localStorage.removeItem(key);
      }
    }
    localStorage.clear();
    secureLog.debug('Cleared all secure storage');
  }

  private async generateIntegrityHash(data: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      secureLog.error('Failed to generate integrity hash', error);
      return '';
    }
  }
}

export const secureStorage = new SecureStorageManager();
