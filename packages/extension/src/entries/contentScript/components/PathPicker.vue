<template>
  <div v-if="isVisible" avoidStyle class="absolute z-max shadow-sm bg-white" ref="container"
    :style="{ top: `${listPosition.top}px`, left: `${listPosition.left}px` }">
    <ul class="path-list" avoidStyle>
      <li v-if="hasParentNode" class="upper" avoidStyle>
        <a avoidStyle class="text-[10px]" @click.prevent="parentNodeEventHandlers?.clickHandler"
          @mouseover="parentNodeEventHandlers?.mouseoverHandler" @mouseout="parentNodeEventHandlers?.mouseoutHandler">
          Select parent element
        </a>
      </li>
      <li v-for="(path, index) in menuListRef" :key="index" avoidStyle>
        <a href="#" avoidStyle @click.prevent="selectPath(path)" @mouseover="previewPath(path)"
          @mouseout="clearPreview">
          <span avoidStyle class="badge bg-brand-blue text-white">{{ path.elements.length }}</span>
          <span avoidStyle class="xpath">{{ path.path.trim() }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted, watch, onBeforeUnmount } from 'vue'
import { useNodeHighlight } from '~/composables/useNodeHighlight'
import { usePathPickerDialogPosition } from '~/composables/usePathPickerDialog'

const { show, dialogPosition, menuListRef, hasParentNode } = usePathPickerDialogPosition()

// shift list position to the right in order to avoid overlapping with selected element
const listPosition = computed(() => {
  return {
    top: dialogPosition.value.top,
    left: dialogPosition.value.left + 5,
  }
})

const props = defineProps<{
  targetType: string
}>()

// const selectedElement = ref<HTMLElement | null>(null)
const { highlightNode, unhighlightNode, selectedElement, paths } = useNodeHighlight(props.targetType.endsWith('xpath'))
const pathPickerHandlers = ref<{ element: HTMLElement, handlers: any[] }[]>([])

const shadowRoot = inject('shadowRoot') as HTMLElement

const emit = defineEmits<{
  (e: 'path-selected', data: { target: string, path: string }): void
  (e: 'element-selected', element: HTMLElement): void
  (e: 'close'): void
}>()

const isVisible = ref(false)
const container = ref<HTMLElement | null>(null)
const parentNodeEventHandlers = ref<{
  mouseoverHandler: (event: MouseEvent) => void,
  mouseoutHandler: (event: MouseEvent) => void,
  clickHandler: (event: MouseEvent) => void,
} | null>(null)


const selectPath = (path: any) => {
  emit('path-selected', {
    target: props.targetType,
    path: path.path.trim()
  })
  close()
}

const highlightHideElements = inject('highlightHideElements') as (el?: HTMLElement[]) => void
const highlightSearchElements = inject('highlightSearchElements') as (el?: HTMLElement[]) => void

const previewPath = (path: any) => {
  const isHide = props.targetType.startsWith('hide')
  const elements = path.elements
  if (isHide) {
    highlightHideElements(elements)
  } else {
    highlightSearchElements(elements)
  }
}

const clearPreview = () => {
  highlightHideElements()
  highlightSearchElements()
}

const close = () => {
  isVisible.value = false
  clearPreview()
  emit('close')
}

const buildMouseEventsHandlers = (node: HTMLElement, originalClickEvent?: MouseEvent) => {
  function mouseoutHandler(event: MouseEvent) {
    event.stopPropagation()
    event.preventDefault()
    unhighlightNode()
  }
  return {
    mouseoverHandler: (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      highlightNode(node)
    },
    mouseoutHandler: mouseoutHandler,
    clickHandler: (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      if (selectedElement.value === node) {
        isVisible.value = true
        show(originalClickEvent || event, node, paths.value)
        if (hasParentNode.value) {
          const { mouseoverHandler, mouseoutHandler: parentMouseoutHandler, clickHandler } = buildMouseEventsHandlers(node.parentNode as HTMLElement, originalClickEvent || event)
          parentNodeEventHandlers.value = {
            mouseoverHandler,
            mouseoutHandler: parentMouseoutHandler,
            clickHandler: (event: MouseEvent) => {
              clickHandler(event);
              parentNodeEventHandlers.value?.mouseoverHandler(event);
            }
          }
        } else {
          parentNodeEventHandlers.value = null
        }
      }
    }
  }
}
const setupPathPickerHandlers = () => {
  const nodes = document.body.getElementsByTagName('*')
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i] as HTMLElement
    if (node.getAttribute('avoidStyle')) continue

    const { mouseoverHandler, mouseoutHandler, clickHandler } = buildMouseEventsHandlers(node)

    node.addEventListener('mouseover', mouseoverHandler)
    node.addEventListener('mouseout', mouseoutHandler)
    node.addEventListener('click', clickHandler)

    pathPickerHandlers.value.push({
      element: node,
      handlers: [
        { type: 'mouseover', fn: mouseoverHandler },
        { type: 'mouseout', fn: mouseoutHandler },
        { type: 'click', fn: clickHandler }
      ]
    })
  }
}

watch(container, (newVal) => {
  if (newVal) {
    newVal.parentNode?.removeChild(newVal)
    shadowRoot.appendChild(newVal)
  }
})

const removePathPickerHandlers = () => {
  pathPickerHandlers.value.forEach(({ element, handlers }) => {
    handlers.forEach(handler => {
      element.removeEventListener(handler.type, handler.fn)
    })
  })
  pathPickerHandlers.value = []
}


onMounted(() => {
  setupPathPickerHandlers()
})

onBeforeUnmount(() => {
  if (container.value) {
    shadowRoot.removeChild(container.value)
  }
  removePathPickerHandlers()
})
</script>

<style scoped>
.path-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.path-picker-header button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 0 4px;
}

.path-list {
  list-style: none;
  margin: 0;
  padding: 2px;
  overflow-y: auto;
}

.path-list a {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  text-decoration: none;
  color: #333;
}

.path-list a:hover {
  background: #f5f5f5;
}

.badge {
  padding: 0 2px;
  font-size: 9px;
  text-align: center;
}

.xpath {
  font-family: monospace;
  font-size: 10px;
  word-break: break-all;
}

.upper {
  border-bottom: 1px solid #aaa;
  padding-bottom: 4px;
  margin-bottom: 2px;
}
</style>
