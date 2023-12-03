import { normalizeSuiAddress } from '@mysten/sui.js/utils';
const ELLIPSIS = '\u{2026}';

/**
 * Enhance @mysten/sui.js/utils `formatAmount` with start and end.
 *
 * @param address
 * @param start Number of characters to keep from the beginning of the string.
 * @param end Number of characters to keep from the end of the string.
 * @returns Formatted address.
 */
export const shortenAddress = (address: string, start = 4, end = 4) => {
  address = normalizeSuiAddress(address);

  return `${address.slice(0, start)}${ELLIPSIS}${address.slice(-end)}`;
};
