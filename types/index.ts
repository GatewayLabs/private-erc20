export interface EncryptedBalance {
  value: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  encryptedAmount: string;
  timestamp: number;
  status: "pending" | "confirmed" | "failed";
}

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

export interface EncryptedTransfer {
  to: `0x${string}`;
  encryptedAmount: bigint;
}
