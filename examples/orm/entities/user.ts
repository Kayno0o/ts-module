import { AbstractEntity, Column, Entity } from '@kaynooo/ts-module/orm'

@Entity('user')
export class User extends AbstractEntity {
  @Column('text', { nullable: true, unique: true })
  username?: string

  constructor(data: { username?: string }) {
    super()

    this.username = data.username
  }
}
