import './miniwallet.scss';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Portfolio } from '@/components/Portfolio';
import { Zklogin } from '@/components/Zklogin';
import { ConnectionProvider, ZkLoginProvider, useZkLogin } from '@/contexts';
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
  const { address } = useZkLogin();
  // const { address, login, logout, isLoggedIn } = useZkLogin();

  // const handleLogin = useCallback(async () => {
  //   await login();
  // }, []);

  // const handleLogout = useCallback(() => {
  //   logout();
  // }, []);

  // const handleButtonClick = useCallback(
  //   () => (isLoggedIn ? handleLogout() : handleLogin()),
  //   [isLoggedIn]
  // );
  return <div className="miniwallet-container">{address ? <Portfolio /> : <Zklogin />}</div>;
};
