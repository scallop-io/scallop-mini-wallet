import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getDB, serializeCoinTypeWithNetwork } from '@/utils';
import { useNetwork } from './connection';
import type { DB } from '@/utils';
import type { FC, PropsWithChildren } from 'react';
import type { ZkLoginAccountSerialized } from '@/types';

export interface DbContextInterface {
  getAccounts: () => Promise<ZkLoginAccountSerialized[]>;
  addAccount: (account: ZkLoginAccountSerialized) => Promise<void>;
  removeAccount: (id: string) => Promise<void>;
  updateAccount: (account: ZkLoginAccountSerialized) => Promise<void>;
  coinIconImageCache: { [coinType: string]: any; };
  addCoinIcon: (coinType: string, image: string, network?: string) => Promise<void>;
  removeCoinIcon: (coinType: string) => Promise<void>;
  reloadCoinIconCache: () => Promise<any>;
}

export const DbContext = createContext<DbContextInterface>({
  getAccounts: async () => [] as ZkLoginAccountSerialized[],
  addAccount: async () => undefined,
  removeAccount: async () => undefined,
  updateAccount: async () => undefined,
  coinIconImageCache: {},
  addCoinIcon: async () => undefined,
  removeCoinIcon: async () => undefined,
  reloadCoinIconCache: async () => undefined,
});

type DbProviderProps = {};
export const DbProvider: FC<PropsWithChildren<DbProviderProps>> = ({ children }) => {
  const { currentNetwork } = useNetwork();
  const [db, setDb] = useState<DB | null>(null);
  const [_accounts, setAccounts] = useState<ZkLoginAccountSerialized[]>([]);
  const [coinIconImageCache, setCoinIconCache] = useState<{ [coinType: string]: any; }>({});

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
      await _db?.accounts.put(account);
      setAccounts(await getAccounts());
    },
    [db]
  );

  const removeAccount = useCallback(
    async (id: string) => {
      const _db = await _getDB();
      await _db?.accounts.delete(id);
      setAccounts(await getAccounts());
    },
    [db]
  );

  const updateAccount = useCallback(
    async (account: ZkLoginAccountSerialized) => {
      await addAccount(account);
      setAccounts(await getAccounts());
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
  const addCoinIcon = useCallback(
    async (coinType: string, image: string, network?: string) => {
      const _db = await _getDB();
      const id = serializeCoinTypeWithNetwork(coinType, network ?? currentNetwork);
      const data = { id, coinType, image, network: network ?? currentNetwork };
      await _db?.coinTypes.put(data);
      await _reloadCoinIconCache();
    },
    [db, currentNetwork]
  );

  const removeCoinIcon = useCallback(
    async (coinType: string) => {
      const _db = await _getDB();
      const id = serializeCoinTypeWithNetwork(coinType, currentNetwork);
      await _db?.coinTypes.delete(id);
      await _reloadCoinIconCache();
    },
    [db, currentNetwork]
  );

  // -------------------------------------------------------------------- //

  const _reloadCoinIconCache = useCallback(async () => {
    const _db = await _getDB();
    const coinTypes = await _db?.coinTypes.where('network').equals(currentNetwork).toArray();
    const coinIconImageCache = coinTypes?.reduce(
      (acc, curr) => {
        acc[curr.coinType] = curr.image;
        return acc;
      },
      {} as { [coinType: string]: any; }
    );
    setCoinIconCache(coinIconImageCache || {});
    return coinIconImageCache;
  }, [db, currentNetwork]);

  useEffect(() => {
    _reloadCoinIconCache();
  }, [currentNetwork]);

  return (
    <DbContext.Provider
      value={{
        getAccounts,
        addAccount,
        removeAccount,
        updateAccount,
        coinIconImageCache,
        addCoinIcon,
        removeCoinIcon,
        reloadCoinIconCache: _reloadCoinIconCache,
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
  const { coinIconImageCache, addCoinIcon, removeCoinIcon, reloadCoinIconCache } =
    useContext(DbContext);

  return {
    coinIconImageCache,
    addCoinIcon,
    removeCoinIcon,
    reloadCoinIconCache,
  };
};
