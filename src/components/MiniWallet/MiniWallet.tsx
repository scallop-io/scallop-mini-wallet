import './miniwallet.scss';
import React, { useEffect } from 'react';
import { Portfolio } from '@/components/Portfolio';
import { Zklogin } from '@/components/Zklogin';
import type { FC } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectionProvider, ZkLoginProvider, useConnection, useNetwork, useZkLogin } from "@/contexts";
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
  return (
    <div className="miniwallet-container">  
      {address ? <Portfolio /> : <Zklogin />}
    </div>
  )
}
