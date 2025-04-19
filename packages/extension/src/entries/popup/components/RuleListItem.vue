<script setup lang="ts">
import type { Rule } from '~/types'
import OffIcon from '~/assets/off.png'
import OnIcon from '~/assets/on.png'
import Delete from '~/components/img/Delete.vue'
import Edit from '~/components/img/Edit.vue'
import { DeepReadonly } from 'vue'

defineProps<{
  rule: Rule | DeepReadonly<Rule>
}>()
defineEmits<{
  (e: 'edit', rule: Rule | DeepReadonly<Rule>): void
  (e: 'delete', rule: Rule | DeepReadonly<Rule>): void
  (e: 'toggle', rule: Rule | DeepReadonly<Rule>): void
}>()
const onUrl = new URL(OnIcon, import.meta.url).href
const offUrl = new URL(OffIcon, import.meta.url).href
</script>

<template>
  <li class="rule-item flex flex-row items-center justify-between">
    <div class="flex flex-row items-center overflow-hidden">
      <div class="count" :class="{ hit: rule.hitCount > 0, noHit: rule.hitCount === 0 }">
        {{ rule.hitCount }}
      </div>
      <span class="truncate grow shrink">{{ rule.title }}</span>
    </div>
      
    <div class="flex flex-row items-center gap-md shrink-0 grow-0">
      <button @click="$emit('toggle', rule)" title="Toggle">
        <img :src="rule.is_disabled ? offUrl : onUrl" class="w-[2.5em] h-[1em]" />
      </button>
      <button class="button-edit" title="Edit" @click="$emit('edit', rule)">
        <Edit />
      </button>
      <button class="button-delete" title="Delete" @click="$emit('delete', rule)">
        <Delete />
      </button>
    </div>
  </li>
</template>

<style scoped>
.rule-item {
  height: 27px;
  line-height: 27px;
  list-style-type: none;
  clear: both;
  font-size: 90%;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  position: relative;
}

.count {
  height: 14px;
  margin-top: 6px;
  line-height: 14px;
  margin-left: 2px;
  margin-right: 2px;
  width: 18px;
  text-align: center;
  color: white;
  font-size: 10px;
}

.hit {
  background-color: #fe376c;
}

.noHit {
  background-color: #959595;
}

.button-container button {
  border: none;
  text-indent: -9999px;
  background: none;
  margin: 0 0.2rem;
  cursor: pointer;
  padding: 0;
}

.button-edit {
  background: url(../../assets/img/button/edit.png) no-repeat;
  background-size: 14px 14px;
  width: 14px;
  height: 14px;
}

.button-delete {
  background: url(../../assets/img/button/delete.png) no-repeat;
  background-size: 14px 14px;
  width: 14px;
  height: 14px;
}
</style>
