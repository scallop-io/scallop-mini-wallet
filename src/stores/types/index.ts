import type { StateCreator, Mutate, StoreApi } from 'zustand';
import type { AppLocalStorageSlice } from '@/stores/types/app';
import type { ConnectionLocalStorageSlice } from '@/stores/types/connection';
import type { DataLocalStorageSlice } from '@/stores/types/data';
import type { DialogLocalStorageSlice } from './dialog';

export type * from '@/stores/types/app';
export type * from '@/stores/types/connection';
export type * from '@/stores/types/data';
export type * from '@/stores/types/dialog';

export type CreateAppLocalStorageSlice = StateCreator<
  LocalStorageState,
  Mis,
  [],
  AppLocalStorageSlice
>;
export type CreateConnectionLocalStorageSlice = StateCreator<
  LocalStorageState,
  Mis,
  [],
  ConnectionLocalStorageSlice
>;
export type CreateDataLocalStorageSlice = StateCreator<
  LocalStorageState,
  Mis,
  [],
  DataLocalStorageSlice
>;

export type CreateDialogLocalStorageSlice = StateCreator<
  LocalStorageState,
  Mis,
  [],
  DialogLocalStorageSlice
>;

export type LocalStorageState = AppLocalStorageSlice &
  ConnectionLocalStorageSlice &
  DataLocalStorageSlice &
  DialogLocalStorageSlice;

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
