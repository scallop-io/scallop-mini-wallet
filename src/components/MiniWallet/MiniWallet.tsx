import './miniwallet.scss';
import React, { useCallback, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Portfolio } from '@/components/Portfolio';
import { ConnectionProvider, ZkLoginProvider, useZkLogin } from '@/contexts';
import { ModalProvider } from '@/contexts/modal';
import { Modal } from '@/components/Modal';
import { LoginButton } from '@/components/LoginButton';
import type { FC } from 'react';
type MiniWalletContainerProps = {};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const MiniWalletContainer: FC<MiniWalletContainerProps> = () => {
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
    <div>
      <div className="miniwallet-container">
        <Portfolio />
        {!isLoggedIn && (
          <LoginButton
            label="Sign In with Google"
            provider="google"
            onClick={onClick}
            isLoading={loading}
          />
        )}
        <Modal />
      </div>
    </div>
  );
};

export { MiniWalletContainer as ScallopMiniWallet };
