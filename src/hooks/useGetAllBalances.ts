import { useQuery } from '@tanstack/react-query'
import { useSuiClient } from '@mysten/dapp-kit';

const useGetAllBalances = (
  address: string,
  refetchInterval?: number,
) => {
  const rpc = useSuiClient();
  return useQuery({
    queryKey: refetchInterval
      ? ['get-all-balances', address, refetchInterval]
      : ['get-all-balances', address],
    queryFn: async () => {
      return await rpc.getAllBalances({
        owner: address,
      });
    },
    enabled: !!address,
    refetchInterval,
  })
}

export default useGetAllBalances;