import type { NetworkType } from './connection';

export type LocalCoinType = {
  coinType: string;
  active: boolean;
  symbol: string;
  decimals: number;
  iconUrl?: string;
};

export interface CoinTypeLocalStorageState {
  coinTypes: {
    [k in NetworkType]: LocalCoinType[];
  };
}

export interface LocalCoinTypeStorageActions {
  addType: (network: string, coinMetadata: LocalCoinType) => void;
  initialImport: (initialState: CoinTypeLocalStorageState) => void;
  removeType: (network: string, coinType: string) => void;
  setActive: (network: string, coinType: string) => void;
  setInactive: (network: string, coinType: string) => void;
}

export interface CoinTypeLocalStorageSlice {
  localCoinTypeState: CoinTypeLocalStorageState;
  localCoinTypeActions: LocalCoinTypeStorageActions;
}
