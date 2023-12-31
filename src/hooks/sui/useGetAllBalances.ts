import { normalizeSuiAddress, isValidSuiAddress } from '@mysten/sui.js/utils';
import { useQuery } from '@tanstack/react-query';
import { useConnectionClient } from '@/contexts/connection';
import type { CoinBalance } from '@mysten/sui.js/client';
import type { UseQueryResult } from '@tanstack/react-query';

const useGetAllBalances = (
  address?: string | null,
  refetchInterval?: number,
  enabled: boolean = true
): UseQueryResult<CoinBalance[], unknown> => {
  const client = useConnectionClient();
  const parsedAddress = address ? normalizeSuiAddress(address) : undefined;

  return useQuery({
    queryKey: refetchInterval
      ? ['hooks-sui-getAllBalances', parsedAddress, refetchInterval]
      : ['hooks-sui-getAllBalances', parsedAddress],
    queryFn: async () =>
      parsedAddress ? await client.getAllBalances({ owner: parsedAddress }) : [],
    retry: true,
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
    refetchInterval,
    enabled: enabled && parsedAddress !== undefined && isValidSuiAddress(parsedAddress),
  });
};

export default useGetAllBalances;
