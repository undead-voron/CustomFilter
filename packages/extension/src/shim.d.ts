import type { ProtocolWithReturn } from 'deco-ext'
import { Rule } from './types'

declare module 'deco-ext' {
  export interface ProtocolMap {
    openPreferences: void
    getRulesByURL: ProtocolWithReturn<{ url: string }, Rule[]>
    badge: ProtocolWithReturn<{ count: number }, void>
    createRule: void
    setInactiveBadge: void
    updateRule: ProtocolWithReturn<{ id: number }, void>
    toggleRule: ProtocolWithReturn<{ id: number }, void>
    deleteRule: ProtocolWithReturn<{ id: number }, void>
    openWordGroupsEditor: void
  }
}
