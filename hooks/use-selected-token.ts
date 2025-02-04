import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TokenInfo } from "@/types";

const SELECTED_TOKEN_KEY = ["selected-token"] as const;

export function useSelectedToken() {
  const queryClient = useQueryClient();

  const { data: selectedToken } = useQuery<TokenInfo | null>({
    queryKey: SELECTED_TOKEN_KEY,
    // Initialize with null if no token is selected
    initialData: null,
  });

  const selectToken = (token: TokenInfo) => {
    queryClient.setQueryData(SELECTED_TOKEN_KEY, token);
  };

  return {
    selectedToken,
    selectToken,
  };
}
