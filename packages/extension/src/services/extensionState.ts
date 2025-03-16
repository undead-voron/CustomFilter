import {InjectableService} from 'deco-ext';
import browser from 'webextension-polyfill'
import { EXTENSION_DISABLED_STORAGE_KEY } from '~/utils';

@InjectableService()
export default class ExtensionStateService {
    isDisabled = false
    async init() {
        this.isDisabled = await browser.storage.local.get(EXTENSION_DISABLED_STORAGE_KEY).then((result) => {
            return result[EXTENSION_DISABLED_STORAGE_KEY] || false
        })
        this.addStateUpdateListener(({newValue}) => {
            this.isDisabled = newValue
        })
    }
    addStateUpdateListener(callback: (arg: { oldValue: boolean, newValue: boolean }) => unknown) {
        browser.storage.local.onChanged.addListener(function initialListener(payload) {
          if (payload[EXTENSION_DISABLED_STORAGE_KEY]) {
            callback({
              oldValue: payload[EXTENSION_DISABLED_STORAGE_KEY].oldValue || false,
              newValue: payload[EXTENSION_DISABLED_STORAGE_KEY].newValue || false,
            })
          }
          return () => {
            browser.storage.local.onChanged.removeListener(initialListener)
          }
        })
      }
}
