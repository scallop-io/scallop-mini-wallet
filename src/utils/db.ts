// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import Dexie, { type Table } from 'dexie';
import { exportDB, importDB } from 'dexie-export-import';
import { getFromLocalStorage, setToLocalStorage } from '@/utils/storage';
import type { AccountType } from '@/accounts/Account';
import type { SerializedAccount } from '@/types/account';

const dbName = 'ScallopMiniWallet DB';
const dbLocalStorageBackupKey = 'indexed-db-backup';

export const settingsKeys = {
  isPopulated: 'isPopulated',
};

class DB extends Dexie {
  accounts!: Table<SerializedAccount, string>;
  secrets!: Table<string, string>;
  settings!: Table<{ value: boolean | number | null; setting: string; }, string>;

  constructor() {
    super(dbName);
    this.version(1).stores({
      accounts: 'id, type, address, sourceID',
      settings: 'setting',
      secrets: 'name,value',
    });
    this.version(2).upgrade((transaction) => {
      const zkLoginType: AccountType = 'zkLogin';
      transaction
        .table('accounts')
        .where({ type: 'zk' })
        .modify((anAccount) => {
          anAccount.type = zkLoginType;
        });
    });
  }
}

async function init() {
  const db = new DB();
  const isPopulated = !!(await db.settings.get(settingsKeys.isPopulated))?.value;
  if (!isPopulated) {
    try {
      const backup = getFromLocalStorage<string>(dbLocalStorageBackupKey);
      if (backup) {
        console.error(new Error('IndexedDB is empty, attempting to restore from backup'), {
          extra: { backupSize: backup.length },
        });
        await db.delete();
        (await importDB(new Blob([backup], { type: 'application/json' }))).close();
        await db.open();
      }
      await db.settings.put({ setting: settingsKeys.isPopulated, value: true });
    } catch (e) {
      console.error(e);
    }
  }
  if (!db.isOpen()) {
    await db.open();
  }
  return db;
}

let initPromise: ReturnType<typeof init> | null = null;
export const getDB = () => {
  if (!initPromise) {
    initPromise = init();
  }
  return initPromise;
};

export async function backupDB() {
  try {
    const backup = await (await exportDB(await getDB())).text();
    setToLocalStorage(dbLocalStorageBackupKey, backup);
  } catch (e) {
    console.error(e);
  }
}
