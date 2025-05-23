<template>
  <div class="rule-editor flex flex-col bg-white z-max" ref="container">
    <div class="drag-handle flex flex-row justify-end items-center">
      <button @click.stop.prevent.capture="closeEditor" class="px-md text-[16px]">×</button>
    </div>
    <RuleEditor 
      :rule="rule" 
      :word-groups="wordGroups"
      @update:rule="updateRule"
      @save="saveRule" 
      @test="testRule" 
      @close="closeEditor"
      @pick-path="startPathPicking" />
    <PathPicker 
      v-if="showPathPicker" 
      :target-type="currentPathTarget" 
      @path-selected="onPathSelected" 
      @close="stopPathPicking" />
    <div class="flex flex-row justify-center items-center absolute top-3 left-0 right-0">
      <span v-if="isErrorNotificationVisible" class="text-center bg-red-500 text-white p-2 rounded-md">{{ errorMessage }}</span>
      <span v-if="isSuccessNotificationVisible" class="text-center bg-green-500 text-white p-2 rounded-md">{{ successMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, unref, inject } from 'vue'
import type { Rule, WordGroup } from '~/types'
import RuleEditor from './RuleEditor.vue'
import PathPicker from './PathPicker.vue'
import useDraggable from '~/composables/useDraggable';
import { useNotification } from '~/composables/useNotification'
import { isRuleValid, WORD_GROUPS_STORAGE_KEY } from '~/utils';
import { useBrowserStorage } from '~/composables/useBrowserStorage';

const props = defineProps<{
  initialRule: Rule
}>()

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'closeEditor'): void
}>()

const container = ref<HTMLElement | null>(null)
const rule = ref<Rule>(JSON.parse(JSON.stringify(props.initialRule)))

const { value: wordGroups } = useBrowserStorage(WORD_GROUPS_STORAGE_KEY, [] as WordGroup[])

// Path picker state
const showPathPicker = ref(false)
const currentPathTarget = ref('')

useDraggable(container);

const {isVisible: isErrorNotificationVisible, show: showErrorNotification, hide: hideErrorNotification} = useNotification()
const {isVisible: isSuccessNotificationVisible, show: showSuccessNotification, hide: hideSuccessNotification} = useNotification()

const testRuleFunction = inject('testRule') as (rule: Rule) => void
const saveRuleFn = inject('saveRule') as (rule: Rule) => void
const clearAllSelections = inject('clearSelections') as () => void

const errorMessage = ref('')
const successMessage = ref('')

const updateRule = (updatedRule: Rule) => {
  rule.value = updatedRule
}

const testRule = () => {
  const cleanedRule = JSON.parse(JSON.stringify(unref(rule)))
  const validationErrors = isRuleValid(cleanedRule)
  if (!validationErrors.length) {
    testRuleFunction(cleanedRule)
    successMessage.value = 'Start testing rule...'
    showSuccessNotification()
  } else {
    showErrorNotification()
    errorMessage.value = validationErrors.join('\n')
  }
}

const saveRule = async () => {
  const cleanedRule = JSON.parse(JSON.stringify(unref(rule)))
  const validationErrors = isRuleValid(cleanedRule)
  if (!validationErrors.length) {
    saveRuleFn(cleanedRule)
    successMessage.value = 'Rule saved successfully'
    showSuccessNotification()
  } else {
    showErrorNotification()
    errorMessage.value = validationErrors.join('\n')
  }
}

const closeEditor = () => {
  clearAllSelections()
  stopPathPicking()
  emit('close')
  emit('closeEditor')
}

const startPathPicking = (target: string) => {
  currentPathTarget.value = target
  showPathPicker.value = true
}

const stopPathPicking = () => {
  showPathPicker.value = false
  currentPathTarget.value = ''
}

const onPathSelected = (data: { target: string, path: string }) => {
  const updatedRule = { ...rule.value }
  
  switch (data.target) {
    case 'search_xpath':
      updatedRule.search_block_xpath = data.path
      break
    case 'search_css':
      updatedRule.search_block_css = data.path
      break
    case 'hide_xpath':
      updatedRule.hide_block_xpath = data.path
      break
    case 'hide_css':
      updatedRule.hide_block_css = data.path
      break
  }
  
  rule.value = updatedRule
  stopPathPicking()
}
</script>

<style>
@tailwind base;

@layer base {
  * {
    color-scheme: none;
  }
  h1 {
    @apply text-black;
  }
  h2 {
    @apply text-black;
  }
  h3 {
    @apply text-black;
  }
  h4 {
    @apply text-black;
  }
  a {
    @apply text-black;
  }
}
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
