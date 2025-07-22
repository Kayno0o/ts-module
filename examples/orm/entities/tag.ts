import { AbstractEntity, Column, Entity } from '#orm'

@Entity('tag')
export class Tag extends AbstractEntity {
  @Column('text', { nullable: false, unique: true })
  name: string

  constructor(data: { name: string }) {
    super()

    this.name = data.name
  }
}
