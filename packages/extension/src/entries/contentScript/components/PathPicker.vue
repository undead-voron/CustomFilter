<template>
  <div v-if="show" class="path-picker" ref="container">
    <div class="path-picker-header">
      <span>{{ title }}</span>
      <button @click="close">×</button>
    </div>
    <ul class="path-list">
      <li v-if="hasParentNode" class="upper">
        <a href="#" @click.prevent="selectParent">{{ t('selectOuterElement') }}</a>
      </li>
      <li v-for="(path, index) in paths" :key="index">
        <a href="#" 
           @click.prevent="selectPath(path)"
           @mouseover="previewPath(path)"
           @mouseout="clearPreview">
          <span class="badge">{{ path.elements.length }}</span>
          <span class="xpath">{{ path.path }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { PathAnalyzer } from '~/utils/path_analyzer'
import { XPathBuilder } from '~/utils/xpath_builder'
import { CssBuilder } from '~/utils/css-builder'

const props = defineProps<{
  targetType: string
  selectedElement: HTMLElement
}>()

const emit = defineEmits<{
  (e: 'path-selected', data: { target: string, path: string }): void
  (e: 'element-selected', element: HTMLElement): void
  (e: 'close'): void
}>()

const show = ref(true)
const container = ref<HTMLElement | null>(null)

const title = computed(() => {
  const isHide = props.targetType.startsWith('hide')
  const isXPath = props.targetType.endsWith('xpath')
  return `Select ${isHide ? 'Hide' : 'Search'} ${isXPath ? 'XPath' : 'CSS'} Path`
})

const paths = computed(() => {
  const isXPath = props.targetType.endsWith('xpath')
  const builder = isXPath ? new XPathBuilder() : new CssBuilder( )
  const analyzer = new PathAnalyzer(props.selectedElement, builder, null, null)
  return analyzer.createPathList()
})

const hasParentNode = computed(() => {
  return props.selectedElement.parentNode && props.selectedElement.parentNode !== document.body
})

const selectPath = (path: any) => {
  emit('path-selected', {
    target: props.targetType,
    path: path.path.trim()
  })
  close()
}

const selectParent = () => {
  if (props.selectedElement.parentNode) {
    emit('element-selected', props.selectedElement.parentNode as HTMLElement)
  }
}
const highlightHideElements = inject('highlightHideElements') as (el?: HTMLElement[]) => void
const highlightSearchElements= inject('highlightHideElements ') as (el?: HTMLElement[]) => void

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
  show.value = false
  clearPreview()
  emit('close')
}

const t = (key: string) => {
  // TODO: Implement proper i18n
  return key
}
</script>

<style scoped>
.path-picker {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  min-width: 300px;
  max-width: 500px;
  z-index: 999999;
}

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
  padding: 8px;
  max-height: 400px;
  overflow-y: auto;
}

.path-list li {
  margin: 4px 0;
}

.path-list a {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  text-decoration: none;
  color: #333;
  border-radius: 4px;
}

.path-list a:hover {
  background: #f5f5f5;
}

.badge {
  background: #e0e0e0;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 12px;
  min-width: 24px;
  text-align: center;
}

.xpath {
  font-family: monospace;
  font-size: 13px;
  word-break: break-all;
}

.upper {
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
  margin-bottom: 8px;
}
</style> 
