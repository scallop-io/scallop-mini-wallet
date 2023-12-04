import { useRef, useLayoutEffect } from 'react';

const useLatestValue = <T>(value: T) => {
  const cache = useRef(value);

  useLayoutEffect(() => {
    cache.current = value;
  }, [value]);

  return cache;
};

export default useLatestValue;
