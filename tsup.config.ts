import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'index': 'modules/index.ts',
    'orm/index': 'modules/orm/index.ts',
    'rcon/index': 'modules/rcon/index.ts',
    'maze/index': 'modules/maze/index.ts',
    'genetics/index': 'modules/genetics/index.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  minify: true,
  external: [
    '@kaynooo/utils',
    'prismarine-nbt',
    'rcon-client',
    'bun:sqlite',
    'node:path',
    'node:fs',
  ],
})
