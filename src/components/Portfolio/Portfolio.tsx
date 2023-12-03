import './portfolio.scss';
import React, { useEffect, type FC } from 'react';
import { Summary } from '@/components/Summary/Summary';
import { CoinItem } from '@/components/CoinItem/CoinItem';
import useGetAllBalances from '@/hooks/useGetAllBalances';
import { useZkLogin } from '@/contexts';

type PortfolioProps = {};

const Portfolio: FC<PortfolioProps> = () => {
  const {address} = useZkLogin();
  const getAccountBalance = useGetAllBalances(address, 10 * 1000)
  useEffect(() => {
    console.log(getAccountBalance)
  })
  return (
    <div className="portfolio-container">
      <Summary balance={25000} />
      {
        getAccountBalance.data?.map((item, index) => {
          return <CoinItem
          key={index}
          coinType={item.coinType}
          totalBalance={item.totalBalance}
        />
        })
      }
    </div>
  );
};

export default Portfolio;
