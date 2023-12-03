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
  address: string;
}

export const ZkLoginContext = createContext<ZkLoginContextInterface>({
  logout: () => undefined,
  login: async () => undefined,
  address: '',
});

type ZkLoginProviderProps = {};

const ZK_ACCOUNT_ID = 'zkAccount';

export const ZkLoginProvider: FC<PropsWithChildren<ZkLoginProviderProps>> = ({ children }) => {
  const client = useConnectionClient();
  const { currentNetwork: network } = useConnection();
  const [address, setAddress] = useState<string | undefined>();
  const channel = useRef(new BroadcastChannel('scallop-mini-wallet')).current;
  const id = useRef<string>(uuid()).current;

  const networkEnv = useMemo(() => {
    return { client, network };
  }, [client, network]);

  const login = useCallback(async () => {
    // check if data exist from DB
    let account = (await (await getDB()).accounts.get(ZK_ACCOUNT_ID)) as ZkLoginAccountSerialized;
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
    if (address !== account.address) setAddress(account.address);
  }, []);

  const resetAccount = useCallback(() => {
    clearEphemeralValue();
    setAddress(undefined);
  }, []);

  const logout = useCallback(() => {
    resetAccount();

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
            }
          }
          break;

        case BroadcastEvents.LOGOUT: {
          resetAccount();
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

  useEffect(() => {
    // load account from db
    (async () => {
      const account = (await (
        await getDB()
      ).accounts.get(ZK_ACCOUNT_ID)) as ZkLoginAccountSerialized;
      if (account) {
        setAddress(account.address);
      }
    })();
  }, []);

  return (
    <ZkLoginContext.Provider
      value={{
        address: address ?? '',
        login,
        logout,
      }}
    >
      {children}
    </ZkLoginContext.Provider>
  );
};

export const useZkLogin = () => {
  const { address, login, logout } = useContext(ZkLoginContext);

  return useMemo(
    () => ({
      address,
      login,
      logout,
    }),
    [address, login, logout]
  );
};
