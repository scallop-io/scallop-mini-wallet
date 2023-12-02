import { CredentialData } from "@/stores/types/session";
import { ZkLoginAccountSerialized } from "@/types/account";
import { getCurrentEpoch } from "./epoch";
import { fetchSalt, prepareZkLogin, zkLoginAuthenticate } from "./utils";
import { deobfuscate, obfuscate } from "@/utils/cryptography";
import { decodeJwt } from "jose";
import { ZkLoginProvider } from "./provider";
import { computeZkLoginAddress, genAddressSeed } from "@mysten/zklogin";
import { getEphemeralValue, setEphemeralValue } from "@/utils/session-ephemeral";
import { NetworkType } from "@/stores";

type JwtSerializedClaims = {
  email: string | null;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  picture: string | null;
  aud: string;
  iss: string;
  sub: string;
};

export const doLogin = async (account: ZkLoginAccountSerialized, currentNetwork: NetworkType): Promise<void> => {
  const { provider, claims } = account;
  // TODO: deobfuscate
  const { sub, aud, iss } = await deobfuscate<JwtSerializedClaims>(claims);
  // const { sub, aud, iss } = claims;
  const epoch = await getCurrentEpoch();
  const { ephemeralKeyPair, nonce, randomness, maxEpoch } = prepareZkLogin(Number(epoch));
  const jwt = await zkLoginAuthenticate({ provider, nonce, loginHint: sub });
  if(!jwt) return;
  
  const decodedJWT = decodeJwt(jwt);
  if (decodedJWT.aud !== aud || decodedJWT.sub !== sub || decodedJWT.iss !== iss) {
    throw new Error("Logged in account doesn't match with saved account");
  }
  const credentialsData: CredentialData = {
    ephemeralKeyPair: ephemeralKeyPair.export(),
    minEpoch: Number(epoch),
    maxEpoch,
    network: currentNetwork,
    randomness: randomness.toString(),
    jwt,
  };

  const ephemeralValue: Record<NetworkType, CredentialData> = getEphemeralValue() || {
    mainnet: {} as CredentialData,
    devnet: {} as CredentialData,
    testnet: {} as CredentialData,
  };
  ephemeralValue[currentNetwork as NetworkType] = credentialsData;
  setEphemeralValue(ephemeralValue);
  // return credentialsData;
};

export const createNewFromOAuth = async ({
  provider,
}: {
  provider: ZkLoginProvider;
}) => {
  zkLoginAuthenticate({ provider, prompt: true });
};

export const createAccountFromJwt = async (jwt: string): Promise<Omit<ZkLoginAccountSerialized, 'id'>> => {
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
    claims: await obfuscate(claims),
    salt: await obfuscate(salt),
    addressSeed: await obfuscate(
      genAddressSeed(BigInt(salt), claimName, claimValue, aud).toString(),
    ),
    provider: 'google', // TODO: need to allow dynamic provider
    publicKey: null,
    nickname: claims.email || null,
    createdAt: Date.now(),
    claimName,
  };
};

export const areCredentialsValid = (
  currentEpoch: number,
  activeNetwork: NetworkType,
  credentials?: CredentialData,
): credentials is CredentialData => {
  if (!credentials) {
    return false;
  }
  const { maxEpoch, network } = credentials;
  return (
    activeNetwork === network &&
    currentEpoch <= maxEpoch
  );
};