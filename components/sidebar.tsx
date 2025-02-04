"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Coins, Send, History, Plus, Menu } from "lucide-react";
import { SendMoneyDrawer } from "./send-money-drawer";
import { DeployTokenDrawer } from "./deploy-token-drawer";
import { TransactionHistoryDrawer } from "./transaction-history-drawer";
import { TokenListDrawer } from "./token-list-drawer";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  {
    name: "Token List",
    icon: Coins,
    action: "token-list",
  },
  {
    name: "Deploy Private Token",
    icon: Plus,
    action: "deploy-token",
  },
  {
    name: "Send To",
    icon: Send,
    action: "send-to",
  },
  {
    name: "Transaction History",
    icon: History,
    action: "transaction-history",
  },
];

export function Sidebar() {
  const [openDrawer, setOpenDrawer] = useState<string | null>(null);
  const { selectedToken } = useSelectedToken();

  const handleNavigation = (action: string) => {
    setOpenDrawer(action);
  };

  const SidebarContent = () => (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Main Menu
        </h2>
        <div className="space-y-1">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.action)}
              className={cn(
                "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                openDrawer === item.action
                  ? "bg-accent text-accent-foreground"
                  : "transparent"
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-[240px] flex-col border-r bg-background px-3 py-4">
        <div className="flex h-[60px] items-center px-2">
          <span className="ml-2 text-xl font-semibold">Private ERC20</span>
        </div>
        <SidebarContent />
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex h-16 items-center border-b bg-background px-4">
        <Sheet>
          <SheetTrigger asChild>
            <button className="mr-4" aria-label="Menu">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] p-0">
            <div className="flex h-[60px] items-center px-6">
              <span className="text-xl font-semibold">Private ERC20</span>
            </div>
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <span className="text-lg font-semibold">Private ERC20</span>
      </div>

      {/* Drawers */}
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
