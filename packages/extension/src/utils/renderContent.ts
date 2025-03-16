import browser from 'webextension-polyfill'

export default async function renderContent(
  cssPaths: string[],
  render: (appRoot: HTMLElement) => void,
) {
  const appContainer = document.createElement('div')
  const shadowRoot = appContainer.attachShadow({
    mode: import.meta.env.MODE === 'development' ? 'open' : 'closed',
  })
  const appRoot = document.createElement('div')

  // Create a mutation observer to track changes in appRoot
  const observer = new MutationObserver(() => {
    if (appRoot.childNodes.length === 0) {
      // If appRoot is empty, detach appContainer from document.body
      if (document.body.contains(appContainer)) {
        document.body.removeChild(appContainer)
      }
    } else {
      // If appRoot has content and appContainer is not in the DOM, reattach it
      if (!document.body.contains(appContainer)) {
        document.body.appendChild(appContainer)
      }
    }
  })

  // Start observing appRoot for changes to its child nodes
  observer.observe(appRoot, { childList: true, subtree: true })

  if (import.meta.hot) {
    const { addViteStyleTarget } = await import(
      '@samrum/vite-plugin-web-extension/client'
    )

    await addViteStyleTarget(shadowRoot)
  }
  else {
    cssPaths.forEach((cssPath: string) => {
      const styleEl = document.createElement('link')
      styleEl.setAttribute('rel', 'stylesheet')
      styleEl.setAttribute('href', browser.runtime.getURL(cssPath))
      shadowRoot.appendChild(styleEl)
    })
  }

  shadowRoot.appendChild(appRoot)
  document.body.appendChild(appContainer)

  render(appRoot)
}
