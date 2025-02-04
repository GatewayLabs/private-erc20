import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTokenList } from "@/hooks/use-token-list";
import { useSelectedToken } from "@/hooks/use-selected-token";

export function TokenSelector() {
  const { tokens, isLoading } = useTokenList();
  const { selectedToken, selectToken } = useSelectedToken();

  // Auto-select first token if none is selected
  useEffect(() => {
    if (tokens && tokens.length > 0 && !selectedToken) {
      selectToken(tokens[0]);
    }
  }, [tokens, selectedToken, selectToken]);

  if (isLoading) return <div>Loading tokens...</div>;
  if (!tokens || tokens.length === 0) return <div>No tokens available</div>;

  return (
    <Select
      value={selectedToken?.address}
      onValueChange={(value) => {
        const token = tokens.find((t) => t.address === value);
        if (token) selectToken(token);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a token">
          {selectedToken
            ? `${selectedToken.symbol} - ${selectedToken.name}`
            : "Select a token"}
        </SelectValue>
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
