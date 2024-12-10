import type { DBField, Identifiable } from './types'

export const __definition: Record<string, EntityDefinition> = {}

export function Entity(tableName: string, options?: { unique?: string[][] }) {
  return function (constructor: typeof AbstractEntity) {
    const name = constructor.name
    __definition[name] ??= { fields: {}, tableName: '', uniques: [] }
    __definition[name].tableName = tableName
    __definition[name].uniques = options?.unique ?? []
  }
}

export function Column(type: 'bool' | 'int' | 'float' | 'text' | 'blob', options: Omit<DBField, 'type'>) {
  return function (target: AbstractEntity, key: string) {
    const name = target.constructor.name
    __definition[name] ??= { fields: {}, tableName: '', uniques: [] }
    __definition[name].fields ??= {}

    __definition[name].fields[key] = { default: options.default, nullable: options.nullable, type, unique: options.unique }
  }
}

export interface EntityDefinition {
  default?: any
  fields: Record<string, DBField>
  tableName: string
  uniques: string[][]
}

export class AbstractEntity implements Identifiable {
  id = 0
}
