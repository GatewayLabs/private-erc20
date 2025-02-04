"use server";

import * as paillier from "paillier-bigint";

// Ensure environment variables are defined
if (!process.env.PAILLIER_LAMBDA || !process.env.PAILLIER_MU) {
  throw new Error("Paillier private key environment variables are not defined");
}

// Convert hex strings to BigInt
const lambda = BigInt("0x" + process.env.PAILLIER_LAMBDA);
const mu = BigInt("0x" + process.env.PAILLIER_MU);
const n = BigInt("0x" + process.env.NEXT_PUBLIC_PUBLIC_KEY_N);
const g = BigInt("0x" + process.env.NEXT_PUBLIC_PUBLIC_KEY_G);

// Create the key instances
const publicKey = new paillier.PublicKey(n, g);
const privateKey = new paillier.PrivateKey(lambda, mu, publicKey);

export async function decryptBalance(encryptedValue: string): Promise<bigint> {
  try {
    // Ensure the value is a proper hex string
    const cleanHex = encryptedValue.startsWith("0x")
      ? encryptedValue.slice(2)
      : encryptedValue;

    // Convert hex to BigInt with proper prefix
    const encryptedBigInt = BigInt("0x" + cleanHex);

    // Decrypt the value
    const decryptedValue = privateKey.decrypt(encryptedBigInt);

    // Handle negative numbers (if the value is larger than n/2, it's negative)
    if (decryptedValue > n / 2n) {
      return decryptedValue - n;
    }

    return decryptedValue;
  } catch (error) {
    console.error("Failed to decrypt balance:", error);
    throw new Error(
      `Failed to decrypt balance: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
