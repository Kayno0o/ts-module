import type { DBField, Identifiable } from './types'

export function Entity(tableName: string, options?: { unique?: string[][] }) {
  // eslint-disable-next-line ts/no-unsafe-function-type
  return function (constructor: Function) {
    constructor.prototype.__definition.tableName = tableName
    constructor.prototype.__definition.uniques = options?.unique ?? []
  }
}

export function Column(type: 'bool' | 'int' | 'float' | 'text' | 'blob', options: Omit<DBField, 'type'>) {
  return function (target: AbstractEntity, key: string) {
    target.__definition ??= { default: null, fields: {}, tableName: '', uniques: [] }
    target.__definition.fields ??= {}

    target.__definition.fields[key] = { default: options.default, nullable: options.nullable, type, unique: options.unique }
  }
}

export interface EntityDefinition {
  default?: any
  fields: Record<string, DBField>
  tableName: string
  uniques: string[][]
}

export class AbstractEntity implements Identifiable {
  __definition: EntityDefinition = { fields: {}, tableName: '', uniques: [] }

  id = 0
}
