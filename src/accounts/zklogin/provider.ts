// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

export type ZkLoginProvider = 'google';
export interface ZkLoginProviderData {
  clientID: string;
  url: string;
  extraParams?: Record<string, string>;
  buildExtraParams?: (inputs: {
    prompt?: boolean;
    loginHint?: string;
    params: URLSearchParams;
  }) => void;
  enabled: boolean;
  hidden?: boolean;
  mfaLink?: string;
  extractJWT?: (authResponseURL: URL) => Promise<string>;
  order: number;
}

// const isDev = process.env.NODE_ENV === 'development';

export const zkLoginProviderDataMap: Record<ZkLoginProvider, ZkLoginProviderData> = {
  google: {
    clientID: '993131426104-ah7qqbp8p73ina6uepib31jj8djf523n.apps.googleusercontent.com',
    url: 'https://accounts.google.com/o/oauth2/v2/auth',
    extraParams: {
      response_type: 'id_token',
      scope: 'openid email profile',
    },
    buildExtraParams: ({ prompt, loginHint, params }) => {
      if (prompt) {
        params.append('prompt', 'select_account');
      }
      if (loginHint) {
        params.append('login_hint', loginHint);
      }
    },
    enabled: true,
    mfaLink: 'https://support.google.com/accounts/answer/185839',
    order: 0,
  },
};
