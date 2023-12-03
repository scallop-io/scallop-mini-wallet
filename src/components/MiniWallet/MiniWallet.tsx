import './miniwallet.scss';
import React, { type FC, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectionProvider, ZkLoginProvider, useZkLogin } from '@/contexts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export type MiniWalletContainerProps = {};
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
const MiniWallet: FC<MiniWalletProps> = () => {
  const { address, login, logout, isLoggedIn } = useZkLogin();

  const handleLogin = useCallback(async () => {
    await login();
  }, []);

  const handleLogout = useCallback(() => {
    logout();
  }, []);

  const handleButtonClick = useCallback(
    () => (isLoggedIn ? handleLogout() : handleLogin()),
    [isLoggedIn]
  );

  return (
    <div>
      <div>{address}</div>
      <div>
        <button onClick={handleButtonClick}>{isLoggedIn ? 'Logout' : 'Login'}</button>
      </div>
    </div>
  );
};
