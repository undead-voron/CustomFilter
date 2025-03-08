import type { Rule, Word } from '~/services/types'
import { arrayContains } from './array-utils'
import { eachWords } from './word-utils'

export function findWord(node: Element, rule: Rule): Word | null {
  let foundWord: Word | null = null
  try {
    let _text = node.textContent || ''
    if (!(_text.length > 0)) {
      return null
    }
    eachWords(rule, (word: Word) => {
      // TODO: fix it. checkedNodes should not be stored here
      if (!word.checkedNodes) {
        word.checkedNodes = []
      }
      if (arrayContains(word.checkedNodes, node)) {
        return
      }
      word.checkedNodes.push(node)
      if (word.is_include_href) {
        const links: HTMLAnchorElement[] = []
        if (node.tagName === 'A') {
          links.push(node as HTMLAnchorElement)
        }
        const innerLinks: HTMLCollectionOf<HTMLAnchorElement> = node.getElementsByTagName('A') as HTMLCollectionOf<HTMLAnchorElement>
        for (let i = 0; i < innerLinks.length; i++) {
          links.push(innerLinks[i])
        }
        for (const link of links) {
          const url = link.href
          if (url) {
            _text += (` ${url}`)
          }
        }
      }
      const text = (word.is_case_sensitive) ? _text : _text.toLowerCase()
      const w = (word.is_case_sensitive) ? word.word : word.word.toLowerCase()
      if (word.deleted) {
        return
      }
      if (word.is_regexp) {
        if (word.regExp && word.regExp.test(text)) {
          foundWord = word
        }
      }
      else {
        if (word.is_complete_matching) {
          if (text === w) {
            foundWord = word
          }
        }
        else {
          if (text.includes(w)) {
            foundWord = word
          }
        }
      }
    })
  }
  catch (ex) {
    console.log('RuleEx ERROR')
    console.log(ex)
    return null
  }
  return foundWord
}
