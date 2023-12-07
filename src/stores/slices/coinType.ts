import { DEFAULT_COINS } from '@/constants/coins';
import {
  networks,
  type CoinTypeLocalStorageState,
  type CreateCoinTypeLocalStorageSlice,
  type CustomCoinType,
} from '@/stores';

export const intialCoinTypeLocalStorageState = {
  customCoinTypeState: {
    coinTypes: DEFAULT_COINS,
  } as CoinTypeLocalStorageState,
};

export const coinTypeLocalStorageSlice: CreateCoinTypeLocalStorageSlice = (setState) => {
  return {
    ...intialCoinTypeLocalStorageState,
    customCoinTypeActions: {
      initialImport: (initialState) => {
        setState((state: any) => {
          const store = { ...state };

          // Use a Map to optimize the duplication check process
          const coinTypesMap = {
            mainnet: new Map<string, CustomCoinType>(),
            testnet: new Map<string, CustomCoinType>(),
            devnet: new Map<string, CustomCoinType>(),
          };

          // Use the addType logic to add coin types
          for (const network of networks) {
            for (const coinType of store.customCoinTypeState.coinTypes[network]) {
              coinTypesMap[network].set(coinType.coinType, coinType);
            }

            for (const coinType of initialState.coinTypes[network]) {
              // If duplicate, replace. If not duplicate, add
              coinTypesMap[network].set(coinType.coinType, { ...coinType, active: true });

            }

            // Convert Map values to array
            store.customCoinTypeState.coinTypes[network] = Array.from(
              coinTypesMap[network].values()
            );
          }

          return store;
        });
      },
      addType: (network: string, coinMetadata: CustomCoinType) => {
        setState((state: any) => {
          const store = { ...state };
          const coinTypes = store.customCoinTypeState.coinTypes[network];
          const duplicateIndex = coinTypes.findIndex(
            (item: any) => item.coinType === coinMetadata.coinType
          );

          if (duplicateIndex !== -1) {
            // If duplicate, replace
            coinTypes[duplicateIndex] = { ...coinMetadata, active: true };
          } else {
            // If not duplicate, add
            coinTypes.push({ ...coinMetadata, active: true });
          }

          store.customCoinTypeState.coinTypes[network] = [...coinTypes];
          return store;
        });
      },
      removeType: (network: string, coinType: string) => {
        setState((state: any) => {
          const store = { ...state };
          const index = store.customCoinTypeState.coinTypes[network].findIndex(
            (item: any) => item.coinType === coinType
          );
          if (index >= 0) {
            store.customCoinTypeState.coinTypes[network].splice(index, 1);
          }
          store.customCoinTypeState.coinTypes[network] = [
            ...store.customCoinTypeState.coinTypes[network],
          ];
          return store;
        });
      },
      setActive: (network: string, coinType: string) => {
        setState((state: any) => {
          const store = { ...state };
          if (store && store.customCoinTypeState.coinTypes[network]) {
            const s = (store.customCoinTypeState.coinTypes[network] as CustomCoinType[]).find(
              (x) => x.coinType === coinType
            );
            if (s) s.active = true;
          }
          store.customCoinTypeState.coinTypes[network] = [
            ...store.customCoinTypeState.coinTypes[network],
          ];
          return store;
        });
      },
      setInactive: (network: string, coinType: string) => {
        setState((state: any) => {
          const store = { ...state };
          if (store && store.customCoinTypeState.coinTypes[network]) {
            const s = (store.customCoinTypeState.coinTypes[network] as CustomCoinType[]).find(
              (x) => x.coinType === coinType
            );
            if (s) s.active = false;
          }
          store.customCoinTypeState.coinTypes[network] = [
            ...store.customCoinTypeState.coinTypes[network],
          ];
          return store;
        });
      },
    },
  };
};
