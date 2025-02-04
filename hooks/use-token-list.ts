import { useReadContract, useReadContracts } from "wagmi";
import {
  DISCRETE_ERC20_ABI,
  DISCRETE_ERC20_FACTORY_ABI,
  DISCRETE_ERC20_FACTORY_ADDRESS,
} from "@/lib/contracts";
import { getAddress } from "viem";

export interface TokenData {
  address: `0x${string}`;
  name: string;
  symbol: string;
  decimals: number;
}

export function useTokenList() {
  // Get total number of tokens
  const { data: tokenCount, refetch: refetchTokenCount } = useReadContract({
    address: DISCRETE_ERC20_FACTORY_ADDRESS,
    abi: DISCRETE_ERC20_FACTORY_ABI,
    functionName: "getTokensCount",
  });

  // Get all token addresses
  const {
    data: tokens,
    isLoading,
    refetch: refetchTokens,
  } = useReadContracts({
    contracts: Array.from({ length: Number(tokenCount || 0) }).map(
      (_, index) => ({
        address: DISCRETE_ERC20_FACTORY_ADDRESS,
        abi: DISCRETE_ERC20_FACTORY_ABI,
        functionName: "getToken",
        args: [BigInt(index)],
      })
    ),
    query: {
      enabled: tokenCount !== undefined && tokenCount > 0,
    },
  });

  // Get token details
  const { data: tokenDetails, refetch: refetchDetails } = useReadContracts({
    contracts: (tokens || [])
      .map((token) => {
        if (!token.result) return [];
        const address = getAddress(token.result.toString());
        return [
          {
            address,
            abi: DISCRETE_ERC20_ABI,
            functionName: "name",
          },
          {
            address,
            abi: DISCRETE_ERC20_ABI,
            functionName: "symbol",
          },
          {
            address,
            abi: DISCRETE_ERC20_ABI,
            functionName: "decimals",
          },
        ];
      })
      .flat(),
    query: {
      enabled: tokens !== undefined && tokens.length > 0,
    },
  });

  const tokenList: TokenData[] =
    tokens
      ?.map((token, index) => {
        if (!token.result) return null;
        const baseIndex = index * 3;
        return {
          address: getAddress(token.result.toString()),
          name: (tokenDetails?.[baseIndex]?.result as string) || "",
          symbol: (tokenDetails?.[baseIndex + 1]?.result as string) || "",
          decimals: Number(tokenDetails?.[baseIndex + 2]?.result || 18),
        };
      })
      .filter((token): token is TokenData => token !== null) || [];

  const refetchAll = async () => {
    await refetchTokenCount();
    await refetchTokens();
    await refetchDetails();
  };

  return {
    tokens: tokenList,
    isLoading,
    refetchAll,
  };
}
