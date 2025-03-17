/**
 * CSS utility functions
 */

// CSS class for custom blocker styles
const CSS_CLASS = 'customblocker-css'

/**
 * Applies CSS to the document
 */
export function applyCss(path: string): void {
  // Check duplication
  const existingLinks = document.getElementsByTagName('LINK')
  for (let i = 0; i < existingLinks.length; i++) {
    const existingLink = existingLinks[i]
    if (CSS_CLASS === existingLink.className && existingLink.getAttribute('href')?.indexOf(path) > 0) {
      return
    }
  }

  // Create Link Element
  const cssNode = document.createElement('LINK')
  cssNode.setAttribute('href', chrome.extension.getURL(path))
  cssNode.setAttribute('rel', 'stylesheet')
  cssNode.className = CSS_CLASS
  document.getElementsByTagName('HEAD')[0].appendChild(cssNode)
}

/**
 * Removes CSS from the document
 */
export function removeCss(path: string): void {
  const existingLinks = document.getElementsByTagName('LINK')
  for (let i = 0; i < existingLinks.length; i++) {
    const existingLink = existingLinks[i]
    if (CSS_CLASS === existingLink.className && existingLink.getAttribute('href')?.indexOf(path) > 0) {
      existingLink.parentNode?.removeChild(existingLink)
      return
    }
  }
}
