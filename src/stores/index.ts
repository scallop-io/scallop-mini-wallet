import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import {
  connectionLocalStorageSlice,
  initialConnectionLocalStorageState,
} from '@/stores/slices';
import { type LocalStorageState } from '@/stores/types';

export * from '@/stores/slices';
export type * from '@/stores/types';

const STORE_VERSION = 1;

export const useLocalStorage = create<LocalStorageState>()(
  devtools(
    subscribeWithSelector(
      persist(
        (...args) => ({
          ...connectionLocalStorageSlice(...args),
        }),
        {
          name: 'scallop-mini-wallet',
          partialize: (state) =>
            Object.fromEntries(Object.entries(state).filter(([key]) => !key.endsWith('Actions'))),
          version: STORE_VERSION,
          migrate: (persistedState: unknown, version) => {
            const state = persistedState as LocalStorageState;
            if (STORE_VERSION !== version) {
              return {
                ...initialConnectionLocalStorageState,
              } as LocalStorageState;
            }
            return state;
          },
        }
      )
    ),
  )
);