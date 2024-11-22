import { defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  dts: true, // Generate declaration file (.d.ts)
  entry: ['./modules/index.ts', './modules/orm/index.ts'],
  format: ['esm'], // Build for commonJS and ESmodules
  minify: true,
  sourcemap: true,
  splitting: false,
  target: ['node22'],
})
