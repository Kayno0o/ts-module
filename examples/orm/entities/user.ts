import type { EntityInput } from '#orm'
import { AbstractEntity, Column, Entity, getRepository } from '#orm'
import { Tag } from './tag'

@Entity('user')
export class User extends AbstractEntity {
  @Column('text', { nullable: false, unique: true })
  username: string

  @Column('int', { nullable: true, unique: false, primary: true, reference: { key: 'id', table: 'tag' } })
  tag_id?: number

  _cache?: {
    tag?: Tag | null
  }

  constructor(data: EntityInput<User>) {
    super()

    this.username = data.username
    this.tag_id = data.tag_id
  }

  getTag(): Tag | null {
    if (this.tag_id === undefined)
      return null

    this._cache ??= {}
    return this._cache.tag ??= getRepository(Tag)!.find(this.tag_id)
  }
}
