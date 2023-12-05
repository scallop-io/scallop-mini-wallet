import { normalizeStructTag, parseStructTag } from '@mysten/sui.js/utils';

export const getCoinAddressFromType = (coinType: string) => {
  const normalizeStruct = normalizeStructTag(coinType);
  return normalizeStruct.split(':')[0];
};

export const getCoinNameFromType = (coinType: string) => {
  const parseStruct = parseStructTag(normalizeStructTag(coinType));
  switch (parseStruct.address) {
    case '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf':
      return 'USDC';
    case '0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5':
      return 'ETH';
    case '0x027792d9fed7f9844eb4839566001bb6f6cb4804f66aa2da6fe1ee242d896881':
      return 'BTC';
    default:
      return parseStruct.name;
  }
};
