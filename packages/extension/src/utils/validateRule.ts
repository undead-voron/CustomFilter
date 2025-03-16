import { Rule } from '~/services/types'
import { getElementsByXPath } from './dom-utils'

export function isRuleValid(rule: Rule): string[] {
  const errors: string[] = []
  if (!rule.title) {
    errors.push('Title can\'t be empty')
  }
  if (!rule.site_regexp)
    errors.push('Site RegEx can\'t be empty')
  if (rule.search_block_xpath) {
    try {
      getElementsByXPath(rule.search_block_xpath)
    }
    catch (e) {
      errors.push('XPath for "Elements to Hide" is invalid')
    }
  }
  if (rule.hide_block_xpath !== '') {
    try {
      getElementsByXPath(rule.hide_block_xpath)
    }
    catch (e) {
      errors.push('XPath for "Search Region" is invalid')
    }
  }
  // check that keywords exists if not block_anyway
  if (!rule.block_anyway && !rule.words.length) {
    errors.push('Keywords can\'t be empty if "Filter with Keywords" is checked')
  }
  return errors
}
