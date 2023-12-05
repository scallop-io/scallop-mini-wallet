import { getFromSessionStorage, setToSessionStorage } from './storage';
import type { NetworkType } from '@/stores/types';
import type { CredentialData } from '@/stores/types/session';

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
  return setToSessionStorage<EphemeralValue>(SESSION_KEY, data);
};

export const clearEphemeralValue = (address: string) => {
  const data = getFromSessionStorage<EphemeralValue>(SESSION_KEY);
  if (!data) {
    return;
  }
  delete data[address];
  console.log(data);
  return importEphemeralValues(data);
};
