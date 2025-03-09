<template>
  <li class="rule-item flex flex-row items-center justify-between">
    <div class="flex flex-row items-center">
      <div class="count" :class="{ hit: rule.hitCount > 0, noHit: rule.hitCount === 0 }">
        {{ rule.hitCount }}
      </div>
      <span>{{ rule.title }}</span>
    </div>
      
    <div class="flex flex-row items-center gap-md">
      <button @click="$emit('toggle', rule)" title="Toggle">
        <img :src="rule.is_disabled ? offUrl : onUrl" class="w-[2.5em] h-[1em]" />
      </button>
      <button class="button-edit" @click="$emit('edit', rule)" title="Edit">
        <Edit />
      </button>
      <button class="button-delete" @click="$emit('delete', rule)" title="Delete">
        <Delete />
      </button>
    </div>
  </li>
</template>

<script setup lang="ts">
import type { Rule } from '~/services/types';
import Edit from '~/components/img/Edit.vue';
import Delete from '~/components/img/Delete.vue';
import OnIcon from '~/assets/on.png';
import OffIcon from '~/assets/off.png';

const onUrl = new URL(OnIcon, import.meta.url).href;
const offUrl = new URL(OffIcon, import.meta.url).href;

defineProps<{
  rule: Rule
}>()

defineEmits<{
  (e: 'edit', rule: Rule): void
  (e: 'delete', rule: Rule): void
}>()
</script>

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