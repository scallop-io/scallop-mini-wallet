import './miniwallet.scss';
import React from 'react';
import { Portfolio } from '@/components/Portfolio';
import { Zklogin } from '@/components/Zklogin';
import type { FC } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectionProvider, ZkLoginProvider } from "@/contexts";
type MiniWalletProps = {};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const MiniWallet: FC<MiniWalletProps> = () => {
  const [isConnected, setIsConnected] = React.useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider>
        <ZkLoginProvider>
          <div className="miniwallet-container">{isConnected ? <Portfolio /> : <Zklogin />}</div>;
        </ZkLoginProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
};
