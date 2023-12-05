import './managetoken.scss';
import React, { useCallback, useState } from 'react';
import { normalizeStructTag } from '@mysten/sui.js/utils';
import { CoinItem } from '@/components/CoinItem';
import { ArrowLeft } from '@/assets/';
import { useLocalCoinType } from '@/contexts/coinType';
import { useGetCoinMetadata } from '@/hooks';
import type { ChangeEvent } from 'react';

type ManageTokenProps = {
  handleBack: () => void;
};

const ManageToken: React.FC<ManageTokenProps> = ({ handleBack }) => {
  const [searchedToken, setSearchedCoin] = useState('');
  const { coinTypes, addCoinType, setInactive, setActive } = useLocalCoinType();
  const coinMetaData = useGetCoinMetadata(searchedToken);

  // Search by coin type
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchedCoin(e.target.value);
  }, []);

  // Add coin type to local storage
  const handleAddToken = (coinType: string) => {
    const isExist = coinTypes.some((val) => val.coinType === coinType);
    if (!isExist) {
      addCoinType(coinType);
    } else {
      setActive(coinType);
    }
  };

  return (
    <div className="managetoken-container">
      <div className="managetoken-header">
        <div>
          <ArrowLeft onClick={handleBack} />
        </div>
        <div>
          <input type="text" placeholder="Coin Type" onChange={onChange} />
        </div>
      </div>
      <div className="managetoken-body">
        {coinMetaData.data ? (
          <div>
            <CoinItem coinType={searchedToken} withPrice={false} />
            <input
              type="checkbox"
              id="checkbox"
              checked={coinTypes.find((val) => val.coinType === searchedToken)?.active}
              onChange={(e) => {
                const normalizedCoinType = normalizeStructTag(searchedToken);
                if (e.target.checked) {
                  handleAddToken(normalizedCoinType);
                } else {
                  setInactive(normalizedCoinType);
                }
              }}
            />
          </div>
        ) : (
          coinTypes.map((coin, index) => {
            return (
              <div key={index}>
                <CoinItem coinType={coin.coinType} withPrice={false} />
                <input
                  type="checkbox"
                  checked={coin.active}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleAddToken(coin.coinType);
                    } else {
                      setInactive(coin.coinType);
                    }
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
