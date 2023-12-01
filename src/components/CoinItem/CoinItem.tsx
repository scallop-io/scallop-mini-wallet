import React from 'react';
import classNames from 'classnames';
import { numberWithCommas } from '@/utils/number';
import type { FC } from 'react';
import './coinItem.scss';

export type CoinItemProps = {
  icon: string;
  coinName: string;
  totalBalance: number;
  coinPrice: number;
  usdValue: number;
  lightBackground: boolean;
};

export const CoinItem: FC<CoinItemProps> = ({
  icon,
  coinName,
  totalBalance,
  coinPrice,
  usdValue,
  lightBackground = false,
}: CoinItemProps) => {
  return (
    <div>
      <div className="token-info-container">
        <div className="token-icon">
          <img src={icon} alt={coinName} />
        </div>
        <div
          className={classNames('token-info', {
            'token-info-light': lightBackground,
          })}
        >
          <span className="token-title">{coinName}</span>
          <span className="token-price">≈ ${numberWithCommas(coinPrice.toString())}</span>
        </div>
      </div>
      <div className="token-info-balance">
        <span className="token-balance">{totalBalance}</span>
        <span className="usd-balance">{numberWithCommas(usdValue.toString())}</span>
      </div>
    </div>
  );
};
