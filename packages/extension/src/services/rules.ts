import type { Rule } from './types'
import { InjectableService, messageData, onMessage, onTabActivated } from 'deco-ext'
import browser from 'webextension-polyfill'
import { wildcardToRegExp } from '~/utils'
import {escapeStringForRegExp} from '~/utils/string-utils';

@InjectableService()
export default class RulesService {
  appliedRules: Record<number, Rule[]> = {}

  async init() {
    const { appliedRules = {} } = await browser.storage.local.get(['appliedRules'])
    this.appliedRules = appliedRules
  }

  @onMessage({ name: 'getRulesByURL' })
  async getRulesByURL(@messageData('url') url: string): Promise<Rule[]> {
    const list: Rule[] = Object.values(this.appliedRules).flat()
    const rules: Rule[] = []
    for (const rule of list) {
      try {
        let regex
        if (rule.specify_url_by_regexp) {
          regex = new RegExp(rule.site_regexp, 'i')
        }
        else {
          regex = new RegExp(wildcardToRegExp(escapeStringForRegExp(rule.url)), 'i')
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

  // TODO: move to tabs manager
  @onTabActivated()
  async onTabsActivated(tab: browser.Tabs.OnActivatedActiveInfoType): Promise<void> {
    // const action = browser.browserAction || browser.action
    // const applied = this.appliedRules[tab.id]
    // let iconPath = `icon/${(applied) ? 'icon.png' : 'icon_disabled.png'}`

    // TODO: add icon change
  }

  @onMessage({ name: 'getAppliedRules' })
  async getAppliedRules(): Promise<Rule[]> {
    // TODO: consider changing it
    // TODO: implment filter for current tab
    // something like
    // const currentTab = await browser.tabs.query({active: true, currentWindow: true})
    // const url = currentTab[0]?.url
    // if (url) {
    //   const appliedRules = Object.values(this.appliedRules).flat().filter(rule => rule.url === url)
    //   return appliedRules
    // }
    return Object.values(this.appliedRules).flat()
  }
}
