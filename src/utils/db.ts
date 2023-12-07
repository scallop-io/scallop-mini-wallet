import { parseStructTag } from '@mysten/sui.js/utils';
import Dexie, { type Table } from 'dexie';
import { exportDB, importDB } from 'dexie-export-import';
import { getFromLocalStorage, setToLocalStorage } from '@/utils/storage';
import { shortenAddress } from './address';
import type { ZkLoginAccountSerialized } from '@/types/account';
import type { StructTag } from '@mysten/sui.js/bcs';

const dbName = 'scallop-mini-wallet-db';
const dbLocalStorageBackupKey = 'indexed-db-backup';

export const settingsKeys = {
  isPopulated: 'isPopulated',
};
export class DB extends Dexie {
  accounts!: Table<ZkLoginAccountSerialized, string>;
  settings!: Table<{ value: string | boolean | number | null; setting: string }, string>;
  coinTypes!: Table<{ id: string; image: string; coinType: string; network: string }, string>;

  constructor() {
    super(dbName);
    this.version(1).stores({
      accounts: 'id, type, address',
      settings: 'setting',
      coinTypes: 'id, network',
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

export const serializeCoinTypeWithNetwork = (coinType: string, network: string) => {
  // for cases like sCoin;
  const parse1 = parseStructTag(coinType);
  let address = parse1.address;
  if (parse1.typeParams.length > 0) {
    address = (parse1.typeParams as unknown as StructTag[])[0].address;
    return `${network}_${parse1.name}_${shortenAddress(address, 8, 8)}`;
  }
  return `${network}_${shortenAddress(address, 8, 8)}`;
};
