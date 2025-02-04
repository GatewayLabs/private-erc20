"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatEther } from "viem";
import { TokenInfo } from "@/types";
import { ErrorAlert } from "@/components/error-alert";
import * as React from "react";
import { useTransactionHistory } from "@/hooks/use-transaction-history";
import { ExternalLink, Lock, Unlock } from "lucide-react";
import { useAccount } from "wagmi";
import { decryptBalance } from "@/app/actions/decrypt-balance";
import { useToast } from "@/components/ui/use-toast";

interface TransactionHistoryProps {
  selectedToken: TokenInfo | null;
}

// Utility function to shorten addresses
const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Utility function to format dates
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000); // Convert to milliseconds
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface Transaction {
  hash: string;
  from: string;
  to: string;
  timestamp: number;
  status: "confirmed" | "pending" | "failed";
  encryptedAmount: string;
}

export function TransactionHistory({ selectedToken }: TransactionHistoryProps) {
  const { address } = useAccount();
  const { toast } = useToast();
  const [decryptedAmounts, setDecryptedAmounts] = React.useState<
    Record<string, string>
  >({});
  const [decryptingHashes, setDecryptingHashes] = React.useState<Set<string>>(
    new Set()
  );
  const {
    transactions,
    isError,
    filter,
    setFilter,
    search,
    setSearch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    getBlockExplorerLink,
    ref,
  } = useTransactionHistory({ selectedToken });

  const handleDecrypt = async (transaction: Transaction) => {
    try {
      setDecryptingHashes((prev) => new Set(prev).add(transaction.hash));
      const decrypted = await decryptBalance(transaction.encryptedAmount);
      setDecryptedAmounts((prev) => ({
        ...prev,
        [transaction.hash]: formatEther(decrypted),
      }));
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to decrypt amount. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDecryptingHashes((prev) => {
        const next = new Set(prev);
        next.delete(transaction.hash);
        return next;
      });
    }
  };

  if (isError) {
    return (
      <ErrorAlert
        title="Error"
        description="Failed to load transactions. Please try again."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input
            placeholder="Search by address"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-auto"
          />
          <Select
            value={filter}
            onValueChange={(value: "all" | "sent" | "received") =>
              setFilter(value)
            }
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="received">Received</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Explorer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.hash}>
                  <TableCell className="font-medium">
                    {transaction.from.toLowerCase() === address?.toLowerCase()
                      ? "Sent"
                      : "Received"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.from.toLowerCase() === address?.toLowerCase()
                      ? shortenAddress(transaction.to)
                      : shortenAddress(transaction.from)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {decryptedAmounts[transaction.hash] ? (
                        <>
                          <Unlock className="h-4 w-4 text-green-500" />
                          <span>
                            {decryptedAmounts[transaction.hash]}{" "}
                            {selectedToken?.symbol}
                          </span>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDecrypt(transaction)}
                            disabled={decryptingHashes.has(transaction.hash)}
                          >
                            {decryptingHashes.has(transaction.hash)
                              ? "Decrypting..."
                              : "Decrypt Amount"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                  <TableCell>
                    <a
                      href={getBlockExplorerLink(transaction.hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:text-primary/80"
                    >
                      <span>View</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div ref={ref} className="mt-4 flex justify-center">
          {isFetchingNextPage ? (
            <Button disabled>Loading more...</Button>
          ) : hasNextPage ? (
            <Button onClick={() => fetchNextPage()} variant="outline">
              Load More
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
