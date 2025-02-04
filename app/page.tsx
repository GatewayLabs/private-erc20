"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { QuickActions } from "@/components/quick-actions";
import { TransactionHistory } from "@/components/transaction-history";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ErrorBoundary from "@/components/error-boundary";
import { ErrorAlert } from "@/components/error-alert";
import { useTokenList } from "@/hooks/use-token-list";
import { useAccount } from "wagmi";
import { useEncryptedBalance } from "@/hooks/use-encrypted-balance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEther } from "viem";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TokenInfo } from "@/types";

export default function Home() {
  const { address } = useAccount();
  const { data: tokens = [] } = useTokenList(address);
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(
    tokens[0] || null
  );
  const { decryptedBalance, isLoading } = useEncryptedBalance(
    selectedToken?.address
  );

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <ErrorBoundary
        fallback={
          <ErrorAlert
            title="Error"
            description="Something went wrong. Please try again later."
          />
        }
      >
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold">My Wallet</h1>
            <ConnectButton />
          </div>
          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Select
                      value={selectedToken?.address}
                      onValueChange={(value) => {
                        const token = tokens.find((t) => t.address === value);
                        setSelectedToken(token || null);
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select token" />
                      </SelectTrigger>
                      <SelectContent>
                        {tokens.map((token) => (
                          <SelectItem key={token.address} value={token.address}>
                            {token.symbol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="text-3xl font-bold">
                      {isLoading ? (
                        "Loading..."
                      ) : decryptedBalance ? (
                        <span>
                          {formatEther(decryptedBalance)}{" "}
                          {selectedToken?.symbol}
                        </span>
                      ) : (
                        `0.00 ${selectedToken?.symbol}`
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <QuickActions />
            <TransactionHistory selectedToken={selectedToken} />
          </div>
        </main>
      </ErrorBoundary>
    </div>
  );
}
