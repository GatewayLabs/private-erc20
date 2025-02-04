"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBalance } from "wagmi";
import { formatEther } from "viem";
import { useEncryptedBalance } from "@/hooks/use-encrypted-balance";
import { TokenSelector } from "@/components/token-selector";
import { TokenInfo } from "@/types";

interface WalletOverviewProps {
  onSelectToken: Dispatch<SetStateAction<TokenInfo | null>>;
}

export function WalletOverview({ onSelectToken }: WalletOverviewProps) {
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null);
  const { data: balance } = useBalance({
    address: "0x...", // Connected wallet address
    token: selectedToken?.address as `0x${string}`,
  });

  const { decryptedBalance, isLoading } = useEncryptedBalance(
    selectedToken?.address
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Your Wallet</h2>
        <TokenSelector onSelectToken={onSelectToken} />
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
              ? `${formatEther(decryptedBalance)} ${selectedToken?.symbol}`
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
