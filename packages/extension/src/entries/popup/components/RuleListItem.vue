<template>
  <li class="rule-item">
    <div class="count" :class="{ hit: rule.hitCount > 0, noHit: rule.hitCount === 0 }">
      {{ rule.hitCount }}
    </div>
    <div class="title">{{ rule.title }}</div>
    <div class="button-container">
      <button class="button-edit" @click="$emit('edit', rule)" title="Edit">
        Edit
      </button>
      <button class="button-delete" @click="$emit('delete', rule)" title="Delete">
        Delete
      </button>
    </div>
  </li>
</template>

<script setup lang="ts">
import type { Rule } from '../../types'

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

.title {
  margin-left: 25px;
  margin-right: 122px;
  vertical-align: middle;
  height: inherit;
  color: #222;
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
  float: left;
}

.hit {
  background-color: #fe376c;
}

.noHit {
  background-color: #959595;
}

.button-container {
  float: right;
  width: 120px;
  height: inherit;
  text-align: right;
  margin: 2px 0 0;
  padding: 0;
  width: 175px;
  line-height: 17px;
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

.button-container button {
  visibility: hidden;
}

.rule-item:hover .button-container button {
  visibility: visible;
}
</style> 