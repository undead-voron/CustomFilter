import type { Rule } from '~/services/types'
import { InjectableService } from 'deco-ext'
import browser from 'webextension-polyfill'

const RULES_STORAGE_KEY = 'custom_blocker_rules'

@InjectableService()
export default class CustomBlockerStorage {
  createRule(): Rule {
    return {
      title: '',
      site_regexp: '',
      example_url: '',
      block_anyway: false,
      hide_block_by_css: true,
      search_block_by_css: true,
      specify_url_by_regexp: false,
      keywords: [],
      is_disabled: false,
      is_replace_rule: false,
    }
  }

  async saveRule(rule: Rule): Promise<void> {
    try {
      const storage = await browser.storage.local.get(RULES_STORAGE_KEY)
      const rules: Rule[] = storage[RULES_STORAGE_KEY] || []

      if (rule.id) {
        // Update existing rule
        const index = rules.findIndex(r => r.id === rule.id)
        if (index !== -1) {
          rules[index] = { ...rule }
        }
        else {
          rules.push(rule)
        }
      }
      else {
        // Add new rule with generated ID
        rule.id = Date.now()
        rules.push(rule)
      }

      await browser.storage.local.set({ [RULES_STORAGE_KEY]: rules })
    }
    catch (error) {
      console.error('Error saving rule:', error)
      throw new Error('Failed to save rule')
    }
  }

  async getRules(): Promise<Rule[]> {
    try {
      const storage = await browser.storage.local.get(RULES_STORAGE_KEY)
      return storage[RULES_STORAGE_KEY] || []
    }
    catch (error) {
      console.error('Error getting rules:', error)
      return []
    }
  }

  async deleteRule(ruleId: number): Promise<void> {
    try {
      const storage = await browser.storage.local.get(RULES_STORAGE_KEY)
      const rules: Rule[] = storage[RULES_STORAGE_KEY] || []
      const filteredRules = rules.filter(rule => rule.id !== ruleId)
      await browser.storage.local.set({ [RULES_STORAGE_KEY]: filteredRules })
    }
    catch (error) {
      console.error('Error deleting rule:', error)
      throw new Error('Failed to delete rule')
    }
  }

  async clearRules(): Promise<void> {
    try {
      await browser.storage.local.remove(RULES_STORAGE_KEY)
    }
    catch (error) {
      console.error('Error clearing rules:', error)
      throw new Error('Failed to clear rules')
    }
  }

  async enableRule(ruleId: number): Promise<void> {
    try {
      const storage = await browser.storage.local.get(RULES_STORAGE_KEY)
      const rules: Rule[] = storage[RULES_STORAGE_KEY] || []
      const rule = rules.find(r => r.id === ruleId)
      if (rule) {
        rule.is_disabled = false
        await browser.storage.local.set({ [RULES_STORAGE_KEY]: rules })
      }
    }
    catch (error) {
      console.error('Error enabling rule:', error)
      throw new Error('Failed to enable rule')
    }
  }

  async disableRule(ruleId: number): Promise<void> {
    try {
      const storage = await browser.storage.local.get(RULES_STORAGE_KEY)
      const rules: Rule[] = storage[RULES_STORAGE_KEY] || []
      const rule = rules.find(r => r.id === ruleId)
      if (rule) {
        rule.is_disabled = true
        await browser.storage.local.set({ [RULES_STORAGE_KEY]: rules })
      }
    }
    catch (error) {
      console.error('Error disabling rule:', error)
      throw new Error('Failed to disable rule')
    }
  }
}
