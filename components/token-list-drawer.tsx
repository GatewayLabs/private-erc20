"use client";

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
import { useSelectedToken } from "@/hooks/use-selected-token";
import { TokenInfo } from "@/types";

export function TokenListDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { tokens } = useTokenList();

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
                  <TokenRow
                    key={token.address}
                    token={token}
                    onClose={() => onOpenChange(false)}
                  />
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
  onClose,
}: {
  token: TokenInfo;
  onClose: () => void;
}) {
  const { decryptedBalance, isLoading } = useEncryptedBalance(
    token.address as `0x${string}`
  );
  const { selectToken } = useSelectedToken();

  const handleSelect = () => {
    selectToken(token);
    onClose();
  };

  return (
    <TableRow>
      <TableCell>{token.name}</TableCell>
      <TableCell>{token.symbol}</TableCell>
      <TableCell>
        {isLoading ? (
          "Loading..."
        ) : decryptedBalance ? (
          <span>
            {decryptedBalance} {token.symbol}
          </span>
        ) : (
          "0.00"
        )}
      </TableCell>
      <TableCell>
        <Button variant="outline" size="sm" onClick={handleSelect}>
          Select
        </Button>
      </TableCell>
    </TableRow>
  );
}
