import React, { createContext, useCallback, useContext, useState } from 'react';
import { getDB } from '@/utils';
import type { FC, PropsWithChildren } from 'react';
import type { ZkLoginAccountSerialized } from '@/types';
import type { DB } from '@/utils';

export interface DbContextInterface {
  getAccounts: () => Promise<ZkLoginAccountSerialized[]>;
  addAccount: (account: ZkLoginAccountSerialized) => Promise<void>;
  removeAccount: (id: string) => Promise<void>;
  updateAccount: (account: ZkLoginAccountSerialized) => Promise<void>;
}

export const DbContext = createContext<DbContextInterface>({
  getAccounts: async () => [] as ZkLoginAccountSerialized[],
  addAccount: async () => undefined,
  removeAccount: async () => undefined,
  updateAccount: async () => undefined,
});

type DbProviderProps = {};
export const DbProvider: FC<PropsWithChildren<DbProviderProps>> = ({ children }) => {
  const [db, setDb] = useState<DB | undefined>();

  const _getDB = useCallback(async () => {
    if (db) {
      return db;
    }

    const _db = await getDB();
    setDb(_db);
    return _db;
  }, [db]);

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

  return (
    <DbContext.Provider
      value={{
        getAccounts,
        addAccount,
        removeAccount,
        updateAccount,
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
