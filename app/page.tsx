"use client";

import { Sidebar } from "@/components/sidebar";
import { QuickActions } from "@/components/quick-actions";
import { TransactionHistory } from "@/components/transaction-history";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ErrorBoundary from "@/components/error-boundary";
import { ErrorAlert } from "@/components/error-alert";
import { useTokenList } from "@/hooks/use-token-list";
import { useEncryptedBalance } from "@/hooks/use-encrypted-balance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { TokenInfo } from "@/types";

export default function Home() {
  const { tokens } = useTokenList();
  const { selectedToken, selectToken } = useSelectedToken();
  const { decryptedBalance, isLoading } = useEncryptedBalance(
    selectedToken?.address as `0x${string}`,
    selectedToken?.decimals
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
        <main className="flex-1 overflow-y-auto md:p-8 p-4 md:pt-8 pt-20">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">My Wallet</h1>
            <ConnectButton />
          </div>
          <div className="grid gap-4 md:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <Select
                      value={selectedToken?.address}
                      onValueChange={(value) => {
                        const token = tokens.find((t) => t.address === value);
                        selectToken(token as TokenInfo);
                      }}
                    >
                      <SelectTrigger className="w-full md:w-[180px]">
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
                    <div className="text-2xl md:text-3xl font-bold">
                      {isLoading ? (
                        "Loading..."
                      ) : (
                        <span>
                          {decryptedBalance} {selectedToken?.symbol}
                        </span>
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
