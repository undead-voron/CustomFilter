import type { Rule } from '../../../types'
import { InjectableService, messageData, onMessage } from 'deco-ext'
import browser from 'webextension-polyfill'
import { RULES_STORAGE_KEY, wildcardToRegExp } from '~/utils'

@InjectableService()
export default class RulesService {
  appliedRules: Rule[] = []

  async init() {
    const { [RULES_STORAGE_KEY]: appliedRules = [] } = await browser.storage.local.get([RULES_STORAGE_KEY])
    this.appliedRules = appliedRules
    browser.storage.local.onChanged.addListener((payload) => {
      if (payload[RULES_STORAGE_KEY]) {
        this.appliedRules = payload[RULES_STORAGE_KEY].newValue || []
      }
    })
  }

  @onMessage({ key: 'getRulesByURL' })
  async getRulesByURL(@messageData('url') url: string): Promise<Rule[]> {
    const list: Rule[] = this.appliedRules
    const rules: Rule[] = []
    for (const rule of list) {
      try {
        let regex
        if (rule.specify_url_by_regexp) {
          regex = new RegExp(rule.site_regexp, 'i')
        }
        else {
          regex = new RegExp(wildcardToRegExp(rule.url), 'i')
        }
        if (regex.test(url)) {
          rules.push(rule)
        }
      }
      catch (e) {
        console.log(e)
      }
    }

    return rules
  }

  @onMessage({ key: 'toggleRule' })
  toggleRule(@messageData('id')id: number): void {
    const rule = this.appliedRules.findIndex(rule => rule.rule_id === id)
    if (rule !== -1) {
      const rulesCopy = [...this.appliedRules]
      rulesCopy[rule].is_disabled = !rulesCopy[rule].is_disabled
      browser.storage.local.set({ [RULES_STORAGE_KEY]: rulesCopy })
    }
  }

  @onMessage({ key: 'deleteRule' })
  deleteRule(@messageData('id') id: number): void {
    const rulesCopy = [...this.appliedRules]
    const ruleIndex = rulesCopy.findIndex(rule => rule.rule_id === id)
    if (ruleIndex !== -1) {
      rulesCopy.splice(ruleIndex, 1)
    }
    browser.storage.local.set({ [RULES_STORAGE_KEY]: rulesCopy })
  }
}
