"use client";

import * as argon2 from "argon2-browser";

// Private symbol to make the key truly private
const KEY_SYMBOL = Symbol('keyEncryptionKey');

// Global object to store the key (not accessible via window or global scope)
const keyStorage = {
  [KEY_SYMBOL]: null as string | null,
};

export class SecureKeyManager {
  // Generate Argon2 hash from password
  static async generateKeyFromPassword(password: string, salt?: Uint8Array): Promise<string> {
    try {
      // Use a consistent salt or generate one if not provided
      const actualSalt = salt || new TextEncoder().encode('invoicesafe_salt_2025');
      
      const result = await argon2.hash({
        pass: password,
        salt: actualSalt,
        time: 2, // Number of iterations
        mem: 1024, // Memory usage in KB
        hashLen: 32, // Hash length
        parallelism: 1, // Number of threads
        type: argon2.ArgonType.Argon2id, // Argon2id variant
      });

      return result.encoded;
    } catch (error) {
      console.error('Error generating Argon2 hash:', error);
      throw new Error('Failed to generate encryption key');
    }
  }

  // Store the key securely in memory
  static storeKey(keyEncryptionKey: string): void {
    keyStorage[KEY_SYMBOL] = keyEncryptionKey;
    
    // Optional: Add to sessionStorage as backup (base64 encoded for obfuscation)
    if (typeof window !== 'undefined') {
      try {
        const encoded = btoa(keyEncryptionKey);
        sessionStorage.setItem('_isk', encoded); // invoicesafe key
      } catch (error) {
        console.warn('Failed to store key in sessionStorage:', error);
      }
    }
  }

  // Retrieve the key
  static getKey(): string | null {
    // First try to get from memory
    if (keyStorage[KEY_SYMBOL]) {
      return keyStorage[KEY_SYMBOL];
    }

    // Fallback to sessionStorage if available
    if (typeof window !== 'undefined') {
      try {
        const encoded = sessionStorage.getItem('_isk');
        if (encoded) {
          const decoded = atob(encoded);
          keyStorage[KEY_SYMBOL] = decoded; // Store back in memory
          return decoded;
        }
      } catch (error) {
        console.warn('Failed to retrieve key from sessionStorage:', error);
      }
    }

    return null;
  }

  // Clear the key (on logout)
  static clearKey(): void {
    keyStorage[KEY_SYMBOL] = null;
    
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('_isk');
        // Also clear any other sensitive data
        sessionStorage.removeItem('_isk_backup');
      } catch (error) {
        console.warn('Failed to clear key from sessionStorage:', error);
      }
    }
  }

  // Check if key exists
  static hasKey(): boolean {
    return this.getKey() !== null;
  }

  // Verify password against stored hash (for additional security)
  static async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    try {
      return await argon2.verify({
        pass: password,
        encoded: storedHash,
      });
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  // Generate and store key from password (main function to use during login)
  static async generateAndStoreKey(password: string): Promise<string> {
    const keyEncryptionKey = await this.generateKeyFromPassword(password);
    this.storeKey(keyEncryptionKey);
    return keyEncryptionKey;
  }
}

// Auto-clear key when page is being unloaded (additional security)
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    SecureKeyManager.clearKey();
  });

  // Clear key when tab becomes hidden for extended period
  let hiddenTimeout: NodeJS.Timeout;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Clear key after 30 minutes of inactivity
      hiddenTimeout = setTimeout(() => {
        SecureKeyManager.clearKey();
      }, 30 * 60 * 1000);
    } else {
      clearTimeout(hiddenTimeout);
    }
  });
}
