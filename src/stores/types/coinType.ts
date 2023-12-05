export type LocalCoinType = {
  coinType: string;
  active: boolean;
};

export interface CoinTypeLocalStorageState {
  coinTypes: LocalCoinType[];
}

export interface LocalCoinTypeStorageActions {
  addType: (coinType: string) => void;
  setActive: (coinType: string) => void;
  setInactive: (coinType: string) => void;
}

export interface CoinTypeLocalStorageSlice {
  localCoinTypeState: CoinTypeLocalStorageState;
  localCoinTypeActions: LocalCoinTypeStorageActions;
}
