import React, { createContext, useCallback, useContext, useState } from 'react';
import type { ZkLoginProviderData } from '@/accounts/zklogin';
import type { FC, PropsWithChildren } from 'react';

export interface ZkLoginProviderDataInterface {
  setGoogleClientID: (clientID: string) => void;
  zkLoginProviderData: Record<string, ZkLoginProviderData>;
}

export const ZkLoginProviderDataContext = createContext<ZkLoginProviderDataInterface>({
  setGoogleClientID: () => undefined,
  zkLoginProviderData: {
    google: {
      clientID: '',
      url: 'https://accounts.google.com/o/oauth/v2/auth',
      extraParams: {
        response_type: 'id_token',
        scope: 'openid email profile',
      },
      buildExtraParams: ({ prompt, loginHint, params }) => {
        if (prompt) {
          params.append('prompt', 'select_account');
        }
        if (loginHint) {
          params.append('login_hint', loginHint);
        }
      },
      enabled: true,
      mfaLink: 'https://support.google.com/accounts/answer/185839',
      order: 0,
    },
  },
});

type ZkLoginProviderDataProviderProps = {};

export const ZkLoginProviderDataProvider: FC<
  PropsWithChildren<ZkLoginProviderDataProviderProps>
> = ({ children }) => {
  const [zkLoginProviderData, setZkLoginProviderData] = useState<
    Record<string, ZkLoginProviderData>
  >({
    google: {
      clientID: '',
      url: 'https://accounts.google.com/o/oauth2/v2/auth',
      extraParams: {
        response_type: 'id_token',
        scope: 'openid email profile',
      },
      buildExtraParams: ({ prompt, loginHint, params }) => {
        if (prompt) {
          params.append('prompt', 'select_account');
        }
        if (loginHint) {
          params.append('login_hint', loginHint);
        }
      },
      enabled: true,
      mfaLink: 'https://support.google.com/accounts/answer/185839',
      order: 0,
    },
  });

  const setGoogleClientID = useCallback(
    (clientID: string) => {
      const data = zkLoginProviderData;
      data.google.clientID = clientID;
      setZkLoginProviderData({ ...data });
    },
    [zkLoginProviderData]
  );

  return (
    <ZkLoginProviderDataContext.Provider
      value={{
        zkLoginProviderData,
        setGoogleClientID,
      }}
    >
      {children}
    </ZkLoginProviderDataContext.Provider>
  );
};

export const useZkLoginProviderData = () => {
  const { zkLoginProviderData, setGoogleClientID } = useContext(ZkLoginProviderDataContext);

  // Return the context value directly without using useMemo
  return {
    zkLoginProviderData,
    setGoogleClientID,
  };
};
