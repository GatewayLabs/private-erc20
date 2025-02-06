import { useState, useEffect } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount, usePublicClient, useWatchContractEvent } from "wagmi";
import { Transaction, TokenInfo } from "@/types";
import { useInView } from "react-intersection-observer";
import { getTransactions } from "@/app/actions/get-transactions";
import { useToast } from "@/components/ui/use-toast";
import { DISCRETE_ERC20_ABI } from "@/lib/contracts";

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
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();
  const [filter, setFilter] = useState<"all" | "sent" | "received">("all");
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const queryKey = ["transactions", address, selectedToken?.address];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery<TransactionResponse, Error>({
    queryKey,
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
    staleTime: 0, // Consider data stale immediately
    refetchInterval: 5000, // Poll every 5 seconds as backup
  });

  // Watch for Transfer events involving our address
  useWatchContractEvent({
    address: selectedToken?.address as `0x${string}` | undefined,
    abi: DISCRETE_ERC20_ABI,
    eventName: "Transfer",
    onLogs: async (logs) => {
      const relevantTransfer = logs.some(
        (log) => log.args.from === address || log.args.to === address
      );
      if (relevantTransfer) {
        // Reset the entire cache for this query and refetch
        await queryClient.resetQueries({ queryKey });
      }
    },
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
