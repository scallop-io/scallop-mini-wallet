import Dexie, { type Table } from 'dexie';
import { exportDB, importDB } from 'dexie-export-import';
import { getFromLocalStorage, setToLocalStorage } from '@/utils/storage';
import type { ZkLoginAccountSerialized } from '@/types/account';

const dbName = 'ScallopMiniWallet DB';
const dbLocalStorageBackupKey = 'indexed-db-backup';

export const settingsKeys = {
  isPopulated: 'isPopulated',
};
export class DB extends Dexie {
  accounts!: Table<ZkLoginAccountSerialized, string>;
  settings!: Table<{ value: string | boolean | number | null; setting: string }, string>;
  coinTypes!: Table<{ image: string; coinType: string }, string>;

  constructor() {
    super(dbName);
    this.version(1).stores({
      accounts: 'id, type, address',
      settings: 'setting',
      coinTypes: 'coinType',
    });

    this.version(2).stores({
      coinTypes: 'coinType',
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

// TODO: call BackupDB()
export async function backupDB() {
  try {
    const backup = await (await exportDB(await getDB())).text();
    setToLocalStorage(dbLocalStorageBackupKey, backup);
  } catch (e) {
    console.error(e);
  }
}
