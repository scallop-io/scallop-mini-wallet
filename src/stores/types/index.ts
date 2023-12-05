import type { StateCreator, Mutate, StoreApi } from 'zustand';
import type { ConnectionLocalStorageSlice } from '@/stores/types/connection';
import type { CoinTypeLocalStorageSlice } from './coinType';

export type * from '@/stores/types/connection';
export type * from '@/stores/types/coinType';

export type CreateConnectionLocalStorageSlice = StateCreator<
  LocalStorageState,
  Mis,
  [],
  ConnectionLocalStorageSlice
>;

export type CreateCoinTypeLocalStorageSlice = StateCreator<
  LocalStorageState,
  Mis,
  [],
  CoinTypeLocalStorageSlice
>;

export type LocalStorageState = ConnectionLocalStorageSlice & CoinTypeLocalStorageSlice;
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
