import type { StateCreator, Mutate, StoreApi } from 'zustand';
import type { ConnectionLocalStorageSlice } from '@/stores/types/connection';

export type * from '@/stores/types/connection';
export type * from '@/stores/types/session';

export type CreateConnectionLocalStorageSlice = StateCreator<
  LocalStorageState,
  Mis,
  [],
  ConnectionLocalStorageSlice
>;

export type LocalStorageState = ConnectionLocalStorageSlice;

export type LocalStorageStateCreatorArgs = {
  setState: Get<Mutate<StoreApi<LocalStorageState>, Mis>, 'setState', undefined>;
  getState: Get<Mutate<StoreApi<LocalStorageState>, Mis>, 'getState', undefined>;
  store: Mutate<StoreApi<LocalStorageState>, Mis>;
  $$storeMutations: Mis;
};

type Mis = [
  ['zustand/devtools', never],
  ['zustand/subscribeWithSelector', never],
  ['zustand/persist', unknown],
];

declare type Get<T, K, F = never> = K extends keyof T ? T[K] : F;
