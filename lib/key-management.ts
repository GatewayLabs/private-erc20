import { paillier } from "paillier-bigint";

interface KeyPair {
  publicKey: string;
  privateKey: string;
}

// In a real-world scenario, these keys would be stored securely, possibly in a hardware security module
let currentKeyPair: KeyPair | null = null;

export async function generateNewKeyPair(): Promise<KeyPair> {
  const { publicKey, privateKey } = await paillier.generateRandomKeys(3072);
  const keyPair = {
    publicKey: publicKey.toString(),
    privateKey: privateKey.toString(),
  };
  currentKeyPair = keyPair;
  return keyPair;
}

export function getCurrentPublicKey(): string | null {
  return currentKeyPair?.publicKey || null;
}

export async function encryptWithCurrentKey(value: bigint): Promise<string> {
  if (!currentKeyPair) {
    throw new Error("No key pair available. Generate a new key pair first.");
  }
  const publicKey = paillier.PublicKey.fromString(currentKeyPair.publicKey);
  const encrypted = publicKey.encrypt(value);
  return encrypted.toString();
}

export async function decryptWithCurrentKey(
  encryptedValue: string
): Promise<bigint> {
  if (!currentKeyPair) {
    throw new Error("No key pair available. Generate a new key pair first.");
  }
  const privateKey = paillier.PrivateKey.fromString(currentKeyPair.privateKey);
  const decrypted = privateKey.decrypt(BigInt(encryptedValue));
  return decrypted;
}
