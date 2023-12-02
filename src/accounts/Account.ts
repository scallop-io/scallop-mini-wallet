export type AccountType = 'zkLogin';

export type Serializable =
  | string
  | number
  | boolean
  | null
  | { [index: string]: Serializable | undefined; }
  | Serializable[]
  | (Iterable<Serializable> & { length: number; });
