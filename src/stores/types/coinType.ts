import type { NetworkType } from './connection';

export type CustomCoinType = {
  coinType: string;
  active?: boolean;
  symbol: string;
  decimals: number;
  iconUrl?: string;
};

export interface CoinTypeLocalStorageState {
  coinTypes: {
    [k in NetworkType]: CustomCoinType[];
  };
}

export interface LocalCoinTypeStorageActions {
  addType: (network: string, coinMetadata: CustomCoinType) => void;
  initialImport: (initialState: CoinTypeLocalStorageState) => void;
  removeType: (network: string, coinType: string) => void;
  setActive: (network: string, coinType: string) => void;
  setInactive: (network: string, coinType: string) => void;
}

export interface CoinTypeLocalStorageSlice {
  customCoinTypeState: CoinTypeLocalStorageState;
  customCoinTypeActions: LocalCoinTypeStorageActions;
}
