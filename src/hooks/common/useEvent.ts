import { useCallback } from 'react';
import { useLatestValue } from '@/hooks';

const useEvent = <
  F extends (...args: any[]) => any,
  FParameters extends any[] = Parameters<F>,
  FReturnType = ReturnType<F>,
>(
  callback: (...args: FParameters) => FReturnType
) => {
  const cache = useLatestValue(callback);

  return useCallback((...args: FParameters) => cache.current(...args), [cache]);
};

export default useEvent;
