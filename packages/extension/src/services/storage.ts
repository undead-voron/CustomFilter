import type { PureRule, Rule, Word, WordGroup } from '~/types'
import { InjectableService } from 'deco-ext'
import browser, { storage } from 'webextension-polyfill'
import { logInfo, wildcardToRegExp } from '~/utils'
import { escapeStringForRegExp, RULES_STORAGE_KEY, WORD_GROUPS_STORAGE_KEY } from '~/utils/'

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

      logInfo('savingRules', { [RULES_STORAGE_KEY]: rules }, rule)

      await browser.storage.local.set({ [RULES_STORAGE_KEY]: rules })
    }
    catch (error) {
      console.error('Error saving rule:', error)
      throw new Error('Failed to save rule')
    }
  }

  private async getWordGroups(): Promise<WordGroup[]> {
    try {
      const storage = await browser.storage.local.get(WORD_GROUPS_STORAGE_KEY)
      return storage[WORD_GROUPS_STORAGE_KEY] || []
    }
    catch (e) {
      return []
    }
  }

  // subscribe to rules update. Return function for unsubscribe
  addRulesUpdateListener(callback: (updatedValue: Rule[]) => unknown) {
    const getPureRules = () => this.getPureRules()
    const getWordGroups = () => this.getWordGroups()

    browser.storage.local.onChanged.addListener(async function initialListener(payload) {
      logInfo('onChanged rules', payload)
      if (payload[RULES_STORAGE_KEY] || payload[WORD_GROUPS_STORAGE_KEY]) {
        const wordGroups: WordGroup[] = payload[WORD_GROUPS_STORAGE_KEY]
          ? (payload[WORD_GROUPS_STORAGE_KEY].newValue || [])
          : await getWordGroups()

        const rulesMapper = (pureRule: PureRule): Rule => ({
          ...pureRule,
          wordGroups: pureRule.wordGroups
            .map((groupId: string) => wordGroups.find(({ global_identifier }) => global_identifier === groupId))
            .filter<WordGroup>((group => !!group)),
        })

        const rules = payload[RULES_STORAGE_KEY]
          ? payload[RULES_STORAGE_KEY].newValue || []
          : await getPureRules()

        callback(rules.map(rulesMapper))
      }
      return () => {
        browser.storage.local.onChanged.removeListener(initialListener)
      }
    })
  }

  private async getPureRules(): Promise<PureRule[]> {
    try {
      const storage = await browser.storage.local.get(RULES_STORAGE_KEY)
      return storage[RULES_STORAGE_KEY] || []
    }
    catch (error) {
      console.error('Error getting rules:', error)
      return []
    }
  }

  async getRules(): Promise<Rule[]> {
    try {
      const {
        [RULES_STORAGE_KEY]: pureRules = [],
        [WORD_GROUPS_STORAGE_KEY]: wordGroups = [],
      } = (await browser.storage.local.get([RULES_STORAGE_KEY, WORD_GROUPS_STORAGE_KEY])) as { [RULES_STORAGE_KEY]: PureRule[], [WORD_GROUPS_STORAGE_KEY]: WordGroup[] }
      return pureRules.map((pureRule: PureRule): Rule => ({
        ...pureRule,
        wordGroups: pureRule.wordGroups
          .map((groupId: string) => wordGroups.find(({ global_identifier }) => global_identifier === groupId))
          .filter<WordGroup>((group => !!group)),
      }))
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
        // eslint-disable-next-line no-console
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
