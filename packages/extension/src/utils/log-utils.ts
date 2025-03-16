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
let FILTER_LEVEL = LOG_LEVEL.INFO

/**
 * Initializes the logger
 */
export function initializeLogger(level = LOG_LEVEL.INFO): void {
  FILTER_LEVEL = level
}

/**
 * Internal write function
 */
function _write(message: string, level: number, label: string): void {
  if (level >= FILTER_LEVEL) {
    console.log(`[${label}] ${message}`)
  }
}

/**
 * Logs a verbose message
 */
export function logVerbose(message: string): void {
  _write(message, LOG_LEVEL.VERBOSE, 'v')
}

/**
 * Logs a debug message
 */
export function logDebug(message: string): void {
  _write(message, LOG_LEVEL.DEBUG, 'd')
}

/**
 * Logs an info message
 */
export function logInfo(message: string): void {
  _write(message, LOG_LEVEL.INFO, 'i')
}

/**
 * Logs a warning message
 */
export function logWarning(message: string): void {
  _write(message, LOG_LEVEL.WARNING, 'w')
}

/**
 * Logs an error message
 */
export function logError(message: string): void {
  _write(message, LOG_LEVEL.ERROR, 'e')
}

