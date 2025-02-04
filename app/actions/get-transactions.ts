"use server";

import { decodeEventLog } from "viem";
import { DISCRETE_ERC20_ABI } from "@/lib/contracts";
import { Transaction } from "@/types";

if (!process.env.ALCHEMY_API_KEY) {
  throw new Error("ALCHEMY_API_KEY is not defined");
}

const ALCHEMY_URL = `https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

async function fetchAlchemyLogs(params: any) {
  const response = await fetch(ALCHEMY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getLogs",
      params: [params],
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message || "Failed to fetch logs");
  }

  return data.result;
}

export async function getTransactions({
  address,
  tokenAddress,
  page = 0,
  pageSize = 10,
}: {
  address: string;
  tokenAddress: string;
  page?: number;
  pageSize?: number;
}) {
  try {
    // Get sent transfer events
    const sentTransfers = await fetchAlchemyLogs({
      address: tokenAddress,
      topics: [
        // Transfer event signature
        "0x3c4aa794be1740f35a3d4ae028f349a57c8faba8aa946e6ead0e554d001d9917",
        // from address (indexed)
        `0x000000000000000000000000${address.slice(2)}`,
        null, // any recipient
      ],
      fromBlock: "0x1082160", // Around when the contract was deployed
      toBlock: "latest",
    });

    // Get received transfer events
    const receivedTransfers = await fetchAlchemyLogs({
      address: tokenAddress,
      topics: [
        // Transfer event signature
        "0x3c4aa794be1740f35a3d4ae028f349a57c8faba8aa946e6ead0e554d001d9917",
        null, // any sender
        `0x000000000000000000000000${address.slice(2)}`, // to address (indexed)
      ],
      fromBlock: "0x1082160", // Around when the contract was deployed
      toBlock: "latest",
    });

    // Deduplicate logs based on transaction hash and combine
    const uniqueLogs = new Map();
    [...sentTransfers, ...receivedTransfers].forEach((log) => {
      if (log.transactionHash && !uniqueLogs.has(log.transactionHash)) {
        uniqueLogs.set(log.transactionHash, log);
      }
    });

    // Sort unique logs
    const sortedLogs = Array.from(uniqueLogs.values()).sort((a, b) => {
      const aBlock = a.blockNumber ? BigInt(a.blockNumber) : 0n;
      const bBlock = b.blockNumber ? BigInt(b.blockNumber) : 0n;
      return Number(bBlock - aBlock);
    });

    // Get block timestamps
    const blocks = await Promise.all(
      sortedLogs.map(async (log) => {
        if (!log.blockNumber) return null;
        const response = await fetch(ALCHEMY_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "eth_getBlockByNumber",
            params: [log.blockNumber, false],
          }),
        });
        const data = await response.json();
        return data.result;
      })
    );

    // Transform events into transactions
    const transactions: Transaction[] = sortedLogs.map((log, index) => {
      const block = blocks[index];
      const event = decodeEventLog({
        abi: DISCRETE_ERC20_ABI,
        data: log.data as `0x${string}`,
        topics: log.topics as [`0x${string}`, ...`0x${string}`[]],
        eventName: "Transfer",
      });

      if (event.eventName !== "Transfer") {
        throw new Error("Invalid event type");
      }

      return {
        hash: log.transactionHash || "",
        from: event.args.from,
        to: event.args.to,
        encryptedAmount: event.args.value.value,
        timestamp: block ? Number(block.timestamp) : Date.now() / 1000,
        status: "confirmed",
      };
    });

    // Calculate pagination
    const start = page * pageSize;
    const end = start + pageSize;
    const paginatedTransactions = transactions.slice(start, end);
    const hasNextPage = transactions.length > end;

    return {
      transactions: paginatedTransactions,
      nextCursor: hasNextPage ? page + 1 : undefined,
    };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch transactions"
    );
  }
}
