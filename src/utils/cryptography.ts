
export type Serializable =
	| string
	| number
	| boolean
	| null
	| { [index: string]: Serializable | undefined }
	| Serializable[]
	| (Iterable<Serializable> & { length: number });
    
// const obfuscationPassword = 'Qe2wZcFYG5eFdSefWb27shstk2eUnNI39';

// export async function encrypt(password: string, secrets: Serializable): Promise<string> {
// 	return metamaskEncrypt(password, secrets);
// }

// export async function decrypt<T extends Serializable>(
// 	password: string,
// 	ciphertext: string,
// ): Promise<T> {
// 	return (await metamaskDecrypt(password, ciphertext)) as T;
// }

// export function obfuscate(value: Serializable) {
// 	return encrypt(obfuscationPassword, value);
// }

// export function deobfuscate<T extends Serializable>(obfuscatedValue: string) {
// 	return decrypt<T>(obfuscationPassword, obfuscatedValue);
// }
