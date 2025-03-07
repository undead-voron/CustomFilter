import type { Rule } from '~/services/types'
import { InjectableService } from 'deco-ext'
import browser from 'webextension-polyfill'
import { wildcardToRegExp } from '~/utils'
import { escapeStringForRegExp, RULES_STORAGE_KEY } from '~/utils/'

@InjectableService()
export default class RulesService {
  createRule(): Rule {
    return {
      dirty: false,
      isNew: false,
      deleted: false,
      insert_date: 0,
      update_date: 0,
      delete_date: 0,
      updaterId: null,
      words: [] as [Word],
      wordGroups: [] as [WordGroup],
      hideNodes: [] as [HTMLElement],
      searchNodes: [] as [HTMLElement],
      hiddenCount: 0,
      staticXpath: null,

      appliedWords: [],
      appliedWordsMap: null,
      is_disabled: false,

      rule_id: 0,
      user_identifier: null,
      global_identifier: null,
      title: document?.title ?? '',

      url: location?.href ?? '',
      site_regexp: escapeStringForRegExp(location?.href ?? ''),
      example_url: null,
      example_url: location?.href ?? '',
      block_anyway: false,
      hide_block_by_css: true,
      search_block_by_css: true,
      specify_url_by_regexp: false,
      keywords: [],
      is_disabled: false,
      is_replace_rule: false,
      search_block_css: null,
      search_block_xpath: null,
      search_block_by_css: true,

      hide_block_css: null,
      hide_block_xpath: null,
      hide_block_by_css: true,

      block_anyway: false,
      specify_url_by_regexp: false,
      existing: false,
    }
    return {
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

  // subscribe to rules update. Return function for unsubscribe
  addRulesUpdateListener(callback: (arg: { oldValue: Rule[], newValue: Rule[] }) => unknown) {
    browser.storage.local.onChanged.addListener(function initialListener(payload) {
      if (payload[RULES_STORAGE_KEY]) {
        callback({
          oldValue: payload[RULES_STORAGE_KEY].oldValue || [],
          newValue: payload[RULES_STORAGE_KEY].newValue || [],
        })
      }
      return () => {
        browser.storage.local.onChanged.removeListener(initialListener)
      }
    })
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

  async getRulesByUrl(url: string): Promise<Rule[]> {
    const rules = await this.getRules()

    return rules.filter((rule) => {
      try {
        let regex
        if (rule.specify_url_by_regexp) {
          regex = new RegExp(rule.site_regexp, 'i')
        }
        else {
          regex = new RegExp(wildcardToRegExp(rule.url), 'i')
        }
        return regex.test(url)
      }
      catch (e) {
        console.log(e)
        return false
      }
    })
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
