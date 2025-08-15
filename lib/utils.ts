import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import sodium from "libsodium-wrappers-sumo"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fromB64 = async (input: string): Promise<Uint8Array> => {
  await sodium.ready;
  return sodium.from_base64(input, sodium.base64_variants.ORIGINAL);
};
export const toB64 = async (input: Uint8Array) => {
  await sodium.ready;
  return sodium.to_base64(input, sodium.base64_variants.ORIGINAL);
};
export const generateKey = async () => {
  await sodium.ready;
  return toB64(sodium.crypto_secretbox_keygen());
};
export const bytes = async (bob: Uint8Array | string) =>
  typeof bob == "string" ? fromB64(bob) : bob;

export const generateDeriveKeySalt = async () => {
  await sodium.ready;
  return toB64(sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES));
}
