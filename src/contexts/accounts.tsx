import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { createNew } from '@/accounts/zklogin/zklogin';
import { useZkLoginProviderData } from './zkprovider';
import { useAccountDB } from './db';
import type { FC, PropsWithChildren } from 'react';
import type { ZkLoginAccountSerialized } from '@/types';

export interface ZkAccountInterface {
  address: string | undefined;
  email: string | undefined;
  currentAccount: ZkLoginAccountSerialized | undefined;
  accounts: ZkLoginAccountSerialized[] | undefined;
  switchAccount: (id: string) => void;
  createNewAccount: () => Promise<[ZkLoginAccountSerialized, string] | []>;
  removeCurrentAccount: () => Promise<void>;
}

export const ZkAccountContext = createContext<ZkAccountInterface>({
  address: '',
  email: '',
  currentAccount: {} as ZkLoginAccountSerialized | undefined,
  accounts: undefined,
  switchAccount: () => undefined,
  createNewAccount: async () => [],
  removeCurrentAccount: async () => undefined,
});

type ZkAccountProviderProps = {};
export const ZkAccountProvider: FC<PropsWithChildren<ZkAccountProviderProps>> = ({ children }) => {
  const { zkLoginProviderData } = useZkLoginProviderData();
  const { getAccounts, addAccount, removeAccount: removeDBAccount } = useAccountDB();
  const [accounts, setAccounts] = useState<ZkLoginAccountSerialized[]>([]);
  const [currentAccount, setCurrentAccount] = useState<ZkLoginAccountSerialized | undefined>();

  const address = useMemo(() => currentAccount?.address, [currentAccount]);
  const email = useMemo(() => currentAccount?.nickname, [currentAccount]);

  const switchAccount = useCallback(
    (id: string) => {
      const account = accounts.find((a) => a.id === id);
      if (account) {
        setCurrentAccount(account);
      }
    },
    [accounts, currentAccount]
  );

  const createNewAccount = useCallback(async () => {
    const [newAccount, jwt] = await createNew({
      providerData: zkLoginProviderData,
      provider: 'google',
    });

    const id = uuid();
    await addAccount({
      ...newAccount,
      id,
    });

    setCurrentAccount({
      ...newAccount,
      id,
    } as ZkLoginAccountSerialized);
    const _accounts = await getAccounts();
    setAccounts(_accounts);
    return [newAccount, jwt] as [ZkLoginAccountSerialized, string];
  }, [currentAccount, accounts]);

  const removeCurrentAccount = useCallback(async () => {
    if (!currentAccount) {
      return;
    }

    await removeDBAccount(currentAccount.id);
    const newAccounts = await getAccounts();
    setAccounts(newAccounts);
    setCurrentAccount(undefined);
  }, [currentAccount, accounts]);

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
        email,
        currentAccount,
        accounts,
        switchAccount,
        createNewAccount,
        removeCurrentAccount,
      }}
    >
      {children}
    </ZkAccountContext.Provider>
  );
};

export const useZkAccounts = () => {
  const {
    address,
    email,
    accounts,
    currentAccount,
    switchAccount,
    createNewAccount,
    removeCurrentAccount,
  } = useContext(ZkAccountContext);
  return {
    address,
    email,
    accounts,
    currentAccount,
    switchAccount,
    createNewAccount,
    removeCurrentAccount,
  };
};
