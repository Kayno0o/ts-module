export type Dir = 1 | 2 | 4 | 8

export function reverseWall(wall: Dir): Dir {
  switch (wall) {
    case 1:
      return 4
    case 4:
      return 1
    case 2:
      return 8
    case 8:
      return 2
  }
}

export const DIRS: Dir[] = [1, 2, 4, 8]

export function get2DFrom1D(pos: number, w: number): [x: number, y: number] {
  return [pos % w, Math.floor(pos / w)]
}

export function get1DManhattanDistance(pos1: number, pos2: number, w: number): number {
  const [x1, y1] = get2DFrom1D(pos1, w)
  const [x2, y2] = get2DFrom1D(pos2, w)

  return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}
