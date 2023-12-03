import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { v4 as uuid } from 'uuid';
import { createNew, doLogin } from '@/accounts/zklogin/zklogin';
import { BroadcastEvents } from '@/types/events';
import { getDB } from '@/utils/db';
import {
  clearEphemeralValue,
  getEphemeralValue,
  setEphemeralValue,
} from '@/utils/session-ephemeral';
import { useConnection, useConnectionClient } from './connection';
import type { BroadcastEventData } from '@/types/events';
import type { ZkLoginAccountSerialized } from '@/types/account';
import type { FC, PropsWithChildren } from 'react';

export interface ZkLoginContextInterface {
  logout: () => void;
  login: () => Promise<void>;
  isLoggedIn: boolean;
  address: string;
  error: string;
}

export const ZkLoginContext = createContext<ZkLoginContextInterface>({
  logout: () => undefined,
  login: async () => undefined,
  isLoggedIn: false,
  address: '',
  error: '',
});

type ZkLoginProviderProps = {};

const ZK_ACCOUNT_ID = 'zkAccount';

export const ZkLoginProvider: FC<PropsWithChildren<ZkLoginProviderProps>> = ({ children }) => {
  const client = useConnectionClient();
  const { currentNetwork: network } = useConnection();
  const [address, setAddress] = useState<string | undefined>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const channel = useRef(new BroadcastChannel('scallop-mini-wallet')).current;
  const id = useRef<string>(uuid()).current;

  const networkEnv = useMemo(() => {
    return { client, network };
  }, [client, network]);

  const handleError = useCallback((error: any) => {
    if (error instanceof Error) {
      // This is a standard Error object, so it has a message property
      const errorMessage = error.message || 'An unknown error occurred';
      setError(errorMessage);
    } else {
      // This is not a standard Error object, so handle it differently
      // For example, you might want to convert it to a string
      const errorMessage = String(error) || 'An unknown error occurred';
      setError(errorMessage);
    }
  }, []);

  const runFunctionDecorator = useCallback(
    <T extends Function>(callback: T, onErrorCallbacks: Array<(error: any) => void> = []): T => {
      return (async (...args: any[]) => {
        try {
          return await callback(...args);
        } catch (e) {
          handleError(e);
          onErrorCallbacks.forEach((callback) => callback(e));
          throw e; // Re-throw the error after handling it
        }
      }) as any;
    },
    []
  );

  const login = runFunctionDecorator(async () => {
    let account = (await (await getDB()).accounts.get(ZK_ACCOUNT_ID)) as ZkLoginAccountSerialized;
    setAddress(account.address);

    if (!account) {
      const newAccount = await createNew({
        provider: 'google',
      });

      const db = await getDB();
      db.accounts.put({
        ...newAccount,
        id: ZK_ACCOUNT_ID,
      });

      // await doLogin(newAccount as ZkLoginAccountSerialized, networkEnv);
      account = newAccount as ZkLoginAccountSerialized;
    }
    await doLogin(account, networkEnv);
    if (address !== account.address) {
      setAddress(account.address);
      setIsLoggedIn(true);
    }
  }, [() => setIsLoggedIn(false)]);

  const resetAccount = useCallback(() => {
    clearEphemeralValue();
    setAddress(undefined);
  }, []);

  const logout = useCallback(() => {
    resetAccount();
    setIsLoggedIn(false);
    channel.postMessage({
      id,
      event: BroadcastEvents.LOGOUT,
    });
  }, []);

  // subscribe to broadcast channel
  useEffect(() => {
    channel.onmessage = (event) => {
      const bcData = event.data as BroadcastEventData;

      switch (bcData.event) {
        case BroadcastEvents.REQUEST_DATA:
          {
            if (!bcData.id) return;

            channel.postMessage({
              event: BroadcastEvents.CRED_DATA,
              target: bcData.id,
              data: getEphemeralValue(),
            } as BroadcastEventData);
          }
          break;

        case BroadcastEvents.CRED_DATA:
          {
            if (bcData.target === id) {
              setEphemeralValue(bcData.data);
              setIsLoggedIn(true);
            }
          }
          break;

        case BroadcastEvents.LOGOUT: {
          resetAccount();
          setIsLoggedIn(false);
        }
      }

      // load data from session storage if exist
      const cred = getEphemeralValue();
      if (!cred) {
        channel.postMessage({
          event: BroadcastEvents.REQUEST_DATA,
          id,
        });
      }

      return () => {
        channel.close();
      };
    };
  }, []);

  // load account from db
  useEffect(() => {
    runFunctionDecorator(async () => {
      const account = (await (
        await getDB()
      ).accounts.get(ZK_ACCOUNT_ID)) as ZkLoginAccountSerialized;
      console.log('HEST');
      if (account) {
        setAddress(account.address);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }, [() => setIsLoggedIn(false)])();
  }, []);

  return (
    <ZkLoginContext.Provider
      value={{
        address: address ?? '',
        isLoggedIn: isLoggedIn,
        error: error ?? '',
        login,
        logout,
      }}
    >
      {children}
    </ZkLoginContext.Provider>
  );
};

export const useZkLogin = () => {
  const { address, isLoggedIn, error, login, logout } = useContext(ZkLoginContext);

  // Return the context value directly without using useMemo
  return {
    address,
    isLoggedIn,
    error,
    login,
    logout,
  };
};
