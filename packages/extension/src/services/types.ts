export interface Word {
  word_id: number
  rule_id: number
  word: string
  newWord: Word
  // Flags

  is_regexp: boolean
  is_complete_matching: boolean
  is_case_sensitive: boolean
  is_include_href: boolean

  // Copied from legacy DbObj
  dirty: boolean
  isNew: boolean
  deleted: boolean
  insert_date: number
  update_date: number
  delete_date: number

  // Compiled and cached
  regExp: RegExp

  // TODO move to wrapper
  checkedNodes: Element[]
  label: string
}
export interface WordGroup {
  name: string
  words: Word[]
  updaterId: string
  global_identifier: string
}
export interface Rule {
  // Copied from legacy DbObj
  dirty: boolean
  isNew: boolean
  deleted: boolean
  insert_date: number
  update_date: number
  delete_date: number
  updaterId: string

  // Copied from legacy Rule
  words: Word[]
  wordGroups: WordGroup[]

  // TODO move to wrapper class!
  hideNodes: HTMLElement[]
  searchNodes: HTMLElement[]
  hiddenCount: number
  staticXpath: any // TODO What's this?

  appliedWords: any[]
  appliedWordsMap: object
  is_disabled: boolean

  rule_id: number // Primary key
  user_identifier: string
  global_identifier: string
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
  existing: boolean // TODO for import/export
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

