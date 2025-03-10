import { computed, onBeforeUnmount, readonly, ref } from 'vue'
import { useCssBuilder, usePathAnalyzer, useXPathBuilder } from '~/composables/usePath'

export function useNodeHighlight(isXPath: boolean) {
  const selectedElement = ref<HTMLElement | undefined>()
  const originalOutlineStyle = ref<string | undefined>()
  const originalHref = ref<string | null>(null)
  const { createPathAnalyzer } = usePathAnalyzer()

  const unhighlightNode = () => {
    if (selectedElement.value) {
      selectedElement.value.style.outline = originalOutlineStyle.value || ''
      selectedElement.value.href = originalHref.value || ''
    }
    selectedElement.value = undefined
  }

  const highlightNode = (node: HTMLElement) => {
    unhighlightNode()
    selectedElement.value = node
    originalOutlineStyle.value = node.style.outline
    originalHref.value = node.getAttribute('href')
    selectedElement.value.href = 'javascript:void(0)'
    node.style.outline = '2px dashed #2fb947'
  }

  onBeforeUnmount(() => {
    unhighlightNode()
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
