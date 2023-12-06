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
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { coinTypes, setInactive, addCoinType, setActive } = useLocalCoinType();
  const [trigger, setTrigger] = useState(true);
  const coinMetaDataQuery = useGetCoinMetadata(searchInput);

  const matchedLocalCoinType = useMemo(
    () =>
      coinTypes.filter(
        (coin) => coin.coinType === searchInput || coin.symbol.includes(searchInput.toUpperCase())
      ),
    [coinTypes, searchInput, trigger]
  );

  const searchedCoinHasMetadata = useMemo(() => {
    return !!coinMetaDataQuery.data;
  }, [coinMetaDataQuery.isFetching]);

  const newValidCoinType = useMemo(() => {
    return matchedLocalCoinType.length === 0 && searchedCoinHasMetadata;
  }, [matchedLocalCoinType, searchedCoinHasMetadata]);

  const coinTypeList = useMemo(() => {
    if (matchedLocalCoinType.length > 0) return matchedLocalCoinType;
    else if (searchInput === '') return coinTypes;
    else return [];
  }, [matchedLocalCoinType, coinTypes]);

  // Search by coin type
  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleToggle = useCallback(
    (active: any, coinType: string) => {
      if (active) {
        setInactive(coinType);
      } else {
        if (newValidCoinType) {
          addCoinType({ coinType, symbol: coinMetaDataQuery.data?.symbol ?? '' });
          setTrigger(!trigger);
        } else {
          setActive(coinType);
        }
      }
    },
    [newValidCoinType]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchInput(searchQuery);
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
        {newValidCoinType ? (
          <div className="token-row">
            <CoinItem
              coinType={searchInput}
              coinSymbol={coinMetaDataQuery.data?.symbol}
              withPrice={true}
            />
            <Toggle
              id="token-new"
              checked={!newValidCoinType}
              onChange={() => {
                handleToggle(!newValidCoinType, normalizeStructTag(searchInput));
              }}
            />
          </div>
        ) : (
          coinTypeList.map((coin, index) => {
            return (
              <div className="token-row" key={index}>
                <CoinItem coinType={coin.coinType} coinSymbol={coin.symbol} withPrice={true} />
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
