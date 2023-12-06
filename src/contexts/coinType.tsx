import React, {
  type PropsWithChildren,
  useMemo,
  createContext,
  useCallback,
  type FC,
  useContext,
} from 'react';
import { useLocalStorage, type LocalCoinType } from '@/stores';
import { useNetwork } from './connection';

export interface LocalCoinTypeContextInterface {
  coinTypes: LocalCoinType[];
  addCoinType: (coinMetadata: LocalCoinType) => void;
  setActive: (coinType: string) => void;
  setInactive: (coinType: string) => void;
}

export const LocalCoinTypeContext = createContext<LocalCoinTypeContextInterface>({
  coinTypes: [],
  addCoinType: () => undefined,
  setActive: () => undefined,
  setInactive: () => undefined,
});

type LocalCoinTypeProviderProps = {};

export const LocalCoinTypeProvider: FC<PropsWithChildren<LocalCoinTypeProviderProps>> = ({
  children,
}) => {
  const { localCoinTypeState, localCoinTypeActions } = useLocalStorage();
  const { currentNetwork } = useNetwork();

  const coinTypes = useMemo(() => {
    return localCoinTypeState.coinTypes[currentNetwork];
  }, [localCoinTypeState.coinTypes, currentNetwork]);

  const addCoinType = useCallback(
    (coinMetadata: LocalCoinType) => {
      return localCoinTypeActions.addType(currentNetwork, coinMetadata);
    },
    [currentNetwork]
  );

  const setActive = useCallback(
    (coinType: string) => {
      return localCoinTypeActions.setActive(currentNetwork, coinType);
    },
    [currentNetwork]
  );

  const setInactive = useCallback(
    (coinType: string) => {
      return localCoinTypeActions.setInactive(currentNetwork, coinType);
    },
    [currentNetwork]
  );

  return (
    <LocalCoinTypeContext.Provider
      value={{
        coinTypes: coinTypes,
        addCoinType,
        setActive,
        setInactive,
      }}
    >
      {children}
    </LocalCoinTypeContext.Provider>
  );
};

export const useLocalCoinType = () => {
  const { coinTypes, addCoinType, setActive, setInactive } = useContext(LocalCoinTypeContext);

  return {
    coinTypes,
    addCoinType,
    setActive,
    setInactive,
  };
};
