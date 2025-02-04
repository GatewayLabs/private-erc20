"use client";

import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { decrypt } from "@/lib/encryption";
import { formatEther } from "viem";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Transaction, TokenInfo } from "@/types";
import { ErrorAlert } from "@/components/error-alert";
import * as React from "react";
import { useInView } from "react-intersection-observer";

async function fetchTransactions({ pageParam = 0, queryKey }: any) {
  const [_, address, tokenAddress] = queryKey;
  const response = await fetch(
    `/api/transactions?page=${pageParam}&address=${address}&token=${tokenAddress}`
  );
  return response.json();
}

export function TransactionHistoryDrawer({
  open,
  onOpenChange,
  selectedToken,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedToken: TokenInfo | null;
}) {
  const { address } = useAccount();
  const { ref, inView } = useInView();
  const [filter, setFilter] = useState<"all" | "sent" | "received">("all");
  const [search, setSearch] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["transactions", address, selectedToken?.address],
      queryFn: fetchTransactions,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!address && !!selectedToken,
      initialPageParam: 0,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const filteredTransactions =
    data?.pages.flatMap((page) =>
      page.transactions.filter((tx: Transaction) => {
        if (filter === "sent" && tx.from !== address) return false;
        if (filter === "received" && tx.to !== address) return false;
        if (search && !tx.to.toLowerCase().includes(search.toLowerCase()))
          return false;
        return true;
      })
    ) || [];

  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filteredTransactions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  if (status === "error") {
    return (
      <ErrorAlert
        title="Error"
        description="Failed to load transactions. Please try again."
      />
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle>Transaction History</DrawerTitle>
          </DrawerHeader>
          <div className="px-4">
            <div className="flex space-x-4 mb-4">
              <Input
                placeholder="Search by address"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Select
                value={filter}
                onValueChange={(value: "all" | "sent" | "received") =>
                  setFilter(value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter transactions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div ref={parentRef} style={{ height: "400px", overflow: "auto" }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>To/From</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {virtualizer.getVirtualItems().map((virtualRow) => {
                    const tx = filteredTransactions[virtualRow.index];
                    return (
                      <TableRow key={tx.hash} data-index={virtualRow.index}>
                        <TableCell>
                          {new Date(tx.timestamp * 1000).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {tx.from === address ? "Sent" : "Received"}
                        </TableCell>
                        <TableCell className="font-mono">
                          {tx.from === address ? tx.to : tx.from}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              const decrypted = await decrypt(
                                tx.encryptedAmount
                              );
                              alert(
                                `Amount: ${formatEther(decrypted)} ${
                                  selectedToken?.symbol
                                }`
                              );
                            }}
                          >
                            Decrypt Amount
                          </Button>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              tx.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : tx.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div ref={ref} className="mt-4 flex justify-center pb-4">
              {isFetchingNextPage ? (
                <Button disabled>Loading more...</Button>
              ) : hasNextPage ? (
                <Button onClick={() => fetchNextPage()} variant="outline">
                  Load More
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
