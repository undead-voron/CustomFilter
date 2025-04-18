<script setup lang="ts">
import CaseSensitiveImg from '~/components/img/CaseSensitive.vue'
import CompleteMatchImg from '~/components/img/CompleteMatch.vue'
import IncludeUrlImg from '~/components/img/IncludeUrl.vue'
import RegexpImg from '~/components/img/Regex.vue'

defineEmits<{
  (e: 'addKeyword'): void
}>()

const newKeyword = defineModel<string>('newKeyword', { required: true })
const isCompleteMatch = defineModel<boolean>('isCompleteMatch', { required: true })
const isRegex = defineModel<boolean>('isRegex', { required: true })
const isCaseSensitive = defineModel<boolean>('isCaseSensitive', { required: true })
const isIncludeLinkUrl = defineModel<boolean>('isIncludeLinkUrl', { required: true })
</script>

<template>
  <div class="flex flex-row gap-md">
    <label class="shrink-0 grow-0 flex items-center justify-center">Keyword</label>
    <input v-model="newKeyword" type="text" class="shrink grow" @keyup.enter="$emit('addKeyword')">
    <button
      class="bg-brand-blue disabled:bg-brand-gray grow-0 shrink-0 text-white px-md py-sm"
      :disabled="newKeyword.trim() === ''"
      @click="$emit('addKeyword')"
    >
      Add
    </button>
  </div>
  <div class="flex flex-row flex-wrap gap-sm">
    <div class="flex flex-row gap-sm items-center mr-md">
      <input id="complete-match" v-model="isCompleteMatch" type="checkbox">
      <label for="complete-match" class="flex flex-row items-center text-[12px]">
        <CompleteMatchImg class="h-[1.25em] w-[1.25em] mr-sm" />
        Complete Match
      </label>
    </div>
    <div class="flex flex-row gap-sm items-center mr-md">
      <input id="regex-match" v-model="isRegex" type="checkbox">
      <label for="regex-match" class="flex flex-row items-center text-[12px]">
        <RegexpImg class="h-[1.25em] w-[1.25em] mr-sm" />
        RegEx
      </label>
    </div>
    <div class="flex flex-row gap-sm items-center mr-md">
      <input id="case-sensitive" v-model="isCaseSensitive" type="checkbox">
      <label for="case-sensitive" class="flex flex-row items-center text-[12px]">
        <CaseSensitiveImg class="h-[1em] w-[1em] mr-sm" />
        Case Sensitive
      </label>
    </div>
    <div class="flex flex-row gap-sm items-center">
      <input id="include-link-url" v-model="isIncludeLinkUrl" type="checkbox">
      <label for="include-link-url" class="flex flex-row items-center text-[12px]">
        <IncludeUrlImg class="h-[1.25em] w-[1.25em] mr-sm" />
        Include Link URL
      </label>
    </div>
  </div>
</template>
