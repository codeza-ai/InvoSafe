"use client";

import { useState, useEffect } from "react";
import { SecureKeyManager } from "@/lib/key-storage";

export function useEncryptionKey() {
  const [hasKey, setHasKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if key exists
    const checkKey = () => {
      try {
        const keyExists = SecureKeyManager.hasKey();
        setHasKey(keyExists);
      } catch (error) {
        console.error("Error checking encryption key:", error);
        setHasKey(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkKey();
    
    // Check periodically (every 30 seconds) to ensure key is still available
    const interval = setInterval(checkKey, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Function to get the encryption key
  const getKey = () => {
    try {
      return SecureKeyManager.getKey();
    } catch (error) {
      console.error("Error getting encryption key:", error);
      return null;
    }
  };

  // Function to manually refresh key status
  const refreshKeyStatus = () => {
    setIsLoading(true);
    try {
      const keyExists = SecureKeyManager.hasKey();
      setHasKey(keyExists);
    } catch (error) {
      console.error("Error refreshing key status:", error);
      setHasKey(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    hasKey,
    isLoading,
    getKey,
    refreshKeyStatus,
  };
}
