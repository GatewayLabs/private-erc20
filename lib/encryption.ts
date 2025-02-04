import { encryptWithCurrentKey, getCurrentPublicKey } from "./key-management";

export async function encrypt(value: bigint): Promise<`0x${string}`> {
  const encrypted = await encryptWithCurrentKey(value);
  return encrypted as `0x${string}`;
}

export async function decrypt(): Promise<bigint> {
  throw new Error(
    "Decryption is not supported in the browser. This should be done off-chain."
  );
}

export function getPublicKey(): { n: `0x${string}`; g: `0x${string}` } {
  return getCurrentPublicKey();
}
