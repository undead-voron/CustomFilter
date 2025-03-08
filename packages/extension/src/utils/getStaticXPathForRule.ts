import type { Rule } from '~/services/types'
import { xpathToCss } from './dom-utils'

export function getXPathCssSelector(rule: Rule): string | false {
  if (rule.block_anyway && !rule.is_disabled) {
    const cssSelector = (rule.hide_block_by_css)
      ? rule.hide_block_css
      : xpathToCss(rule.hide_block_xpath)
    if (cssSelector) {
      return cssSelector
    }
  }
  return false
}
