import type { CreateDataLocalStorageSlice, DataLocalStorageState } from '@/stores/types';
import type { RateTypeOptions } from '@/stores/types/data';

export enum rateTypeOptions {
  apr = 'apr',
  apy = 'apy',
}

export const initialDataLocalStorageState = {
  dataState: {
    rateType: rateTypeOptions.apy,
    marketStatusCoinName: undefined,
  } as DataLocalStorageState,
};

export const dataLocalStorageSlice: CreateDataLocalStorageSlice = (setState) => {
  return {
    ...initialDataLocalStorageState,
    dataActions: {
      setRateType: (rateType: RateTypeOptions) => {
        setState((state) => {
          const store = { ...state };
          store.dataState.rateType = rateTypeOptions[rateType];
          return store;
        });
      },
      setMarketStatusCoinName: (coin) => {
        setState((state) => {
          const store = { ...state };
          store.dataState.marketStatusCoinName = coin;
          return store;
        });
      },
    },
  };
};
