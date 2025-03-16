<template>
  <li :class="{ done: ruleWrapper.isAlreadyImported }">
    <input
      type="checkbox"
      v-model="ruleWrapper.isChecked"
      :disabled="disabled || ruleWrapper.isAlreadyImported"
    />
    {{ ruleWrapper.label }}
  </li>
</template>

<script setup lang="ts">
import type { RuleWrapper } from '../types'

defineProps<{
  ruleWrapper: RuleWrapper
  disabled?: boolean
}>()
</script>

<style scoped>
li {
  height: 18px;
}

li.done {
  color: #888;
}
</style> 