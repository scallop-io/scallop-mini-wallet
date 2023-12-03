import { normalizeStructTag } from "@mysten/sui.js/utils";

export const getCoinAddressFromType = (coinType: string) => {
  const normalizeStruct = normalizeStructTag(coinType);
  return normalizeStruct.split(':')[0];
}

export const getCoinNameFromType = (coinType: string) => {
  const normalizeStruct = normalizeStructTag(coinType);
  return normalizeStruct.split(':')[2];
}