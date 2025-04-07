import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./modules/orm/index.ts', './modules/rcon/index.ts'],
  format: ['esm'],
  clean: true,
  dts: true,
  minify: true,
  sourcemap: false,
  splitting: false,
  target: ['node22'],
})
