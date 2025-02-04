"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSendEncryptedTokens } from "@/hooks/use-send-encrypted-tokens";
import { isAddress } from "viem";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useEncryptedBalance } from "@/hooks/use-encrypted-balance";
import { useToast } from "@/components/ui/use-toast";

export function SendMoneyDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const { toast } = useToast();

  // Get the selected token info
  const { selectedToken } = useSelectedToken();
  const tokenAddress = selectedToken?.address as `0x${string}` | undefined;
  const { decryptedBalance: balance } = useEncryptedBalance(tokenAddress);

  const { sendTokens, isPending, isSuccess, error, reset } =
    useSendEncryptedTokens(tokenAddress as `0x${string}`);

  const isValidAddress = isAddress(recipient);
  const parsedAmount = parseFloat(amount);
  const parsedBalance = balance ? parseFloat(balance.replace(/,/g, "")) : 0;
  const isValidAmount =
    !isNaN(parsedAmount) && parsedAmount > 0 && parsedAmount <= parsedBalance;

  // Reset form and states when drawer is closed
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setAmount("");
      setRecipient("");
      reset?.();
    }
    onOpenChange(open);
  };

  // Handle transaction success
  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Success",
        description: "Tokens sent successfully",
      });
      handleOpenChange(false);
    }
  }, [isSuccess, toast]);

  // Handle transaction error
  useEffect(() => {
    if (error) {
      const errorMessage =
        (error as { message?: string })?.message || "Failed to send tokens";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!isValidAddress) {
        throw new Error("Invalid recipient address");
      }

      if (!isValidAmount) {
        throw new Error("Invalid amount");
      }

      await sendTokens({
        amount: parsedAmount.toString(),
        recipient: recipient as `0x${string}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to send tokens",
        variant: "destructive",
      });
    }
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Send {selectedToken?.symbol || "Tokens"}</DrawerTitle>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 px-4">
            <div className="grid gap-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                aria-invalid={recipient !== "" && !isValidAddress}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="flex gap-2">
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  aria-invalid={amount !== "" && !isValidAmount}
                />
                <div className="flex items-center px-3 border rounded-md bg-muted">
                  <span className="text-sm font-medium">
                    {selectedToken?.symbol}
                  </span>
                </div>
              </div>
              {balance && (
                <p className="text-sm text-muted-foreground">
                  Balance: {balance} {selectedToken?.symbol}
                </p>
              )}
            </div>
            <DrawerFooter>
              <Button
                type="submit"
                disabled={isPending || !isValidAddress || !isValidAmount}
              >
                {isPending ? "Sending..." : "Send"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
