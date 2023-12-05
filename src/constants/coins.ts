import { normalizeStructTag } from '@mysten/sui.js/utils';

export const DEFAULT_COINS = {
  testnet: [
    {
      coinType: normalizeStructTag('0x2::sui::SUI'),
      totalBalance: '0',
      coinObjectCount: 1,
      lockedBalance: {},
    },
    {
      coinType: normalizeStructTag(
        '0x949572061c09bbedef3ac4ffc42e58632291616f0605117cec86d840e09bf519::usdc::USDC'
      ),
      totalBalance: '0',
      coinObjectCount: 1,
      lockedBalance: {},
    },
    {
      coinType: normalizeStructTag(
        '0x949572061c09bbedef3ac4ffc42e58632291616f0605117cec86d840e09bf519::btc::BTC'
      ),
      totalBalance: '0',
      coinObjectCount: 1,
      lockedBalance: {},
    },
    {
      coinType: normalizeStructTag(
        '0x949572061c09bbedef3ac4ffc42e58632291616f0605117cec86d840e09bf519::eth::ETH'
      ),
      totalBalance: '0',
      coinObjectCount: 1,
      lockedBalance: {},
    },
  ],
  mainnet: [
    {
      coinType: normalizeStructTag('0x2::sui::SUI'),
      totalBalance: '0',
      coinObjectCount: 1,
      lockedBalance: {},
    },
    {
      coinType: normalizeStructTag(
        '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN'
      ),
      totalBalance: '0',
      coinObjectCount: 1,
      lockedBalance: {},
    },
    {
      coinType: normalizeStructTag(
        '0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN'
      ),
      totalBalance: '0',
      coinObjectCount: 1,
      lockedBalance: {},
    },
    {
      coinType: normalizeStructTag(
        '0x027792d9fed7f9844eb4839566001bb6f6cb4804f66aa2da6fe1ee242d896881::coin::COIN'
      ),
      totalBalance: '0',
      coinObjectCount: 1,
      lockedBalance: {},
    },
  ],
};