import './portfolio.scss';
import React, { useEffect, type FC, useState, useMemo, useCallback, type ChangeEvent } from 'react';
import { normalizeStructTag } from '@mysten/sui.js/utils';
import logo from '@/assets/images/basic/logo.png';
import { CoinItem } from '@/components/CoinItem';
import useGetAllBalances from '@/hooks/sui/useGetAllBalances';
import { useNetwork, useZkLogin } from '@/contexts';
import { shortenAddress } from '@/utils';
import { ArrowLeftOnRectangle, ClipboardDocument, SettingGear } from '@/assets';
import { useCopyToClipboard } from '@/hooks/common';
import { useModal } from '@/contexts/modal';
import AdjustmentHorizontal from '@/assets/AdjustmentHorizontal';
import { ManageToken } from '@/components/ManageToken';
import { useZkAccounts } from '@/contexts/accounts';
import { useLocalCoinType } from '@/contexts/coinType';
import { Dropdown } from '@/components/Dropdown';
import { type CustomCoinType, networks, type NetworkType } from '@/stores';
import type { CoinBalance } from '@mysten/sui.js/client';

type PortfolioProps = {
  walletIcon?: string;
};

const Portfolio: FC<PortfolioProps> = ({ walletIcon }) => {
  const { currentNetwork, setCurrentNetwork } = useNetwork();
  const { address, email } = useZkAccounts();
  const { isLoggedIn, logout } = useZkLogin();
  const { coinTypes } = useLocalCoinType();
  const { showDialog } = useModal();
  const getAccountBalanceQuery = useGetAllBalances(address, 10000);
  const [isManageToken, setIsManageToken] = useState(false);

  const customCoinTypeMap = useMemo(
    () =>
      coinTypes.reduce(
        (acc, coin) => {
          acc[coin.coinType] = coin;
          return acc;
        },
        {} as Record<string, CustomCoinType>
      ),
    [coinTypes]
  );

  const localCoinBalance = useMemo(
    () =>
      coinTypes
        .filter(({ active }) => active)
        .map(({ coinType }) => {
          return {
            coinType,
            coinObjectCount: 0,
            totalBalance: '0',
            lockedBalance: {},
          } as CoinBalance;
        }),
    [coinTypes]
  );

  const accountBalance = useMemo(() => {
    return (getAccountBalanceQuery.data ?? []).filter(
      ({ coinType }) =>
        customCoinTypeMap[coinType]?.active || customCoinTypeMap[coinType] === undefined
    );
  }, [customCoinTypeMap, getAccountBalanceQuery.isFetching]);

  const handleNetworkChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const network = e.target.value as NetworkType;
    setCurrentNetwork(network);
  }, []);

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

  useEffect(() => {
    getAccountBalanceQuery.refetch();
  }, [currentNetwork]);

  return (
    <div className="portfolio-container">
      <div className="header">
        <div>
          <div className="wallet-icon">
            <img src={walletIcon ?? logo} alt="wallet logo" />
            {/* <span>Scallop</span> */}
          </div>
          <div className="logout-container">
            <span className={isLoggedIn ? '' : 'hidden'}>
              <ArrowLeftOnRectangle onClick={() => (isLoggedIn ? handleLogout() : '')} />
            </span>
          </div>
        </div>
        <div className="address-container">
          <div className="email">{email}</div>
          {isLoggedIn && <AddressDisplay address={address ?? ''} />}
        </div>
      </div>
      <div className="body">
        {isManageToken ? (
          <ManageToken handleBack={() => setIsManageToken(false)} />
        ) : (
          <>
            <div className="setting-list">
              <button onClick={() => setIsManageToken(true)}>
                <AdjustmentHorizontal />
                Manage Token List
              </button>
              <Dropdown as="div" className="setting-dropdown-container">
                {({ close }) => (
                  <>
                    <Dropdown.Button className="setting-dropdown-btn">
                      <SettingGear />
                    </Dropdown.Button>
                    <Dropdown.Content className="setting-content">
                      <div className="setting-content-grid">
                        <section className="setting-content-network">
                          <div className="setting-network-title">Networks</div>
                          <select
                            className="setting-network-select"
                            onChange={(e) => {
                              handleNetworkChange(e);
                              close();
                            }}
                            value={currentNetwork}
                          >
                            {networks.map((name) => {
                              return (
                                <option value={name} key={name}>
                                  {name.charAt(0).toUpperCase() + name.substring(1)}
                                </option>
                              );
                            })}
                          </select>
                        </section>
                      </div>
                    </Dropdown.Content>
                  </>
                )}
              </Dropdown>
            </div>
            <div className="coin-list">
              {!getAccountBalanceQuery.isFetching &&
                accountBalance.map((item, index) => {
                  return (
                    <CoinItem
                      key={index}
                      coinType={normalizeStructTag(item.coinType)}
                      coinSymbol={customCoinTypeMap[normalizeStructTag(item.coinType)]?.symbol}
                      totalBalance={item.totalBalance}
                    />
                  );
                })}
              {localCoinBalance.map((item, index) => {
                if (
                  accountBalance.find(
                    (account) => normalizeStructTag(account.coinType) === item.coinType
                  )
                )
                  return undefined;
                return (
                  <CoinItem
                    key={index}
                    coinType={item.coinType}
                    coinSymbol={customCoinTypeMap[item.coinType]?.symbol}
                    totalBalance={item.totalBalance}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const AddressDisplay: FC<{ address: string }> = ({ address }) => {
  const [isCopied, setIsCopied] = useState(false);
  const copyAddress = useCopyToClipboard(address ?? '', setIsCopied);
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 500);
      return () => clearTimeout(timer);
    }

    return () => {};
  }, [isCopied]);

  return (
    <div className="address" onClick={copyAddress}>
      {isCopied ? 'Address copied!' : shortenAddress(address)}
      <ClipboardDocument />
    </div>
  );
};

export default Portfolio;
