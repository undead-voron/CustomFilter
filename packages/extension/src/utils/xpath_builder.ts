import type { PathBuilder, PathFilter } from '~/services/types'
import { getElementsByXPath } from './dom-utils'
import { trim } from './string-utils'

export class XPathBuilder implements PathBuilder {
  getIdExpression(elementId: string): string {
    return `id("${elementId}")`
  }

  getDescendantSeparator(): string {
    return '//'
  }

  getChildSeparator(): string {
    return '/'
  }

  getMultipleTagNameAndClassNameExpression(tagName: string, className: string): string {
    return `${tagName
    }[contains(concat(" ",normalize-space(@class)," "),"${className
    }")]`
  }

  getSingleTagNameAndClassNameExpression(tagName: string, className: string) {
    return `${tagName}[@class="${className}"]`
  }

  createPathFilter(_path): PathFilter {
    const path = trim(_path)
    return new XpathPathFilter(path)
  }
}

export class XpathPathFilter implements PathFilter {
  path: string
  elements: HTMLElement[]
  constructor(path: string) {
    this.path = path
    this.elements = getElementsByXPath(path)
  }
}
