import { useMemo } from 'react';
import { useLocalCoinType } from '@/contexts/coinType';
import type { CustomCoinType } from '@/stores';

const useGetLocalMetadata = (coinType: string): CustomCoinType | null => {
  const { coinTypes } = useLocalCoinType();

  return useMemo(() => {
    const coinTypeData = coinTypes.find((coinTypeData) => coinTypeData.coinType === coinType);
    if (!coinTypeData) return null;
    return coinTypeData;
  }, [coinTypes]);
};

export default useGetLocalMetadata;
