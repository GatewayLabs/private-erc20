import { useState } from "react";
import { useWriteContract } from "wagmi";
import {
  DISCRETE_ERC20_FACTORY_ABI,
  DISCRETE_ERC20_FACTORY_ADDRESS,
} from "@/lib/contracts";
import { encrypt } from "@/lib/encryption";
import { parseEther } from "viem";

interface DeployTokenParams {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: string;
  paillierAddress: `0x${string}`;
  publicKey: {
    n: `0x${string}`;
    g: `0x${string}`;
  };
}

export function useDeployToken() {
  const [error, setError] = useState<string | null>(null);

  const { writeContract, isPending, isSuccess, data } = useWriteContract();

  const deployToken = async ({
    name,
    symbol,
    decimals,
    initialSupply,
    paillierAddress,
    publicKey,
  }: DeployTokenParams) => {
    try {
      setError(null);
      const parsedAmount = parseEther(initialSupply);
      const encryptedAmountStr = await encrypt(parsedAmount);

      writeContract({
        address: DISCRETE_ERC20_FACTORY_ADDRESS,
        abi: DISCRETE_ERC20_FACTORY_ABI,
        functionName: "createDiscreteERC20",
        args: [
          name,
          symbol,
          decimals,
          { value: encryptedAmountStr as `0x${string}` },
          paillierAddress,
          { n: publicKey.n, g: publicKey.g },
        ],
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
