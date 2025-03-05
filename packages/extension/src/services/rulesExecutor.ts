import type { Rule, Word } from './types'
import { InjectableService, sendMessageToBackground } from 'deco-ext'
import { eachWords, findWord, getElementsByCssSelector, getElementsByXPath, isEmpty, wildcardToRegExp, xpathToCss } from '~/utils'

@InjectableService()
export default class RulesExecutor {
  rules: Rule[] = []
  blockedCount = 0
  styleTag?: HTMLStyleElement
  async init() {
    this.rules = await sendMessageToBackground('getRulesByURL', { url: location.href })
    if (this.rules.length > 0) {
      this.startBlocking()
    }
  }

  startBlocking(): void {
    for (const rule of this.rules) {
      if (rule.block_anyway && !rule.is_disabled) {
        const cssSelector = (rule.hide_block_by_css)
          ? rule.hide_block_css
          : xpathToCss(rule.hide_block_xpath)
        if (cssSelector != null) {
          this.addBlockCss(cssSelector)
          rule.staticXpath = cssSelector
        }
      }
      // Set labels for tooltips in pop-up window
      for (const word of rule.words) {
        word.label = String(word.word)
      }
      for (const group of rule.wordGroups) {
        for (const word of group.words) {
          word.label = `${String(group.name)}>${String(word.word)}`
        }
      }
      let wordIdIncr = 0
      eachWords(rule, (word: Word) => {
        word.word_id = wordIdIncr++
        if (word.is_regexp) {
          try {
            if (word.is_complete_matching) {
              // Append "^" and "$"
              let expression = (word.word.charAt(0) !== '^') ? '^' : ''
              expression += word.word
              expression += ((word.word.charAt(word.word.length - 1) !== '$') ? '$' : '')
              if (word.is_case_sensitive) {
                word.regExp = new RegExp(expression)
              }
              else {
                word.regExp = new RegExp(expression, 'i')
              }
            }
            else {
              if (word.is_case_sensitive) {
                word.regExp = new RegExp(word.word)
              }
              else {
                word.regExp = new RegExp(word.word, 'i')
              }
            }
          }
          catch (ex) {
            console.log(`Invalid RegExp: "${word.word}"`)
          }
        }
      })
    }
    let needBlocking = false
    for (const rule of this.rules) {
      if (!rule.is_disabled)
        needBlocking = true
    }
    if (needBlocking) {
      for (let after = 50; after < 250; after += 50) {
        setTimeout(() => {
          this.execBlock()
        }, after)
      }
      this.blockInterval = setInterval(() => {
        this.execBlock()
      }, 250)
      this.execBlock()
    }
  }

  execBlock(): void {
    // TODO: fix it. move this somewhere
    if (!needExecBlock) {
      return
    }
    needExecBlock = false
    if (!this.rules)
      return
    for (let rule of this.rules) {
      if (!rule.is_disabled) {
        this.applyRule(rule, false, (node: HTMLElement) => {
          hiddenNodeList.add(node)
          this.blockedCount++
          if (!rule.staticXpath) {
            hiddenNodeList.apply(node)
          }
        }, false)
      }
    }
  }

  addBlockCss(xpath: string) {
    if (!this.styleTag) {
      this.styleTag = document.createElement('STYLE') as HTMLStyleElement
      this.styleTag.type = 'text/css'
      document.getElementsByTagName('HEAD')[0].appendChild(this.styleTag)
    }
    this.styleTag.innerHTML = `${this.styleTag.innerHTML}${xpath}{display:none;}`
  }

  applyRule(rule: Rule, ignoreHidden: boolean, onHide: (HTMLElement) => void, isTesting: boolean) {
    let needRefreshBadge = false
    const hideNodes = (rule.hide_block_by_css)
      ? getElementsByCssSelector(rule.hide_block_css)
      : getElementsByXPath(rule.hide_block_xpath)
    let searchNodes: HTMLElement[]
    if ((rule.search_block_by_css && isEmpty(rule.search_block_css))
      || (!rule.search_block_by_css && isEmpty(rule.search_block_xpath))) {
      searchNodes = []
      for (let i = 0; i < hideNodes.length; i++) {
        searchNodes.push(hideNodes[i] as HTMLElement)
      }
    }
    else {
      searchNodes = (rule.block_anyway)
        ? []
        : ((rule.search_block_by_css) ? getElementsByCssSelector(rule.search_block_css) : getElementsByXPath(rule.search_block_xpath))
    }
    for (const node of searchNodes) {
      // Check keywords
      if (node.getAttribute('containsNgWord')) {
        continue
      }
      const foundWord = findWord(node, rule)
      if (foundWord != null) {
        node.containsNgWord = true
        node.setAttribute('containsNgWord', true)
        node.setAttribute('foundWord', `${foundWord.word_id}`)
      }
    }
    for (let i = 0, l = hideNodes.length; i < l; i++) {
      const node = hideNodes[i] as HTMLElement
      if (node.style.display === 'none') {
        continue
      }
      let shouldBeHidden = rule.block_anyway
      let foundChild = null
      if (!shouldBeHidden) {
        foundChild = this.findFlaggedChild(node, searchNodes)
        if (foundChild) {
          shouldBeHidden = true
        }
      }
      if ((ignoreHidden || !node.hideDone) && shouldBeHidden) {
        if (!node.defaultStyles) {
          node.defaultStyles = {
            backgroundColor: node.style.backgroundColor,
            display: node.style.display,
          }
        }
        // TODO: refactore it. This implementation is terrible
        node.hideDone = true
        needRefreshBadge = true
        rule.hiddenCount = (rule.hiddenCount) ? rule.hiddenCount + 1 : 1
        if (foundChild) {
          if (!rule.appliedWordsMap) {
            rule.appliedWordsMap = []
          }
          const wordId = foundChild.getAttribute('foundWord')
          if (wordId) {
            rule.appliedWordsMap[wordId] = (rule.appliedWordsMap[wordId] > 0) ? rule.appliedWordsMap[wordId] + 1 : 1
          }
        }
        // Exec callback
        if (onHide) {
          onHide(node)
        }
      }
      else if (isTesting && node.hideDone && !shouldBeHidden) {
        if (node.defaultStyles) {
          node.style.backgroundColor = node.defaultStyles.backgroundColor
          node.style.display = node.defaultStyles.display
        }
      }
    }
    for (const node of searchNodes) {
      node.containsNgWord = false
    }
    const appliedWords = []
    for (const key in rule.appliedWordsMap) {
      appliedWords.push({ word: key, count: rule.appliedWordsMap[key] })
    }
    rule.appliedWords = appliedWords
    if (needRefreshBadge && this.blockedCount > 0) {
      sendMessageToBackground('badge', { count: this.blockedCount })
      // window.bgCommunicator.sendRequest('badge', { rules, count: this.blockedCount })
    }
  }

  findFlaggedChild(hideNode: HTMLElement, list: HTMLElement[]) {
    for (let i = 0, l = list.length; i < l; i++) {
      if (!list[i].getAttribute('containsNgWord')) {
        continue
      }
      if (this.containsAsChild(hideNode, list[i])) {
        return list[i]
      }
    }
    return null
  }

  containsAsChild(rootNode: HTMLElement, _node: HTMLElement): boolean {
    let node = _node
    while (node) {
      if (node === rootNode)
        return true
      node = <HTMLElement>node.parentNode
    }
    return false
  }
}
