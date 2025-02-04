import * as paillier from "paillier-bigint";

// Ensure environment variables are defined
if (
  !process.env.NEXT_PUBLIC_PUBLIC_KEY_N ||
  !process.env.NEXT_PUBLIC_PUBLIC_KEY_G
) {
  throw new Error("Public key environment variables are not defined");
}

// Convert hex strings to BigInt
const publicKeyN = BigInt("0x" + process.env.NEXT_PUBLIC_PUBLIC_KEY_N);
const publicKeyG = BigInt("0x" + process.env.NEXT_PUBLIC_PUBLIC_KEY_G);

// Create the public key instance
const publicKey = new paillier.PublicKey(publicKeyN, publicKeyG);

export async function encryptWithCurrentKey(value: bigint): Promise<string> {
  const encrypted = publicKey.encrypt(value);
  return "0x" + encrypted.toString(16); // Convert to hex string
}

export async function decryptWithCurrentKey(): Promise<bigint> {
  throw new Error(
    "Decryption is not supported in the browser. This should be done off-chain."
  );
}

export function getCurrentPublicKey(): { n: `0x${string}`; g: `0x${string}` } {
  return {
    n: ("0x" + publicKeyN.toString(16)) as `0x${string}`,
    g: ("0x" + publicKeyG.toString(16)) as `0x${string}`,
  };
}

// These functions are no longer needed since we use fixed keys
export async function generateNewKeyPair(): Promise<never> {
  throw new Error(
    "Key generation is not supported. Using fixed keys from environment variables."
  );
}

export async function initializeEncryption(): Promise<void> {
  // Nothing to initialize since we're using fixed keys
  return;
}
