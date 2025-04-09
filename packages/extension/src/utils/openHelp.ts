import browser from 'webextension-polyfill'

export function openHelp(url: string) {
  const fullUrl = browser.runtime.getURL(url)
  window.open(fullUrl, 'new', 'width=450,height=500')
}
