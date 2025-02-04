import { useQuery } from "@tanstack/react-query";
import { useAccount, useReadContract } from "wagmi";
import { DISCRETE_ERC20_ABI } from "@/lib/contracts";
import { decryptBalance } from "@/app/actions/decrypt-balance";
import { formatTokenAmount } from "@/lib/format";

export function useEncryptedBalance(
  tokenAddress?: `0x${string}`,
  decimals: number = 18
) {
  const { address } = useAccount();

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

  const {
    data: decryptedBalance,
    isLoading: isLoadingDecrypted,
    error,
  } = useQuery({
    queryKey: ["decrypted-balance", encryptedBalance, tokenAddress, decimals],
    queryFn: async () => {
      if (!encryptedBalance) return "0";
      try {
        const decryptedHex = await decryptBalance(encryptedBalance);
        return formatTokenAmount(decryptedHex, decimals);
      } catch (err) {
        console.error("Error decrypting balance:", err);
        return "0";
      }
    },
    enabled: !!encryptedBalance,
  });

  return {
    encryptedBalance,
    decryptedBalance: decryptedBalance || "0",
    isLoading: isLoadingEncrypted || isLoadingDecrypted,
    error,
  };
}
