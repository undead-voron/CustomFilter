import { InjectableService } from 'deco-ext'

abstract class StyleProcessor {
  abstract attribute: string
  abstract attributeJs: string
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
    if (!this.originalNodeStylesContainer.has(node)) {
      return
    }
    node.style[this.attributeJs] = this.originalNodeStylesContainer.get(node)
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
  attributeJs = 'display'
  value = 'none'
}

@InjectableService()
export class TestNodes extends StyleProcessor {
  attribute = 'background-color'
  attributeJs = 'backgroundColor'
  value = '#888'
}
