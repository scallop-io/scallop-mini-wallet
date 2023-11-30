import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useSuiClient } from '@mysten/dapp-kit';
import { CoinMetadata } from '@mysten/sui.js/client';

const useGetCoinMetadata = (coinType?: string, refetchInterval?: number) : UseQueryResult<CoinMetadata | null, unknown> => {
  const rpc = useSuiClient();
  return useQuery({
    queryKey: refetchInterval
      ? ['get-coin-metadata', coinType, refetchInterval]
      : ['get-coin-metadata', coinType],
    queryFn: async () => (coinType ? await rpc.getCoinMetadata({ coinType }) : null),
    retry: false,
    staleTime: Infinity,
    enabled: false,
    // Keep this data in the cache for 24 hours.
    // We allow this to be GC'd after a very long time to avoid unbounded cache growth.
    gcTime: 24 * 60 * 60 * 1000,
    refetchInterval,
  })
}

export default useGetCoinMetadata;