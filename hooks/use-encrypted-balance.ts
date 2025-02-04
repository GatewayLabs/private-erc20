import { useQuery } from "@tanstack/react-query";
import { useAccount, useReadContract } from "wagmi";
import { DISCRETE_ERC20_ABI } from "@/lib/contracts";
import { decryptBalance } from "@/app/actions/decrypt-balance";
import { formatUnits } from "viem";

// Helper function to format number with commas
const formatWithCommas = (value: string) => {
  const [integerPart, decimalPart] = value.split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

export function useEncryptedBalance(
  tokenAddress?: `0x${string}`,
  decimals: number = 0
) {
  const { address } = useAccount();

  // Get the encrypted balance
  const { data: encryptedBalance, isLoading: isLoadingEncrypted } =
    useReadContract({
      address: tokenAddress,
      abi: DISCRETE_ERC20_ABI,
      functionName: "balanceOf",
      args: [address as `0x${string}`],
      query: {
        enabled: !!address && !!tokenAddress,
      },
    });

  // Get the token decimals if not provided
  const { data: tokenDecimals } = useReadContract({
    address: tokenAddress,
    abi: DISCRETE_ERC20_ABI,
    functionName: "decimals",
    query: {
      enabled: !!tokenAddress && decimals === 0,
    },
  });

  // Use provided decimals or fetched decimals, fallback to 0
  const actualDecimals = decimals || Number(tokenDecimals || 0);

  // Decrypt and format the balance
  const {
    data: balanceData,
    isLoading: isLoadingDecrypted,
    error,
  } = useQuery({
    queryKey: [
      "decrypted-balance",
      encryptedBalance,
      tokenAddress,
      actualDecimals,
    ],
    queryFn: async () => {
      if (!encryptedBalance) return { raw: 0n, formatted: "0" };
      try {
        const rawBalance = await decryptBalance(encryptedBalance);

        // If the balance is 0 or negative, return zero
        if (rawBalance <= 0n) {
          return { raw: 0n, formatted: "0" };
        }

        // Format the balance without any manipulation first
        const formatted = formatUnits(rawBalance, 0);

        // Now apply the decimals adjustment if needed
        if (actualDecimals > 0) {
          // Insert decimal point from the right
          const parts = formatted.split(".");
          const integerPart = parts[0];

          if (integerPart.length <= actualDecimals) {
            // Pad with leading zeros if needed
            const paddedNumber =
              "0".repeat(actualDecimals - integerPart.length + 1) + integerPart;
            const formattedWithDecimals =
              paddedNumber.slice(0, -actualDecimals) +
              "." +
              paddedNumber.slice(-actualDecimals);
            const cleanNumber = formattedWithDecimals.replace(/\.?0+$/, ""); // Remove trailing zeros
            return {
              raw: rawBalance,
              formatted: formatWithCommas(cleanNumber),
            };
          } else {
            // Insert decimal point from the right
            const formattedWithDecimals =
              integerPart.slice(0, -actualDecimals) +
              "." +
              integerPart.slice(-actualDecimals);
            const cleanNumber = formattedWithDecimals.replace(/\.?0+$/, ""); // Remove trailing zeros
            return {
              raw: rawBalance,
              formatted: formatWithCommas(cleanNumber),
            };
          }
        }

        const cleanNumber = formatted.replace(/\.?0+$/, ""); // Remove trailing zeros
        return {
          raw: rawBalance,
          formatted: formatWithCommas(cleanNumber),
        };
      } catch (err) {
        console.error("Error decrypting balance:", err);
        return { raw: 0n, formatted: "0" };
      }
    },
    enabled: !!encryptedBalance,
  });

  return {
    encryptedBalance,
    rawBalance: balanceData?.raw || 0n,
    decryptedBalance: balanceData?.formatted || "0",
    decimals: actualDecimals,
    isLoading: isLoadingEncrypted || isLoadingDecrypted,
    error,
  };
}
