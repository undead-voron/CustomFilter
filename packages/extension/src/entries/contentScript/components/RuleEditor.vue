<template>
  <div class="rule-editor flex flex-col bg-white z-max" ref="container">
    <div class="drag-handle"></div>
    <RuleEditorFrame :rule="rule" @save="saveRule" @test="testRule" @close="closeEditor"
      @pick-path="startPathPicking" />
    <PathPicker v-if="showPathPicker" :target-type="currentPathTarget" :selected-element="selectedElement"
      @path-selected="onPathSelected" @close="stopPathPicking" />
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, provide, inject, onMounted } from 'vue'
import type { Rule } from '~/services/types'
import RuleEditorFrame from './RuleEditorFrame.vue'
import PathPicker from './PathPicker.vue'
import useDraggable from '~/utils/useDraggable';
import { isRuleValid } from '~/utils/validateRule';
// import { usePathPickerDialog } from '~/utils';

const props = defineProps<{
  initialRule: Rule
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const container = ref<HTMLElement | null>(null)
const rule = ref<Rule>(props.initialRule)

// const { show, close, getOnclickAction } = usePathPickerDialog()

// Path picker state
const showPathPicker = ref(false)
const currentPathTarget = ref('')
// const selectedElement = ref<HTMLElement | null>(null)
// const pathPickerHandlers = ref<{ element: HTMLElement, handlers: any[] }[]>([])

useDraggable(container);

const applyRule = inject('applyRule') as (rule: Rule) => void
console.log('applyRule', applyRule)
const testRule = () => {
  applyRule(rule.value)
  //RuleExecutor.applyRule(rule.value, true, (node) => {
  //  ElementHighlighter.highlightHideElements([node])
  //}, false)
}
const saveRuleFn = inject('saveRule') as (rule: Rule) => void

const saveRule = async () => {
  const validationErrors = isRuleValid(rule.value)
  console.log('validation errors', validationErrors, rule.value)
  if (!validationErrors.length) {
    saveRuleFn(rule.value)
  }
  //await cbStorage.saveRule(rule.value)
}

const closeEditor = () => {
  stopPathPicking()
  emit('close')
}

const startPathPicking = (target: string) => {
  currentPathTarget.value = target
  showPathPicker.value = true
  // setupPathPickerHandlers()
  // show(event, originNode, paths, target, pathPickerHandlers.value, (...args) => {
  //   console.log('onSelect', args)
  // })
}

const stopPathPicking = () => {
  showPathPicker.value = false
  currentPathTarget.value = ''
  // selectedElement.value = null
  // removePathPickerHandlers()
}

// const setupPathPickerHandlers = () => {
//   const nodes = document.body.getElementsByTagName('*')
//   for (let i = 0; i < nodes.length; i++) {
//     const node = nodes[i] as HTMLElement
//     if (node.getAttribute('avoidStyle')) continue

//     const mouseoverHandler = (event: MouseEvent) => {
//       event.stopPropagation()
//       event.preventDefault()
//       selectedElement.value = node
//       node.style.outline = '2px solid #2fb947'
//     }

//     const mouseoutHandler = (event: MouseEvent) => {
//       event.stopPropagation()
//       event.preventDefault()
//       if (selectedElement.value === node) {
//         node.style.outline = ''
//       }
//     }

//     const clickHandler = (event: MouseEvent) => {
//       event.stopPropagation()
//       event.preventDefault()
//       if (selectedElement.value === node) {
//         // need to move it into pathpicker itself
//         showPathPicker.value = true
//         show(event, node, [], 'none', pathPickerHandlers.value, (...args) => {  
//           console.log('onSelect', args)
//         })
//       }
//     }

//     node.addEventListener('mouseover', mouseoverHandler)
//     node.addEventListener('mouseout', mouseoutHandler)
//     node.addEventListener('click', clickHandler)

//     pathPickerHandlers.value.push({
//       element: node,
//       handlers: [
//         { type: 'mouseover', fn: mouseoverHandler },
//         { type: 'mouseout', fn: mouseoutHandler },
//         { type: 'click', fn: clickHandler }
//       ]
//     })
//   }
// }

// const removePathPickerHandlers = () => {
//   pathPickerHandlers.value.forEach(({ element, handlers }) => {
//     handlers.forEach(handler => {
//       element.removeEventListener(handler.type, handler.fn)
//     })
//   })
//   pathPickerHandlers.value = []
// }

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
  // removePathPickerHandlers()
})
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

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
