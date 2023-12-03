import { getFromSessionStorage, removeFromSessionStorage, setToSessionStorage } from './storage';
import type { NetworkType } from '@/stores/types';
import type { CredentialData } from '@/stores/types/session';

const SESSION_KEY = 'credentials_session';

export const getEphemeralValue = (): Record<NetworkType, CredentialData> | null => {
  const data = getFromSessionStorage<Record<NetworkType, CredentialData>>(SESSION_KEY);
  if (!data) {
    return null;
  }
  return data; // TODO: Get decrypted
};

export const setEphemeralValue = (data: Record<NetworkType, CredentialData>) => {
  return setToSessionStorage<Record<NetworkType, CredentialData>>(SESSION_KEY, data); // TODO: Set encrypted
};

export const clearEphemeralValue = () => {
  return removeFromSessionStorage(SESSION_KEY);
};
