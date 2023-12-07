import { normalizeStructTag } from '@mysten/sui.js/utils';
import type { CustomCoinType } from '@/stores';

export const DEFAULT_COINS: { [key: string]: Omit<CustomCoinType, 'active'>[]; } = {
  testnet: [
    {
      symbol: 'SUI',
      decimals: 9,
      coinType: normalizeStructTag('0x2::sui::SUI'),
    },
    {
      symbol: 'USDC',
      decimals: 6,
      coinType: '0x949572061c09bbedef3ac4ffc42e58632291616f0605117cec86d840e09bf519::usdc::USDC',
    },
    {
      symbol: 'BTC',
      decimals: 8,
      coinType: '0x949572061c09bbedef3ac4ffc42e58632291616f0605117cec86d840e09bf519::btc::BTC',
    },
    {
      symbol: 'ETH',
      decimals: 8,
      coinType: '0x949572061c09bbedef3ac4ffc42e58632291616f0605117cec86d840e09bf519::eth::ETH',
    },
  ],
  mainnet: [
    {
      symbol: 'SUI',
      decimals: 9,
      coinType: normalizeStructTag('0x2::sui::SUI'),
    },
    {
      symbol: 'USDC',
      decimals: 6,
      coinType: '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN',
    },
    {
      symbol: 'ETH',
      decimals: 8,
      coinType: '0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN',
    },
    {
      symbol: 'BTC',
      decimals: 8,
      coinType: '0x027792d9fed7f9844eb4839566001bb6f6cb4804f66aa2da6fe1ee242d896881::coin::COIN',
    },
    {
      symbol: 'USDT',
      decimals: 6,
      coinType: '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN',
    },
    {
      symbol: 'sSUI',
      decimals: 9,
      coinType:
        '0xefe8b36d5b2e43728cc323298626b83177803521d195cfb11e15b910e892fddf::reserve::MarketCoin<0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI>',
      iconUrl: 'https://app.scallop.io/assets/sSUI-df1cc6de.png',
    },
    {
      symbol: 'sUSDC',
      decimals: 6,
      coinType:
        '0xefe8b36d5b2e43728cc323298626b83177803521d195cfb11e15b910e892fddf::reserve::MarketCoin<0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN>',
      iconUrl: 'https://app.scallop.io/assets/sUSDC-8cd2f058.png',
    },
  ],
  devnet: [],
};
