/**
 * UI utility functions
 */

import type { Rule } from '~/services/types'

// Constants
const KEY_CODE_RETURN = 13

/**
 * Gets a rule detail tooltip
 */
export function getRuleDetailTip(rule: Rule): string | null {
  if (rule.block_anyway) {
    return chrome.i18n.getMessage('blockAnyway')
  }
  if (rule.words === null || rule.words.length === 0) {
    return null
  }

  const lines: string[] = []
  const wordStrings: string[] = []

  const getWordTip = (word: any, map: any) => {
    if (map && map[word.word_id] > 0) {
      return `${word.word} (${map[word.word_id]})`
    }
    return word.word
  }

  for (const word of rule.words) {
    wordStrings.push(getWordTip(word, rule.appliedWordsMap))
  }

  lines.push(wordStrings.join(', '))

  for (const group of rule.wordGroups) {
    const str = `[${group.name}]${group.words.map((word) => { return getWordTip(word, rule.appliedWordsMap) }).join(',')}`
    lines.push(str)
  }

  return lines.join(' / ')
}

/**
 * Creates a word element
 */
export function createWordElement(word: any, deleteCallback: (span: HTMLElement) => void): HTMLElement {
  const span = document.createElement('SPAN')
  span.innerHTML = word.word
  span.className = 'word'

  const deleteButton = createDeleteButton()
  deleteButton.addEventListener('click', () => { deleteCallback(span) }, false)
  span.appendChild(deleteButton)

  return span
}

/**
 * Creates a word group element
 */
export function createWordGroupElement(group: any, deleteCallback: (span: HTMLElement) => void): HTMLElement {
  const span = document.createElement('SPAN')
  span.innerHTML = group.name
  span.className = 'word group'

  const deleteButton = createDeleteButton()
  deleteButton.addEventListener('click', () => { deleteCallback(span) }, false)
  span.appendChild(deleteButton)

  return span
}

/**
 * Creates a delete button
 */
export function createDeleteButton(): HTMLElement {
  const button = document.createElement('INPUT')
  button.type = 'BUTTON'
  button.value = '×'
  button.className = 'deleteButton'
  return button
}

/**
 * Creates a simple word element
 */
export function createSimpleWordElement(word: string): HTMLElement {
  const span = document.createElement('SPAN')
  span.innerHTML = word
  span.className = 'word'
  return span
}

/**
 * Shows help
 */
export function showHelp(fileName: string): void {
  window.open(
    chrome.extension.getURL(`/help/${chrome.i18n.getMessage('extLocale')}/${fileName}`),
    'help',
    'top=10,left=10,width=480 height=500 resizable=yes menubar=no, toolbar=no',
  )
}

/**
 * Creates a keyword option icon
 */
export function createKeywordOptionIcon(fileName: string, suffix: string, tip: string): HTMLElement {
  const img = document.createElement('IMG')
  img.title = chrome.i18n.getMessage(tip)
  img.setAttribute('src', chrome.extension.getURL(`img/${fileName}_${suffix}.png`))
  img.className = 'option'
  return img
}

/**
 * Enables flash z-index
 */
export function enableFlashZIndex(): void {
  const embeds = document.getElementsByTagName('EMBED')
  for (let i = 0; i < embeds.length; i++) {
    const embed = embeds[i]
    if (embed.getAttribute('wmode') !== 'transparent') {
      embed.setAttribute('wmode', 'transparent')
    }
  }

  const objects = document.getElementsByTagName('OBJECT')
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i]
    let param = null
    const params = object.getElementsByTagName('PARAM')
    for (let j = 0; j < params.length; j++) {
      if (params[j].getAttribute('name') && params[j].getAttribute('name').toLowerCase() === 'wmode') {
        param = params[j]
      }
    }
    if (param) {
      param.setAttribute('value', 'transparent')
    }
    else {
      param = document.createElement('PARAM')
      param.setAttribute('name', 'wmode')
      param.setAttribute('value', 'transparent')
      object.appendChild(param)
    }
  }
}

