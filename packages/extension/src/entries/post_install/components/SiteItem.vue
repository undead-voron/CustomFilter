<template>
  <li :class="{ duplicate: siteWrapper.isDisabled }">
    <input
      type="button"
      class="openButton"
      :class="{ plus: !isOpen, minus: isOpen }"
      @click="toggleOpen"
    />
    <input
      type="checkbox"
      v-model="isChecked"
      :disabled="siteWrapper.isDisabled"
      @change="updateChecked"
    />
    <img
      :src="getFaviconUrl"
      :alt="siteWrapper.site.name"
    />
    <span>
      {{ siteWrapper.site.name }}
      <span v-if="siteWrapper.isDisabled" class="installed">
        {{ chrome.i18n.getMessage('alreadyInstalled') }}
      </span>
    </span>
    <ul :style="{ height: ulHeight }">
      <RuleItem
        v-for="rule in siteWrapper.ruleWrappers"
        :key="rule.label"
        :ruleWrapper="rule"
        :disabled="siteWrapper.isDisabled"
      />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SiteWrapper } from '../types'
import RuleItem from './RuleItem.vue'

declare const chrome: any

const props = defineProps<{
  siteWrapper: SiteWrapper
}>()

const emit = defineEmits<{
  'update:checked': [site: SiteWrapper, checked: boolean]
}>()

const isOpen = ref(false)

const isChecked = computed({
  get: () => props.siteWrapper.ruleWrappers.every(rule => rule.isChecked),
  set: (value) => emit('update:checked', props.siteWrapper, value)
})

const getFaviconUrl = computed(() => {
  return props.siteWrapper.site.url
    ? `chrome://favicon/${props.siteWrapper.site.url}`
    : chrome.extension.getURL('img/world.png')
})

const ulHeight = computed(() => {
  return isOpen.value ? `${18 * props.siteWrapper.ruleWrappers.length}px` : '0px'
})

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

const updateChecked = () => {
  emit('update:checked', props.siteWrapper, isChecked.value)
}
</script>

<style scoped>
li {
  list-style-type: none;
  line-height: 100%;
}

li.duplicate {
  color: #888;
}

li > ul {
  list-style-type: none;
  -webkit-transition: height .1s linear;
  overflow-y: hidden;
}

.openButton {
  width: 13px;
  height: 13px;
  border: none;
}

.plus {
  background-image: url(../img/open_plus.png);
}

.minus {
  background-image: url(../img/open_minus.png);
}

.installed {
  background-color: #66f;
  color: #fff;
  margin-left: 8px;
  padding: 1px;
  font-size: 60%;
}
</style> 