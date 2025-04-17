import type { LogLevel } from '@kaynooo/utils'

declare global {
  interface ImportMeta {
    readonly env: {
      readonly DEBUG_DB?: 'true' | 'false'
      readonly LOG_LEVEL?: LogLevel
    }
  }
}
