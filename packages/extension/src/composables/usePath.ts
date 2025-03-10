import type { PathBuilder, PathFilter } from '~/services/types'

import {
  getElementsByCssSelector,
  getElementsByXPath,
  isContained,
} from '~/utils/dom-utils'

// Composable for XPathBuilder
export function useXPathBuilder(): PathBuilder {
  const getIdExpression = (elementId: string): string => {
    return `id("${elementId}")`
  }

  const getDescendantSeparator = (): string => {
    return '//'
  }

  const getChildSeparator = (): string => {
    return '/'
  }

  const getMultipleTagNameAndClassNameExpression = (tagName: string, className: string): string => {
    return `${tagName}[contains(concat(" ",normalize-space(@class)," "),"${className}")]`
  }

  const getSingleTagNameAndClassNameExpression = (tagName: string, className: string): string => {
    return `${tagName}[@class="${className}"]`
  }

  const createPathFilter = (_path: string): PathFilter => {
    const path = _path.trim()
    return {
      path,
      elements: getElementsByXPath(path) as HTMLElement[],
    }
  }

  return {
    getIdExpression,
    getDescendantSeparator,
    getChildSeparator,
    getMultipleTagNameAndClassNameExpression,
    getSingleTagNameAndClassNameExpression,
    createPathFilter,
  }
}

// Composable for CssBuilder
export function useCssBuilder(): PathBuilder {
  const getIdExpression = (elementId: string): string => {
    return `#${elementId}`
  }

  const getDescendantSeparator = (): string => {
    return ' '
  }

  const getChildSeparator = (): string => {
    return '>'
  }

  const getMultipleTagNameAndClassNameExpression = (tagName: string, className: string): string => {
    return `${tagName}.${className}`
  }

  const getSingleTagNameAndClassNameExpression = (tagName: string, className: string): string => {
    return `${tagName}.${className}`
  }

  const createPathFilter = (_path: string): PathFilter => {
    const path = _path.trim()
    return {
      path,
      elements: getElementsByCssSelector(path) as HTMLElement[],
    }
  }

  return {
    getIdExpression,
    getDescendantSeparator,
    getChildSeparator,
    getMultipleTagNameAndClassNameExpression,
    getSingleTagNameAndClassNameExpression,
    createPathFilter,
  }
}

// Composable for PathAnalyzer
export function usePathAnalyzer() {
  const SEQ_LIMIT = 2

  const cloneArray = (orig: any[]): any[] => {
    const array = []
    for (let i = 0, l = orig.length; i < l; i++) {
      array[i] = { path: orig[i].path, index: orig[i].index }
    }
    return array
  }

  // Internal function to create a path element
  const createPathElement = (node: any, index: number, builder: PathBuilder) => {
    const classes = (node.className == null || node.className === '')
      ? []
      : node.className.replace(/[ \n]+/g, ' ').split(' ')

    const tagName = node.tagName
    const options: string[] = []

    if ((classes.length > 1 || index === 0) && tagName !== 'BODY') {
      for (let i = 0, l = classes.length; i < l; i++) {
        if (classes[i] === '')
          continue
        const xpath = builder.getMultipleTagNameAndClassNameExpression(tagName, classes[i])
        options.push(xpath)
      }
    }else if (classes.length === 1 && tagName !== 'BODY') {
      const className = classes[0]
      options.push(builder.getSingleTagNameAndClassNameExpression(node.tagName, className))
    }

    if (tagName !== 'DIV' && tagName !== 'UL')
      options.push(tagName)

    return {
      node,
      options,
      isTarget: false,
    }
  }

  const createPathAnalyzer = (
    targetNode: HTMLElement,
    builder: PathBuilder,
    rootNode: HTMLElement | null = null,
    basePath: string | null = null,
  ) => {
    const rootNodeValue = rootNode || document.body
    const basePathValue = basePath || ''

    // Create path list from the DOM hierarchy
    const createPathList = (): PathFilter[] => {
      // Build ancestor list
      const ancestors: ReturnType<typeof createPathElement>[] = []
      let node = targetNode
      let index = 0
     
      while (node) {
        if (rootNodeValue === node)
          break
        ancestors.push(createPathElement(node, index, builder))
        node = node.parentNode as HTMLElement
        index++
      }

      // Mark target
      if (ancestors.length > 0) {
        ancestors[0].isTarget = true
      }

      // Track paths
      const pathList: PathFilter[] = []
      const uniqPathList: string[] = []

      // Add sequence to unique path list
      const addSeq = (seq: any[]): void => {
        let str = ''
        for (let i = 0, l = seq.length; i < l; i++) {
          const next = (i < l - 1) ? seq[i + 1] : null
          const current = seq[i]
          str = current.path + str
          if (current.hasId) {
            // do nothing
          }else if ((next && next.index === current.index + 1) || current.path === 'BODY') {
            str = builder.getChildSeparator() + str
          } else {
            str = builder.getDescendantSeparator() + str
          }
        }

        if (!uniqPathList.includes(str))
          uniqPathList.push(str)
      }

      // Scan the ancestors to build path combinations
      const scan = (index: number, seq: any[]): void => {
        const current = ancestors[index]
        for (let i = 0, l = current.options.length; i < l; i++) {
          const cloneSeq = cloneArray(seq)
          const option = current.options[i]
          cloneSeq.push({ path: option, index })
         
          if (cloneSeq.length < SEQ_LIMIT && ancestors.length > index + 1)
            scan(index + 1, cloneArray(cloneArray(cloneSeq)))
         
          addSeq(cloneSeq)
        }
       
        // Add Nothing
        if (index > 0 && seq.length < SEQ_LIMIT && ancestors.length > index + 1)
          scan(index + 1, cloneArray(seq))
       
        if (rootNodeValue === document.body && current.node.id) {
          const cloneSeq = cloneArray(seq)
          cloneSeq.push({ path: builder.getIdExpression(current.node.id), index, hasId: true })
          addSeq(cloneSeq)
        }
      }

      // Start path generation
      if (ancestors.length > 0)
        scan(0, [])
     
      // Add base path if provided
      if (basePathValue.length > 0) {
        pathList.push(builder.createPathFilter(basePathValue))
      }
     
      // Add all unique paths to pathList
      for (let i = 0, l = uniqPathList.length; i < l; i++) {
        try {
          const path = builder.createPathFilter(basePathValue + uniqPathList[i])
         
          // Exclude nested elements
          let nested = false
          for (let elementIndex = 0; elementIndex < path.elements.length; elementIndex++) {
            const element = path.elements[elementIndex]
            if (element !== targetNode
              && (isContained(targetNode, element as HTMLElement) || isContained(element as HTMLElement, targetNode))) {
              nested = true
            }
          }
         
          if (!nested)
            pathList.push(path)
        } catch (ex) {
          // Silent error
        }
      }

      // Sort paths by element count, then by path length
      pathList.sort((a: PathFilter, b: PathFilter) => {
        return (a.elements.length === b.elements.length)
          ? (a.path.length - b.path.length)
          : (a.elements.length - b.elements.length)
      })

      // Filter to keep only unique element counts
      const result: PathFilter[] = []
      let prevPath = null
     
      for (let i = 0, l = pathList.length; i < l; i++) {
        const path = pathList[i]
        if (!prevPath || prevPath.elements.length !== path.elements.length) {
          result.push(path)
        }
        prevPath = path
      }
     
      return result
    }

    return {
      createPathList,
    }
  }

  return {
    createPathAnalyzer,
  }
}