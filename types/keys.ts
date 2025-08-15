
export interface EncryptedBoxB64 {
  encryptedData: string;
  nonce: string;
}
export interface KeyAttributes {
    //encrypted master key
    encryptedKey: string; 
    keyDecryptionNonce: string;
    /**
     * The salt used during the derivation of the KEK.
     * Base64 encoded.
     * [Note: KEK three tuple]
     * The three tuple (kekSalt, opsLimit, memLimit) is needed (along with the
     * user's password) to rederive the KEK when the user logs in on a new
     * device.
     */
    kekSalt: string;
    opsLimit: number;
    memLimit: number;
    publicKey: string;
    encryptedSecretKey: string;
    secretKeyDecryptionNonce: string;
    /** 
     * masterKeyEncryptedWithRecoveryKey: string;
     * masterKeyDecryptionNonce: string;
     * recoveryKeyEncryptedWithMasterKey: string;
     * recoveryKeyDecryptionNonce: string;
    */

}

export interface GenerateKeysAndAttributesResult {
  masterKey: string;
  kek: string;
  keyAttributes: KeyAttributes;
}
export interface DerivedKey {
  key: string;
  salt: string;
  opsLimit: number;
  memLimit: number;
}
