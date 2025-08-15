// Example usage of the encryption key system

import { useEncryptionKey } from "@/hooks/use-encryption-key";
import { SecureKeyManager } from "@/lib/key-storage";
import { useSession } from "next-auth/react";

export function EncryptionKeyExample() {
  const { data: session } = useSession();
  const { hasKey, isLoading, getKey } = useEncryptionKey();

  if (!session) {
    return <div>Please log in to access encrypted features.</div>;
  }

  if (isLoading) {
    return <div>Checking encryption status...</div>;
  }

  if (!hasKey) {
    return (
      <div className="text-red-600">
        Encryption key not available. Please log out and log back in.
      </div>
    );
  }

  const handleTestEncryption = () => {
    const key = getKey();
    if (key) {
      console.log("Encryption key is available (length:", key.length, ")");
      // Here you would use the key for encryption/decryption operations
      // Example: encryptData(sensitiveData, key)
    } else {
      console.error("Failed to retrieve encryption key");
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Encryption Status</h3>
      <div className="space-y-2">
        <div className="text-green-600">✓ Encryption key is available</div>
        <div className="text-sm text-gray-600">
          User: {session.user?.business_name}
        </div>
        <button
          onClick={handleTestEncryption}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test Encryption Key Access
        </button>
      </div>
    </div>
  );
}

// Example of how you might use the key for actual encryption
export async function encryptSensitiveData(data: string): Promise<string | null> {
  try {
    const key = SecureKeyManager.getKey();
    if (!key) {
      throw new Error("Encryption key not available");
    }

    // Here you would implement your encryption logic
    // This is just a placeholder - you'd use a proper encryption library
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(data);
    const keyBytes = encoder.encode(key);
    
    // Simple XOR encryption (NOT SECURE - use proper encryption in production)
    const encrypted = dataBytes.map((byte, index) => 
      byte ^ keyBytes[index % keyBytes.length]
    );
    
    return btoa(String.fromCharCode(...encrypted));
  } catch (error) {
    console.error("Encryption failed:", error);
    return null;
  }
}

export async function decryptSensitiveData(encryptedData: string): Promise<string | null> {
  try {
    const key = SecureKeyManager.getKey();
    if (!key) {
      throw new Error("Encryption key not available");
    }

    // Reverse the encryption process
    const encoder = new TextEncoder();
    const keyBytes = encoder.encode(key);
    const encryptedBytes = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    
    const decrypted = encryptedBytes.map((byte, index) => 
      byte ^ keyBytes[index % keyBytes.length]
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(new Uint8Array(decrypted));
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}
