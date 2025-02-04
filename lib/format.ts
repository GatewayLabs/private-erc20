import { formatUnits, parseUnits } from "viem";

/**
 * Format a raw token amount (in wei) to a human-readable string
 * @param amount The amount in wei (raw value from contract)
 * @param decimals Number of decimals (defaults to 18)
 * @returns Formatted string with proper decimal places
 */
export function formatTokenAmount(
  amount: bigint | string,
  decimals: number = 18
): string {
  if (typeof amount === "string" && amount.startsWith("0x")) {
    amount = BigInt(amount);
  }
  return formatUnits(BigInt(amount), decimals);
}

/**
 * Parse a human-readable token amount to wei
 * @param amount The amount as a human-readable string
 * @param decimals Number of decimals (defaults to 18)
 * @returns BigInt value in wei
 */
export function parseTokenAmount(
  amount: string,
  decimals: number = 18
): bigint {
  return parseUnits(amount, decimals);
}
