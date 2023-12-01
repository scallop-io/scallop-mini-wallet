import type { FC } from 'react';
type BalanceInfoProps = {
    accountAddress: string;
    balance: number;
    usdValue: number;
};
declare const BalanceInfo: FC<BalanceInfoProps>;
export default BalanceInfo;
