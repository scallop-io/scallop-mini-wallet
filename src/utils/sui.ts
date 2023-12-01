import BigNumber from 'bignumber.js';

/**
 * Based on BigNumber rounding logic.
 */
export enum CoinFormat {
  ROUND_FULL = 'ROUND_FULL',
  ROUND_CEIL = 'ROUND_CEIL',
  ROUND_FLOOR = 'ROUND_FLOOR',
  ROUND_UP = 'ROUND_UP',
  ROUND_DOWN = 'ROUND_DOWN',
}

export type FormatCoinConfig = {
  round?: CoinFormat;
  constrict?: boolean;
  separator?: boolean;
  prefix?: string;
  postfix?: string;
  defaultDisplay?: string;
};

/**
 * Enhance @mysten/core `formatAmount`.
 *
 * @param amount  Amount to format.
 * @param precision Number of decimal places to round to.
 * @param coinfig.round Rounding mode.
 * @param coinfig.constrict Whether to constrict the amount.
 * @param coinfig.separator Whether to use a separator.
 * @param coinfig.prefix Prefix to add to the formatted amount.
 * @param coinfig.postfix Postfix to add to the formatted amount.
 * @param coinfig.defaultDisplay Default display when amount is undefined or null.
 * @returns Formatted amount.
 */
export const formatAmount = (
  amount?: BigNumber | bigint | number | string | null,
  precision: number = 3,
  config?: FormatCoinConfig
) => {
  let amountParts = [];
  config = {
    round: CoinFormat.ROUND_DOWN,
    constrict: true,
    separator: true,
    prefix: undefined,
    postfix: undefined,
    defaultDisplay: '--',
    ...config,
  };

  if (amount === undefined || amount === null) {
    amountParts = [config.defaultDisplay];
  } else {
    const prefix = config.prefix ?? '';
    const postfix = config.postfix ?? '';

    let unit = '';
    let bn = new BigNumber(amount.toString()).abs();

    if (config.constrict) {
      if (bn.gte(1_000_000_000)) {
        bn = bn.shiftedBy(-9);
        unit = 'B';
      } else if (bn.gte(1_000_000)) {
        bn = bn.shiftedBy(-6);
        unit = 'M';
      } else if (bn.gte(10_000)) {
        bn = bn.shiftedBy(-3);
        unit = 'K';
      }
    }

    if (config.round === CoinFormat.ROUND_UP) {
      bn = bn.decimalPlaces(precision, BigNumber.ROUND_UP);
    } else if (config.round === CoinFormat.ROUND_DOWN) {
      bn = bn.decimalPlaces(precision, BigNumber.ROUND_DOWN);
    } else if (config.round === CoinFormat.ROUND_CEIL) {
      bn = bn.decimalPlaces(precision, BigNumber.ROUND_CEIL);
    } else if (config.round === CoinFormat.ROUND_FLOOR) {
      bn = bn.decimalPlaces(precision, BigNumber.ROUND_FLOOR);
    } else if (config.round === CoinFormat.ROUND_FULL) {
      bn = bn.decimalPlaces(precision);
    }

    if (config.constrict && bn.isGreaterThan(0) && bn.isLessThan(10 ** -precision)) {
      unit = '<';
      bn = new BigNumber(10 ** -precision).decimalPlaces(precision, BigNumber.ROUND_UP);
      amountParts = [unit, prefix, bn, postfix];
    } else {
      if (config.separator) {
        amountParts = [prefix, bn.toFormat(), unit, postfix];
      } else {
        amountParts = [prefix, bn.toString(), unit, postfix];
      }
    }
  }

  return amountParts.filter(Boolean).join('');
};

/**
 * Enhance @mysten/core `formatBalance`.
 * Process decimal in coin balance.
 *
 * @param balance Balance to format.
 * @param decimals Balance of decimal.
 * @param precision Number of decimal places to round to.
 * @param coinfig.round Rounding mode.
 * @param coinfig.constrict Whether to constrict the amount.
 * @param coinfig.separator Whether to use a separator.
 * @param coinfig.prefix Prefix to add to the formatted amount.
 * @param coinfig.postfix Postfix to add to the formatted amount.
 * @param coinfig.defaultDisplay Default display when amount is undefined or null.
 * @returns Formatted balance.
 */
export const formatBalance = (
  balance: BigNumber | bigint | number | string,
  decimals: number,
  precision?: number,
  config?: FormatCoinConfig
) => {
  const bn = new BigNumber(balance.toString()).shiftedBy(-1 * decimals);
  return formatAmount(bn, precision, config);
};
