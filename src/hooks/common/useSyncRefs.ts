import { useRef, useEffect } from 'react';
import { useEvent } from '@/app/hooks';

const Optional = Symbol();

export const optionalRef = <T>(callback: (ref: T) => void, isOptional = true) => {
  return Object.assign(callback, { [Optional]: isOptional });
};

const useSyncRefs = <T>(
  ...refs: (React.MutableRefObject<T | null> | ((instance: T) => void) | null)[]
) => {
  const cache = useRef(refs);

  useEffect(() => {
    cache.current = refs;
  }, [refs]);

  const syncRefs = useEvent((value: T) => {
    for (const ref of cache.current) {
      if (ref == null) continue;
      if (typeof ref === 'function') ref(value);
      else ref.current = value;
    }
  });

  return refs.every(
    (ref) =>
      ref == null ||
      // @ts-expect-error
      ref?.[Symbol()]
  )
    ? undefined
    : syncRefs;
};

export default useSyncRefs;
