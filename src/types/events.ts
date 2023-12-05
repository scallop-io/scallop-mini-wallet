import type { EphemeralValue } from '@/utils';

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
  data: EphemeralValue;
};
