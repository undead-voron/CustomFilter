import type { ProtocolWithReturn } from 'deco-ext'
import { Rule } from './services/types'

declare module 'deco-ext' {
  export interface ProtocolMap {
    openPreferences: void
    openRuleEditor: void
    getAppliedRules: ProtocolWithReturn<Record<never, never>, Rule[]>
    getRulesByURL: ProtocolWithReturn<{ url: string }, Rule[]>
    badge: ProtocolWithReturn<{ count: number }, void>
  }
}
