import type { LogLevel } from '@kaynooo/utils'

declare global {
  interface ImportMeta {
    env: {
      readonly DEBUG_DB?: 'true' | 'false'
      readonly LOG_LEVEL?: LogLevel
    }
  }
}

export {}
