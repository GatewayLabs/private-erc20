import { useState, useCallback } from "react";
import { useWriteContract, usePublicClient } from "wagmi";
import {
  DISCRETE_ERC20_FACTORY_ABI,
  DISCRETE_ERC20_FACTORY_ADDRESS,
  PAILLIER_ADDRESS,
} from "@/lib/contracts";
import { encrypt, getPublicKey } from "@/lib/encryption";
import { type Hash, type TransactionReceipt } from "viem";
import { parseTokenAmount } from "@/lib/format";

interface DeployTokenParams {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: string; // Human-readable amount (e.g., "1000" for 1000 tokens)
  onSuccess?: (address: `0x${string}`) => void;
}

export function useDeployToken() {
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<Hash | null>(null);
  const [successCallback, setSuccessCallback] = useState<
    ((address: `0x${string}`) => void) | null
  >(null);
  const publicClient = usePublicClient();

  const handleTransactionReceipt = useCallback(
    (receipt: TransactionReceipt) => {
      const event = receipt.logs[0];
      if (event && successCallback) {
        const tokenAddress = event.address as `0x${string}`;
        successCallback(tokenAddress);
      }
    },
    [successCallback]
  );

  const watchTransaction = useCallback(
    async (hash: Hash) => {
      if (!publicClient) return;
      try {
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        handleTransactionReceipt(receipt);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Transaction failed");
      }
    },
    [publicClient, handleTransactionReceipt]
  );

  const { writeContract, isPending: isWritePending } = useWriteContract({
    mutation: {
      onSuccess: (hash) => {
        setTxHash(hash);
        watchTransaction(hash);
      },
    },
  });

  const deployToken = async ({
    name,
    symbol,
    decimals,
    initialSupply,
    onSuccess,
  }: DeployTokenParams) => {
    try {
      setError(null);
      setTxHash(null);
      setSuccessCallback(() => onSuccess);

      // Parse the human-readable amount to wei
      const parsedAmount = parseTokenAmount(initialSupply, decimals);
      const encryptedAmountStr = await encrypt(parsedAmount);
      const publicKey = getPublicKey();

      writeContract({
        address: DISCRETE_ERC20_FACTORY_ADDRESS,
        abi: DISCRETE_ERC20_FACTORY_ABI,
        functionName: "createDiscreteERC20",
        args: [
          name,
          symbol,
          decimals,
          { value: encryptedAmountStr },
          PAILLIER_ADDRESS,
          publicKey,
        ],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to deploy token");
      throw err;
    }
  };

  const isPending = isWritePending || !!txHash;

  return {
    deployToken,
    isPending,
    error,
  };
}
