<script setup lang="ts">
import type { WordGroup } from '~/types'
import { computed } from 'vue'
import CaseSensitiveImg from '~/components/img/CaseSensitive.vue'
import CompleteMatchImg from '~/components/img/CompleteMatch.vue'
import IncludeUrlImg from '~/components/img/IncludeUrl.vue'
import RegexpImg from '~/components/img/Regex.vue'
import WordEditor from './WordEditor.vue'

const props = defineProps<
  { isDuplicatedGroupName: boolean }
  & Omit<WordGroup, 'global_identifier' | 'name'>
>()

defineEmits<{
  (e: 'save'): void
  (e: 'addKeyword'): void
  (e: 'removeKeyword', index: number): void
}>()

const name = defineModel<string>('name', { required: true })
const newKeyword = defineModel<string>('newKeyword', { required: true })
const isCompleteMatch = defineModel<boolean>('isCompleteMatch', { required: true })
const isRegex = defineModel<boolean>('isRegex', { required: true })
const isCaseSensitive = defineModel<boolean>('isCaseSensitive', { required: true })
const isIncludeLinkUrl = defineModel<boolean>('isIncludeLinkUrl', { required: true })

const isValid = computed(() => name.value.trim() !== '' && (props.words.length > 0) && !props.isDuplicatedGroupName)
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-row justify-center gap-2">
      <label class="shrink-0 grow-0 flex items-center justify-center">Name</label>
      <input v-model="name" type="text" class="flex-1 shrink grow">
    </div>
    <div v-if="words.length" class="flex flex-row flex-wrap gap-sm">
      <div
        v-for="(word, index) in words" :key="index"
        class="flex flex-row gap-sm shrink-0 grow-0 bg-brand-blue text-white px-sm justify-center items-center"
      >
        <CompleteMatchImg v-if="word.is_complete_matching" class="h-[1em] w-[1em]" />
        <RegexpImg v-if="word.is_regexp" class="h-[1em] w-[1em]" />
        <CaseSensitiveImg v-if="word.is_case_sensitive" class="h-[1em] w-[1em]" />
        <IncludeUrlImg v-if="word.is_include_href" class="h-[1em] w-[1em]" />
        <span type="text">{{ word.text }}</span>
        <button class="p-0 shrink-0 grow-0" @click="$emit('removeKeyword', index)">
          ×
        </button>
      </div>
    </div>
    <WordEditor
      v-model:is-case-sensitive="isCaseSensitive"
      v-model:is-complete-match="isCompleteMatch"
      v-model:is-regex="isRegex"
      v-model:is-include-link-url="isIncludeLinkUrl"
      v-model:new-keyword="newKeyword"
      @add-keyword="$emit('addKeyword')"
    />
    <div class="flex flex-row justify-center">
      <button
        class="bg-brand-blue disabled:bg-brand-gray text-white px-2 py-1"
        :disabled="!isValid"
        @click="$emit('save')"
      >
        Save
      </button>
    </div>
  </div>
</template>
