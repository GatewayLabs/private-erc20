import { NextResponse } from "next/server";

const MOCK_TRANSACTIONS = [
  {
    hash: "0x123...",
    from: "0xabc...",
    to: "0xdef...",
    encryptedAmount: "123456789",
    timestamp: Date.now() / 1000,
    status: "confirmed",
  },
  // Add more mock transactions...
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "0");
  const pageSize = 10;

  const start = page * pageSize;
  const end = start + pageSize;
  const transactions = MOCK_TRANSACTIONS.slice(start, end);
  const hasMore = MOCK_TRANSACTIONS.length > end;

  return NextResponse.json({
    transactions,
    nextCursor: hasMore ? page + 1 : undefined,
  });
}
