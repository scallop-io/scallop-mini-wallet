import { type WalletStatusChange } from '_src/shared/messaging/messages/payloads/wallet-status-change';
import Dexie from "dexie";
import { backupDB, getDB } from "../db";
import { makeUniqueKey } from "../storage-utils";
import { SerializedAccount } from "./Account";
import { accountsEvents } from "./events";
import { ZkLoginAccount } from "./zklogin/ZkLoginAccount";

function toAccount(account: SerializedAccount) {
	// if (MnemonicAccount.isOfType(account)) {
	// 	return new MnemonicAccount({ id: account.id, cachedData: account });
	// }
	// if (ImportedAccount.isOfType(account)) {
	// 	return new ImportedAccount({ id: account.id, cachedData: account });
	// }
	// if (LedgerAccount.isOfType(account)) {
	// 	return new LedgerAccount({ id: account.id, cachedData: account });
	// }
	// if (QredoAccount.isOfType(account)) {
	// 	return new QredoAccount({ id: account.id, cachedData: account });
	// }
	if (ZkLoginAccount.isOfType(account)) {
		return new ZkLoginAccount({ id: account.id, cachedData: account });
	}
	throw new Error(`Unknown account of type ${account.type}`);
}

export async function isAccountsInitialized() {
	return (await (await getDB()).accounts.count()) > 0;
}

export async function getAccountsStatusData(
	accountsFilter?: string[],
): Promise<Required<WalletStatusChange>['accounts']> {
	const allAccounts = await (await getDB()).accounts.toArray();
	return allAccounts
		.filter(({ address }) => !accountsFilter || accountsFilter.includes(address))
		.map(({ address, publicKey, nickname }) => ({ address, publicKey, nickname }));
}

export async function changeActiveAccount(accountID: string) {
	const db = await getDB();
	return db.transaction('rw', db.accounts, async () => {
		const newSelectedAccount = await db.accounts.get(accountID);
		if (!newSelectedAccount) {
			throw new Error(`Failed, account with id ${accountID} not found`);
		}
		await db.accounts.where('id').notEqual(accountID).modify({ selected: false });
		await db.accounts.update(accountID, { selected: true });
		accountsEvents.emit('activeAccountChanged', { accountID });
	});
}

export async function getAccountsByAddress(address: string) {
	return (await (await getDB()).accounts.where('address').equals(address).toArray()).map(toAccount);
}

export async function getAccountByID(id: string) {
	const serializedAccount = await (await getDB()).accounts.get(id);
	if (!serializedAccount) {
		return null;
	}
	return toAccount(serializedAccount);
}

export async function addNewAccounts<T extends SerializedAccount>(accounts: Omit<T, 'id'>[]) {
	const db = await getDB();
	const accountsCreated = await db.transaction('rw', db.accounts, async () => {
		// delete all existing qredo accounts that have the same sourceID (come from the same connection)
		// and not in the new accounts list
		const accountInstances = [];
		for (const anAccountToAdd of accounts) {
			let id = '';
			const existingSameAddressAccounts = await getAccountsByAddress(anAccountToAdd.address);
			for (const anExistingAccount of existingSameAddressAccounts) {
				if (
					(await Dexie.waitFor(anExistingAccount.address)) === anAccountToAdd.address &&
					anExistingAccount.type === anAccountToAdd.type
				) {
					// allow importing accounts that have the same address but are of different type
					// probably it's an edge case and we used to see this problem with importing
					// accounts that were exported from the mnemonic while testing
					throw new Error(`Duplicated account ${anAccountToAdd.address}`);
				}
			}
			id = id || makeUniqueKey();
			await db.accounts.put({ ...anAccountToAdd, id });
			const accountInstance = await Dexie.waitFor(getAccountByID(id));
			if (!accountInstance) {
				throw new Error(`Something went wrong account with id ${id} not found`);
			}
			accountInstances.push(accountInstance);
		}
		const selectedAccount = await db.accounts.filter(({ selected }) => selected).first();
		if (!selectedAccount && accountInstances.length) {
			const firstAccount = accountInstances[0];
			await db.accounts.update(firstAccount.id, { selected: true });
		}
		return accountInstances;
	});
	await backupDB();
	accountsEvents.emit('accountsChanged');
	return accountsCreated;
}

export async function createNewZkLoginAccount() {
	let newSerializedAccounts: Omit<SerializedAccount, 'id'>[] = [];
	const type = 'zkLogin';
	const provider: { provider: "google" } = { 
		provider: 'google'
	};

	if (type === 'zkLogin') {
		newSerializedAccounts.push(await ZkLoginAccount.createNew(provider));
	} else {
		throw new Error(`Unknown accounts type to create ${type}`);
	}
	return true;
}