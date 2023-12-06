import React from 'react';
import suiAsset from '@/assets/images/coins/sui.png';
import btcAsset from '@/assets/images/coins/btc.png';
import ethAsset from '@/assets/images/coins/eth.png';
import usdcAsset from '@/assets/images/coins/usdc.png';
import usdtAsset from '@/assets/images/coins/usdt.png';
import solAsset from '@/assets/images/coins/sol.png';
import aptAsset from '@/assets/images/coins/apt.png';

export type CoinIconProps = {
  coinName: string;
  iconUrl?: string;
};

const CoinIcon: React.FC<CoinIconProps> = ({ iconUrl, coinName }) => {
  let imageURL = iconUrl ?? '';
  if (!iconUrl) {
    switch (coinName.toLowerCase()) {
      case 'sui':
        imageURL = suiAsset;
        break;
      case 'btc':
        imageURL = btcAsset;
        break;
      case 'eth':
        imageURL = ethAsset;
        break;
      case 'usdc':
        imageURL = usdcAsset;
        break;
      case 'usdt':
        imageURL = usdtAsset;
        break;
      case 'sol':
        imageURL = solAsset;
        break;
      case 'apt':
        imageURL = aptAsset;
        break;
    }
  }
  return <img src={imageURL} alt={coinName} />;
};

export default CoinIcon;
