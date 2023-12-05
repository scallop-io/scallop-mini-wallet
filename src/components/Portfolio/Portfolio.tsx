import './portfolio.scss';
import React, { useEffect, type FC, useState, useMemo, useCallback } from 'react';
import { normalizeStructTag } from '@mysten/sui.js/utils';
import logo from '@/assets/images/basic/logo.png';
import { CoinItem } from '@/components/CoinItem';
import useGetAllBalances from '@/hooks/sui/useGetAllBalances';
import { useNetwork, useZkLogin } from '@/contexts';
import { getCoinNameFromType, shortenAddress } from '@/utils';
import { ArrowLeftOnRectangle, ClipboardDocument } from '@/assets';
import { useCopyToClipboard } from '@/hooks/common';
import { useModal } from '@/contexts/modal';
import { DEFAULT_COINS } from '@/constants/coins';
import AdjustmentHorizontal from '@/assets/AdjustmentHorizontal';
import { ManageToken } from '@/components/ManageToken';
import { useZkAccounts } from '@/contexts/accounts';
import { useLocalCoinType } from '@/contexts/coinType';
import type { CoinBalance } from '@mysten/sui.js/client';

type PortfolioProps = {};

const Portfolio: FC<PortfolioProps> = () => {
  const { address } = useZkAccounts();
  const { isLoggedIn, logout } = useZkLogin();
  const { coinTypes } = useLocalCoinType();
  const { showDialog } = useModal();
  const { currentNetwork } = useNetwork();
  const getAccountBalanceQuery = useGetAllBalances(address, 10 * 1000);
  const [isCopied, setIsCopied] = useState(false);
  const [isManageToken, setIsManageToken] = useState(false);
  const copyAddress = useCopyToClipboard(address ?? '', setIsCopied);

  const accountBalance = useMemo(() => {
    if (isLoggedIn) {
      let coinBalances = getAccountBalanceQuery.data ?? [];

      if (coinBalances.length === 0) {
        coinBalances = [...DEFAULT_COINS[currentNetwork]];
      } else {
        const balanceCoinTypes = coinBalances.map((coinBalance) =>
          normalizeStructTag(coinBalance.coinType)
        );
        const newCoins = [
          ...coinTypes
            .filter((coin) => coin.active)
            .map((coin) => ({
              coinType: coin.coinType,
              totalBalance: '0',
              coinObjectCount: 0,
              lockedBalance: {},
            })),
        ].filter((coin) => !balanceCoinTypes.includes(coin.coinType));
        coinBalances = [...coinBalances, ...newCoins];
      }

      coinBalances.sort((a: CoinBalance, b: CoinBalance) => {
        const aCoinName = getCoinNameFromType(a.coinType);
        const bCoinName = getCoinNameFromType(b.coinType);
        return aCoinName.localeCompare(bCoinName);
      });

      return coinBalances;
    }
    return [];
  }, [getAccountBalanceQuery.isFetching, isLoggedIn, isManageToken]);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 500);
      return () => clearTimeout(timer);
    }

    return () => {};
  }, [isCopied]);

  const handleLogout = useCallback(() => {
    if (isLoggedIn) {
      showDialog({
        content: 'Are you sure you want to logout?',
        confirmButtonLabel: 'Yes',
        cancelButtonLabel: 'No',
        onConfirm: logout,
      });
    }
  }, [isLoggedIn]);

  const handleManageTokenList = useCallback(() => {
    setIsManageToken(true);
  }, [isManageToken]);
  return (
    <div className="portfolio-container">
      <div className="header">
        <div>
          <div className="scallop-icon">
            <img src={logo} alt="scallop logo" />
            <span>Scallop</span>
          </div>
          <div className="address" onClick={copyAddress}>
            {isLoggedIn &&
              (isCopied ? 'Address copied!' : <AddressDisplay address={address ?? ''} />)}
          </div>
          <div className="logout-container">
            <span className={isLoggedIn ? '' : 'hidden'}>
              <ArrowLeftOnRectangle onClick={() => (isLoggedIn ? handleLogout() : '')} />
            </span>
          </div>
        </div>
      </div>
      <div className="body">
        {isManageToken ? (
          <ManageToken handleBack={() => setIsManageToken(false)} />
        ) : (
          <>
            <div className="coin-list-manage">
              <button onClick={handleManageTokenList}>
                <AdjustmentHorizontal />
                Manage Token List
              </button>
            </div>
            <div className="coin-list">
              {accountBalance.map((item, index) => {
                return (
                  <CoinItem key={index} coinType={item.coinType} totalBalance={item.totalBalance} />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const AddressDisplay: FC<{ address: string }> = ({ address }) => (
  <div>
    {shortenAddress(address)}
    <ClipboardDocument />
  </div>
);

export default Portfolio;
