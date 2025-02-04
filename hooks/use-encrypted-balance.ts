import { useQuery } from "@tanstack/react-query";
import { useAccount, useReadContract } from "wagmi";
import {
  ENCRYPTED_TOKEN_FACTORY_ABI,
  ENCRYPTED_TOKEN_FACTORY_ADDRESS,
} from "@/lib/contracts";
import { decrypt, initializeEncryption } from "@/lib/encryption";
import { EncryptedBalance } from "@/types";

export function useEncryptedBalance(tokenAddress?: string) {
  const { address } = useAccount();

  const { data: encryptedBalance, isLoading: isLoadingEncrypted } =
    useReadContract({
      address:
        (tokenAddress as `0x${string}`) || ENCRYPTED_TOKEN_FACTORY_ADDRESS,
      abi: ENCRYPTED_TOKEN_FACTORY_ABI,
      functionName: "encryptedBalanceOf",
      args: [address],
      query: {
        enabled: !!address && !!tokenAddress,
      },
    }) as { data: EncryptedBalance | undefined; isLoading: boolean };

  const { data: decryptedBalance, isLoading: isLoadingDecrypted } = useQuery({
    queryKey: ["decrypted-balance", encryptedBalance, tokenAddress],
    queryFn: async () => {
      if (!encryptedBalance) return null;
      await initializeEncryption();
      return await decrypt(encryptedBalance.value);
    },
    enabled: !!encryptedBalance,
  });

  return {
    encryptedBalance,
    decryptedBalance,
    isLoading: isLoadingEncrypted || isLoadingDecrypted,
  };
}
