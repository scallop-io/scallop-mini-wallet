import { normalizeStructTag } from '@mysten/sui.js/utils';
import type { LocalCoinType } from '@/stores';

export const DEFAULT_COINS: { [key: string]: Omit<LocalCoinType, 'active'>[]; } = {
  testnet: [
    {
      symbol: 'SUI',
      coinType: normalizeStructTag('0x2::sui::SUI'),
    },
    {
      symbol: 'USDC',
      coinType: '0x949572061c09bbedef3ac4ffc42e58632291616f0605117cec86d840e09bf519::usdc::USDC',
    },
    {
      symbol: 'BTC',
      coinType: '0x949572061c09bbedef3ac4ffc42e58632291616f0605117cec86d840e09bf519::btc::BTC',
    },
    {
      symbol: 'ETH',
      coinType: '0x949572061c09bbedef3ac4ffc42e58632291616f0605117cec86d840e09bf519::eth::ETH',
    },
  ],
  mainnet: [
    {
      symbol: 'SUI',
      coinType: normalizeStructTag('0x2::sui::SUI'),
    },
    {
      symbol: 'USDC',
      coinType: '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN',
    },
    {
      symbol: 'ETH',
      coinType: '0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN',
    },
    {
      symbol: 'BTC',
      coinType: '0x027792d9fed7f9844eb4839566001bb6f6cb4804f66aa2da6fe1ee242d896881::coin::COIN',
    },
    {
      symbol: 'CETUS',
      coinType: '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS',
    },
    {
      symbol: 'TURBOS',
      coinType: '0x5d1f47ea69bb0de31c313d7acf89b890dbb8991ea8e03c6c355171f84bb1ba4a::turbos::TURBOS',
    },
    {
      symbol: 'BUCK',
      coinType: '0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK'
    },
    {
      symbol: 'SUIA',
      coinType:
        '0x1d58e26e85fbf9ee8596872686da75544342487f95b1773be3c9a49ab1061b19::suia_token::SUIA_TOKEN',
    },
    {
      symbol: 'APT',
      coinType: '0x3a5143bb1196e3bcdfab6203d1683ae29edd26294fc8bfeafe4aaa9d2704df37::coin::COIN'
    },
    {
      symbol: 'USDT',
      coinType: '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN'
    },
  ],
  devnet: [],
};
