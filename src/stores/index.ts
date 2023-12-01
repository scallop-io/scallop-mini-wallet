import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import {
  dappLocalStorageSlice,
  connectionLocalStorageSlice,
  dataLocalStorageSlice,
  dialogLocalStorageSlice,
  initialAppLocalStorageState,
  initialConnectionLocalStorageState,
  initialDataLocalStorageState,
  initialDialogLocalStorageState,
} from '@/stores/slices';
import { env } from '@/utils';
import type { LocalStorageState } from '@/stores/types';

export * from '@/stores/slices';
export type * from '@/stores/types';

const STORE_VERSION = 1;

export const useLocalStorage = create<LocalStorageState>()(
  devtools(
    subscribeWithSelector(
      persist(
        (...args) => ({
          ...dappLocalStorageSlice(...args),
          ...connectionLocalStorageSlice(...args),
          ...dataLocalStorageSlice(...args),
          ...dialogLocalStorageSlice(...args),
        }),
        {
          name: 'sui-scallop-dapp',
          partialize: (state) =>
            Object.fromEntries(Object.entries(state).filter(([key]) => !key.endsWith('Actions'))),
          version: STORE_VERSION,
          migrate: (persistedState: unknown, version) => {
            const state = persistedState as LocalStorageState;
            if (STORE_VERSION !== version) {
              return {
                ...initialAppLocalStorageState,
                ...initialConnectionLocalStorageState,
                ...initialDataLocalStorageState,
                ...initialDialogLocalStorageState,
              } as LocalStorageState;
            }
            return state;
          },
        }
      )
    ),
    {
      enabled: env.MODE !== 'production',
    }
  )
);
