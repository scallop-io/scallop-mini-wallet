import { type ExportedKeypair } from '@mysten/sui.js/cryptography';
import type { PartialZkLoginSignature } from '@/accounts/zklogin';
import type { NetworkType } from '@/stores';

export type CredentialData = {
  ephemeralKeyPair: ExportedKeypair;
  proofs?: PartialZkLoginSignature;
  minEpoch: number;
  maxEpoch: number;
  network: NetworkType;
  randomness: string;
  jwt: string;
};