import path from 'node:path'
import { initDB } from '@kaynooo/ts-module/orm'
import { Database } from 'bun:sqlite'
import { UserRepository } from './repositories/userRepository'

await initDB(new Database(path.resolve(import.meta.dir, 'data.sqlite')), [
  new UserRepository(),
])
