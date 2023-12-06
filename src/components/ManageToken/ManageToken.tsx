import './managetoken.scss';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { normalizeStructTag, parseStructTag } from '@mysten/sui.js/utils';
import { CoinItem } from '@/components/CoinItem';
import { ArrowLeft, TrashBin } from '@/assets/';
import { useLocalCoinType } from '@/contexts/coinType';
import { useGetCoinMetadata } from '@/hooks';
import { Toggle } from '@/components/Toggle';
import { Dropdown } from '@/components/Dropdown';
import Plus from '@/assets/Plus';
import type { ChangeEvent } from 'react';

type ManageTokenProps = {
  handleBack: () => void;
};

const ManageToken: React.FC<ManageTokenProps> = ({ handleBack }) => {
  const { coinTypes, setInactive, addCoinType, removeCoinType, setActive } = useLocalCoinType();
  const [searchInput, setSearchInput] = useState('');
  const [coinTypeInput, setCoinTypeInput] = useState('');
  const [symbolInput, setSymbolInput] = useState('');
  const [decimaInput, setDecimalInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
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
  }, [matchedLocalCoinType, coinTypes, trigger]);

  const isCoinTypeValid = useMemo(() => {
    if (coinTypeInput === '') return true;
    try {
      parseStructTag(normalizeStructTag(coinTypeInput));
      return true;
    } catch (e) {
      return false;
    }
  }, [coinTypeInput]);

  // Search by coin type
  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCoinTypeInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setCoinTypeInput(e.target.value);
  }, []);

  const handleSymbolInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSymbolInput(e.target.value);
  }, []);

  const handleDecimalInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget as any;
    if (target.value) {
      if ((target.value as string).includes('.')) return;
      let ok = false;
      const fixedAmount = target.value.replace(/,/g, '');
      const lastChar = fixedAmount[fixedAmount.length - 1];

      if ((!isNaN(lastChar) || fixedAmount === '') && /^\S+$/.test(fixedAmount)) {
        ok = true;
      } else if (lastChar === '.') {
        ok = true;
      }

      if (ok) {
        setDecimalInput(fixedAmount);
      }
    } else {
      setDecimalInput('');
    }
  }, []);

  const handleToggle = useCallback(
    (active: any, coinType: string) => {
      if (active) {
        setInactive(coinType);
      } else {
        if (newValidCoinType) {
          addCoinType({
            coinType,
            symbol: coinMetaDataQuery.data?.symbol ?? '',
            decimals: coinMetaDataQuery.data?.decimals ?? 0,
            name: coinMetaDataQuery.data?.name ?? '',
            active: true,
          });
          setTrigger(!trigger);
        } else {
          setActive(coinType);
        }
      }
    },
    [newValidCoinType]
  );

  const handleDeleteCoinType = useCallback(
    (coinType: string) => {
      removeCoinType(coinType);
      setTrigger(!trigger);
    },
    [trigger]
  );

  const handleImportCustomToken = () => {
    if (coinTypeInput === '' || symbolInput === '' || decimaInput === undefined) return;
    // console.log(coinTypeInput, symbolInput, decimaInput);
    addCoinType({
      coinType: coinTypeInput,
      symbol: symbolInput,
      decimals: +decimaInput,
      name: '',
      active: true,
    });
    setTrigger(!trigger);
  };

  const resetInput = () => {
    setCoinTypeInput('');
    setSymbolInput('');
    setDecimalInput('');
  };

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
        <Dropdown as="div" className="form-dropdown-container">
          {({ close }) => (
            <>
              <Dropdown.Button
                onClick={() => {
                  resetInput();
                }}
                className="form-dropdown-btn"
              >
                <Plus />
              </Dropdown.Button>
              <Dropdown.Content className="form-content">
                <div className="form-content-grid">
                  <span className="form-title">Add Custom Token</span>
                  <section className="form-content-coin-type">
                    <div className="form-coin-type-title">Coin Type</div>
                    <input value={coinTypeInput} onChange={handleCoinTypeInput} type="text" />
                    {!isCoinTypeValid && (
                      <div className="coin-type-error">Coin type struct invalid</div>
                    )}
                    <div className="form-coin-type-title">Symbol</div>
                    <input value={symbolInput} onChange={handleSymbolInput} type="text" />
                    <div className="form-coin-type-title">Decimal</div>
                    <input value={decimaInput} onChange={handleDecimalInput} />
                    <button
                      disabled={!isCoinTypeValid}
                      onClick={() => {
                        handleImportCustomToken();
                        resetInput();
                        close();
                      }}
                    >
                      Import
                    </button>
                  </section>
                </div>
              </Dropdown.Content>
            </>
          )}
        </Dropdown>
      </div>
      <div className="managetoken-body">
        {newValidCoinType ? (
          <div className="token-row">
            <CoinItem
              coinType={searchInput}
              coinSymbol={coinMetaDataQuery.data?.symbol}
              withPrice={false}
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
                <CoinItem coinType={coin.coinType} coinSymbol={coin.symbol} withPrice={false} />
                <TrashBin onClick={() => handleDeleteCoinType(coin.coinType)} />
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
