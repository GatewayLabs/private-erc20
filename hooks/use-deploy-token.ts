import { useState } from "react";
import { useWriteContract } from "wagmi";
import {
  ENCRYPTED_TOKEN_FACTORY_ABI,
  ENCRYPTED_TOKEN_FACTORY_ADDRESS,
} from "@/lib/contracts";

interface DeployTokenParams {
  name: string;
  symbol: string;
  initialSupply: string;
}

export function useDeployToken() {
  const [error, setError] = useState<string | null>(null);

  const { writeContract, isPending, isSuccess, data } = useWriteContract();

  const deployToken = async ({
    name,
    symbol,
    initialSupply,
  }: DeployTokenParams) => {
    try {
      setError(null);

      writeContract({
        address: ENCRYPTED_TOKEN_FACTORY_ADDRESS,
        abi: ENCRYPTED_TOKEN_FACTORY_ABI,
        functionName: "deployToken",
        args: [name, symbol, BigInt(initialSupply)],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to deploy token");
      throw err;
    }
  };

  return {
    deployToken,
    isPending,
    isSuccess,
    error,
    deployedTokenAddress: data as `0x${string}` | undefined,
  };
}
