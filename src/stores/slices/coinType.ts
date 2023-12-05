import { DEFAULT_COINS } from '@/constants/coins';
import type {
  CoinTypeLocalStorageState,
  CreateCoinTypeLocalStorageSlice,
  LocalCoinType,
} from '@/stores';

export const intialCoinTypeLocalStorageState = {
  localCoinTypeState: {
    coinTypes: {
      mainnet: DEFAULT_COINS.mainnet
        .map((x) => {
          if (x) return { ...x, active: true };
          return null;
        })
        .filter((x) => x),
      testnet: DEFAULT_COINS.testnet
        .map((x) => {
          if (x) return { ...x, active: true };
          return null;
        })
        .filter((x) => x),
      devnet: DEFAULT_COINS.devnet
        .map((x) => {
          if (x) return { ...x, active: true };
          return null;
        })
        .filter((x) => x),
    },
  } as CoinTypeLocalStorageState,
};

export const coinTypeLocalStorageSlice: CreateCoinTypeLocalStorageSlice = (setState) => {
  return {
    ...intialCoinTypeLocalStorageState,
    localCoinTypeActions: {
      addType: (network: string, coinType: string) => {
        setState((state: any) => {
          const store = { ...state };
          store.localCoinTypeState.coinTypes[network].push({ coinType, active: true });
          return store;
        });
      },
      setActive: (network: string, coinType: string) => {
        setState((state: any) => {
          const store = { ...state };
          if (store && store.localCoinTypeState.coinTypes[network]) {
            const s = (store.localCoinTypeState.coinTypes[network] as LocalCoinType[]).find(
              (x) => x.coinType === coinType
            );
            if (s) s.active = true;
          }
          return store;
        });
      },
      setInactive: (network: string, coinType: string) => {
        setState((state: any) => {
          const store = { ...state };
          if (store && store.localCoinTypeState.coinTypes[network]) {
            const s = (store.localCoinTypeState.coinTypes[network] as LocalCoinType[]).find(
              (x) => x.coinType === coinType
            );
            if (s) s.active = false;
          }
          return store;
        });
      },
    },
  };
};
