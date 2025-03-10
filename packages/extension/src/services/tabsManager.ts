import { InjectableService, messageData, messageSender, onInstalled, onMessage, onTabUpdated, sendMessageToContent, tabUpdatedDetails, tabUpdatedTab } from 'deco-ext'
import browser from 'webextension-polyfill'

@InjectableService()
export default class TabsManager {
  @onInstalled({ reason: 'install' })
  @onMessage({ name: 'openPreferences' })
  async openPreferences(): Promise<void> {
    await browser.tabs.create({ url: browser.runtime.getURL('./src/entries/options/index.html') })
  }

  @onMessage({ name: 'createRule' })
  async createRule(): Promise<void> {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    if (tabs.length > 0) {
      await sendMessageToContent('createRule', undefined, { tabId: tabs[0].id || 0 })
    }
  }

  @onMessage({ name: 'updateRule' })
  async updateRule(@messageData('id') id: number): Promise<void> {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    if (tabs.length > 0) {
      await sendMessageToContent('updateRule', { id }, { tabId: tabs[0].id || 0 })
    }
  }

  @onMessage({ name: 'badge' })
  async setBadge(@messageData('count') text: number | string, @messageSender('tab') tab: browser.Tabs.Tab) {
    const action = browser.action || browser.browserAction
    action.setBadgeText({ tabId: tab.id || 0, text: text ? `${text}` : '' })
  }

  @onTabUpdated()
  async clearBadge(@tabUpdatedTab() tab: browser.Tabs.Tab, @tabUpdatedDetails() details: browser.Tabs.OnUpdatedChangeInfoType): Promise<void> {
    if (details.status) {
      this.setBadge('', tab)
    }
  }
}
