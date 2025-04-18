/**
 * DOM utility functions
 */

// Constants
const REGEX_DOUBLE_SLASH = /\/\//g
const REGEX_SLASH = /\//g
const REGEX_SINGLE_CLASS_NAME = /\[@class=['"](.+?)['"]\]/g
const REGEX_MULTIPLE_CLASS_NAME = /\[contains\(concat\(['"] ['"],normalize-space\(@class\),['"] ['"]\]\),['"](.+?)['"]\]\)/g
const REGEX_ID = /id\(['"](.+?)['"]\]/g
const REGEX_FAIL = /.*[[\]()"'].*/

/**
 * Gets elements by XPath
 */
export function getElementsByXPath(xpath: string): Element[] {
  const list: Element[] = []
  try {
    const result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null)
    for (
      // set next node on first iteration
      let node = result.iterateNext();
      // check that node exists
      node;
      // set next node
      node = result.iterateNext()
    ) {
      list.push(node as Element)
    }
  }
  catch (ex) {
    // eslint-disable-next-line no-console
    console.log(ex)
  }
  return list
}

/**
 * Gets elements by CSS selector
 */
export function getElementsByCssSelector(selector: string): Element[] {
  try {
    const list = document.querySelectorAll(selector)
    return list ? Array.from(list) : []
  }
  catch (ex) {
    return []
  }
}

/**
 * Converts XPath to CSS selector
 */
export function xpathToCss(str: string): string | null {
  let xpath = str
  xpath = xpath.replace(REGEX_ID, '#$1')
  xpath = xpath.replace(REGEX_SINGLE_CLASS_NAME, '.$1')
  xpath = xpath.replace(REGEX_MULTIPLE_CLASS_NAME, '.$1')
  xpath = xpath.replace(REGEX_DOUBLE_SLASH, ' ')
  xpath = xpath.replace(REGEX_SLASH, '>')
  if (REGEX_FAIL.test(xpath))
    return null
  return xpath
}
