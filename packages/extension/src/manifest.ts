import pkg from '../package.json'

const sharedManifest: Partial<chrome.runtime.ManifestBase> = {
  content_scripts: [
    {
      js: ['src/entries/contentScript/main.ts'],
      matches: ['*://*/*'],
    },
  ],
  icons: {
    16: 'icons/icon.png',
    // 19: 'icons/19.png',
    32: 'icons/icon32.png',
    // 38: 'icons/38.png',
    48: 'icons/icon48.png',
    // 64: 'icons/64.png',
    // 96: 'icons/96.png',
    128: 'icons/icon128.png',
    // 256: 'icons/256.png',
    // 512: 'icons/512.png',
  },
  options_ui: {
    page: 'src/entries/options/index.html',
    open_in_tab: true,
  },
  permissions: [
    'storage',
    'unlimitedStorage',
    'activeTab',
  ],
}

const browserAction = {
  default_icon: {
    16: 'icons/icon.png',
    // 19: 'icons/19.png',
    32: 'icons/icon32.png',
    // 38: 'icons/38.png',
    48: 'icons/icon48.png',
    // 64: 'icons/64.png',
    // 96: 'icons/96.png',
    128: 'icons/icon128.png',
    // 256: 'icons/256.png',
    // 512: 'icons/512.png',
  },
  default_title: 'CustomBlocker Rules',
  default_popup: 'src/entries/popup/index.html',
}

const ManifestV2 = {
  ...sharedManifest,
  background: {
    scripts: ['src/entries/background/script.ts'],
    persistent: true,
  },
  browser_action: browserAction,
  options_ui: {
    ...sharedManifest.options_ui,
    chrome_style: false,
  },
  permissions: [...sharedManifest.permissions, '*://*/*'],
}

const resources = [
  'help/*',
  // 'post_install.html',
  // 'src/entries/post_install/index.html',
]
const ManifestV3 = {
  ...sharedManifest,
  action: browserAction,
  background: {
    service_worker: 'src/entries/background/serviceWorker.ts',
  },
  // host_permissions: ['*://*/*'],
  web_accessible_resources: [{
    resources,
    matches: ['*://*/*'],
  }],
}

export function getManifest(manifestVersion: number): chrome.runtime.ManifestV2 | chrome.runtime.ManifestV3 {
  const manifest = {
    author: pkg.author,
    description: pkg.description,
    name: pkg.displayName ?? pkg.name,
    version: pkg.version,
  }

  if (manifestVersion === 2) {
    return {
      ...manifest,
      ...ManifestV2,
      manifest_version: manifestVersion,
    }
  }

  if (manifestVersion === 3) {
    return {
      ...manifest,
      ...ManifestV3,
      manifest_version: manifestVersion,
    }
  }

  throw new Error(
    `Missing manifest definition for manifestVersion ${manifestVersion}`,
  )
}
