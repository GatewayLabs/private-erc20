"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Coins, Send, History, Plus } from "lucide-react";
import { SendMoneyDrawer } from "./send-money-drawer";
import { DeployTokenDrawer } from "./deploy-token-drawer";
import { TransactionHistoryDrawer } from "./transaction-history-drawer";
import { TokenListDrawer } from "./token-list-drawer";
import { useTokenList } from "@/hooks/use-token-list";
import { useAccount } from "wagmi";

const actions = [
  {
    name: "Token List",
    icon: Coins,
    action: "token-list",
  },
  {
    name: "Deploy Token",
    icon: Plus,
    action: "deploy-token",
  },
  {
    name: "Send",
    icon: Send,
    action: "send-to",
  },
  {
    name: "History",
    icon: History,
    action: "transaction-history",
  },
];

export function QuickActions() {
  const [openDrawer, setOpenDrawer] = useState<string | null>(null);
  const { address } = useAccount();
  const { data: tokens = [] } = useTokenList(address);
  const selectedToken = tokens[0]; // For now, use the first token as selected

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Quick Actions</h2>
        <div className="flex gap-4">
          {actions.map((action) => (
            <Button
              key={action.name}
              variant="outline"
              className="flex-1 flex-col gap-2 py-6"
              onClick={() => setOpenDrawer(action.action)}
            >
              <action.icon className="h-5 w-5" />
              <span className="text-sm">{action.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <TokenListDrawer
        open={openDrawer === "token-list"}
        onOpenChange={(open) => setOpenDrawer(open ? "token-list" : null)}
      />

      <SendMoneyDrawer
        open={openDrawer === "send-to"}
        onOpenChange={(open) => setOpenDrawer(open ? "send-to" : null)}
      />

      <DeployTokenDrawer
        open={openDrawer === "deploy-token"}
        onOpenChange={(open) => setOpenDrawer(open ? "deploy-token" : null)}
      />

      <TransactionHistoryDrawer
        open={openDrawer === "transaction-history"}
        onOpenChange={(open) =>
          setOpenDrawer(open ? "transaction-history" : null)
        }
        selectedToken={selectedToken}
      />
    </>
  );
}
