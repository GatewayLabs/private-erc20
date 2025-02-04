import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TokenInfo } from "@/types";
import { useTokenList } from "@/hooks/use-token-list";

interface TokenSelectorProps {
  onSelectToken: (token: TokenInfo) => void;
}

export function TokenSelector({ onSelectToken }: TokenSelectorProps) {
  const { address } = useAccount();
  const { tokens, isLoading, error } = useTokenList(address);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  useEffect(() => {
    if (tokens && tokens.length > 0 && !selectedToken) {
      setSelectedToken(tokens[0].address);
      onSelectToken(tokens[0]);
    }
  }, [tokens, selectedToken, onSelectToken]);

  if (isLoading) return <div>Loading tokens...</div>;
  if (error) return <div>Error loading tokens: {error}</div>;
  if (!tokens || tokens.length === 0) return <div>No tokens available</div>;

  return (
    <Select
      value={selectedToken || undefined}
      onValueChange={(value) => {
        setSelectedToken(value);
        const token = tokens.find((t) => t.address === value);
        if (token) onSelectToken(token);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a token" />
      </SelectTrigger>
      <SelectContent>
        {tokens.map((token) => (
          <SelectItem key={token.address} value={token.address}>
            {token.symbol} - {token.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
