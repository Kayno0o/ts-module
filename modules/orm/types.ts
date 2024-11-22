export type ExcludeFunctions<T> = {
  // eslint-disable-next-line ts/no-unsafe-function-type
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T]

export interface SqliteColumn {
  cid: number
  name: string
  notnull: number
  pk: number
  type: string
}

export interface SqliteUnique {
  name: string
  origin: string
  partial: number
  seq: number
  unique: number
}

export interface DBField {
  default?: any
  nullable?: boolean
  primary?: boolean
  reference?: string | { key: string, table: string }
  type: 'bool' | 'int' | 'float' | 'text' | 'blob'
  unique?: boolean
}

export type QueryEntityType<T extends Identifiable> = Omit<Pick<T, ExcludeFunctions<T>>, '__definition'>
export type InputQueryEntityType<T extends Identifiable> = Omit<Pick<T, ExcludeFunctions<T>>, 'id' | '__definition'>

export interface Identifiable {
  id: number
}

/** @description from bun:sqlite built-in package */
export type SQLQueryBindings =
  | string
  | bigint
  | NodeJS.TypedArray
  | number
  | boolean
  | null
  | Record<
    string,
    string | bigint | NodeJS.TypedArray | number | boolean | null
  >
