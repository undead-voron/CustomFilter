import browser from 'webextension-polyfill'

export async function isExtensionEnabled(): Promise<boolean> {
  const {isDisabled} = await browser.storage.local.get('isDisabled')
  return !isDisabled
}

export async function setExtensionEnabledState(isEnabled: boolean): Promise<void> {
  await browser.storage.local.set({isDisabled: !isEnabled})
}
