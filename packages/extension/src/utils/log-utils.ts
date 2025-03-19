/**
 * Logging utility functions
 */

// Log levels
export const LOG_LEVEL = {
  VERBOSE: 1,
  DEBUG: 2,
  INFO: 3,
  WARNING: 4,
  ERROR: 5,
}

// Current filter level
let FILTER_LEVEL = import.meta.env.DEV ? LOG_LEVEL.VERBOSE : LOG_LEVEL.INFO

/**
 * Initializes the logger
 */
export function initializeLogger(level = LOG_LEVEL.INFO): void {
  FILTER_LEVEL = level
}

/**
 * Internal write function
 */
function _write(level: number, label: string, ...message: any[]): void {
  if (level >= FILTER_LEVEL) {
    // eslint-disable-next-line no-console
    console.trace(`[${label}]`, ...message)
  }
}

/**
 * Logs a verbose message
 */
export function logVerbose(...message: any[]): void {
  _write(LOG_LEVEL.VERBOSE, 'v', ...message)
}

/**
 * Logs a debug message
 */
export function logDebug(...message: any[]): void {
  _write(LOG_LEVEL.DEBUG, 'd', ...message)
}

/**
 * Logs an info message
 */
export function logInfo(...message: any[]): void {
  _write(LOG_LEVEL.INFO, 'i', ...message)
}

/**
 * Logs a warning message
 */
export function logWarning(...message: any[]): void {
  _write(LOG_LEVEL.WARNING, 'w', ...message)
}

/**
 * Logs an error message
 */
export function logError(...message: any[]): void {
  _write(LOG_LEVEL.ERROR, 'e', ...message)
}
