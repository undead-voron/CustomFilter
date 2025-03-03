import type { ProtocolWithReturn } from 'deco-ext'

declare module 'deco-ext' {
  export interface ProtocolMap {
    openPreferences: void
    openRuleEditor: void
    additionalCall: ProtocolWithReturn<Record<never, never>, { firstTimeInited?: number }>
  }
}
