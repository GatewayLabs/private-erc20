import {
  encryptWithCurrentKey,
  decryptWithCurrentKey,
  getCurrentPublicKey,
} from "./key-management";

export async function encrypt(value: bigint): Promise<`0x${string}`> {
  const encrypted = await encryptWithCurrentKey(value);
  return encrypted as `0x${string}`;
}

export async function decrypt(encryptedValue: string): Promise<bigint> {
  return decryptWithCurrentKey(encryptedValue);
}

export function getPublicKey(): { n: `0x${string}`; g: `0x${string}` } {
  return getCurrentPublicKey();
}
