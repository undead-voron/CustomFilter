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
    let node: Node | null
    while (node = result.iterateNext()) {
      list.push(node as Element)
    }
  }
  catch (ex) {
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

/**
 * Gets elements by XPath relative to a target node
 */
export function getRelativeElementsByXPath(targetNode: HTMLElement, xpath: string): Element[] {
  const list: Element[] = []
  try {
    const result = document.evaluate(xpath, targetNode, null, XPathResult.ANY_TYPE, null)
    let node: Node | null
    while (node = result.iterateNext()) {
      list.push(node as Element)
    }
  }
  catch (e) {
    console.log(e)
  }
  return list
}

/**
 * Checks if a target node is contained in an ancestor node
 */
export function isContained(targetNode: HTMLElement, ancestorNode: HTMLElement): boolean {
  if (!ancestorNode || !targetNode)
    return false
  let node: HTMLElement | null = targetNode
  while (node && document.body !== node) {
    if (node === ancestorNode)
      return true
    node = node.parentNode as HTMLElement
  }
  return false
}

/**
 * Gets the common ancestor of multiple elements
 */
export function getCommonAncestor(elements: HTMLElement[]): HTMLElement {
  if (!elements || elements.length === 0)
    return document.body
  if (elements.length === 1)
    return elements[0].parentNode as HTMLElement

  let ancestor = elements[0].parentNode
  for (let i = 1; i < elements.length && ancestor !== document.body; i++) {
    let node = elements[i].parentNode
    while (node !== document.body) {
      let found = false
      let parent = ancestor
      while (parent !== document.body) {
        if (parent === node) {
          found = true
          break
        }
        parent = parent?.parentNode
      }
      if (found)
        break
      node = node?.parentNode
    }
    ancestor = node
  }
  return ancestor as HTMLElement
}

/**
 * Clears all child elements from a parent element
 */
export function clearChildren(element: HTMLElement): void {
  while (element.childNodes.length > 0) {
    element.removeChild(element.childNodes[0])
  }
}

/**
 * Gets siblings that are similar to the given element
 */
export function getSimilarSiblings(element: HTMLElement): HTMLElement[] {
  const tagName = element.tagName
  if (!element.parentNode)
    return []

  const siblings: HTMLElement[] = []
  const children = element.parentNode.childNodes
  for (let i = 0; i < children.length; i++) {
    const node = children[i] as HTMLElement
    if (node.tagName === tagName && node !== element) {
      siblings.push(node)
    }
  }
  return siblings
}

/**
 * Gets elements that are contained in ancestor elements
 */
export function getContainedElements(ancestorElements: HTMLElement[], elements: HTMLElement[]): HTMLElement[] {
  const containedElements: HTMLElement[] = []
  for (const element of elements) {
    for (const ancestor of ancestorElements) {
      if (isContained(element, ancestor)) {
        containedElements.push(element)
        break
      }
    }
  }
  return containedElements
}

