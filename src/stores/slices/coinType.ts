import { DEFAULT_COINS } from '@/constants/coins';
import { getCoinNameFromType } from '@/utils';
import type {
  CoinTypeLocalStorageState,
  CreateCoinTypeLocalStorageSlice,
  LocalCoinType,
  PartialCoinMetadata,
} from '@/stores';

export const intialCoinTypeLocalStorageState = {
  localCoinTypeState: {
    coinTypes: {
      mainnet: DEFAULT_COINS.mainnet
        .map((x) => {
          if (x) return { ...x, active: true };
          return null;
        })
        .filter((x) => !!x)
        .sort((a, b) => {
          const aCoinName = getCoinNameFromType(a!.coinType);
          const bCoinName = getCoinNameFromType(b!.coinType);
          return aCoinName.localeCompare(bCoinName);
        }),
      testnet: DEFAULT_COINS.testnet
        .map((x) => {
          if (x) return { ...x, active: true };
          return null;
        })
        .filter((x) => x)
        .sort((a, b) => {
          const aCoinName = getCoinNameFromType(a!.coinType);
          const bCoinName = getCoinNameFromType(b!.coinType);
          return aCoinName.localeCompare(bCoinName);
        }),
      devnet: DEFAULT_COINS.devnet
        .map((x) => {
          if (x) return { ...x, active: true };
          return null;
        })
        .filter((x) => x)
        .sort((a, b) => {
          const aCoinName = getCoinNameFromType(a!.coinType);
          const bCoinName = getCoinNameFromType(b!.coinType);
          return aCoinName.localeCompare(bCoinName);
        }),
    },
  } as CoinTypeLocalStorageState,
};

export const coinTypeLocalStorageSlice: CreateCoinTypeLocalStorageSlice = (setState) => {
  return {
    ...intialCoinTypeLocalStorageState,
    localCoinTypeActions: {
      addType: (network: string, coinMetadata: PartialCoinMetadata) => {
        setState((state: any) => {
          const store = { ...state };
          const duplicate = store.localCoinTypeState.coinTypes[network].some(
            (item: any) => item.coinType === coinMetadata.coinType
          );

          if (!duplicate) {
            coinMetadata.symbol = coinMetadata.symbol.toUpperCase();
            store.localCoinTypeState.coinTypes[network].push({ ...coinMetadata, active: true });
          }
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
