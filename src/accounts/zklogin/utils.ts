// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import {
  generateNonce,
  generateRandomness,
  getExtendedEphemeralPublicKey,
  getZkLoginSignature
} from '@mysten/zklogin';
import { ZkLoginProvider, zkLoginProviderDataMap } from "./provider";
import { base64url, decodeJwt } from 'jose';
import { randomBytes } from "@noble/hashes/utils";
import { getDB, settingsKeys } from "@/utils/db";
import type { PublicKey } from "@mysten/sui.js/cryptography";
import { v4 as uuidV4 } from 'uuid';

export function prepareZkLogin(currentEpoch: number) {
  const maxEpoch = currentEpoch + 2;
  const ephemeralKeyPair = new Ed25519Keypair();
  const randomness = generateRandomness();
  const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, randomness);
  return {
    ephemeralKeyPair,
    randomness,
    nonce,
    maxEpoch,
  };
}

// const forceSilentGetProviders: ZkLoginProvider[] = ['twitch'];

/**
 * This method does a get request to the authorize url and is used as a workarround
 * for `forceSilentGetProviders` that they do the silent login/token refresh using
 * html directives or js code to redirect to the redirect_url (instead of response headers) and that forces the launchWebAuthFlow
 * to open and close quickly a new window. Which closes the popup window when open but also creates a weird flickering effect.
 *
 * @param authUrl
 */
async function tryGetRedirectURLSilently(authUrl: string) {
  // if (!forceSilentGetProviders.includes(provider)) {
  // 	return null;
  // }
  try {
    const responseText = await (await fetch(authUrl, { mode: 'no-cors' })).text();
    const redirectURLMatch =
      /<meta\s*http-equiv="refresh"\s*(CONTENT|content)=["']0;\s?URL='(.*)'["']\s*\/?>/.exec(
        responseText,
      );
    if (redirectURLMatch) {
      const redirectURL = redirectURLMatch[2];
      if (
        // redirectURL.startsWith(`https://${Browser.runtime.id}.chromiumapp.org`) &&
        redirectURL.includes('id_token=')
      ) {
        return new URL(redirectURL.replaceAll('&amp;', '&'));
      }
    }
  } catch (e) {
    //do nothing
  }
  return null;
}

export async function zkLoginAuthenticate({
  provider,
  nonce,
  loginHint,
  prompt,
}: {
  provider: ZkLoginProvider;
  nonce?: string;
  // This can be used for logins after the user has already connected an account
  // and we need to make sure that the user logged in with the correct account
  // seems only google supports this
  loginHint?: string;
  prompt?: boolean;
}): Promise<string | void> {
  if (!nonce) {
    nonce = base64url.encode(randomBytes(20));
  }
  const { clientID, url, extraParams, buildExtraParams } =
    zkLoginProviderDataMap[provider];
  const params = new URLSearchParams(extraParams);
  params.append('client_id', clientID);
  params.append('redirect_uri', window.location.origin); // replace with your redirect URL
  params.append('nonce', nonce);
  if (buildExtraParams) {
    buildExtraParams({ prompt, loginHint, params });
  }
  const authUrl = `${url}?${params.toString()}`;
  let responseURL: any;
  if (!prompt) {
    responseURL = await tryGetRedirectURLSilently(authUrl);
    if (responseURL) {
      const jwt = await fetchJwt(responseURL);
      return jwt;
    }
  } else {

  }
  if (!responseURL) {
    // Open a new popup window for the authentication flow
    const authWindow = window.open(authUrl, '_blank', 'width=500,height=600');
    if (!authWindow) {
      throw new Error('Failed to open authentication window');
    }
    // Poll the popup window to get the authentication response
    const authResponse = await new Promise<string>((resolve, reject) => {
      const intervalId = setInterval(() => {
        try {
          if (authWindow.closed) {
            reject(new Error('Authentication window was closed'));
          } else if (authWindow.location.href.startsWith(window.location.origin)) {
            resolve(authWindow.location.href);
            authWindow.close();
          }
        } catch (error) {
          // Ignore DOMException: Blocked a frame with origin "http://localhost" from accessing a cross-origin frame.
        }
      }, 250);

      // Stop polling if the window was closed
      authWindow.onbeforeunload = () => {
        clearInterval(intervalId);
      };
    });

    // Extract the token from the authentication response
    const token = await fetchJwt(authResponse);
    return token;
  }
}

export async function fetchJwt(url?: string) {
  const responseURL = new URL(url ?? window.location.href);
  let jwt;
  const responseParams = new URLSearchParams(responseURL.hash.replace('#', ''));
  jwt = responseParams.get('id_token');
  if (!jwt) {
    throw new Error('JWT is missing');
  }
  return jwt;
}

export async function fetchSalt(jwtToken: string): Promise<string> {
  const db = await getDB();

  // Get the master seed from the database
  const masterSeed = (await db.settings.get(settingsKeys.masterSeed))?.value as string;
  const hasSeed = !!masterSeed;
  if (!hasSeed)
    throw new Error('Master seed is missing');
  

  // TODO: Validate JWT
  const decoded = decodeJwt(jwtToken);

  // Extract the iss, aud, and sub claims
  const { iss, aud, sub } = decoded;

  // Use the iss and aud claims as the salt for the HKDF
  const salt = `${iss || ''}${aud || ''}`;

  // Use the sub claim as the info for the HKDF
  const info = sub || '';

  // Derive the user salt using HKDF
  const userSalt = (await import('crypto')).createHmac('sha256', salt)
    .update(masterSeed + info)
    .digest('hex');

  return `0x${userSalt}`;
}

type WalletInputs = {
  jwt: string;
  ephemeralPublicKey: PublicKey;
  maxEpoch: number;
  jwtRandomness: bigint;
  userSalt: bigint;
  keyClaimName?: 'sub' | 'email';
};

export type PartialZkLoginSignature = Omit<
  Parameters<typeof getZkLoginSignature>['0']['inputs'],
  'addressSeed'
>;

const zkLoginProofsServerUrl = 'https://prover.mystenlabs.com/v1';

export async function createPartialZkLoginSignature({
  jwt,
  ephemeralPublicKey,
  jwtRandomness,
  maxEpoch,
  userSalt,
  keyClaimName = 'sub',
}: WalletInputs): Promise<PartialZkLoginSignature> {
  const response = await fetch(zkLoginProofsServerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Request-Id': uuidV4(),
    },
    body: JSON.stringify({
      jwt,
      extendedEphemeralPublicKey: getExtendedEphemeralPublicKey(ephemeralPublicKey),
      maxEpoch,
      jwtRandomness: jwtRandomness.toString(),
      salt: userSalt.toString(),
      keyClaimName,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}