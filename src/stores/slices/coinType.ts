import {
  networks,
  type CoinTypeLocalStorageState,
  type CreateCoinTypeLocalStorageSlice,
  type LocalCoinType,
} from '@/stores';

export const intialCoinTypeLocalStorageState = {
  localCoinTypeState: {
    coinTypes: {
      mainnet: [] as LocalCoinType[],
      testnet: [] as LocalCoinType[],
      devnet: [] as LocalCoinType[],
    },
  } as CoinTypeLocalStorageState,
};

export const coinTypeLocalStorageSlice: CreateCoinTypeLocalStorageSlice = (setState) => {
  return {
    ...intialCoinTypeLocalStorageState,
    localCoinTypeActions: {
      initialImport: (initialState) => {
        setState((state: any) => {
          const store = { ...state };

          // Use a Map to optimize the duplication check process
          const coinTypesMap = {
            mainnet: new Map<string, LocalCoinType>(),
            testnet: new Map<string, LocalCoinType>(),
            devnet: new Map<string, LocalCoinType>(),
          };

          // Use the addType logic to add coin types
          for (const network of networks) {
            for (const coinType of store.localCoinTypeState.coinTypes[network]) {
              coinTypesMap[network].set(coinType.coinType, coinType);
            }

            for (const coinType of initialState.coinTypes[network]) {
              // If duplicate, replace. If not duplicate, add
              coinTypesMap[network].set(coinType.coinType, { ...coinType, active: true });

            }

            // Convert Map values to array
            store.localCoinTypeState.coinTypes[network] = Array.from(
              coinTypesMap[network].values()
            );
          }

          return store;
        });
      },
      addType: (network: string, coinMetadata: LocalCoinType) => {
        setState((state: any) => {
          const store = { ...state };
          const coinTypes = store.localCoinTypeState.coinTypes[network];
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

          store.localCoinTypeState.coinTypes[network] = [...coinTypes];
          return store;
        });
      },
      removeType: (network: string, coinType: string) => {
        setState((state: any) => {
          const store = { ...state };
          const index = store.localCoinTypeState.coinTypes[network].findIndex(
            (item: any) => item.coinType === coinType
          );
          if (index >= 0) {
            store.localCoinTypeState.coinTypes[network].splice(index, 1);
          }
          store.localCoinTypeState.coinTypes[network] = [
            ...store.localCoinTypeState.coinTypes[network],
          ];
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
          store.localCoinTypeState.coinTypes[network] = [
            ...store.localCoinTypeState.coinTypes[network],
          ];
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
          store.localCoinTypeState.coinTypes[network] = [
            ...store.localCoinTypeState.coinTypes[network],
          ];
          return store;
        });
      },
    },
  };
};
