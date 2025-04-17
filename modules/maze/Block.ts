import type { Dir } from './utils'

export class Block {
  pos: number
  order: number
  wall: Dir | 0

  constructor(pos: number, order: number, wall: Dir | 0) {
    this.pos = pos
    this.order = order
    this.wall = wall
  }
}
