import path from 'node:path'
import { AbstractRepository, getRepository, initDB, runQuery } from '#orm'
import { Database } from 'bun:sqlite'
import { Tag } from './entities/tag'
import { User } from './entities/user'
import { UserRepository } from './repositories/userRepository'

await initDB(new Database(path.resolve(import.meta.dir, 'data.sqlite')), [
  new UserRepository(),
  new AbstractRepository(Tag),
])

runQuery('delete from user')
runQuery('delete from tag')

const tagRepo = getRepository(Tag)
const tag = tagRepo.create({ name: 'My tag' })

const userRepo = getRepository(User)
const newUser = userRepo.create({ username: 'My User', tag_id: tag.id })
console.log('Created user:', newUser)
console.log('User\'s tag:', newUser.getTag())
console.log(userRepo.update(newUser.id, newUser))
