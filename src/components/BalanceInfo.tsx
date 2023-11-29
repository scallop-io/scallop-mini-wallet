import { shortenAddress } from '../utils/address';
import ClipboardDocument from '../assets/ClipboardDocument';
import type { FC } from 'react';

type BalanceInfoProps = {
  accountAddress: string;
  balance: number;
  usdValue: number;
};

const BalanceInfo: FC<BalanceInfoProps> = ({ accountAddress, balance, usdValue }) => {
  return (
    <div>
      <div className="address">
        {shortenAddress(accountAddress)}
        <ClipboardDocument />
      </div>
      <div className="total-balance">
        <span>{balance} SUI</span>
        <span>(${usdValue})</span>
      </div>
    </div>
  );
};

export default BalanceInfo;
