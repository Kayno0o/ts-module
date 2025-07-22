import type { DBField, Identifiable } from '.'

export const __definition: Record<string, EntityDefinition> = {}

export function Entity(tableName: string, options?: { unique?: string[][] }) {
  return function <T extends new (...args: any[]) => AbstractEntity>(constructor: T) {
    const name = constructor.name
    __definition[name] ??= { fields: {}, tableName: '', uniques: [] }
    __definition[name].tableName = tableName
    __definition[name].uniques = options?.unique ?? []
  }
}

export function Column(type: 'bool' | 'int' | 'float' | 'text' | 'blob', options?: Omit<DBField, 'type'>) {
  return function (target: AbstractEntity, key: string) {
    const name = target.constructor.name
    __definition[name] ??= { fields: {}, tableName: '', uniques: [] }
    __definition[name].fields ??= {}

    __definition[name].fields[options?.name ?? key] = { default: options?.default, nullable: options?.nullable, type, unique: options?.unique }
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
