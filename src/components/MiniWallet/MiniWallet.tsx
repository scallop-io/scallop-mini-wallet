import './miniwallet.scss';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Zklogin } from '@/components/Zklogin';
import { Portfolio } from '@/components/Portfolio';
import { ConnectionProvider, ZkLoginProvider, useZkLogin } from '@/contexts';
import { ModalProvider } from '@/contexts/modal';
import { Modal } from '@/components/Modal';
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
          <ModalProvider>
            <MiniWallet />
          </ModalProvider>
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
<<<<<<< HEAD
    <div>
      <div className="miniwallet-container">
        <Portfolio />
        {showBtn && <LoginButton />}
      </div>
=======
    <div className="miniwallet-container">
      {address ? <Portfolio /> : <Zklogin />}
      <Modal />
>>>>>>> feat-update-wallet-ui
    </div>
  );
};
