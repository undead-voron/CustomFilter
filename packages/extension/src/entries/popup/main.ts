import { createApp } from 'vue'
import browser from 'webextension-polyfill'
import Popup from './Popup.vue'

(async () => {
  const activeUrl = await browser.tabs.query({active: true, currentWindow: true}).then(tabs => tabs[0]?.url)

  const app = createApp(Popup, {activeUrl: activeUrl ?? ''})
  app.mount('#app') 
})()
