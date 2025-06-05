export interface Gene {
  genes: string
  fitness: number
}

export interface StringGeneticEvent {
  best: (best: Gene) => void | Promise<void>
  generation: (nb: number) => void | Promise<void>
}

export type EventType = keyof StringGeneticEvent

export class StringGenetic {
  populationSize: number
  mutationRate: number
  bestPopulationRate: number
  maxGeneration: number
  charset: string
  size: number
  calcFitness: (genes: string) => number
  events: Partial<StringGeneticEvent> = {}
  verbose?: boolean

  constructor(options: {
    populationSize: number
    mutationRate: number
    bestPopulationRate: number
    maxGeneration: number
    charset: string
    size: number
    calcFitness: (genes: string) => number
    verbose?: boolean
  }) {
    this.populationSize = options.populationSize
    this.mutationRate = options.mutationRate
    this.bestPopulationRate = options.bestPopulationRate
    this.maxGeneration = options.maxGeneration
    this.charset = options.charset
    this.size = options.size
    this.calcFitness = options.calcFitness
    this.verbose = options.verbose ?? true
  }

  randomChar() {
    return this.charset[Math.floor(Math.random() * this.charset.length)]
  }

  randomGenes() {
    return Array.from({ length: this.size }, () => this.randomChar()).join('')
  }

  crossover(a: string, b: string): string {
    const midpoint = Math.floor(Math.random() * a.length)
    return a
      .split('')
      .map((_, i) => (i < midpoint ? a[i] : b[i]))
      .join('')
  }

  mutate(genes: string): string {
    return genes
      .split('')
      .map(char => (Math.random() < this.mutationRate ? this.randomChar() : char))
      .join('')
  }

  async solve() {
    let population: Gene[] = Array.from({ length: this.populationSize }, () => {
      const genes = this.randomGenes()
      return { genes, fitness: this.calcFitness(genes) }
    })

    let generation = 0
    let bestOfAll: Gene | undefined

    let startTime = 0
    if (this.verbose) {
      startTime = performance.now()
    }

    do {
      const genStart = this.verbose ? performance.now() : 0

      population.sort((a, b) => b.fitness - a.fitness)
      generation++
      await this.emit('generation', generation)

      if (!bestOfAll || population[0]!.fitness > bestOfAll.fitness) {
        bestOfAll = population[0]!
        if (this.verbose)
          console.log(`Gen ${generation} | New best: ${bestOfAll.fitness}`)
        await this.emit('best', bestOfAll)
      }

      const matingPool = population.slice(0, this.populationSize * this.bestPopulationRate)
      const newPopulation: Gene[] = []

      for (let i = 0; i < this.populationSize; i++) {
        const parentA = matingPool[Math.floor(Math.random() * matingPool.length)]!.genes
        const parentB = matingPool[Math.floor(Math.random() * matingPool.length)]!.genes
        const childGenes = this.mutate(this.crossover(parentA, parentB))
        newPopulation.push({ genes: childGenes, fitness: this.calcFitness(childGenes) })
      }

      population = newPopulation

      if (this.verbose) {
        const genEnd = performance.now()
        console.log(`Gen ${generation} | Time: ${(genEnd - genStart).toFixed(2)}ms`)
      }
    } while (generation < this.maxGeneration)

    if (this.verbose) {
      const endTime = performance.now()
      const total = endTime - startTime
      console.log(`Total time: ${total.toFixed(2)}ms`)
      console.log(`Average per gen: ${(total / generation).toFixed(2)}ms`)
    }

    return { bestOfAll }
  }

  on<Event extends EventType>(event: Event, callback: StringGeneticEvent[Event]): void {
    this.events[event] = callback
  }

  async emit<Event extends EventType>(event: Event, ...args: Parameters<StringGeneticEvent[Event]>) {
    const callback = this.events[event]
    if (typeof callback === 'function')
      await (callback as (...args: Parameters<StringGeneticEvent[Event]>) => void | Promise<void>)(...args)
  }
}
