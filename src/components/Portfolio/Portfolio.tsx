import './portfolio.scss';
import React, { type FC } from 'react';
import { Summary } from '@/components/Summary/Summary';
import { CoinItem } from '@/components/CoinItem/CoinItem';

const COIN_LIST = [
  {
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
    coinName: 'Bitcoin',
    totalBalance: 10,
    coinPrice: 38000,
    coinAddress: '0x0000000000000000000000000000000000000000000000000000000000000002',
  },
  {
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    coinName: 'Ethereum',
    totalBalance: 10,
    coinPrice: 0.0,
    coinAddress: '0x0000000000000000000000000000000000000000000000000000000000000002',
  },
  {
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
    coinName: 'USDT',
    totalBalance: 100,
    coinPrice: 1,
    coinAddress: '0x0000000000000000000000000000000000000000000000000000000000000002',
  },
  {
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
    coinName: 'USDC',
    totalBalance: 100,
    coinPrice: 1,
    coinAddress: '0x0000000000000000000000000000000000000000000000000000000000000002',
  },
  {
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png',
    coinName: 'Sui',
    totalBalance: 100,
    coinPrice: 0.62,
    coinAddress: '0x0000000000000000000000000000000000000000000000000000000000000002',
  },
];

type PortfolioProps = {};

const Portfolio: FC<PortfolioProps> = () => {
  return (
    <div className="portfolio-container">
      <Summary accountAddress="0xabcdefghijklmnopqrstuvwxyz" balance={25000} />
      {COIN_LIST.map((coin, index) => (
        <CoinItem
          key={index}
          coinName={coin.coinName}
          coinPrice={coin.coinPrice}
          icon={coin.icon}
          totalBalance={coin.totalBalance}
          coinAddress={coin.coinAddress}
        />
      ))}
    </div>
  );
};

export default Portfolio;
