# Scallop Mini Wallet

Scallop Mini-Wallet is a react component library designed to integrate with Sui blockchain using zkLogin. This tool is particularly useful in addressing issues where your cryptocurrency does not appear in your wallet.

## Instalation

You can install the Scallop Mini-Wallet using either pnpm or npm:

To install using pnpm, run:

```bash
pnpm install @scallop-io/scallop-mini-wallet
```

To install using npm, run:

```
npm install @scallop-io/scallop-mini-wallet
```

## Implementation

There are two methods to utilize this library:

**1. Using Your Own OpenID Provider (Currently limited to Google):**

You can follow this article to setup your `googleClientId` ([Google Client ID](https://docs.sui.io/concepts/cryptography/zklogin#google))

To integrate using your Google OpenID provider, implement the following code:

```ts
import { MiniWalletContainer } from '@scallop-io/scallop-mini-wallet';

<MiniWalletContainer googleAccountId={googleClientID} />
```

**2. Using Scallop's OpenID Provider:**

For integration using Scallop's Google OpenID provider, your project must be whitelisted. Please contact us for this purpose. Once whitelisted, use the following code:

```ts
import { MiniWalletContainer } from '@scallop-io/scallop-mini-wallet';

<MiniWalletContainer />
```

## Salt Management

Scallop uses a master seed value to derive the user salt with key derivation, in conjunction with the JWT token.

Note: If you're using your own `googleClientId`, it's essential to have your `googleClientId` whitelisted by the Scallop team. Only registered and approved client IDs can utilize this service. Please contact the Scallop team for assistance in getting your client ID whitelisted. Be aware that change in client ID (i.e., `aud`) will result in a different user address being derived, which could lead to a loss of funds.
