import './miniwallet.scss';
import React, { useEffect, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Portfolio } from '@/components/Portfolio';
import { LoginButton } from '@/components/LoginButton';
import { ConnectionProvider, ZkLoginProvider, useNetwork, useZkLogin } from '@/contexts';
import type { FC } from 'react';
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
          <MiniWallet />
        </ZkLoginProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
};

type MiniWalletProps = {};

export const MiniWallet: FC<MiniWalletProps> = () => {
  const { isLoggedIn } = useZkLogin();
  const { setCurrentNetwork } = useNetwork();
  const showBtn = useMemo(() => !isLoggedIn || true, [isLoggedIn]);

  useEffect(() => {
    setCurrentNetwork('testnet');
  }, [])
  return (
    <div>
      <div className="miniwallet-container">
        <Portfolio />
        {showBtn && <LoginButton />}
      </div>
    </div>
  );
};
