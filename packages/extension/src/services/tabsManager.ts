import { InjectableService, messageData, messageSender, onInstalled, onMessage, onTabUpdated, sendMessageToContent, tabUpdatedDetails, tabUpdatedTab } from 'deco-ext'
import browser from 'webextension-polyfill'

@InjectableService()
export default class TabsManager {
  @onMessage({ name: 'openPreferences' })
  async openPreferences(): Promise<void> {
    await browser.tabs.create({ url: browser.runtime.getURL('./src/entries/options/index.html') })
  }

  @onMessage({ name: 'createRule' })
  async createRule(): Promise<void> {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    if (tabs.length > 0) {
      // TODO: add handler in content script
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
  async setBadge(@messageData('count') text: number | string, @messageSender('id') tabId: number) {
    const action = browser.action || browser.browserAction
    action.setBadgeText({ tabId, text: `${text}` })
  }

  // TODO: fix it. change it on redirect only
  @onTabUpdated()
  async clearBadge(@tabUpdatedTab('id') tabId: number, @tabUpdatedDetails() details: browser.Tabs.OnUpdatedChangeInfoType): Promise<void> {
    if (details.status === 'complite') {
      this.setBadge('', tabId)
    }
  }

  @onInstalled({reason: 'install'})
  async onInstalled() {
    // await browser.tabs.create({ url: browser.runtime.getURL('./src/entries/post_install/index.html') })
    await this.openPreferences()
  }
}
