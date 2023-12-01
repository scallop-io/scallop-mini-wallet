import type { FC } from 'react';
type CoinItemProps = {
    icon: string;
    coinName: string;
    totalBalance: number;
    coinPrice: number;
    usdValue: number;
};
declare const CoinItem: FC<CoinItemProps>;
export default CoinItem;
