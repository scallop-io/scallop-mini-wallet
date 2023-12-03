import type { NetworkType } from '@/stores/types';
import type { CredentialData } from '@/stores/types/session';

export enum BroadcastEvents {
  LOGOUT = 'logout',
  LOGIN = 'login',
  REQUEST_DATA = 'requestData',
  CRED_DATA = 'credentialData',
}

export type BroadcastEventData = {
  id: string | null;
  target: string | null;
  event: BroadcastEvents;
  data: Record<NetworkType, CredentialData>;
};
