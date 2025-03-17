import type { PathBuilder, PathFilter } from '~/types'
import { useCssBuilder } from '~/composables/usePath'

export class CssBuilder implements PathBuilder {
  private builder: ReturnType<typeof useCssBuilder>

  constructor() {
    this.builder = useCssBuilder()
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

// TODO interface
export class CssPathFilter implements PathFilter {
  path: string
  elements: HTMLElement[]

  constructor(path: string) {
    const filter = useCssBuilder().createPathFilter(path)
    this.path = filter.path
    this.elements = filter.elements as HTMLElement[]
  }
}
