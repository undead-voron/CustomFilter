<template>
  <div class="rule-editor" ref="container">
    <div class="drag-handle" @mousedown="onMousedown" @mousemove="onMousemove" @mouseup="onMouseup"></div>
    <RuleEditorFrame :rule="rule" @save="saveRule" @test="testRule" @close="closeEditor"
      @pick-path="startPathPicking" />
    <PathPicker v-if="showPathPicker" :target-type="currentPathTarget" :selected-element="selectedElement"
      @path-selected="onPathSelected" @close="stopPathPicking" />
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, provide, inject } from 'vue'
import type { Rule } from '~/services/types'
import RuleEditorFrame from './RuleEditorFrame.vue'
import PathPicker from './PathPicker.vue'

const props = defineProps<{
  initialRule: Rule
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const container = ref<HTMLElement | null>(null)
const rule = ref<Rule>(props.initialRule )
const moving = ref(false)
const dragState = ref({
  origEventX: 0,
  origEventY: 0,
  origDivX: 0,
  origDivY: 0,
})

// Path picker state
const showPathPicker = ref(false)
const currentPathTarget = ref('')
const selectedElement = ref<HTMLElement | null>(null)
const pathPickerHandlers = ref<{ element: HTMLElement, handlers: any[] }[]>([])

const onMousedown = (event: MouseEvent) => {
  moving.value = true
  dragState.value = {
    origEventX: event.pageX,
    origEventY: event.pageY,
    origDivX: parseInt(container.value?.style.right.replace('px', '') || '0'),
    origDivY: parseInt(container.value?.style.top.replace('px', '') || '0'),
  }
}

const onMousemove = (event: MouseEvent) => {
  if (!moving.value || !container.value) return
  container.value.style.right = `${dragState.value.origDivX - (event.pageX - dragState.value.origEventX)}px`
  container.value.style.top = `${dragState.value.origDivY + (event.pageY - dragState.value.origEventY)}px`
}

const onMouseup = () => {
  moving.value = false
}

const applyRule = inject('applyRule') as (rule: Rule) => void
const testRule = () => {
  applyRule(rule.value)
  //RuleExecutor.applyRule(rule.value, true, (node) => {
  //  ElementHighlighter.highlightHideElements([node])
  //}, false)
}
const saveRuleFn = inject('saveRule') as (rule: Rule) => void

const saveRule = async () => {
  //await cbStorage.saveRule(rule.value)
  saveRuleFn(rule.value)
}

const closeEditor = () => {
  stopPathPicking()
  emit('close')
}

const startPathPicking = (target: string) => {
  currentPathTarget.value = target
  showPathPicker.value = true
  setupPathPickerHandlers()
}

const stopPathPicking = () => {
  showPathPicker.value = false
  currentPathTarget.value = ''
  selectedElement.value = null
  removePathPickerHandlers()
}

const setupPathPickerHandlers = () => {
  const nodes = document.body.getElementsByTagName('*')
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i] as HTMLElement
    if (node.getAttribute('avoidStyle')) continue

    const mouseoverHandler = (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      selectedElement.value = node
      node.style.outline = '2px solid #2fb947'
    }

    const mouseoutHandler = (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      if (selectedElement.value === node) {
        node.style.outline = ''
      }
    }

    const clickHandler = (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      if (selectedElement.value === node) {
        showPathPicker.value = true
      }
    }

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

const removePathPickerHandlers = () => {
  pathPickerHandlers.value.forEach(({ element, handlers }) => {
    handlers.forEach(handler => {
      element.removeEventListener(handler.type, handler.fn)
    })
  })
  pathPickerHandlers.value = []
}

const onPathSelected = (data: { target: string, path: string }) => {
  switch (data.target) {
    case 'search_xpath':
      rule.value.search_block_xpath = data.path
      break
    case 'search_css':
      rule.value.search_block_css = data.path
      break
    case 'hide_xpath':
      rule.value.hide_block_xpath = data.path
      break
    case 'hide_css':
      rule.value.hide_block_css = data.path
      break
  }
  stopPathPicking()
}

onUnmounted(() => {
  removePathPickerHandlers()
})
</script>

<style scoped>
.rule-editor {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  border-radius: 4px;
}

.drag-handle {
  height: 24px;
  background: #f5f5f5;
  cursor: move;
  border-bottom: 1px solid #ddd;
}
</style>
