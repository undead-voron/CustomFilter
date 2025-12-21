import { onBeforeUnmount, onMounted, readonly, ref } from 'vue'
import browser from 'webextension-polyfill'

export function useBrowserStorage<T>(key: string, defaultValue: T) {
  const value = ref<T>(defaultValue)
  const listener: (changes: Record<string, browser.Storage.StorageChange>) => void = (changes) => {
    if (key in changes) {
      value.value = changes[key].newValue ?? defaultValue
    }
  }
  onMounted(async () => {
    const storageValue = await browser.storage.local.get(key)
    value.value = storageValue[key] ?? defaultValue
    browser.storage.local.onChanged.addListener(listener)
  })
  onBeforeUnmount(() => {
    browser.storage.local.onChanged.removeListener(listener)
  })

  return { value: readonly<typeof value>(value) }
}
