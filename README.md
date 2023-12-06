# Scallop Mini Wallet

Scallop Mini-Wallet is a library designed to integrate with web3 using zkLogin, supported by SUI. This tool is particularly useful in addressing issues where your cryptocurrency does not appear in your wallet.

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

There are two ways for using salt management

1. Mysten Salt Service:
   This method involves utilizing the Mysten salt service. For a comprehensive understanding of this approach, refer to the User Salt Management section in the SUI documentation. It provides detailed guidance on implementing this service in your application.

2. Scallop Salt Service:
   Opting for the Scallop salt service simplifies the process as it requires no additional action from your side. The Scallop Mini-Wallet library automatically handles this method, ensuring a seamless integration.

Note: To use the Scallop salt service, it is essential to have your googleClientId whitelisted by the Scallop team. Only registered and approved client IDs can utilize this service. Contact the Scallop team for assistance in getting your client ID whitelisted.

Each method offers distinct benefits and is designed to cater to different implementation preferences, ensuring flexibility and security in your application's salt management.
