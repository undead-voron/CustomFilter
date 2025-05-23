import { InjectableService } from 'deco-ext'

type AllowedAttributeJs = keyof Omit<CSSStyleDeclaration, 'length' | 'toString' | 'toLocaleString' | 'item' | 'getPropertyValue' | 'setProperty' | 'getPropertyPriority' | 'removeProperty' | 'getPropertyCSSValue' | 'parentRule'> & string

abstract class StyleProcessor {
  abstract attribute: string
  abstract attributeJs: AllowedAttributeJs
  abstract value: string
  private originalNodeStylesContainer = new Map<HTMLElement, string>()

  apply(node: HTMLElement) {
    if (this.originalNodeStylesContainer.has(node)) {
      return
    }
    this.originalNodeStylesContainer.set(node, getComputedStyle(node, null).getPropertyValue(this.attribute))
    node.style[this.attributeJs] = this.value
  }

  revert(node: HTMLElement) {
    const originalValue = this.originalNodeStylesContainer.get(node)
    if (!originalValue) {
      return
    }
    node.style[this.attributeJs] = originalValue
    this.originalNodeStylesContainer.delete(node)
  }

  revertAll() {
    for (const node of this.originalNodeStylesContainer.keys()) {
      this.revert(node)
    }
  }

  clearDetachedNodes() {
    for (const node of this.originalNodeStylesContainer.keys()) {
      if (!document.contains(node)) {
        this.revert(node)
      }
    }
  }

  hasNode(node: HTMLElement) {
    return this.originalNodeStylesContainer.has(node)
  }

  getNodeCount() {
    return this.originalNodeStylesContainer.size
  }
}

@InjectableService()
export class HiddenNodes extends StyleProcessor {
  attribute = 'display'
  attributeJs: AllowedAttributeJs = 'display'
  value = 'none'
}

@InjectableService()
export class TestNodes extends StyleProcessor {
  attribute = 'background-color'
  attributeJs: AllowedAttributeJs  = 'backgroundColor'
  value = '#888'
}

@InjectableService()
export class HighlighteNodesForSearching extends StyleProcessor {
  attribute = 'outline'
  attributeJs: AllowedAttributeJs  = 'outline'
  value = 'solid 1px #0db3ea'
}

@InjectableService()
export class HighlighteNodesForHiding extends StyleProcessor {
  attribute = 'outline'
  attributeJs: AllowedAttributeJs = 'outline'
  value = 'solid 1px #0db3ea'
}

@InjectableService()
export class BackgroundChangeNodesForHiding extends StyleProcessor {
  attribute = 'background'
  attributeJs: AllowedAttributeJs = 'background'
  value = '#bbb'
}