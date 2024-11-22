import type { Database } from 'bun:sqlite'
import type { AbstractEntity } from './entity'
import fs from 'node:fs'
import path from 'node:path'
import { firstUpper } from '@kaynooo/utils'
import { AbstractRepository } from './repository'
import { repositories } from './types/global'

let db: Database

export const getDB: () => Database = () => {
  return db!
}

export async function initDB(newDb: Database, abstractRepositories: AbstractRepository<any>[]) {
  // for (const repository of repositories) {
  //   db.addRepository(repository)
  // }
  db = newDb

  for (const repository of abstractRepositories) {
    repositories[repository.tableName] = repository
  }
}

export function getRepository<T extends AbstractEntity>(entity: T): AbstractRepository<T> | undefined {
  return repositories[entity.__definition.tableName]
}

// const entitiesDir = path.resolve(import.meta.dir, 'app', 'entities')
export async function loadRepositoriesFromFile(entitiesDir: string): Promise<AbstractRepository<any>[]> {
  const repositories: AbstractRepository<any>[] = []

  const dirs = fs.readdirSync(entitiesDir)
  for (const dir of dirs) {
    const files = fs.readdirSync(path.resolve(entitiesDir, dir)).filter(file => file === 'repository.ts')
    const file = files[0]

    if (!file) {
      console.log('no files, continue')
      continue
    }

    const importRepository = await import(`~/entities/${dir}/${file}`)

    const ImportedRepository = importRepository[`${firstUpper(dir)}Repository`]
    if (ImportedRepository && ImportedRepository.prototype instanceof AbstractRepository) {
      repositories.push(new ImportedRepository())
      continue
    }

    const DefaultImportedRepository = importRepository.default
    if (DefaultImportedRepository && DefaultImportedRepository.prototype instanceof AbstractRepository)
      repositories.push(new DefaultImportedRepository())
  }

  return repositories
}
