import type { FC } from 'react';

type CoinItemProps = {
  icon: string;
  coinName: string;
  totalBalance: number;
  coinPrice: number;
  usdValue: number;
};

const CoinItem: FC<CoinItemProps> = ({ icon, coinName, totalBalance, coinPrice, usdValue }) => {
  return (
    <div>
      <div className="token-info-container">
        <div className="token-icon">
          <img src={icon} alt={coinName} />
        </div>
        <div className="token-info">
          <span className="token-title">{coinName}</span>
          <span className="token-price">≈ ${coinPrice}</span>
        </div>
      </div>
      <div className="token-info-balance">
        <span className="token-balance">{totalBalance}</span>
        <span className="usd-balance">{usdValue}</span>
      </div>
    </div>
  );
};

export default CoinItem;
