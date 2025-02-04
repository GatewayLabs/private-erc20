import { useState } from "react";
import { useWriteContract } from "wagmi";
import { DISCRETE_ERC20_ABI } from "@/lib/contracts";
import { encrypt } from "@/lib/encryption";
import { parseEther } from "viem";

export function useSendEncryptedTokens(tokenAddress: `0x${string}`) {
  const [error, setError] = useState<string | null>(null);

  const { writeContract, isPending, isSuccess } = useWriteContract();

  const sendTokens = async ({
    amount,
    recipient,
  }: {
    amount: string;
    recipient: `0x${string}`;
  }) => {
    try {
      setError(null);
      const parsedAmount = parseEther(amount);
      const encryptedAmountStr = await encrypt(parsedAmount);

      writeContract({
        address: tokenAddress,
        abi: DISCRETE_ERC20_ABI,
        functionName: "transfer",
        args: [recipient, { value: encryptedAmountStr as `0x${string}` }],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send tokens");
      throw err;
    }
  };

  return {
    sendTokens,
    isPending,
    isSuccess,
    error,
  };
}
