import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAccount, usePublicClient } from "wagmi";
import { Transaction, TokenInfo } from "@/types";
import { useInView } from "react-intersection-observer";
import { getTransactions } from "@/app/actions/get-transactions";
import { useToast } from "@/components/ui/use-toast";

interface UseTransactionHistoryProps {
  selectedToken: TokenInfo | null;
}

interface UseTransactionHistoryReturn {
  transactions: Transaction[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  filter: "all" | "sent" | "received";
  setFilter: (filter: "all" | "sent" | "received") => void;
  search: string;
  setSearch: (search: string) => void;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  getBlockExplorerLink: (hash: string) => string;
  ref: (node?: Element | null) => void;
}

interface TransactionResponse {
  transactions: Transaction[];
  nextCursor: number | undefined;
}

export function useTransactionHistory({
  selectedToken,
}: UseTransactionHistoryProps): UseTransactionHistoryReturn {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { ref, inView } = useInView();
  const [filter, setFilter] = useState<"all" | "sent" | "received">("all");
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery<TransactionResponse, Error>({
    queryKey: ["transactions", address, selectedToken?.address],
    queryFn: ({ pageParam = 0 }) =>
      getTransactions({
        address: address as string,
        tokenAddress: selectedToken?.address as string,
        page: pageParam as number,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!address && !!selectedToken,
    initialPageParam: 0,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Handle errors with a useEffect
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch transactions",
        variant: "destructive",
      });
    }
  }, [error, toast]);

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

  const getBlockExplorerLink = (hash: string): string => {
    if (!publicClient?.chain?.blockExplorers?.default?.url) {
      return `https://sepolia.basescan.org/tx/${hash}`;
    }
    return `${publicClient.chain.blockExplorers.default.url}/tx/${hash}`;
  };

  return {
    transactions: filteredTransactions,
    isLoading: status === "pending",
    isError: status === "error",
    error: error instanceof Error ? error : null,
    filter,
    setFilter,
    search,
    setSearch,
    hasNextPage: !!hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    getBlockExplorerLink,
    ref,
  };
}
