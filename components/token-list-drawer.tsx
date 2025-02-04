"use client";

import { useAccount } from "wagmi";
import { useTokenList } from "@/hooks/use-token-list";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEncryptedBalance } from "@/hooks/use-encrypted-balance";
import { formatEther } from "viem";

export function TokenListDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { address } = useAccount();
  const { data: tokens = [] } = useTokenList(address);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle>Token List</DrawerTitle>
          </DrawerHeader>
          <div className="px-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokens.map((token) => (
                  <TokenRow key={token.address} token={token} />
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end pb-4">
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function TokenRow({
  token,
}: {
  token: { address: string; name: string; symbol: string };
}) {
  const { decryptedBalance, isLoading } = useEncryptedBalance(token.address);

  return (
    <TableRow>
      <TableCell>{token.name}</TableCell>
      <TableCell>{token.symbol}</TableCell>
      <TableCell>
        {isLoading ? (
          "Loading..."
        ) : decryptedBalance ? (
          <span>
            {formatEther(decryptedBalance)} {token.symbol}
          </span>
        ) : (
          "0.00"
        )}
      </TableCell>
      <TableCell>
        <Button variant="outline" size="sm">
          Select
        </Button>
      </TableCell>
    </TableRow>
  );
}
