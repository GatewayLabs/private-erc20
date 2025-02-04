import {
  encryptWithCurrentKey,
  decryptWithCurrentKey,
  generateNewKeyPair,
  getCurrentPublicKey,
} from "./key-management";

export async function initializeEncryption() {
  if (!getCurrentPublicKey()) {
    await generateNewKeyPair();
  }
}

export async function encrypt(value: bigint): Promise<string> {
  await initializeEncryption();
  return encryptWithCurrentKey(value);
}

export async function decrypt(encryptedValue: string): Promise<bigint> {
  await initializeEncryption();
  return decryptWithCurrentKey(encryptedValue);
}

export function getPublicKey(): string | null {
  return getCurrentPublicKey();
}
