import type { Dir } from './utils'
import { randomInt, shuffleArray } from '@kaynooo/utils'
import { DIRS } from './utils'

export class Maze {
  w: number
  h: number
  start: number
  end: number
  startSide: Dir
  endSide: Dir
  blocks: number[]

  constructor(
    w: number,
    h: number,
    data?: {
      blocks?: number[]
      start?: number
      end?: number
      startSide?: Dir
      endSide?: Dir
    },
  ) {
    this.w = w
    this.h = h

    this.blocks = data?.blocks || new Array(w * h).fill(0)

    const sides: Dir[] = [1, 2, 4, 8]
    const startSideIndex = randomInt(4)
    this.startSide = data?.startSide ?? sides[startSideIndex]
    this.start = data?.start || this.getEdgeIndex(this.startSide)

    sides.splice(startSideIndex, 1)
    const endSideIndex = randomInt(3)
    this.endSide = data?.endSide ?? sides[endSideIndex]
    this.end = data?.end || this.getEdgeIndex(this.endSide)
  }

  // eslint-disable-next-line ts/no-empty-function
  generate(..._args: any): void {}

  getBlock(pos: number, dir: Dir): number {
    if (dir === 1 && pos >= this.w)
      return pos - this.w
    if (dir === 2 && (pos + 1) % this.w !== 0)
      return pos + 1
    if (dir === 4 && pos < this.w * (this.h - 1))
      return pos + this.w
    if (dir === 8 && pos % this.w !== 0)
      return pos - 1

    return -1
  }

  canMoveToBlock(pos: number, dir: Dir): boolean {
    return (this.blocks[pos] & dir) !== 0
  }

  getNeighbours(pos: number): number[] {
    return DIRS.reduce((acc, dir) => {
      const p = this.getBlock(pos, dir)
      if (p !== -1)
        acc.push(p)
      return acc
    }, [] as number[])
  }

  getNonVisitedNeighbours(pos: number): number[] {
    return DIRS.reduce((acc, dir) => {
      const p = this.getBlock(pos, dir)
      if (p !== -1 && this.blocks[p] === 0)
        acc.push(p)
      return acc
    }, [] as number[])
  }

  randomNonVisitedNeighbour(pos: number): [newPos: number, dir: Dir | -1] {
    shuffleArray(DIRS)

    for (const dir of DIRS) {
      const newPos = this.getBlock(pos, dir)
      if (newPos !== -1 && this.blocks[newPos] === 0)
        return [newPos, dir]
    }

    return [-1, -1]
  }

  getEdgeIndex(side: Dir): number {
    switch (side) {
      case 1:
        return randomInt(this.w)
      case 2:
        return randomInt(this.h) * this.w + (this.w - 1)
      case 4:
        return (this.h - 1) * this.w + randomInt(this.w)
      case 8:
        return randomInt(this.h) * this.w
      default:
        return 0
    }
  }

  getExploredPosFromPath(path: string): Set<number> {
    let pos = this.start
    const positions = new Set<number>([pos])

    for (const char of path) {
      const dir = Number(char) as Dir
      if (!this.canMoveToBlock(pos, dir))
        continue

      const nextPos = this.getBlock(pos, dir)
      if (nextPos === -1)
        continue

      pos = nextPos
      positions.add(pos)
    }

    return positions
  }

  printHTML(path?: string): HTMLElement {
    const container = document.createElement('div')
    container.className = 'grid gap-[1px] bg-neutral rounded-lg overflow-hidden'

    container.style.gridTemplateColumns = `repeat(${this.w}, minmax(0, 1fr))`

    let positions = new Set<number>()
    if (path)
      positions = this.getExploredPosFromPath(path)

    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const i = y * this.w + x
        let wall = this.blocks[i]
        if (i === this.start)
          wall |= this.startSide
        if (i === this.end)
          wall |= this.endSide

        const cell = document.createElement('div')
        const base = 'w-6 h-6 sm:w-8 sm:h-8 transition-all duration-300'
        const cls = [base, 'bg-base-200 border border-neutral-content']

        if (!(wall & 1))
          cls.push('border-t-4 border-primary')
        if (!(wall & 2))
          cls.push('border-r-4 border-primary')
        if (!(wall & 4))
          cls.push('border-b-4 border-primary')
        if (!(wall & 8))
          cls.push('border-l-4 border-primary')

        if (i === this.start) {
          cls.push('bg-success text-success-content flex items-center justify-center text-[10px] sm:text-xs font-bold')
          cls.push(`side-${this.startSide}`)
          cell.textContent = 'S'
        }

        if (i === this.end) {
          cls.push('bg-error text-error-content flex items-center justify-center text-[10px] sm:text-xs font-bold')
          cls.push(`side-${this.endSide}`)
          cell.textContent = 'E'
        }

        if (positions.has(i)) {
          cls.push('bg-info')
        }

        cell.className = cls.join(' ')
        container.appendChild(cell)
      }
    }

    return container
  }

  static loadFromString<T extends typeof Maze>(this: T, maze: string): InstanceType<T> {
    const [w, start, end, startSide, endSide, path] = maze.split('_')

    const blocks = Array.from(path, dir => Number.parseInt(dir, 16))

    return new this(
      Number(w),
      Math.floor(path.length / Number(w)),
      {
        blocks,
        start: Number(start),
        end: Number(end),
        startSide: Number(startSide) as Dir,
        endSide: Number(endSide) as Dir,
      },
    ) as InstanceType<T>
  }

  toString(): string {
    return [
      this.w,
      this.start,
      this.end,
      this.startSide,
      this.endSide,
      this.blocks.map(block => block.toString(16)).join(''),
    ].join('_')
  }
}
