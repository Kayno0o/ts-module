import { AbstractEntity, Column, Entity } from '#orm'

@Entity('user')
export class User extends AbstractEntity {
  @Column('text', { nullable: true, unique: true })
  username?: string

  constructor(data: { username?: string }) {
    super()

    this.username = data.username
  }
}
