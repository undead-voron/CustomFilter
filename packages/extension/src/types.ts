export interface Word {
  text: string

  // Flags
  is_regexp: boolean
  is_complete_matching: boolean
  is_case_sensitive: boolean
  is_include_href: boolean
}
export interface WordGroup {
  name: string
  words: Word[]
  // updaterId: string
  global_identifier: string
}
interface BaseRule {
  // Copied from legacy Rule
  words: Word[]

  is_disabled: boolean

  rule_id: number
  title: string
  url: string
  site_regexp: string
  example_url: string

  search_block_css: string
  search_block_xpath: string
  search_block_by_css: boolean

  hide_block_css: string
  hide_block_xpath: string
  hide_block_by_css: boolean

  block_anyway: boolean
  specify_url_by_regexp: boolean
}

export interface Rule extends BaseRule {
  wordGroups: WordGroup[]
}
export interface PureRule extends BaseRule {
  wordGroups: string[]
}
export interface PathFilter {
  path: string
  elements: HTMLElement[]
}
export interface PathBuilder {
  getIdExpression: (elementId: string) => string
  getDescendantSeparator: () => string
  getChildSeparator: () => string
  getMultipleTagNameAndClassNameExpression: (tagName: string, className: string) => string
  getSingleTagNameAndClassNameExpression: (tagName: string, className: string) => string
  createPathFilter: (_path: string) => PathFilter
}
export interface RuleValidation {
  title: string
  site_regexp: string
  search_block_xpath: string
  hide_block_xpath: string

  example_url?: string
  site_description?: string
  search_block_css?: string
  search_block_description?: string
  hide_block_css?: string
  hide_block_description?: string
}
