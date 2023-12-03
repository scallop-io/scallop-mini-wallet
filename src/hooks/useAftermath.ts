import { Aftermath, AftermathApi, IndexerCaller } from 'aftermath-ts-sdk';
import { afConfigAddresses } from '@/constants/aftermath';
import type { SuiClient } from '@mysten/sui.js/client';

const useAftermath = (client: SuiClient, env: 'LOCAL' | 'MAINNET' = 'MAINNET') => {
  const api = new AftermathApi(client, afConfigAddresses, new IndexerCaller(env));
  const aftermath = new Aftermath(env);
  return {
    routerApi: api.Router(),
    router: aftermath.Router(),
    pools: aftermath.Pools(),
    poolsApi: api.Pools(),
    price: aftermath.Prices(),
  };
};
export default useAftermath;
