// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it } from 'vitest';

import { decrypt, encrypt, getRandomPassword } from './keystore';

describe('keystore', () => {
	it('encrypt and decrypt success', async () => {
		const password = 'password';
		const plaintext = JSON.stringify('hello world');
		const ciphertext = await encrypt(password, plaintext);
		const result = await decrypt<string>(password, ciphertext);
		expect(result).toBe(plaintext);
	});

	it('encrypt and decrypt failed with wrong password', async () => {
		const password = 'password';
		const plaintext = JSON.stringify('hello world');
		const ciphertext = await encrypt(password, plaintext);
		await expect(decrypt('random', ciphertext)).rejects.toThrow('Incorrect password');
	});

	it('encrypt and decrypt failed with wrong ciphertext', async () => {
		const password = 'password';
		await expect(decrypt(password, 'random')).rejects.toThrowError();
	});

	it('obfuscate and deobfuscate success', async () => {
		const plaintext = JSON.stringify('hello world');
		const obfuscatedValue = await encrypt('Qe2wZcFYG5eFdSefWb27shstk2eUnNI39', plaintext);
		const result = await decrypt<string>('Qe2wZcFYG5eFdSefWb27shstk2eUnNI39', obfuscatedValue);
		expect(result).toBe(plaintext);
	});

	it('getRandomPassword success', async () => {
		const password = getRandomPassword();
		expect(password.length).toBe(128);
	});
});
