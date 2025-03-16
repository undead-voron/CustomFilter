import type { Rule, Word, WordGroup } from '~/types'
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
      words: [] as Word[],
      wordGroups: [] as WordGroup[],
      hideNodes: [] as HTMLElement[],
      searchNodes: [] as HTMLElement[],
      hiddenCount: 0,
      staticXpath: null,

      appliedWords: [],
      appliedWordsMap: null,
      is_disabled: false,

      rule_id: Date.now(),
      user_identifier: null,
      global_identifier: null,
      title: document?.title ?? '',

      url: location?.href ?? '',
      site_regexp: escapeStringForRegExp(location?.href ?? ''),
      example_url: location?.href ?? '',
      block_anyway: true,
      hide_block_by_css: true,
      search_block_by_css: true,
      specify_url_by_regexp: false,
      keywords: [],
      is_replace_rule: false,
      search_block_css: null,
      search_block_xpath: null,

      hide_block_css: null,
      hide_block_xpath: null,

      existing: false,
    }
  }

  async saveRule(rule: Rule): Promise<void> {
    try {
      const storage = await browser.storage.local.get(RULES_STORAGE_KEY)
      const rules: Rule[] = storage[RULES_STORAGE_KEY] || []

      if (rule.rule_id) {
        // Update existing rule
        const index = rules.findIndex(r => r.rule_id === rule.rule_id)
        if (index !== -1) {
          rules[index] = { ...rule }
        }
        else {
          rules.push(rule)
        }
      }
      else {
        // Add new rule with generated ID
        rule.rule_id = Date.now()
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
      const filteredRules = rules.filter(rule => rule.rule_id !== ruleId)
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
      const rule = rules.find(r => r.rule_id === ruleId)
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

  async getRuleById(ruleId: number): Promise<Rule | undefined> {
    const rules = await this.getRules()
    return rules.find(r => r.rule_id === ruleId)
  }

  async disableRule(ruleId: number): Promise<void> {
    try {
      const storage = await browser.storage.local.get(RULES_STORAGE_KEY)
      const rules: Rule[] = storage[RULES_STORAGE_KEY] || []
      const rule = rules.find(r => r.rule_id === ruleId)
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
