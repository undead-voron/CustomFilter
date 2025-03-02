import browser from 'webextension-polyfill'

browser.runtime.onInstalled.addListener(() => {
  console.log('Extension installed')
  browser.tabs.create({ url: browser.runtime.getURL('./post_install.html') })
})
