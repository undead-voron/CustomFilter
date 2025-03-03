import type { Rule, Word } from '~/services/types'

export function eachWords(rule: Rule, callback: (word: Word) => boolean | void): void {
  // Process individual words
  for (const word of rule.words) {
    if (callback(word) === true)
      return
  }

  // Process words in word groups
  for (const group of rule.wordGroups) {
    for (const word of group.words) {
      if (callback(word) === true)
        return
    }
  }
}

