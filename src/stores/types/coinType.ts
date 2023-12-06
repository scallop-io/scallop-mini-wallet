import type { CoinMetadata } from '@mysten/sui.js/client';

export type LocalCoinType = {
  coinType: string;
  active: boolean;
  symbol: string;
};

export type PartialCoinMetadata = Pick<LocalCoinType, 'coinType'> & Pick<CoinMetadata, 'symbol'>;

export interface CoinTypeLocalStorageState {
  coinTypes: {
    mainnet: LocalCoinType[];
    testnet: LocalCoinType[];
    devnet: LocalCoinType[];
  };
}


export interface LocalCoinTypeStorageActions {
  addType: (network: string, coinMetadata: PartialCoinMetadata) => void;
  setActive: (network: string, coinType: string) => void;
  setInactive: (network: string, coinType: string) => void;
}

export interface CoinTypeLocalStorageSlice {
  localCoinTypeState: CoinTypeLocalStorageState;
  localCoinTypeActions: LocalCoinTypeStorageActions;
}
