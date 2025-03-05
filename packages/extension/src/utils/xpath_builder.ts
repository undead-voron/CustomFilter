import type { PathBuilder, PathFilter } from '~/services/types'
import { useXPathBuilder } from '~/composables/usePath'

export class XPathBuilder implements PathBuilder {
  private builder: ReturnType<typeof useXPathBuilder>

  constructor() {
    this.builder = useXPathBuilder()
  }

  getIdExpression(elementId: string): string {
    return this.builder.getIdExpression(elementId)
  }

  getDescendantSeparator(): string {
    return this.builder.getDescendantSeparator()
  }

  getChildSeparator(): string {
    return this.builder.getChildSeparator()
  }

  getMultipleTagNameAndClassNameExpression(tagName: string, className: string): string {
    return this.builder.getMultipleTagNameAndClassNameExpression(tagName, className)
  }

  getSingleTagNameAndClassNameExpression(tagName: string, className: string): string {
    return this.builder.getSingleTagNameAndClassNameExpression(tagName, className)
  }

  createPathFilter(_path: string): PathFilter {
    return this.builder.createPathFilter(_path)
  }
}

export class XpathPathFilter implements PathFilter {
  path: string
  elements: HTMLElement[]

  constructor(path: string) {
    const filter = useXPathBuilder().createPathFilter(path)
    this.path = filter.path
    this.elements = filter.elements as HTMLElement[]
  }
}

