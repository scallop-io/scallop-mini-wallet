import { ConnectionProvider } from "@/contexts/connection";
import { ZkLoginProvider } from "@/contexts/zklogin";
import React, { FC } from 'react';
import './MiniWallet.css';
import { CoinItem } from "../CoinItem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export type MiniWalletProps = {};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const MiniWallet: FC<MiniWalletProps> = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider>
        <ZkLoginProvider>
          <CoinItem
            icon="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png"
            coinName="Bitcoin"
            coinPrice={50000}
            totalBalance={1}
            usdValue={50000}
            lightBackground={true}
          />
        </ZkLoginProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
};
