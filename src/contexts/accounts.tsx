import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { createNew } from '@/accounts/zklogin/zklogin';
import { useAccountDB } from './db';
import type { FC, PropsWithChildren } from 'react';
import type { ZkLoginAccountSerialized } from '@/types';

export interface ZkAccountInterface {
  address: string | undefined;
  currentAccount: ZkLoginAccountSerialized | undefined;
  accounts: ZkLoginAccountSerialized[] | undefined;
  switchAccount: (id: string) => void;
  createNewAccount: () => Promise<[ZkLoginAccountSerialized, string] | []>;
  removeAccount: () => Promise<void>;
}

export const ZkAccountContext = createContext<ZkAccountInterface>({
  address: '',
  currentAccount: {} as ZkLoginAccountSerialized | undefined,
  accounts: undefined,
  switchAccount: () => undefined,
  createNewAccount: async () => [],
  removeAccount: async () => undefined,
});

type ZkAccountProviderProps = {};
export const ZkAccountProvider: FC<PropsWithChildren<ZkAccountProviderProps>> = ({ children }) => {
  const { getAccounts, addAccount, removeAccount: removeDBAccount } = useAccountDB();
  const [accounts, setAccounts] = useState<ZkLoginAccountSerialized[]>([]);
  const [currentAccount, setCurrentAccount] = useState<ZkLoginAccountSerialized | undefined>();

  const address = useMemo(() => currentAccount?.address, [currentAccount]);

  const switchAccount = useCallback(
    (id: string) => {
      const account = accounts.find((a) => a.id === id);
      if (account) {
        setCurrentAccount(account);
      }
    },
    [accounts]
  );

  const createNewAccount = useCallback(async () => {
    const [newAccount, jwt] = await createNew({
      provider: 'google',
    });

    await addAccount({
      ...newAccount,
      id: uuid(),
    });

    return [newAccount, jwt] as [ZkLoginAccountSerialized, string];
  }, []);

  const removeAccount = useCallback(async () => {
    if (!currentAccount) {
      return;
    }

    await removeDBAccount(currentAccount.id);
    const newAccounts = await getAccounts();
    setAccounts(newAccounts);
  }, [currentAccount]);

  useEffect(() => {
    (async () => {
      const _accounts = await getAccounts();
      setAccounts(_accounts);
    })();
  }, []);

  return (
    <ZkAccountContext.Provider
      value={{
        address,
        currentAccount,
        accounts,
        switchAccount,
        createNewAccount,
        removeAccount,
      }}
    >
      {children}
    </ZkAccountContext.Provider>
  );
};

export const useZkAccounts = () => {
  const { address, accounts, currentAccount, switchAccount, createNewAccount, removeAccount } =
    useContext(ZkAccountContext);
  return {
    address,
    accounts,
    currentAccount,
    switchAccount,
    createNewAccount,
    removeAccount,
  };
};
