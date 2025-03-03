import browser from 'webextension-polyfill'
import { InjectableService, onMessage } from 'deco-ext'
import '~/services/tabsManager'
import '~/services/rules'


browser.runtime.onInstalled.addListener(() => {
  console.log('Extension installed')
  browser.tabs.create({ url: browser.runtime.getURL('./src/entries/post_install/index.html') })
})
