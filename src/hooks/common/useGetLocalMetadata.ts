import { useMemo } from 'react';
import { useLocalCoinType } from '@/contexts/coinType';
import type { LocalCoinType } from '@/stores';

const useGetLocalMetadata = (coinType: string): LocalCoinType | null => {
  const { coinTypes } = useLocalCoinType();

  return useMemo(() => {
    const coinTypeData = coinTypes.find((coinTypeData) => coinTypeData.coinType === coinType);
    if (!coinTypeData) return null;
    return coinTypeData;
  }, [coinTypes]);
};

export default useGetLocalMetadata;
