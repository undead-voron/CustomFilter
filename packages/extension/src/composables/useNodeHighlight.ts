import { computed, onBeforeUnmount, readonly, ref } from 'vue'
import { useCssBuilder, usePathAnalyzer, useXPathBuilder } from '~/composables/usePath'

function canProcessElement (element: Element | null | undefined) {
  return !!element && element !== document.body && element !== document.documentElement && document.contains(element);
}
class LinksController {
  elements = new Map<Element, string>()

  disableHrefForElement(element: Element) {
    for (const processedElement of this.elements.keys()) {
      const willBeHidden = processedElement.contains(element) || processedElement === element || element.contains(processedElement)
      if (!willBeHidden) {
        this.restoreElement(processedElement)
      }
    }
    for (let elementToProcess: Element | null | undefined = element; canProcessElement(elementToProcess); elementToProcess = elementToProcess?.parentElement) {
      if (elementToProcess) {
        this.add(elementToProcess)
      }
    }
  }

  add(element: Element) {
    if (element.getAttribute('href') && !this.elements.has(element)) {
      this.elements.set(element, element.getAttribute('href') || '')
      element.href = 'javascript:void(0)'
    }
  }

  restoreElement(element: Element) {
    const originalHref = this.elements.get(element)
    if (originalHref) {
      element.setAttribute('href', originalHref)
      element.href = originalHref
      this.elements.delete(element)
    }
  }

  restoreAll() {
    this.elements.forEach((originalHref, element) => {
      element.setAttribute('href', originalHref)
      element.href = originalHref
    })
    this.elements.clear()
  }
}

export function useNodeHighlight(isXPath: boolean) {
  const selectedElement = ref<HTMLElement | undefined>()
  const originalOutlineStyle = ref<string | undefined>()
  const originalHref = ref<string | null>(null)
  const { createPathAnalyzer } = usePathAnalyzer()

  const linksController = new LinksController()

  const unhighlightNode = () => {
    if (selectedElement.value) {
      selectedElement.value.style.outline = originalOutlineStyle.value || ''
    }
    selectedElement.value = undefined
  }

  const highlightNode = (node: HTMLElement) => {
    unhighlightNode()
    selectedElement.value = node
    originalOutlineStyle.value = node.style.outline
    linksController.disableHrefForElement(node)
    node.style.outline = '2px dashed #2fb947'
  }

  onBeforeUnmount(() => {
    unhighlightNode()
    linksController.restoreAll()
  })

  const paths = computed(() => {
    if (!selectedElement.value)
      return []
    const builder = isXPath ? useXPathBuilder() : useCssBuilder()
    const analyzer = createPathAnalyzer(selectedElement.value, builder)
    return analyzer.createPathList()
  })

  return {
    highlightNode,
    unhighlightNode,
    selectedElement: readonly(selectedElement),
    paths,
  }
}
