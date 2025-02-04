"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEther } from "viem";
import { useEncryptedBalance } from "@/hooks/use-encrypted-balance";
import { TokenSelector } from "@/components/token-selector";
import { useSelectedToken } from "@/hooks/use-selected-token";

export function WalletOverview() {
  const { selectedToken } = useSelectedToken();
  const { decryptedBalance, isLoading } = useEncryptedBalance(
    selectedToken?.address as `0x${string}`
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Your Wallet</h2>
        <TokenSelector />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedToken
              ? `${selectedToken.name} (${selectedToken.symbol})`
              : "Select a token"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {isLoading
              ? "Loading..."
              : decryptedBalance
              ? `${formatEther(BigInt(decryptedBalance))} ${
                  selectedToken?.symbol
                }`
              : "N/A"}
          </div>
          <div className="mt-1 flex items-center text-sm text-green-600">
            <span>+2.5%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
