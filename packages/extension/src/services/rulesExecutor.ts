import type { Rule, Word } from './types'
import { InjectableService, sendMessageToBackground } from 'deco-ext'
import { eachWords, findWord, getElementsByCssSelector, getElementsByXPath, isEmpty, xpathToCss, getXPathCssSelector } from '~/utils'
import RulesService from './storage'
import { HiddenNodes } from './stylesController'

@InjectableService()
export default class RulesExecutor {
  rules: Rule[] = []
  blockedCount = 0
  styleTag?: HTMLStyleElement
  needExecBlock: boolean = true
  blockInterval?: number
  blockedNodesByRuleCount = new Map<Rule, number>()

  constructor(public hiddenNodesList: HiddenNodes, public rulesService: RulesService ) { }

  async init() {
    this.rules = await sendMessageToBackground('getRulesByURL', { url: location.href })
    this.startBlocking()
    this.rulesService.addRulesUpdateListener(async () => {
      // react to rules change (independent from source of change) and re-start blocking
      this.revert()
      this.rules = await this.rulesService.getRulesByUrl(location.href)
      this.startBlocking()
    })
  }

  

  stopBlocking() {
    clearInterval(this.blockInterval)
    return this
  }

  clearRules() {
    this.rules = []
    return this
  }

  revert() {
    this
      .stopBlocking()
      .clearRules()
      .removeBlockCss()
      .hiddenNodesList
        .revertAll()

    return this
  }

  startBlocking() {
    console.log('start blocking', this.rules)
    for (const rule of this.rules) {
      const cssSelector = getXPathCssSelector(rule)
      if (cssSelector) {
        this.addBlockCss(cssSelector)
      }
      // Set labels for tooltips in pop-up window
      // for (const word of rule.words) {
      //   word.label = String(word.word)
      // }
      // // TODO: add word groups later
      // for (const group of rule.wordGroups) {
      //   for (const word of group.words) {
      //     word.label = `${String(group.name)}>${String(word.word)}`
      //   }
      // }
      // let wordIdIncr = 0
      // // this stuff mutates words. TODO: refactore it
      // eachWords(rule, (word: Word) => {
      //   word.word_id = wordIdIncr++
      //   // this stuff mutates words. TODO: refactore it
      //   if (word.is_regexp) {
      //     try {
      //       if (word.is_complete_matching) {
      //         // Append "^" and "$"
      //         let expression = (word.text.charAt(0) !== '^') ? '^' : ''
      //         expression += word.text
      //         expression += ((word.text.charAt(word.text.length - 1) !== '$') ? '$' : '')
      //         if (word.is_case_sensitive) {
      //           word.regExp = new RegExp(expression)
      //         }
      //         else {
      //           word.regExp = new RegExp(expression, 'i')
      //         }
      //       }
      //       else {
      //         if (word.is_case_sensitive) {
      //           word.regExp = new RegExp(word.word)
      //         }
      //         else {
      //           word.regExp = new RegExp(word.word, 'i')
      //         }
      //       }
      //     }
      //     catch (ex) {
      //       console.log(`Invalid RegExp: "${word.word}"`)
      //     }
      //   }
      // })
    }
    let needBlocking = false
    for (const rule of this.rules) {
      if (!rule.is_disabled)
        needBlocking = true
    }
    console.log('checking blocking', needBlocking, this.rules)
    // TODO: consider removing this condition. I see no point in it. Just execute the block itself
    if (needBlocking) {
      this.blockInterval = setInterval(() => {
        this.executeHideRules()
      }, 250)
    }
    return this
  }

  addBlockCss(xpath: string) {
    if (!this.styleTag) {
      this.styleTag = document.createElement('STYLE') as HTMLStyleElement
      this.styleTag.type = 'text/css'
      document.getElementsByTagName('HEAD')[0].appendChild(this.styleTag)
    }
    this.styleTag.innerHTML = `${this.styleTag.innerHTML}${xpath}{display:none;}`
  }

  removeBlockCss() {
    if (this.styleTag) {
      this.styleTag.innerHTML = ''
    }
    return this
  }

  getNodesForRule(rule: Rule) {
    const blockingNodes = ((rule.hide_block_by_css)
      ? getElementsByCssSelector(rule.hide_block_css)
      : getElementsByXPath(rule.hide_block_xpath)) as HTMLElement[]

    const containerNodes = blockingNodes.filter((node): boolean => {
      // filter out hidden nodes
      return node.style.display !== 'none'
    })

    const isValidCssSearchBlock = (rule.search_block_by_css && isEmpty(rule.search_block_css))
    const isValidXPathSearchBlock = (!rule.search_block_by_css && isEmpty(rule.search_block_xpath))
    const isValidSearchBlock = (isValidCssSearchBlock || isValidXPathSearchBlock)

    let searchNodes: HTMLElement[]

    if (isValidSearchBlock) {
      searchNodes = [...containerNodes]
    } else {
      searchNodes = (rule.block_anyway)
        ? []
        : ((rule.search_block_by_css) ? getElementsByCssSelector(rule.search_block_css) : getElementsByXPath(rule.search_block_xpath)) as HTMLElement[]
    }

    const searchNodesWithKeyword = searchNodes.filter((node): boolean => !!findWord(node, rule))

    return containerNodes.filter((node): boolean => rule.block_anyway || searchNodesWithKeyword.some(searchNode => node.contains(searchNode) || searchNode === node))
  }

  executeRule(rule: Rule) {
    if (rule.is_disabled) {
      return
    }
    const nodesToHide = this.getNodesForRule(rule)
    for (const node of nodesToHide) {
      if (!getXPathCssSelector(rule)) {
        this.hiddenNodesList.apply(node)
      }
    }
  }
  executeHideRules() {
    this.hiddenNodesList.clearDetachedNodes()
    for (const rule of this.rules) {
      if (!rule.is_disabled) {
        this.executeRule(rule)
      }
    }
  }

  applyRule(rule: Rule, ignoreHidden: boolean, onHide: (el: HTMLElement) => void, isTesting: boolean) {
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
        : ((rule.search_block_by_css) ? getElementsByCssSelector(rule.search_block_css) : getElementsByXPath(rule.search_block_xpath)) as HTMLElement[]
    }
    for (const node of searchNodes) {
      // Check keywords
      if (node.getAttribute('containsNgWord')) {
        continue
      }
      const foundWord = findWord(node, rule)
      if (foundWord) {
        node.containsNgWord = true
        node.setAttribute('containsNgWord', 'true')
        node.setAttribute('foundWord', `${foundWord.word_id}`)
      }
    }
    // console.log('hide nodes', hideNodes)
    for (let i = 0, l = hideNodes.length; i < l; i++) {
      const node = hideNodes[i] as HTMLElement
      if (node.style.display === 'none') {
        continue
      }
      let shouldBeHidden = rule.block_anyway
      let foundChild = null
      console.log('some filtering here')
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
      node = node.parentNode
    }
    return false
  }
}
