"use client";

import { useState } from "react";
import { useDeployToken } from "@/hooks/use-deploy-token";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useToast } from "@/components/ui/use-toast";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useTokenList } from "@/hooks/use-token-list";

export function DeployTokenDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [initialSupply, setInitialSupply] = useState("");
  const { toast } = useToast();
  const { selectToken } = useSelectedToken();
  const { refetchAll } = useTokenList();

  const { deployToken, isPending, error } = useDeployToken();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await deployToken({
      name,
      symbol,
      initialSupply,
      decimals: 18,
      onSuccess: async (address) => {
        onOpenChange(false);

        toast({
          title: "Token Deployed Successfully",
          description: `Your token has been deployed at ${address}`,
        });

        await refetchAll();

        selectToken({
          address,
          name,
          symbol,
          decimals: 0,
        });

        setName("");
        setSymbol("");
        setInitialSupply("");
      },
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Deploy New Token</DrawerTitle>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 px-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Token Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="symbol">Token Symbol</Label>
              <Input
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="initialSupply">Initial Supply</Label>
              <Input
                id="initialSupply"
                type="number"
                value={initialSupply}
                onChange={(e) => setInitialSupply(e.target.value)}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <DrawerFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Deploying..." : "Deploy Token"}
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
