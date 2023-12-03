import { randomBytes } from "@noble/hashes/utils";
import { Serializable } from "./cryptography";

const PASSWORD =
	process.env.WALLET_KEYRING_PASSWORD ||
	'344c6f7d04a65c24f35f5c710b0e91e2f2e2f88c038562622d5602019b937bc2c2aa2821e65cc94775fe5acf2fee240d38f1abbbe00b0e6682646a4ce10e908e';

export const getFromLocalStorage = <T>(key: string): T | null => {
  const value = localStorage.getItem(key);
  if (value) {
    return JSON.parse(value) as T;
  }
  return null;
};

export const setToLocalStorage = <T>(key: string, value: T): void => {
  const jsonString = JSON.stringify(value);
  localStorage.setItem(key, jsonString);
};

export const removeFromLocalStorage = (key: string): void => {
  localStorage.removeItem(key);
};

export const getFromSessionStorage = <T>(key: string): T | null => {
  const value = sessionStorage.getItem(key);
  if (value) {
    return JSON.parse(value) as T;
  }
  return null;
};

export const setToSessionStorage = <T>(key: string, value: T): void => {
  const jsonString = JSON.stringify(value);
  sessionStorage.setItem(key, jsonString);
}

export function getRandomPassword() {
	return Buffer.from(randomBytes(64)).toString('hex');
}

export function makeEphemeraPassword(rndPass: string) {
	return `${PASSWORD}${rndPass}`;
}

// export async function setToSessionStorageEncrypted<T extends Serializable>(key: string, value: T) {
// 	const random = getRandomPassword();
// 	setToSessionStorage(key, {
// 		random,
// 		data: await encrypt(makeEphemeraPassword(random), value),
// 	});
// }
// export async function getEncryptedFromSessionStorage<T extends Serializable>(key: string) {
// 	const encryptedData = getFromSessionStorage<{ random: string; data: string }>(key);
// 	if (!encryptedData) {
// 		return null;
// 	}
// 	try {
// 		return decrypt<T>(makeEphemeraPassword(encryptedData.random), encryptedData.data);
// 	} catch (e) {
// 		return null;
// 	}
// }

export const removeFromSessionStorage = (key: string): void => {
  sessionStorage.removeItem(key);
}