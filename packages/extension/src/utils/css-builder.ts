import type { PathBuilder, PathFilter } from '~/services/types'
import { getElementsByCssSelector } from './dom-utils'
import { trim } from './string-utils'

export class CssBuilder implements PathBuilder {
  getIdExpression(elementId: string): string {
    return `#${elementId}`
  }

  getDescendantSeparator(): string {
    return ' '
  }

  getChildSeparator(): string {
    return '>'
  }

  getMultipleTagNameAndClassNameExpression(tagName: string, className: string): string {
    return `${tagName}.${className}`
  }

  getSingleTagNameAndClassNameExpression(tagName: string, className: string): string {
    return `${tagName}.${className}`
  }

  createPathFilter(_path: string): PathFilter {
    const path = trim(_path)
    return new CssPathFilter(path)
  }
}

// TODO interface
export class CssPathFilter implements PathFilter {
  path: string
  elements: HTMLElement[]
  constructor(path: string) {
    this.path = path
    this.elements = getElementsByCssSelector(path)
  }
}
