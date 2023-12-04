import './portfolio.scss';
import React, { useEffect, type FC, useState, useMemo, useCallback } from 'react';
import logo from '@/assets/images/basic/logo.png';
import { CoinItem } from '@/components/CoinItem';
import useGetAllBalances from '@/hooks/useGetAllBalances';
import { useZkLogin } from '@/contexts';
import { shortenAddress } from '@/utils';
import { ArrowLeftOnRectangle, ClipboardDocument } from '@/assets';
import { useCopyToClipboard } from '@/hooks';
import { useModal } from '@/contexts/modal';

type PortfolioProps = {};

const Portfolio: FC<PortfolioProps> = () => {
  const { address, isLoggedIn, logout } = useZkLogin();
  const { showDialog } = useModal();
  const getAccountBalanceQuery = useGetAllBalances(address, 10 * 1000);
  const [isCopied, setIsCopied] = useState(false);
  const copyAddress = useCopyToClipboard(address, setIsCopied);

  const accountBalance = useMemo(() => {
    return isLoggedIn ? getAccountBalanceQuery.data ?? [] : [];
  }, [getAccountBalanceQuery.isFetching, isLoggedIn]);

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
  return (
    <div className="portfolio-container">
      <div className="header">
        <div>
          <div className="scallop-icon">
            <img src={logo} alt="scallop logo" />
            <span>Scallop</span>
          </div>
          <div className="address" onClick={copyAddress}>
            {isLoggedIn && (isCopied ? 'Address copied!' : <AddressDisplay address={address} />)}
          </div>
          <div className="logout-container">
            <span className={isLoggedIn ? '' : 'hidden'}>
              <ArrowLeftOnRectangle onClick={() => (isLoggedIn ? handleLogout() : '')} />
            </span>
          </div>
        </div>
      </div>
      <div className="body">
        {accountBalance.map((item, index) => {
          return <CoinItem key={index} coinType={item.coinType} totalBalance={item.totalBalance} />;
        })}
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
