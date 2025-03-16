import type { Rule } from '~/types'
import { InjectableService, sendMessageToBackground } from 'deco-ext'
import ExtensionStateService from '~/services/extensionState'
import RulesService from '~/services/storage'
import { findWord, getElementsByCssSelector, getElementsByXPath, getXPathCssSelector } from '~/utils'
import { HiddenNodes } from './stylesController'

function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
  let inThrottle = false
  let shouldExecute = false

  const throttled = ((...args: any[]) => {
    if (!inThrottle) {
      inThrottle = true
      shouldExecute = false
      func(...args)
      setTimeout(() => {
        inThrottle = false
        if (shouldExecute) {
          throttled()
        }
      }, limit)
    } else {
      shouldExecute = true
    }
  }) as T
  return throttled
}

@InjectableService()
export default class RulesExecutor {
  rules: Rule[] = []
  blockedCount = 0
  styleTag?: HTMLStyleElement
  needExecBlock: boolean = true
  mutationObserver?: MutationObserver
  rulesUrl?: string
  throttledExecuteHideRules: () => void = throttle(() => {
    this.executeHideRules()
  }, 250)

  blockedNodesByRuleCount = new Map<Rule, number>()

  constructor(
    public hiddenNodesList: HiddenNodes,
    public rulesService: RulesService,
    public extensionState: ExtensionStateService
  ) { }

  async init() {
    this.rules = await sendMessageToBackground('getRulesByURL', { url: location.href })
    this.startBlocking()
    this.rulesService.addRulesUpdateListener(async () => {
      // react to rules change (independent from source of change) and re-start blocking
      await this.updateRules()
    })
    this.extensionState.addStateUpdateListener(async () => {
      this.revert()
      if (!this.extensionState.isDisabled) {
        this.rules = await this.rulesService.getRulesByUrl(location.href)
        this.startBlocking()
      }
    })
  }

  async updateRules() {
    const url = location.href
    const rules = await this.rulesService.getRulesByUrl(url)
    this.revert()
    this.rules = rules
    this.rulesUrl = url

    this.startBlocking()
  }

  stopBlocking() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
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

    sendMessageToBackground('badge', { count: this.hiddenNodesList.getNodeCount() })

    return this
  }

  startBlocking() {
    if (this.extensionState.isDisabled) {
      return
    }
    console.log('start blocking', this.rules)
    for (const rule of this.rules) {
      const cssSelector = getXPathCssSelector(rule)
      if (cssSelector) {
        this.addBlockCss(cssSelector)
      }
    }
    let needBlocking = false
    for (const rule of this.rules) {
      if (!rule.is_disabled)
        needBlocking = true
    }
    // TODO: consider removing this condition. I see no point in it. Just execute the block itself
    if (needBlocking) {
      // Execute hide rules immediately once
      this.executeHideRules()
    }
    // Set up MutationObserver to watch for DOM changes
    this.mutationObserver = this.mutationObserver || new MutationObserver(this.throttledExecuteHideRules);
    try {
      // disconnect existing observer just in case
      this.mutationObserver.disconnect()
    } catch (e) {
      // ignore
    }

    // Start observing the document with configured parameters
    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    })
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

  getAllNodesForRule(rule: Rule) {
    const containerNodes = ((rule.hide_block_by_css)
      ? getElementsByCssSelector(rule.hide_block_css)
      : getElementsByXPath(rule.hide_block_xpath)) as HTMLElement[]

    const isValidCssSearchBlock = (rule.search_block_by_css && !rule.search_block_css)
    const isValidXPathSearchBlock = (!rule.search_block_by_css && !rule.search_block_xpath)
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

  getNodesForRule(rule: Rule) {
    return this.getAllNodesForRule(rule).filter((node): boolean => node.style.display !== 'none')
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
    if (this.extensionState.isDisabled) {
      return
    }
    if (this.rulesUrl !== location.href) {
      this.updateRules()
    }
    this.hiddenNodesList.clearDetachedNodes()
    for (const rule of this.rules) {
      if (!rule.is_disabled) {
        this.executeRule(rule)
      }
    }
    if (this.hiddenNodesList.getNodeCount() > 0) {
      sendMessageToBackground('badge', { count: this.hiddenNodesList.getNodeCount() })
    }
  }
}
