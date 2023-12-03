import { decodeJwt } from 'jose';
import { computeZkLoginAddress, genAddressSeed } from '@mysten/zklogin';
import { getEphemeralValue, setEphemeralValue } from '@/utils/session-ephemeral';
import { getCurrentEpoch } from './epoch';
import { fetchSalt, prepareZkLogin, zkLoginAuthenticate } from './utils';
import type { ZkLoginAccountSerialized } from '@/types/account';
import type { CredentialData } from '@/stores/types/session';
// import { deobfuscate, obfuscate } from "@/utils/cryptography";
import type { ZkLoginProvider } from './provider';
import type { NetworkType } from '@/stores';
import type { SuiClient } from '@mysten/sui.js/dist/cjs/client';

export type JwtSerializedClaims = {
  email: string | null;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  picture: string | null;
  aud: string;
  iss: string;
  sub: string;
};

export type NetworkEnvType = {
  client: SuiClient;
  network: NetworkType;
};

export const doLogin = async (
  account: ZkLoginAccountSerialized,
  networkEnv: NetworkEnvType
): Promise<CredentialData> => {
  const { provider, claims } = account;
  // TODO: deobfuscate
  // const { sub, aud, iss } = await deobfuscate<JwtSerializedClaims>(claims);
  const { sub, aud, iss } = claims;
  const epoch = await getCurrentEpoch(networkEnv);
  const { ephemeralKeyPair, nonce, randomness, maxEpoch } = prepareZkLogin(Number(epoch));
  const jwt = await zkLoginAuthenticate({ provider, nonce, loginHint: sub });
  if (!jwt) throw new Error('JWT is missing');
  const decodedJWT = decodeJwt(jwt);
  if (decodedJWT.aud !== aud || decodedJWT.sub !== sub || decodedJWT.iss !== iss) {
    throw new Error("Logged in account doesn't match with saved account");
  }
  const credentialsData: CredentialData = {
    ephemeralKeyPair: ephemeralKeyPair.export(),
    minEpoch: Number(epoch),
    maxEpoch,
    network: networkEnv.network,
    randomness: randomness.toString(),
    jwt,
  };

  const ephemeralValue: Record<NetworkType, CredentialData> = getEphemeralValue() || {
    mainnet: {} as CredentialData,
    devnet: {} as CredentialData,
    testnet: {} as CredentialData,
  };
  ephemeralValue[networkEnv.network as NetworkType] = credentialsData;
  setEphemeralValue(ephemeralValue);
  return credentialsData;
};

export const createNew = async ({
  provider,
}: {
  provider: ZkLoginProvider;
}): Promise<Omit<ZkLoginAccountSerialized, 'id'>> => {
  const jwt = await zkLoginAuthenticate({ provider, prompt: true });
  if (!jwt) throw new Error('JWT is missing');

  const decodedJWT = decodeJwt(jwt);
  if (!decodedJWT.sub || !decodedJWT.iss || !decodedJWT.aud) {
    throw new Error('Missing jwt data');
  }
  const salt = await fetchSalt(jwt);
  if (Array.isArray(decodedJWT.aud)) {
    throw new Error('Not supported aud. Aud is an array, string was expected.');
  }
  const aud = decodedJWT.aud;
  const claims: JwtSerializedClaims = {
    email: String(decodedJWT.email || '') || null,
    fullName: String(decodedJWT.name || '') || null,
    firstName: String(decodedJWT.given_name || '') || null,
    lastName: String(decodedJWT.family_name || '') || null,
    picture: String(decodedJWT.picture || '') || null,
    aud,
    iss: decodedJWT.iss,
    sub: decodedJWT.sub,
  };
  const claimName = 'sub';
  const claimValue = decodedJWT.sub;
  return {
    type: 'zkLogin',
    address: computeZkLoginAddress({
      claimName,
      claimValue,
      iss: decodedJWT.iss,
      aud,
      userSalt: BigInt(salt),
    }),
    claims: claims,
    salt: salt,
    addressSeed: genAddressSeed(BigInt(salt), claimName, claimValue, aud).toString(),
    provider,
    publicKey: null,
    nickname: claims.email || null,
    createdAt: Date.now(),
    claimName,
  };
};

export const areCredentialsValid = (
  currentEpoch: number,
  activeNetwork: NetworkType,
  credentials?: CredentialData
): credentials is CredentialData => {
  if (!credentials) {
    return false;
  }
  const { maxEpoch, network } = credentials;
  return activeNetwork === network && currentEpoch <= maxEpoch;
};
