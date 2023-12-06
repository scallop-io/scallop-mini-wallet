import React, {
  type PropsWithChildren,
  useMemo,
  createContext,
  useCallback,
  type FC,
  useContext,
} from 'react';
import { useLocalStorage, type LocalCoinType, type PartialCoinMetadata } from '@/stores';
import { useNetwork } from './connection';

export interface LocalCoinTypeContextInterface {
  coinTypes: LocalCoinType[];
  addCoinType: (coinMetadata: PartialCoinMetadata) => void;
  addBulkCoinType: (coinMetadata: PartialCoinMetadata[]) => void;
  setActive: (coinType: string) => void;
  setInactive: (coinType: string) => void;
}

export const LocalCoinTypeContext = createContext<LocalCoinTypeContextInterface>({
  coinTypes: [],
  addCoinType: () => undefined,
  addBulkCoinType: () => undefined,
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
  }, [currentNetwork]);

  const addCoinType = useCallback(
    (coinMetadata: PartialCoinMetadata) => {
      return localCoinTypeActions.addType(currentNetwork, coinMetadata);
    },
    [currentNetwork]
  );

  const addBulkCoinType = useCallback(
    (coinMetadata: PartialCoinMetadata[]) => {
      return localCoinTypeActions.addBulk(currentNetwork, coinMetadata);
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
        addBulkCoinType,
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
  const { coinTypes, addCoinType, addBulkCoinType, setActive, setInactive } =
    useContext(LocalCoinTypeContext);

  return {
    coinTypes,
    addBulkCoinType,
    addCoinType,
    setActive,
    setInactive,
  };
};
