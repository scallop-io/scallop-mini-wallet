import './miniwallet.scss';
import React from 'react';
import { Portfolio } from '@/components/Portfolio';
import { Zklogin } from '@/components/Zklogin';
import type { FC } from 'react';
type MiniWalletProps = {};

const MiniWallet: FC<MiniWalletProps> = () => {
  const [isConnected, setIsConnected] = React.useState(false);

  return <div className="miniwallet-container">{isConnected ? <Portfolio /> : <Zklogin />}</div>;
};

export default MiniWallet;
