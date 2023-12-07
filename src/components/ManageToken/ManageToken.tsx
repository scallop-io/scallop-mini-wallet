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
import { toBase64 } from '@/utils';
import { useCoinTypeDB } from '@/contexts/db';
import type { ChangeEvent } from 'react';

type ManageTokenProps = {
  handleBack: () => void;
};

const ManageToken: React.FC<ManageTokenProps> = ({ handleBack }) => {
  const { addCoinTypeImage } = useCoinTypeDB();
  const { coinTypes, setInactive, addCoinType, removeCoinType, setActive } = useLocalCoinType();
  const [searchInput, setSearchInput] = useState('');
  const [coinTypeInput, setCoinTypeInput] = useState('');
  const [symbolInput, setSymbolInput] = useState('');
  const [decimalInput, setDecimalInput] = useState<string>('9');
  const [searchQuery, setSearchQuery] = useState('');
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const inputFileRef = React.useRef<HTMLInputElement>(null);
  const coinMetaDataQuery = useGetCoinMetadata(searchInput);

  const matchedLocalCoinType = useMemo(
    () =>
      coinTypes.filter(
        (coin) => coin.coinType === searchInput || coin.symbol.includes(searchInput.toUpperCase())
      ),
    [coinTypes, searchInput]
  );

  const searchedCoinHasMetadata = useMemo(() => {
    return !!coinMetaDataQuery.data;
  }, [coinMetaDataQuery.isFetching]);

  const newValidCoinType = useMemo(() => {
    return matchedLocalCoinType.length === 0 && searchedCoinHasMetadata;
  }, [matchedLocalCoinType, searchedCoinHasMetadata]);

  const isCoinTypeValid = useMemo(() => {
    if (coinTypeInput === '') return true;
    try {
      parseStructTag(normalizeStructTag(coinTypeInput));
      return true;
    } catch (e) {
      return false;
    }
  }, [coinTypeInput]);

  const coinTypeList = useMemo(() => {
    if (matchedLocalCoinType.length > 0) return matchedLocalCoinType;
    else if (newValidCoinType)
      return [
        {
          coinType: searchInput,
          symbol: coinMetaDataQuery.data?.symbol ?? '',
          decimals: coinMetaDataQuery.data?.decimals ?? 0,
          name: coinMetaDataQuery.data?.name ?? '',
          active: false,
        },
      ];
    else if (searchInput === '') return coinTypes;
    else return [];
  }, [matchedLocalCoinType, newValidCoinType]);

  // Search by coin type
  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCoinTypeInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setCoinTypeInput(e.target.value);
  }, []);

  const handleSymbolInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSymbolInput((e.target.value ?? '').toUpperCase());
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
        } else {
          setActive(coinType);
        }
      }
    },
    [newValidCoinType]
  );

  const handleImageInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 70 * 1024) {
        // Validate file size (70kb in this case)
        alert('File size exceeds limit of 70kb');
        e.target.value = ''; // Reset the file input field
      } else {
        toBase64(file).then(setBase64Image); // Convert image to base64
      }
    }
  }, []);

  const handleDeleteCoinType = useCallback((coinType: string) => {
    removeCoinType(coinType);
  }, []);

  const handleImportCustomToken = () => {
    if (coinTypeInput === '' || symbolInput === '' || decimalInput === undefined) return;
    const success = addCoinType({
      coinType: normalizeStructTag(coinTypeInput),
      symbol: symbolInput,
      decimals: +decimalInput,
      name: '',
      active: true,
    });

    // add coin type image to db
    if (success && base64Image) {
      addCoinTypeImage(normalizeStructTag(coinTypeInput), base64Image);
    }

    resetInput();
  };

  const resetInput = () => {
    setCoinTypeInput('');
    setSymbolInput('');
    setDecimalInput('9');
    setBase64Image(null);
    inputFileRef.current?.value && (inputFileRef.current.value = '');
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
                    <input
                      value={coinTypeInput}
                      onChange={handleCoinTypeInput}
                      type="text"
                      placeholder="0x2::sui::SUI"
                    />
                    {!isCoinTypeValid && (
                      <div className="coin-type-error">Coin type struct invalid</div>
                    )}
                    <div className="form-coin-type-title">Symbol</div>
                    <input
                      value={symbolInput}
                      onChange={handleSymbolInput}
                      type="text"
                      placeholder="SUI"
                    />
                    <div className="form-coin-type-title">Decimal</div>
                    <input value={decimalInput} onChange={handleDecimalInput} type="text" />
                    <div className="form-coin-type-title">Image</div>
                    <input
                      ref={inputFileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageInput}
                    />
                    {base64Image && <img height="30" src={base64Image} alt="Selected" />}
                    <button
                      disabled={!isCoinTypeValid}
                      onClick={() => {
                        handleImportCustomToken();
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
        {coinTypeList.map((coin) => {
          return (
            <div className="token-row" key={coin.coinType}>
              <CoinItem coinType={coin.coinType} coinSymbol={coin.symbol} withPrice={false} />
              {!newValidCoinType && (
                <TrashBin onClick={() => handleDeleteCoinType(coin.coinType)} />
              )}
              <Toggle
                id={'token-' + coin.coinType}
                defaultChecked={coin.active}
                onChange={() => {
                  handleToggle(coin.active, coin.coinType);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageToken;
