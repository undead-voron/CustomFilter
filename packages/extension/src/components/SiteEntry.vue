<template>
  <li :class="{ duplicate }">
    <button class="openButton" :class="open ? 'minus' : 'plus'" @click="toggleOpen" />
    <input type="checkbox" v-model="allChecked" :disabled="duplicate" @change="toggleAllRules" />
    <img :src="faviconSrc" class="favicon" />
    <span class="title">
      {{ site.name }}
      <span v-if="duplicate" class="duplicate-label">(Already Installed)</span>
    </span>
    <ul ref="rulesList" class="rules">
      <RuleWrapper v-for="(rule, index) in site.rules" :key="index" :rule="rule" :site="site"
        v-model:checked="rule.checked" />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { PropType } from 'vue'
import RuleWrapper from './RuleWrapper.vue'
import type { Rule as RuleType } from '~/services/types'
import browser from 'webextension-polyfill'

type Rule = RuleType & { checked: boolean }
const props = defineProps({
  site: {
    type: Object as PropType<Site>,
    required: true
  }
})

interface Site {
  name: string
  url?: string
  rules: Rule[]
}

const open = ref(false)
const duplicate = ref(false)
const rulesList = ref<HTMLElement>()
const allChecked = ref(true)

const faviconSrc = computed(() =>
  props.site.url
    ? `chrome://favicon/${props.site.url}`
    : browser.runtime.getURL('img/world.png')
)

const toggleOpen = () => {
  open.value = !open.value
  if (rulesList.value) {
    rulesList.value.style.height = open.value
      ? `${props.site.rules.length * 18}px`
      : '0px'
  }
}

const toggleAllRules = () => {
  props.site.rules.forEach(rule => {
    rule.checked = allChecked.value
  })
}

const disable = () => {
  duplicate.value = true
  allChecked.value = false
}

// If you need to expose any methods to parent components
defineExpose({
  disable,
  setChecked: (checked: boolean) => {
    if (!duplicate.value) {
      allChecked.value = checked
      toggleAllRules()
    }
  }
})
</script>

<style scoped>
li {
  position: relative;
  list-style: none;
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.openButton {
  cursor: pointer;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border: none;
  background-color: transparent;
  background-position: center;
  background-repeat: no-repeat;
}

.openButton.plus {
  background-image: url('data:image/svg+xml;utf8,<svg ...>/* plus icon */</svg>');
}

.openButton.minus {
  background-image: url('data:image/svg+xml;utf8,<svg ...>/* minus icon */</svg>');
}

.favicon {
  width: 16px;
  height: 16px;
  margin: 0 8px;
  vertical-align: middle;
}

.title {
  vertical-align: middle;
}

.rules {
  list-style: none;
  padding-left: 20px;
  margin: 8px 0 0 0;
  overflow: hidden;
  transition: height 0.3s ease;
}

.duplicate {
  opacity: 0.6;
  background-color: #f5f5f5;
}

.duplicate-label {
  color: #666;
  font-size: 0.9em;
  margin-left: 8px;
}
</style>
