import { useQuery } from '@tanstack/react-query';
import { useConnectionClient } from '@/contexts';
import type { UseQueryResult } from '@tanstack/react-query';
import type { CoinMetadata } from '@mysten/sui.js/client';

const useGetCoinMetadata = (
  coinType?: string,
  refetchInterval?: number
): UseQueryResult<CoinMetadata | null, unknown> => {
  const rpc = useConnectionClient();
  return useQuery({
    queryKey: refetchInterval
      ? ['get-coin-metadata', coinType, refetchInterval]
      : ['get-coin-metadata', coinType],
    queryFn: async () => (coinType ? await rpc.getCoinMetadata({ coinType }) : null),
    retry: false,
    staleTime: Infinity,
    enabled: true,
    // Keep this data in the cache for 24 hours.
    // We allow this to be GC'd after a very long time to avoid unbounded cache growth.
    gcTime: 24 * 60 * 60 * 1000,
    refetchInterval,
  });
};

export default useGetCoinMetadata;
