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
import { getZkLoginSignature } from '@mysten/zklogin';
import { toSerializedSignature } from '@mysten/sui.js/cryptography';
import { areCredentialsValid, doLogin, generateProofs } from '@/accounts/zklogin/zklogin';
import { BroadcastEvents } from '@/types/events';
import {
  clearEphemeralValue,
  exportEphemeralValues,
  getEphemeralValue,
  importEphemeralValues,
  setEphemeralValue,
} from '@/utils/session-ephemeral';
import { fromExportedKeypair, getCurrentEpoch } from '@/accounts/zklogin';
import { useConnection, useConnectionClient } from './connection';
import { useZkAccounts } from './accounts';
import { useZkLoginProviderData } from './zkprovider';
import type { BroadcastEventData } from '@/types/events';
import type { ZkLoginAccountSerialized } from '@/types/account';
import type { FC, PropsWithChildren } from 'react';
import type { TransactionBlock } from '@mysten/sui.js/transactions';
import type { SuiTransactionBlockResponse } from '@mysten/sui.js/client';

export interface ZkLoginContextInterface {
  logout: () => void;
  login: (account: ZkLoginAccountSerialized, jwt?: string) => Promise<void>;
  signAndSend: (
    account: ZkLoginAccountSerialized,
    txb: TransactionBlock
  ) => Promise<SuiTransactionBlockResponse | void>;
  isLoggedIn: boolean;
  error: string;
}

export const ZkLoginContext = createContext<ZkLoginContextInterface>({
  logout: () => undefined,
  login: async () => undefined,
  signAndSend: async () => undefined,
  isLoggedIn: false,
  error: '',
});

type ZkLoginProviderProps = {};

export const ZkLoginProvider: FC<PropsWithChildren<ZkLoginProviderProps>> = ({ children }) => {
  const client = useConnectionClient();
  const { address, removeCurrentAccount } = useZkAccounts();
  const { zkLoginProviderData } = useZkLoginProviderData();
  const { currentNetwork: network } = useConnection();
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
    <T extends Function>(
      callback: T,
      onErrorCallbacks: Array<(error: any) => void> = [],
      finallyCallbacks: Array<() => void> = []
    ): T => {
      return (async (...args: any[]) => {
        try {
          return await callback(...args);
        } catch (e) {
          handleError(e);
          onErrorCallbacks.forEach((callback) => callback(e));
        } finally {
          for (const callback of finallyCallbacks) {
            await callback();
          }
        }
      }) as any;
    },
    []
  );

  const login = useCallback(
    runFunctionDecorator(
      async (account: ZkLoginAccountSerialized, jwt?: string) => {
        // await doLogin(newAccount as ZkLoginAccountSerialized, networkEnv);
        await doLogin(zkLoginProviderData, account, networkEnv, jwt);
        setIsLoggedIn(true);
      },
      [() => setIsLoggedIn(false)],
      []
    ),
    []
  );

  const logout = (emit: boolean = true) => {
    console.log(address);
    if (address) clearEphemeralValue(address);
    removeCurrentAccount();
    setIsLoggedIn(false);
    if (emit) {
      channel.postMessage({
        id,
        event: BroadcastEvents.LOGOUT,
      });
    }
  };

  const signData = runFunctionDecorator(
    async (account: ZkLoginAccountSerialized, digest: Uint8Array) => {
      if (!account || !address) {
        setError('Please login first');
        return;
      }

      const currentEpoch = await getCurrentEpoch(networkEnv);
      const credentials = getEphemeralValue(address);
      if (!credentials) {
        setError('Please login first');
        return;
      }

      let credentialsData = credentials[network];
      if (!credentialsData) {
        setError('Please login first');
        return;
      }

      if (!areCredentialsValid(currentEpoch, networkEnv.network, credentialsData)) {
        credentialsData = await doLogin(
          zkLoginProviderData,
          account,
          networkEnv,
          credentialsData.jwt
        );
      }

      const { ephemeralKeyPair, proofs: storedProofs, maxEpoch, jwt, randomness } = credentialsData;
      const keyPair = fromExportedKeypair(ephemeralKeyPair);
      let proofs = storedProofs;
      if (!proofs) {
        proofs = await generateProofs(
          account,
          jwt,
          BigInt(randomness),
          maxEpoch,
          keyPair.getPublicKey()
        );
        credentialsData.proofs = proofs;
        // store the proofs to avoid creating them again
        const newEphemeralValue = getEphemeralValue(address);
        if (!newEphemeralValue) {
          // this should never happen
          throw new Error('Missing data, account is locked');
        }
        newEphemeralValue[network] = credentialsData;
        setEphemeralValue(address, newEphemeralValue);
      }

      const userSignature = toSerializedSignature({
        signature: await keyPair.sign(digest),
        signatureScheme: keyPair.getKeyScheme(),
        publicKey: keyPair.getPublicKey(),
      });

      return getZkLoginSignature({
        inputs: { ...proofs, addressSeed: address },
        maxEpoch,
        userSignature,
      });
    },
    [],
    []
  );

  const signAndSend = runFunctionDecorator(
    async (account: ZkLoginAccountSerialized, txb: TransactionBlock) => {
      const digest = await txb.build({ client });
      const signature = await signData(account as ZkLoginAccountSerialized, digest);
      if (!signature) {
        throw new Error('Error on generating signature');
      }

      txb.setSenderIfNotSet(account.address);

      return client.executeTransactionBlock({
        transactionBlock: digest,
        signature,
      });
    },
    [],
    []
  );

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
              data: exportEphemeralValues(),
            } as BroadcastEventData);
          }
          break;

        case BroadcastEvents.CRED_DATA:
          {
            if (bcData.target === id) {
              importEphemeralValues(bcData.data);
              setIsLoggedIn(true);
            }
          }
          break;

        case BroadcastEvents.LOGOUT: {
          if (bcData.id === id) return;
          // console.log('Logout Event', console.log(bcData.id, id));
          logout(false);
        }
      }

      return () => {
        channel.close();
      };
    };
  }, []);

  useEffect(() => {
    if (!address) return;
    const cred = getEphemeralValue(address);
    if (!cred) {
      channel.postMessage({
        id,
        event: BroadcastEvents.REQUEST_DATA,
      });
    } else {
      setIsLoggedIn(true);
    }
  }, [address]);

  return (
    <ZkLoginContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        error: error ?? '',
        login,
        logout,
        signAndSend,
      }}
    >
      {children}
    </ZkLoginContext.Provider>
  );
};

export const useZkLogin = () => {
  const { isLoggedIn, error, login, logout } = useContext(ZkLoginContext);

  // Return the context value directly without using useMemo
  return {
    isLoggedIn,
    error,
    login,
    logout,
  };
};
