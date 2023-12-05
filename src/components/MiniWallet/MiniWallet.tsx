import './miniwallet1.scss';
import React, { useCallback, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import classNames from 'classnames';
import { Portfolio } from '@/components/Portfolio';
import { ConnectionProvider, ZkLoginProvider, useZkLogin } from '@/contexts';
import { ModalProvider } from '@/contexts/modal';
import { Modal } from '@/components/Modal';
import { LoginButton } from '@/components/LoginButton';
import { ChevronRight } from '@/assets';
import { DbProvider } from '@/contexts/db';
import { ZkAccountProvider, useZkAccounts } from '@/contexts/accounts';
import { LocalCoinTypeProvider } from '@/contexts/coinType';
import type { FC } from 'react';
import '@/style.css';
import type { ZkLoginAccountSerialized } from '@/types';

type MiniWalletContainerProps = {};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const MiniWalletContainer: FC<MiniWalletContainerProps> = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider>
        <DbProvider>
          <LocalCoinTypeProvider>
            <ZkAccountProvider>
              <ZkLoginProvider>
                <ModalProvider>
                  <MiniWallet />
                </ModalProvider>
              </ZkLoginProvider>
            </ZkAccountProvider>
          </LocalCoinTypeProvider>
        </DbProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
};

type MiniWalletProps = {};
const MiniWallet: FC<MiniWalletProps> = () => {
  const { accounts, currentAccount, switchAccount, createNewAccount } = useZkAccounts();
  const { isLoggedIn, login } = useZkLogin();
  const [loading, setLoading] = useState(false);
  const [hide, setHide] = useState(false);

  // const { setCurrentNetwork } = useNetwork();
  //TODO: Allow user to select network

  const onLoginButtonClick = useCallback(async () => {
    try {
      setLoading(true);
      if (!currentAccount) {
        const [newAcccount, jwt] = await createNewAccount();
        await login(newAcccount as ZkLoginAccountSerialized, jwt);
      } else {
        await login(currentAccount);
      }
    } finally {
      setLoading(false);
    }
  }, [currentAccount]);

  useEffect(() => {
    // TODO: Allow user to select account
    if (accounts && accounts?.length > 0) {
      switchAccount(accounts[0].id);
    }
  }, [accounts]);

  // const onCreateNewClick = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const [newAcccount, jwt] = await createNewAccount();
  //     await login(newAcccount as ZkLoginAccountSerialized, jwt);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  return (
    <div className="main" style={{ transform: hide ? 'translate(-100%)' : '' }}>
      <div
        className={classNames(
          isLoggedIn ? 'miniwallet-container' : 'miniwallet-container not-connected'
        )}
      >
        {isLoggedIn ? (
          <Portfolio />
        ) : (
          <div>
            <LoginButton
              label="Sign In with Google"
              provider="google"
              onClick={onLoginButtonClick}
              isLoading={loading}
            />
          </div>
        )}
        <Modal />
      </div>
      <div className="miniwallet-control">
        <button
          onClick={() => {
            console.log('clicked');
            setHide(!hide);
          }}
        >
          <ChevronRight
            style={{ height: '18px', width: '18px', transform: !hide ? 'rotateY(180deg)' : '' }}
          />
        </button>
      </div>
    </div>
  );
};
