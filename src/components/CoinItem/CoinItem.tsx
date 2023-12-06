import React, { useEffect, useMemo } from 'react';
import './coinItem.scss';
import BigNumber from 'bignumber.js';
import { normalizeStructTag } from '@mysten/sui.js/utils';
import { shortenAddress } from '@/utils';
import { useCopyToClipboard, useGetCoinMetadata } from '@/hooks';
import { numberWithCommas } from '@/utils/number';
import { CoinIcon } from '@/components/CoinIcon';
import { getCoinAddressFromType, getCoinNameFromType } from '@/utils/coin';

export type CoinItemProps = {
  coinType: string;
  coinSymbol?: string;
  totalBalance?: string;
  withPrice?: boolean;
};

export const CoinItem: React.FC<CoinItemProps> = ({
  coinType,
  coinSymbol,
  totalBalance,
  withPrice = true,
}: CoinItemProps) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const coinAddress = useMemo(() => {
    return getCoinAddressFromType(coinType);
  }, [coinType]);
  const copyAddress = useCopyToClipboard(coinAddress, setIsCopied);
  const coinMetadata = useGetCoinMetadata(normalizeStructTag(coinType), 10000);

  const coinBalance = useMemo(() => {
    return new BigNumber(totalBalance ?? 0).shiftedBy(-1 * (coinMetadata.data?.decimals ?? 0));
  }, [coinMetadata.data?.decimals, totalBalance]);

  const coinName = useMemo(() => {
    return coinSymbol ?? getCoinNameFromType(coinType);
  }, [coinType]);

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
          <CoinIcon coinName={coinName} iconUrl={coinMetadata.data?.iconUrl ?? ''} />
        </div>
        <div className="info">
          <div>
            <span>{coinName}</span>
            {totalBalance && <span>{numberWithCommas(coinBalance.toString())}</span>}
          </div>
          {withPrice && (
            <>
              <div>
                <span>≈ ${}</span>
                <span>${numberWithCommas(coinBalance.times(1).toString())}</span>
              </div>
              <div>
                <span>{isCopied ? 'Address copied' : 'Click to copy address'}</span>
                <span>{shortenAddress(coinAddress, 5, 4)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
