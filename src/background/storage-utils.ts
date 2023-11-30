// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
	decrypt,
	encrypt,
	getRandomPassword,
	makeEphemeraPassword,
	type Serializable,
} from '../shared/cryptography/keystore';
import { v4 as uuidV4 } from 'uuid';

async function getFromStorage<T>(
	storage: Storage,
	key: string,
	defaultValue: T | null = null,
): Promise<T | null> {
	return storage.get(key) ?? defaultValue;
}

async function setToStorage<T>(
	storage: Storage,
	key: string,
	value: T,
): Promise<void> {
	return storage.set(key, value);
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
type OmitFirst<T extends any[]> = T extends [any, ...infer R] ? R : never;
type GetParams<T> = OmitFirst<Parameters<typeof getFromStorage<T>>>;
type SetParams<T> = OmitFirst<Parameters<typeof setToStorage<T>>>;

export function getFromLocalStorage<T>(...params: GetParams<T>) {
	return getFromStorage<T>(localStorage, ...params);
}
export function setToLocalStorage<T>(...params: SetParams<T>) {
	return setToStorage<T>(localStorage, ...params);
}
export async function getFromSessionStorage<T>(...params: GetParams<T>) {
	return getFromStorage<T>(sessionStorage, ...params);
}
export async function setToSessionStorage<T>(...params: SetParams<T>) {
	return setToStorage<T>(sessionStorage, ...params);
}
export async function removeFromSessionStorage(key: string) {
	await sessionStorage.remove(key);
}
export async function setToSessionStorageEncrypted<T extends Serializable>(key: string, value: T) {
	const random = getRandomPassword();
	await setToSessionStorage(key, {
		random,
		data: await encrypt(makeEphemeraPassword(random), value),
	});
}
export async function getEncryptedFromSessionStorage<T extends Serializable>(key: string) {
	const encryptedData = await getFromSessionStorage<{ random: string; data: string }>(key, null);
	if (!encryptedData) {
		return null;
	}
	try {
		return decrypt<T>(makeEphemeraPassword(encryptedData.random), encryptedData.data);
	} catch (e) {
		return null;
	}
}

/**
 * Generates a unique id using uuid, that can be used as a key for storage data
 */
export function makeUniqueKey() {
	return uuidV4();
}
