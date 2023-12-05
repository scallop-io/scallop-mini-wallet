import React, {
  type PropsWithChildren,
  useMemo,
  createContext,
  useCallback,
  type FC,
  useContext,
} from 'react';
import { useLocalStorage, type LocalCoinType } from '@/stores';

export interface LocalCoinTypeContextInterface {
  coinTypes: LocalCoinType[];
  addCoinType: (coinType: string) => void;
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

  const coinTypes = useMemo(() => {
    return localCoinTypeState.coinTypes;
  }, [localCoinTypeState.coinTypes]);

  const addCoinType = useCallback((coinType: string) => {
    return localCoinTypeActions.addType(coinType);
  }, []);

  const setActive = useCallback((coinType: string) => {
    return localCoinTypeActions.setActive(coinType);
  }, []);

  const setInactive = useCallback((coinType: string) => {
    return localCoinTypeActions.setInactive(coinType);
  }, []);

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
