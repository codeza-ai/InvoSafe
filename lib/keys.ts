import sodium from "libsodium-wrappers-sumo";
import {
  bytes,
  fromB64,
  toB64,
  generateKey,
  generateDeriveKeySalt,
} from "@/lib/utils";
import {
  DerivedKey,
  EncryptedBoxB64,
  KeyAttributes,
  GenerateKeysAndAttributesResult,
} from "@/types/keys";

export const deriveKey = async (
  passphrase: string,
  salt: string,
  opsLimit: number,
  memLimit: number
) => {
  await sodium.ready;
  return await toB64(
    sodium.crypto_pwhash(
      sodium.crypto_secretbox_KEYBYTES,
      sodium.from_string(passphrase),
      await fromB64(salt),
      opsLimit,
      memLimit,
      sodium.crypto_pwhash_ALG_ARGON2ID13
    )
  );
};

export const deriveSensitiveKey = async (
  passphrase: string
): Promise<DerivedKey> => {
  await sodium.ready;

  const salt = await generateDeriveKeySalt();

  const desiredStrength =
    sodium.crypto_pwhash_MEMLIMIT_SENSITIVE *
    sodium.crypto_pwhash_OPSLIMIT_SENSITIVE;
  let memLimit = sodium.crypto_pwhash_MEMLIMIT_MODERATE; // = 256 MB
  const factor = Math.floor(
    sodium.crypto_pwhash_MEMLIMIT_SENSITIVE /
      sodium.crypto_pwhash_MEMLIMIT_MODERATE
  ); // = 4
  let opsLimit = sodium.crypto_pwhash_OPSLIMIT_SENSITIVE * factor; // = 16
  if (memLimit * opsLimit != desiredStrength) {
    throw new Error(`Invalid mem and ops limits: ${memLimit}, ${opsLimit}`);
  }

  const minMemLimit = sodium.crypto_pwhash_MEMLIMIT_MIN;
  while (memLimit > minMemLimit) {
    try {
      const key = await deriveKey(passphrase, salt, opsLimit, memLimit);
      return { key, salt, opsLimit, memLimit };
    } catch {
      opsLimit *= 2;
      memLimit /= 2;
    }
  }
  throw new Error("Failed to derive key (insufficient memory)");
};

export const encryptBox = async (
  data: Uint8Array | string,
  key: Uint8Array | string
): Promise<EncryptedBoxB64> => {
  await sodium.ready;
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const encryptedData = sodium.crypto_secretbox_easy(
    await bytes(data),
    nonce,
    await bytes(key)
  );
  return {
    encryptedData: await toB64(encryptedData),
    nonce: await toB64(nonce),
  };
};

export const generateKeyPair = async () => {
  await sodium.ready;
  const keyPair = sodium.crypto_box_keypair();
  return {
    publicKey: await toB64(keyPair.publicKey),
    privateKey: await toB64(keyPair.privateKey),
  };
};

export async function generateKeysAndAttributes(
  password: string
): Promise<GenerateKeysAndAttributesResult> {
  const masterKey = await generateKey();
  // const recoveryKey = await generateKey();
  const {
    key: kek,
    salt: kekSalt,
    opsLimit,
    memLimit,
  } = await deriveSensitiveKey(password);

  const { encryptedData: encryptedKey, nonce: keyDecryptionNonce } =
    await encryptBox(masterKey, kek);
  // const {
  //   encryptedData: masterKeyEncryptedWithRecoveryKey,
  //   nonce: masterKeyDecryptionNonce,
  // } = await encryptBox(masterKey, recoveryKey);
  // const {
  //   encryptedData: recoveryKeyEncryptedWithMasterKey,
  //   nonce: recoveryKeyDecryptionNonce,
  // } = await encryptBox(recoveryKey, masterKey);

  const keyPair = await generateKeyPair();
  const { encryptedData: encryptedSecretKey, nonce: secretKeyDecryptionNonce } =
    await encryptBox(keyPair.privateKey, masterKey);

  const keyAttributes: KeyAttributes = {
    encryptedKey,
    keyDecryptionNonce,
    kekSalt,
    opsLimit,
    memLimit,
    publicKey: keyPair.publicKey,
    encryptedSecretKey,
    secretKeyDecryptionNonce,
    // masterKeyEncryptedWithRecoveryKey,
    // masterKeyDecryptionNonce,
    // recoveryKeyEncryptedWithMasterKey,
    // recoveryKeyDecryptionNonce,
  };

  return { masterKey, kek, keyAttributes };
}
