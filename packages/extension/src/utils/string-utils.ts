/**
 * String utility functions
 */

// Constants
const REGEX_WILDCARD_TO_REGEXP = /([^\w*])/g
const REGEX_WILDCARD = /\*/g

/**
 * Escapes HTML special characters in a string
 */
export function escapeHTML(str: string): string {
  const regExpAmp = /&/g
  const regExpGt = />/g
  const regExpLt = /</g
  
  return str
    .replace(regExpAmp, '&amp;')
    .replace(regExpGt, '&gt;')
    .replace(regExpLt, '&lt')
}

/**
 * Converts a wildcard pattern to a regular expression pattern
 */
export function wildcardToRegExp(str: string): string {
  const result = `.*${str.replace(REGEX_WILDCARD_TO_REGEXP, '\\$1').replace(REGEX_WILDCARD, '.*')}.*`
  return result
}

export function escapeStringForRegExp(str: string): string {
  return str.replace(/[\\[.+*?(){|^$]/g, '\\$&')
}

/**
 * Shortens text to fit within a specified width limit
 */
export function shorten(text: string, limit: number): string {
  const WIDTH_PER_LETTER = 10
  const span = document.createElement('SPAN')
  span.style.fontSize = `${WIDTH_PER_LETTER * 2}px`
  let resultText = text
  
  document.body.appendChild(span)
  span.innerHTML = escapeHTML(resultText)
  
  if (span.offsetWidth > limit * WIDTH_PER_LETTER) {
    // Shorten
    for (let length = text.length; length > 0; length--) {
      const str = `${text.substring(0, length)}...`
      span.innerHTML = escapeHTML(str)
      if (span.offsetWidth <= limit * WIDTH_PER_LETTER) {
        resultText = str
        break
      }
    }
  }
  
  document.body.removeChild(span)
  return resultText
}

/**
 * Trims whitespace from a string
 */
export function trim(str: string): string {
  return str.replace(/^[\s]+|[\s]+$/g, '')
}

/**
 * Checks if a string is empty
 */
export function isEmpty(str: string): boolean {
  return (str === null || str === '')
}

/**
 * Checks if a string is not empty
 */
export function notEmpty(str: string): boolean {
  return !isEmpty(str)
} 