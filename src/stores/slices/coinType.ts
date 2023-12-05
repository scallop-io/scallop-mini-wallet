import type {
  CoinTypeLocalStorageState,
  CreateCoinTypeLocalStorageSlice,
  LocalCoinType,
} from '@/stores';

export const intialCoinTypeLocalStorageState = {
  localCoinTypeState: {
    coinTypes: [],
  } as CoinTypeLocalStorageState,
};

export const coinTypeLocalStorageSlice: CreateCoinTypeLocalStorageSlice = (setState) => {
  return {
    ...intialCoinTypeLocalStorageState,
    localCoinTypeActions: {
      addType: (coinType: string) => {
        setState((state: any) => {
          const store = { ...state };
          store.localCoinTypeState.coinTypes.push({ coinType, active: true });
          return store;
        });
      },
      setActive: (coinType: string) => {
        setState((state: any) => {
          const store = { ...state };
          if (store && store.localCoinTypeState.coinTypes) {
            const s = (store.localCoinTypeState.coinTypes as LocalCoinType[]).find(
              (x) => x.coinType === coinType
            );
            if (s) s.active = true;
          }
          return store;
        });
      },
      setInactive: (coinType: string) => {
        setState((state: any) => {
          const store = { ...state };
          if (store && store.localCoinTypeState.coinTypes) {
            const s = (store.localCoinTypeState.coinTypes as LocalCoinType[]).find(
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
