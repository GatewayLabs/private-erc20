import { useState } from "react";
import { useWriteContract } from "wagmi";
import {
  ENCRYPTED_TOKEN_FACTORY_ABI,
  ENCRYPTED_TOKEN_FACTORY_ADDRESS,
} from "@/lib/contracts";
import { encrypt } from "@/lib/encryption";
import { parseEther } from "viem";
import { EncryptedTransfer } from "@/types";

export function useSendEncryptedTokens() {
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

      const transfer: EncryptedTransfer = {
        to: recipient,
        encryptedAmount: BigInt(encryptedAmountStr),
      };

      writeContract({
        address: ENCRYPTED_TOKEN_FACTORY_ADDRESS,
        abi: ENCRYPTED_TOKEN_FACTORY_ABI,
        functionName: "transferEncrypted",
        args: [
          {
            to: recipient,
            encryptedAmount: BigInt(encryptedAmountStr),
          },
        ],
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
