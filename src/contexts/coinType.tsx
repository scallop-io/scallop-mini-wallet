import React, {
  type PropsWithChildren,
  createContext,
  useCallback,
  type FC,
  useContext,
  useMemo,
  useEffect,
} from 'react';
import {
  type CoinTypeLocalStorageState,
  useLocalStorage,
  type LocalCoinType,
  networks,
} from '@/stores';
import { useNetwork } from './connection';
import { useCoinTypeDB } from './db';

export interface LocalCoinTypeContextInterface {
  coinTypes: LocalCoinType[];
  addCoinType: (coinMetadata: LocalCoinType) => boolean;
  removeCoinType: (coinType: string) => void;
  setActive: (coinType: string) => void;
  setInactive: (coinType: string) => void;
}

export const LocalCoinTypeContext = createContext<LocalCoinTypeContextInterface>({
  coinTypes: [],
  addCoinType: () => false,
  removeCoinType: () => undefined,
  setActive: () => undefined,
  setInactive: () => undefined,
});

type LocalCoinTypeProviderProps = {
  initialCoinTypeState?: CoinTypeLocalStorageState;
};

export const LocalCoinTypeProvider: FC<PropsWithChildren<LocalCoinTypeProviderProps>> = ({
  children,
  initialCoinTypeState,
}) => {
  const { addCoinTypeImage, removeCoinTypeImage } = useCoinTypeDB();
  const { localCoinTypeState, localCoinTypeActions } = useLocalStorage();
  const { currentNetwork } = useNetwork();

  const coinTypes = useMemo(
    () => localCoinTypeState.coinTypes[currentNetwork],
    [localCoinTypeState.coinTypes[currentNetwork], currentNetwork]
  );

  const addCoinType = useCallback(
    (coinMetadata: LocalCoinType) => {
      const exist = coinTypes.some((coin) => coin.coinType === coinMetadata.coinType);
      localCoinTypeActions.addType(currentNetwork, coinMetadata);
      return !exist;
    },
    [currentNetwork]
  );

  const removeCoinType = useCallback(
    (coinType: string) => {
      localCoinTypeActions.removeType(currentNetwork, coinType);
      removeCoinTypeImage(coinType);
      return;
    },
    [currentNetwork]
  );

  const setActive = useCallback(
    (coinType: string) => {
      localCoinTypeActions.setActive(currentNetwork, coinType);
      return;
    },
    [currentNetwork]
  );

  const setInactive = useCallback(
    (coinType: string) => {
      localCoinTypeActions.setInactive(currentNetwork, coinType);
      return;
    },
    [currentNetwork]
  );

  useEffect(() => {
    for (const network of networks) {
      for (const coinType of initialCoinTypeState?.coinTypes[network] || []) {
        if (coinType.iconUrl) {
          addCoinTypeImage(coinType.coinType, coinType.iconUrl);
          delete coinType.iconUrl;
        }
      }
    }
    if (initialCoinTypeState) localCoinTypeActions.initialImport(initialCoinTypeState);
  }, []);

  return (
    <LocalCoinTypeContext.Provider
      value={{
        coinTypes: coinTypes,
        addCoinType,
        removeCoinType,
        setActive,
        setInactive,
      }}
    >
      {children}
    </LocalCoinTypeContext.Provider>
  );
};

export const useLocalCoinType = () => {
  const { coinTypes, addCoinType, removeCoinType, setActive, setInactive } =
    useContext(LocalCoinTypeContext);

  return {
    coinTypes,
    addCoinType,
    removeCoinType,
    setActive,
    setInactive,
  };
};
