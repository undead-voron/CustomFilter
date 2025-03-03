/**
 * Path utility functions
 */

// Regular expression for file names
const REGEX_FILE_NAME = /\/(\w+\.html)$/

/**
 * Gets the suggested site regular expression based on the current URL
 */
export function getSuggestedSiteRegexp(): string {
  const url = document.URL
  return url.replace(/\./g, '\\.').replace(/\?/g, '\\?')
}

/**
 * Gets a show help action function
 */
export function getShowHelpAction(fileName: string): (event: Event) => void {
  REGEX_FILE_NAME.test(fileName)
  const extractedFileName = RegExp.$1

  return function(event: Event): void {
    // Import showHelp dynamically to avoid circular dependencies
    import('./ui-utils').then(({ showHelp }) => {
      showHelp(extractedFileName)
    })
  }
}

/**
 * Process the page for localization
 */
export function processPage(): void {
  const tags: HTMLElement[] = []

  // Add all span, label, and anchor elements
  const spans = document.getElementsByTagName('SPAN')
  const labels = document.getElementsByTagName('LABEL')
  const anchors = document.getElementsByTagName('A')

  for (let i = 0; i < spans.length; i++) {
    tags.push(spans[i] as HTMLElement)
  }

  for (let i = 0; i < labels.length; i++) {
    tags.push(labels[i] as HTMLElement)
  }

  for (let i = 0; i < anchors.length; i++) {
    tags.push(anchors[i] as HTMLElement)
  }

  // Process localization for tags
  const LOCALIZE_CLASS_REGEXP = /custom_filter_localize_([^ ]+)/

  for (let i = 0; i < tags.length; i++) {
    const element = tags[i]
    if (element.className !== null && element.className.match(LOCALIZE_CLASS_REGEXP)) {
      const key = RegExp.$1
      if (chrome.i18n.getMessage(key)) {
        element.innerHTML = chrome.i18n.getMessage(key)
      }
      else {
        console.error(`Missing localization key: ${key}, className=${element.className}`)
      }
    }
  }

  // Process buttons
  const buttons = document.getElementsByTagName('INPUT')
  for (let i = 0; i < buttons.length; i++) {
    const element = buttons[i]
    if (element.getAttribute('type') !== 'button')
      continue

    if (element.className !== null && element.className.match(LOCALIZE_CLASS_REGEXP)) {
      const key = RegExp.$1
      if (chrome.i18n.getMessage(key)) {
        element.setAttribute('value', chrome.i18n.getMessage(key))
      }
      else {
        console.error(`Missing localization key: ${key}, value=${element.getAttribute('value')}`)
      }
    }
  }

  // Process dismissable notes
  const keyPrefix = 'customblocker_note_'
  const notes = document.querySelectorAll<HTMLElement>('.note--dismissable')

  if (notes) {
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i]
      const noteKey = keyPrefix + note.getAttribute('note_key')

      if (localStorage[noteKey] === 'true') {
        // Already dismissed
        continue
      }

      note.style.display = 'block'
      const links = note.getElementsByTagName('a')

      for (let j = 0; j < links.length; j++) {
        const link = links[j]
        if (link.className.includes('note__dismiss')) {
          link.addEventListener('click', () => {
            note.style.display = 'none'
            localStorage[noteKey] = 'true'
          })
        }
      }
    }
  }
}

