/**
 * String utility functions
 */

// Constants
const REGEX_WILDCARD_TO_REGEXP = /([^\w*])/g
const REGEX_WILDCARD = /\*/g

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
