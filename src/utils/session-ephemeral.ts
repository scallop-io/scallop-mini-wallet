import { getFromSessionStorage, setToSessionStorage } from './storage';
import type { CredentialData } from '@/types';
import type { NetworkType } from '@/stores/types';

export type EphemeralCredentialValue = Record<NetworkType, CredentialData>;
export type EphemeralValue = Record<string, EphemeralCredentialValue>;

const SESSION_KEY = 'credentials_session';

export const getEphemeralValue = (address: string): Record<NetworkType, CredentialData> | null => {
  const data = getFromSessionStorage<EphemeralValue>(SESSION_KEY);
  if (!data) {
    return null;
  }
  return data[address]; // TODO: Get decrypted
};

export const setEphemeralValue = (address: string, data: EphemeralCredentialValue) => {
  if (!address) {
    return;
  }

  const values = getFromSessionStorage<EphemeralValue>(SESSION_KEY) || {};
  values[address] = data;
  return setToSessionStorage<EphemeralValue>(SESSION_KEY, values); // TODO: Set encrypted
};

export const exportEphemeralValues = () => {
  return getFromSessionStorage<EphemeralValue>(SESSION_KEY);
};

export const importEphemeralValues = (data: EphemeralValue) => {
  const values = getFromSessionStorage<EphemeralValue>(SESSION_KEY) || {};
  Object.assign(values, data);
  return setToSessionStorage<EphemeralValue>(SESSION_KEY, values);
};

export const clearEphemeralValue = (address: string) => {
  const data = getFromSessionStorage<EphemeralValue>(SESSION_KEY);
  if (!data) {
    return;
  }
  delete data[address];
  setToSessionStorage<EphemeralValue>(SESSION_KEY, data);
  return;
};
