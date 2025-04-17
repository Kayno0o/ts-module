import type { Dir } from '../maze'
import { map } from '@kaynooo/utils'
import { StringGenetic } from '.'
import { get1DManhattanDistance, GrowingTreeMaze } from '../maze'

export default class GrowingTreeMazeGenetic extends StringGenetic {
  maze: GrowingTreeMaze

  constructor(options: {
    maze?: GrowingTreeMaze
    w: number
    h: number
    populationSize: number
    mutationRate: number
    bestPopulationRate: number
    maxGeneration: number
    verbose?: boolean
  }) {
    super({
      populationSize: options.populationSize,
      mutationRate: options.mutationRate,
      bestPopulationRate: options.bestPopulationRate,
      maxGeneration: options.maxGeneration,
      charset: '1248',
      size: options.w * options.h,
      calcFitness: (genes: string): number => {
        let pos = this.maze.start
        let steps = 0

        const explored = this.maze.getExploredPosFromPath(genes)
        const maxDistance = options.w + options.h

        let score = 0

        for (const char of genes) {
          steps++

          const dir = Number(char) as Dir
          if (!this.maze.canMoveToBlock(pos, dir)) {
            score -= 0.25
            continue
          }

          const nextPos = this.maze.getBlock(pos, dir)
          if (nextPos === -1)
            continue

          pos = nextPos

          if (pos === this.maze.end)
            return options.w * options.h * 10 - steps - explored.size
        }

        // return explored.size

        for (const b of explored)
          score += map(get1DManhattanDistance(b, this.maze.end, options.w), 0, maxDistance, 1, 0)

        return score / 4 + explored.size * 2
      },
      verbose: options.verbose,
    })

    if (options.maze) {
      this.maze = options.maze
    }
    else {
      this.maze = new GrowingTreeMaze(options.w, options.h)
      this.maze.generate(() => 0)
    }
  }
}
