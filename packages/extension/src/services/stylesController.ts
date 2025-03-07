import { InjectableService } from 'deco-ext'
import { arrayContains } from '~/utils'

abstract class StyleProcessor {
  abstract attribute: string
  abstract attributeJs: string
  abstract value: string
  nodes: NodeContainer[] = [] // TODO rename it. It's confusing!

  add(node: HTMLElement) {
    // Ignore duplicate node
    if (arrayContains(this.nodes, node)) {
      return
    }
    let origValue = getComputedStyle(node, null).getPropertyValue(this.attribute)
    this.nodes.push({ node, origValue })
  }

  apply(node: HTMLElement) {
    node.style[this.attributeJs] = this.value
  }

  applyStyles() {
    for (let i = 0, l = this.nodes.length; i < l; i++) {
      this.nodes[i].node.style[this.attributeJs] = this.value
    }
  }

  restoreStyles() {
    for (let i = 0, l = this.nodes.length; i < l; i++) {
      this.nodes[i].node.style[this.attributeJs] = this.nodes[i].origValue
    }
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
