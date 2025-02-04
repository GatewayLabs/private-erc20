import { useQuery } from "@tanstack/react-query";
import { useAccount, useReadContract } from "wagmi";
import { DISCRETE_ERC20_ABI } from "@/lib/contracts";
import { decryptBalance } from "@/app/actions/decrypt-balance";
import { formatEther } from "viem";

export function useEncryptedBalance(tokenAddress?: `0x${string}`) {
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
    queryKey: ["decrypted-balance", encryptedBalance, tokenAddress],
    queryFn: async () => {
      if (!encryptedBalance) return "0";
      try {
        const decryptedHex = await decryptBalance(encryptedBalance);
        return formatEther(BigInt(decryptedHex));
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
