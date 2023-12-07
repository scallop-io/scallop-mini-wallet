import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getDB } from '@/utils';
import { useNetwork } from './connection';
import type { FC, PropsWithChildren } from 'react';
import type { ZkLoginAccountSerialized } from '@/types';
import type { DB } from '@/utils';

export interface DbContextInterface {
  getAccounts: () => Promise<ZkLoginAccountSerialized[]>;
  addAccount: (account: ZkLoginAccountSerialized) => Promise<void>;
  removeAccount: (id: string) => Promise<void>;
  updateAccount: (account: ZkLoginAccountSerialized) => Promise<void>;
  coinTypeImageCache: { [coinType: string]: any };
  addCoinTypeImage: (coinType: string, image: string) => Promise<void>;
  removeCoinTypeImage: (coinType: string) => Promise<void>;
}

export const DbContext = createContext<DbContextInterface>({
  getAccounts: async () => [] as ZkLoginAccountSerialized[],
  addAccount: async () => undefined,
  removeAccount: async () => undefined,
  updateAccount: async () => undefined,
  coinTypeImageCache: {},
  addCoinTypeImage: async () => undefined,
  removeCoinTypeImage: async () => undefined,
});

type DbProviderProps = {};
export const DbProvider: FC<PropsWithChildren<DbProviderProps>> = ({ children }) => {
  const { currentNetwork } = useNetwork();
  const [db, setDb] = useState<DB | undefined>();
  const [coinTypeImageCache, setCoinTypeImageCache] = useState<{ [coinType: string]: any }>({});

  const _getDB = useCallback(async () => {
    if (db) {
      return db;
    }

    const _db = await getDB();
    setDb(_db);
    return _db;
  }, [db]);

  // -------------------------------------------------------------------- //
  const addAccount = useCallback(
    async (account: ZkLoginAccountSerialized) => {
      const _db = await _getDB();
      _db?.accounts.put(account);
      await getAccounts();
    },
    [db]
  );

  const removeAccount = useCallback(
    async (id: string) => {
      const _db = await _getDB();
      _db?.accounts.delete(id);
      await getAccounts();
    },
    [db]
  );

  const updateAccount = useCallback(
    async (account: ZkLoginAccountSerialized) => {
      await addAccount(account);
    },
    [db]
  );

  const getAccounts = async () => {
    const _db = await _getDB();
    const accounts = await _db.accounts.toArray();
    return accounts;
  };
  // -------------------------------------------------------------------- //

  // -------------------------------------------------------------------- //
  const addCoinTypeImage = useCallback(
    async (coinType: string, image: string) => {
      const _db = await _getDB();
      _db?.coinTypes.put({ coinType, image, network: currentNetwork });
      setCoinTypeImageCache({ ...coinTypeImageCache, [coinType]: image });
    },
    [db, currentNetwork]
  );

  const removeCoinTypeImage = useCallback(
    async (coinType: string) => {
      const _db = await _getDB();
      delete coinTypeImageCache[coinType];
      setCoinTypeImageCache({ ...coinTypeImageCache });
      _db?.coinTypes.delete(coinType);
    },
    [db]
  );

  // -------------------------------------------------------------------- //

  useEffect(() => {
    const _getCoinTypeImages = async () => {
      const _db = await _getDB();
      const coinTypes = await _db?.coinTypes.toArray();
      const coinTypeImageCache = coinTypes?.reduce(
        (acc, curr) => {
          acc[curr.coinType] = curr.image;
          return acc;
        },
        {} as { [coinType: string]: any }
      );
      setCoinTypeImageCache(coinTypeImageCache);
    };
    _getCoinTypeImages();
  }, []);

  return (
    <DbContext.Provider
      value={{
        getAccounts,
        addAccount,
        removeAccount,
        updateAccount,
        coinTypeImageCache,
        addCoinTypeImage,
        removeCoinTypeImage,
      }}
    >
      {children}
    </DbContext.Provider>
  );
};

export const useAccountDB = () => {
  const { getAccounts, addAccount, removeAccount, updateAccount } = useContext(DbContext);

  return {
    getAccounts,
    addAccount,
    removeAccount,
    updateAccount,
  };
};

export const useCoinTypeDB = () => {
  const { coinTypeImageCache, addCoinTypeImage, removeCoinTypeImage } = useContext(DbContext);

  return {
    coinTypeImageCache,
    addCoinTypeImage,
    removeCoinTypeImage,
  };
};
