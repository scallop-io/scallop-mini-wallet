export type LocalCoinType = {
  coinType: string;
  active: boolean;
  symbol: string;
  decimals: number;
  name: string;
  iconUrl?: string;
};

export interface CoinTypeLocalStorageState {
  coinTypes: {
    mainnet: LocalCoinType[];
    testnet: LocalCoinType[];
    devnet: LocalCoinType[];
  };
}

export interface LocalCoinTypeStorageActions {
  addType: (network: string, coinMetadata: LocalCoinType) => void;
  removeType: (network: string, coinType: string) => void;
  setActive: (network: string, coinType: string) => void;
  setInactive: (network: string, coinType: string) => void;
}

export interface CoinTypeLocalStorageSlice {
  localCoinTypeState: CoinTypeLocalStorageState;
  localCoinTypeActions: LocalCoinTypeStorageActions;
}
