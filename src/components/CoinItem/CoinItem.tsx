import React, { useEffect } from 'react';
import { useCopyToClipboard } from '@/hooks';
import { numberWithCommas } from '@/utils/number';
import type { FC } from 'react';
import './coinItem.scss';

export type CoinItemProps = {
  icon: string;
  coinName: string;
  totalBalance: number;
  coinPrice: number;
  coinAddress: string;
};

export const CoinItem: FC<CoinItemProps> = ({
  icon,
  coinName,
  totalBalance,
  coinPrice,
  coinAddress,
}: CoinItemProps) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const copyAddress = useCopyToClipboard(coinAddress, setIsCopied);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 500);
    }
  }, [isCopied]);
  return (
    <div className="coinitem-container" onClick={copyAddress}>
      <div className="token">
        <div className="icon">
          <img src={icon} alt={coinName} />
        </div>
        <div className="info">
          <div>
            <span>{coinName}</span>
            <span>{numberWithCommas(totalBalance.toString())}</span>
          </div>
          <div>
            <span>≈ ${numberWithCommas(coinPrice.toString())}</span>
            <span>${numberWithCommas((totalBalance * coinPrice).toString())}</span>
          </div>
          <div>
            <span>{isCopied ? 'Address copied' : 'Click to copy address'}</span>
            <span>{coinAddress}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
