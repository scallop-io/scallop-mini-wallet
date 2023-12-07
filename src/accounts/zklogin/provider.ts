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
