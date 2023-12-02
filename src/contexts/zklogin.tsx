import { createAccountFromJwt, createNewFromOAuth, doLogin } from "@/accounts/zklogin/zklogin";
import { ZkLoginAccountSerialized } from "@/types/account";
import { BroadcastEventData, BroadcastEvents } from "@/types/events";
import { getDB } from "@/utils/db";
import { clearEphemeralValue, getEphemeralValue, setEphemeralValue } from "@/utils/session-ephemeral";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuid } from 'uuid';
import { useConnection } from "./connection";
import React from 'react';
import { fetchJwt } from "@/accounts/zklogin/utils";

export interface ZkLoginContextInterface {
  logout: () => void,
  login: () => Promise<void>,
  address: string;
}

export const ZkLoginContext = createContext<ZkLoginContextInterface>({
  logout: () => undefined,
  login: async () => undefined,
  address: ''
});

type ZkLoginProviderProps = {};

const ZK_ACCOUNT_ID = 'zkAccount';

export const ZkLoginProvider: FC<PropsWithChildren<ZkLoginProviderProps>> = ({
  children
}) => {
  const { currentNetwork } = useConnection();
  const [address, setAddress] = useState<string | undefined>();
  const channel = useRef(new BroadcastChannel('scallop-mini-wallet')).current;
  const id = useRef<string>(uuid()).current;

  const login = useCallback(async () => {
    // check if data exist from DB
    let account = (await (await getDB()).accounts.get(ZK_ACCOUNT_ID) as ZkLoginAccountSerialized);
    if (!account) {
      createNewFromOAuth({
        provider: 'google'
      });
    } else {
      await doLogin(account, currentNetwork);
      if (address !== account.address) setAddress(account.address);
    }
  }, []);

  const logout = useCallback(() => {
    clearEphemeralValue();
    setAddress(undefined);

    channel.postMessage({
      event: BroadcastEvents.LOGOUT
    });
  }, []);


  // subscribe to broadcast channel
  useEffect(() => {
    channel.onmessage = (event) => {
      const bcData = event.data as BroadcastEventData;

      switch (bcData.event) {
        case BroadcastEvents.REQUEST_DATA: {
          if (!bcData.id) return;

          channel.postMessage({
            event: BroadcastEvents.CRED_DATA,
            target: bcData.id,
            data: getEphemeralValue(),
          } as BroadcastEventData);
        }
          break;

        case BroadcastEvents.CRED_DATA: {
          if (bcData.target === id) {
            setEphemeralValue(bcData.data);
          }
        }
          break;

        case BroadcastEvents.LOGOUT: {
          clearEphemeralValue();
        }
      };

      return () => {
        channel.close();
      };
    };
  }, []);

  useEffect(() => {
    // load account from db
    (async () => {
      const account = (await (await getDB()).accounts.get(ZK_ACCOUNT_ID) as ZkLoginAccountSerialized);
      if (account) {
        setAddress(account.address);
      }
    })();
  }, []);

  useEffect(() => {
    fetchJwt().then(async (jwt) => {
      if (jwt) {
        const db = await getDB();
        const newAccount = await createAccountFromJwt(jwt);
        db.accounts.put({
          ...newAccount,
          id: ZK_ACCOUNT_ID
        });

        await doLogin(newAccount as ZkLoginAccountSerialized, currentNetwork);
        setAddress(newAccount.address);
      }
    }).catch((e) => {
      console.error(e);

      // load data from session storage if exist
      const cred = getEphemeralValue();
      if (!cred) {
        channel.postMessage({
          event: BroadcastEvents.REQUEST_DATA,
          id
        });
      }
    });
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

  return useMemo(() => ({
    address,
    login,
    logout
  }), [address, login, logout]);
};
