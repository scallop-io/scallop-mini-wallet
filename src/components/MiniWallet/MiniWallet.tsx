import './miniwallet.scss';
import React, { useCallback, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import classNames from 'classnames';
import { Portfolio } from '@/components/Portfolio';
import { ConnectionProvider, ZkLoginProvider, useZkLogin } from '@/contexts';
import { ModalProvider } from '@/contexts/modal';
import { Modal } from '@/components/Modal';
import { LoginButton } from '@/components/LoginButton';
import { ChevronRight } from '@/assets';
import type { FC } from 'react';
import '@/style.css';

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
        <ZkLoginProvider>
          <ModalProvider>
            <MiniWallet />
          </ModalProvider>
        </ZkLoginProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
};

type MiniWalletProps = {};
const MiniWallet: FC<MiniWalletProps> = () => {
  const { isLoggedIn, login } = useZkLogin();
  const [loading, setLoading] = useState(false);
  const [hide, setHide] = useState(false);

  // const { setCurrentNetwork } = useNetwork();
  //TODO: Allow user to select network

  const onClick = useCallback(async () => {
    try {
      setLoading(true);
      await login();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // setCurrentNetwork('testnet');
    console.log(isLoggedIn);
  }, []);

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
              onClick={onClick}
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
