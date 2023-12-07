import React, { useEffect, useMemo } from 'react';
import './coinItem.scss';
import BigNumber from 'bignumber.js';
import { normalizeStructTag } from '@mysten/sui.js/utils';
import { shortenAddress } from '@/utils';
import {
  useCopyToClipboard,
  useGetCoinMetadata,
  useGetCoinPrice,
  useGetLocalMetadata,
} from '@/hooks';
import { numberWithCommas } from '@/utils/number';
import { CoinIcon } from '@/components/CoinIcon';
import { getCoinAddressFromType, getCoinNameFromType } from '@/utils/coin';
import { useCoinTypeDB } from '@/contexts/db';
import { useConnectionClient } from '@/contexts';

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
  const { coinTypeImageCache } = useCoinTypeDB();
  const [isCopied, setIsCopied] = React.useState(false);
  const client = useConnectionClient();
  const copyAddress = useCopyToClipboard(coinType, setIsCopied);
  const coinMetadata = useGetCoinMetadata(normalizeStructTag(coinType));
  const localCoinMetadata = useGetLocalMetadata(coinType);
  const getCoinPrice = useGetCoinPrice(client, coinType, 10000);

  const coinAddress = useMemo(() => getCoinAddressFromType(coinType), [coinType]);

  const coinBalance = useMemo(() => {
    return new BigNumber(totalBalance ?? 0).shiftedBy(
      -1 * (coinMetadata.data?.decimals ?? localCoinMetadata?.decimals ?? 0)
    );
  }, [coinMetadata.data?.decimals, totalBalance, localCoinMetadata]);

  const coinPrice = useMemo(() => {
    if (!getCoinPrice.data || getCoinPrice.data === -1) return Number(0).toFixed(3);
    return getCoinPrice.data.toFixed(3);
  }, [getCoinPrice.data]);

  const coinName = useMemo(() => {
    return coinSymbol && coinSymbol !== '' ? coinSymbol : getCoinNameFromType(coinType);
  }, [coinType]);

  useEffect(() => {
    if (isCopied) {
      console.log(coinTypeImageCache[coinType]);
      setTimeout(() => {
        setIsCopied(false);
      }, 500);
    }
  }, [isCopied]);

  return (
    <div className="coinitem-container" onClick={copyAddress}>
      <div className="token">
        <div className="icon">
          <CoinIcon
            coinName={coinName}
            iconUrl={coinMetadata.data?.iconUrl ?? coinTypeImageCache[coinType] ?? ''}
          />
        </div>
        <div className="info">
          <div>
            <span>{coinName}</span>
            {totalBalance && <span>{numberWithCommas(coinBalance.toString())}</span>}
          </div>
          {withPrice && (
            <>
              <div>
                <span>≈ ${numberWithCommas(coinPrice)}</span>
                <span>${numberWithCommas(coinBalance.toString())}</span>
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
