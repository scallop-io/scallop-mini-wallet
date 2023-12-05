import './managetoken.scss';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { normalizeStructTag } from '@mysten/sui.js/utils';
import { CoinItem } from '@/components/CoinItem';
import { ArrowLeft } from '@/assets/';
import { useLocalCoinType } from '@/contexts/coinType';
import { useGetCoinMetadata } from '@/hooks';
import { Toggle } from '@/components/Toggle';
import type { ChangeEvent } from 'react';

type ManageTokenProps = {
  handleBack: () => void;
};

const ManageToken: React.FC<ManageTokenProps> = ({ handleBack }) => {
  const [searchedToken, setSearchedCoin] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { coinTypes, setInactive, addCoinType, setActive } = useLocalCoinType();
  const coinMetaDataQuery = useGetCoinMetadata(searchedToken);

  const searchCoinType = useMemo(
    () => coinTypes.find((coin) => coin.coinType === searchedToken),
    [coinTypes, searchedToken]
  );

  const searchedCoinHasMetadata = useMemo(() => {
    return coinMetaDataQuery.data;
  }, [coinMetaDataQuery.data]);

  // Search by coin type
  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleToggle = useCallback(
    (active: any, coinType: string) => {
      if (active) {
        setInactive(coinType);
      } else {
        if (!searchCoinType && searchedCoinHasMetadata) {
          addCoinType(coinType);
        } else {
          setActive(coinType);
        }
      }
    },
    [coinTypes, searchCoinType]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchedCoin(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="managetoken-container">
      <div className="managetoken-header">
        <div>
          <ArrowLeft onClick={handleBack} />
        </div>
        <div>
          <input type="text" placeholder="Coin Type" onChange={handleSearch} />
        </div>
      </div>
      <div className="managetoken-body">
        {searchedCoinHasMetadata ? (
          <div className="token-row">
            <CoinItem coinType={searchedToken} withPrice={false} />
            <Toggle
              id="token-new"
              checked={searchCoinType?.active ?? false}
              onChange={() => {
                handleToggle(searchCoinType?.active ?? false, normalizeStructTag(searchedToken));
              }}
            />
          </div>
        ) : (
          coinTypes.map((coin, index) => {
            return (
              <div className="token-row" key={index}>
                <CoinItem coinType={coin.coinType} withPrice={false} />
                <Toggle
                  id={'token-' + index}
                  checked={coin.active}
                  onChange={() => {
                    handleToggle(coin.active, coin.coinType);
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
