import { AccountType } from "@/accounts/Account";
import type { ZkLoginProvider } from "@/accounts/zklogin/provider";
import { JwtSerializedClaims } from "@/accounts/zklogin/zklogin";

export interface SerializedAccount {
  readonly id: string;
  readonly type: AccountType;
  readonly address: string;
  readonly publicKey: string | null;
  // /**
  //  * indicates if it's the selected account in the UI (active account)
  //  */
  // readonly selected: boolean;
  readonly nickname: string | null;
  readonly createdAt: number;
}

export interface ZkLoginAccountSerialized extends SerializedAccount {
  type: 'zkLogin';
  provider: ZkLoginProvider;
  /**
   * the salt used to create the account obfuscated
   */
  salt: string;
  /**
   * obfuscated data that contains user info as it was in jwt
   */
  claims: JwtSerializedClaims;
  /**
   * the addressSeed obfuscated
   */
  addressSeed: string;
  /**
   * the name/key of the claim in claims used for the address sub or email
   */
  claimName: 'sub' | 'email';
  warningAcknowledged?: boolean;
}
