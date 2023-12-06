import { useQuery } from '@tanstack/react-query';
import useAftermath from './useAftermath';
import type { SuiClient } from '@mysten/sui.js/client';

const useGetCoinPrice = (client: SuiClient, coin?: string, refetchInterval?: number) => {
  const { price } = useAftermath(client);
  return useQuery({
    queryKey: refetchInterval
      ? ['hook-get-completed-trade-route', coin, refetchInterval]
      : ['hook-get-completed-trade-route', coin],
    queryFn: async () =>
      await price.getCoinPrice({
        coin: coin ?? '',
      }),
    enabled: !!coin,
    refetchInterval,
  });
};

export default useGetCoinPrice;
