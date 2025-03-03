import { InjectableService, onMessage, sendMessageToContent } from 'deco-ext'
import browser from 'webextension-polyfill'

@InjectableService()
export default class TabsManager {
  @onMessage({ name: 'openPreferences' })
  async openPreferences(): Promise<void> {
    await browser.tabs.create({ url: browser.runtime.getURL('./src/entries/options/index.html') })
  }

  @onMessage({ name: 'openRuleEditor' })
  async openRuleEditor(): Promise<void> {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    if (tabs.length > 0) {
      // TODO: add handler in content script
      await sendMessageToContent('openRuleEditor', undefined, { tabId: tabs[0].id || 0 })
    }
  }
}
