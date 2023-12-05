import './managetoken.scss';
import React, { useCallback, useMemo, useState } from 'react';
import { normalizeStructTag } from '@mysten/sui.js/utils';
import { CoinItem } from '@/components/CoinItem';
import { ArrowLeft } from '@/assets/';
import { DEFAULT_COINS } from '@/constants/coins';
import { useNetwork, useZkLogin } from '@/contexts';
import { useGetAllBalances } from '@/hooks';
import { getCoinNameFromType } from '@/utils';
import { Checkbox } from '../Checkbox';
import type { ChangeEvent } from 'react';
import type { CoinBalance } from '@mysten/sui.js/client';

type ManageTokenProps = {
  handleBack: () => void;
};

const ManageToken: React.FC<ManageTokenProps> = ({ handleBack }) => {
  const [searchedToken, setSearchedCoin] = useState('');
  const { address, isLoggedIn } = useZkLogin();
  const { currentNetwork } = useNetwork();
  const getAccountBalanceQuery = useGetAllBalances(address, 10 * 1000);
  const [checked, setChecked] = useState(false);

  const accountBalance = useMemo(() => {
    if (isLoggedIn) {
      let coinBalances = getAccountBalanceQuery.data ?? [];

      if (coinBalances.length === 0) {
        coinBalances = [...DEFAULT_COINS[currentNetwork]];
      } else {
        const balanceCoinTypes = coinBalances.map((coinBalance) =>
          normalizeStructTag(coinBalance.coinType)
        );
        const newCoins = DEFAULT_COINS[currentNetwork].filter(
          (coin) => !balanceCoinTypes.includes(coin.coinType)
        );
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
  }, [getAccountBalanceQuery.isFetching, isLoggedIn]);

  // TODO: Search token using address
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchedCoin(e.target.value);
  }, []);

  // TODO: Add token to local storage
  const handleAddToken = useCallback(() => {}, [searchedToken]);
  return (
    <div className="managetoken-container">
      <div className="managetoken-header">
        <div>
          <ArrowLeft onClick={handleBack} />
        </div>
        <div>
          <input type="text" placeholder="Coin Address" onChange={onChange} />
        </div>
      </div>
      <div className="managetoken-body">
        {searchedToken !== '' ? (
          <div>
            <CoinItem coinType={searchedToken} withPrice={false} />
            <input
              type="checkbox"
              id="checkbox"
              checked={checked}
              onChange={() => {
                setChecked(!checked);
                handleAddToken();
              }}
            />
          </div>
        ) : (
          accountBalance.map((coinBalance: CoinBalance, index) => {
            return (
              <div key={index}>
                <CoinItem coinType={coinBalance.coinType} withPrice={false} />
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setChecked(e.target.checked);
                    handleAddToken();
                  }}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ManageToken;
