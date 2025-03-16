import type { Rule, Word } from '~/types'

export function findWord(node: Element, rule: Rule): Word | null {
  try {
    let _text = node.textContent || ''
    if (!(_text.length > 0)) {
      return null
    }
    // TODO: fix it. can just use rule.words.some
    return rule.words.find((word) => {
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
      const w = (word.is_case_sensitive) ? word.text : word.text.toLowerCase()

      if (word.is_regexp) {
        try {
          const regExpFlags = word.is_case_sensitive ? '' : 'i'
          const regExp = new RegExp(word.text, regExpFlags)
          if (regExp.test(text)) {
            return word
          }
        } catch (ex) {
          console.log('RuleEx ERROR')
          console.log(ex)
        }
      }
      else {
        if (word.is_complete_matching) {
          if (text === w) {
            return word
          }
        }
        else {
          if (text.includes(w)) {
            return word
          }
        }
      }
    }) || null
  }
  catch (ex) {
    console.log('RuleEx ERROR')
    console.log(ex)
    return null
  }
}
