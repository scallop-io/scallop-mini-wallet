import type { SupportAssetCoins } from '@scallop-io/sui-scallop-sdk';
import type { rateTypeOptions } from '@/stores/slices/data';

export type RateTypeOptions = keyof typeof rateTypeOptions;
export type RateTypeValues = (typeof rateTypeOptions)[RateTypeOptions];

export interface DataLocalStorageState {
  rateType: RateTypeValues;
  marketStatusCoinName?: SupportAssetCoins;
}

interface DataLocalStorageActions {
  setRateType: (rateType: RateTypeOptions) => void;
  setMarketStatusCoinName: (coinName: SupportAssetCoins) => void;
}

export interface DataLocalStorageSlice {
  dataState: DataLocalStorageState;
  dataActions: DataLocalStorageActions;
}
