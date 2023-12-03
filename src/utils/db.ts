// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import Dexie, { type Table } from 'dexie';
import { exportDB, importDB } from 'dexie-export-import';
import { getFromLocalStorage, setToLocalStorage } from '@/utils/storage';
import type { SerializedAccount } from '@/types/account';
import * as crypto from 'crypto';
const dbName = 'ScallopMiniWallet DB';
const dbLocalStorageBackupKey = 'indexed-db-backup';

export const settingsKeys = {
  isPopulated: 'isPopulated',
  masterSeed: 'masterSeed',
};
class DB extends Dexie {
  accounts!: Table<SerializedAccount, string>;
  settings!: Table<{ value: string | boolean | number | null; setting: string; }, string>;

  constructor() {
    super(dbName);
    this.version(1).stores({
      accounts: 'id, type, address',
      settings: 'setting',
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

  const hasMasterSeed = !!(await db.settings.get(settingsKeys.masterSeed))?.value;
  if(!hasMasterSeed) {
    const masterSeed = crypto.randomBytes(32).toString('hex');
    await db.settings.put({ setting: settingsKeys.masterSeed, value: masterSeed });
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

// TODO: call BackupDB()
export async function backupDB() {
  try {
    const backup = await (await exportDB(await getDB())).text();
    setToLocalStorage(dbLocalStorageBackupKey, backup);
  } catch (e) {
    console.error(e);
  }
}

// TODO: allow app to send master key to user in case user or change device but still using scallop-mini-wallet and same account
