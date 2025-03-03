/**
 * Array utility functions
 */

/**
 * Checks if two arrays are equal
 */
export function arrayEquals(array0: any[], array1: any[]): boolean {
  if (!array0 || !array1 || array0.length !== array1.length) {
    return false
  }
  for (let i = 0, l = array0.length; i < l; i++) {
    if (array0[i] !== array1[i]) {
      return false
    }
  }
  return true
}

/**
 * Checks if an array contains an object
 */
export function arrayContains(array: any[], obj: any): boolean {
  for (const objInArray of array) {
    if (obj === objInArray) return true
  }
  return false
}

/**
 * Adds all elements from one array to another
 */
export function addAll(array: any[], elementsToAdd: any[]): void {
  for (let i = 0; i < elementsToAdd.length; i++) {
    array.push(elementsToAdd[i])
  }
} 