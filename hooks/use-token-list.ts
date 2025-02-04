import { useQuery } from "@tanstack/react-query";
import { TokenInfo } from "@/types";

async function fetchTokenList(address: string): Promise<TokenInfo[]> {
  // In a real application, this would fetch from your backend or a token list provider
  // For now, we'll return a mock list
  return [
    { address: "0x123...", name: "Mock Token 1", symbol: "MTK1", decimals: 18 },
    { address: "0x456...", name: "Mock Token 2", symbol: "MTK2", decimals: 18 },
  ];
}

export function useTokenList(address: string | undefined) {
  return useQuery({
    queryKey: ["tokenList", address],
    queryFn: () => (address ? fetchTokenList(address) : Promise.resolve([])),
    enabled: !!address,
  });
}
