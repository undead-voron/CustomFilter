<template>
  <h4>Keywords</h4>
  <div class="flex flex-row flex-wrap gap-sm">
    <div v-for="(word, index) in words" :key="index"
      class="flex flex-row gap-sm shrink-0 grow-0 bg-brand-blue text-white px-sm justify-center items-center">
      <CompleteMatchImg v-if="word.is_complete_matching" class="h-[1em] w-[1em]" />
      <RegexpImg v-if="word.is_regexp" class="h-[1em] w-[1em]" />
      <CaseSensitiveImg v-if="word.is_case_sensitive" class="h-[1em] w-[1em]" />
      <IncludeUrlImg v-if="word.is_include_href" class="h-[1em] w-[1em]" />
      <span type="text">{{ word.text }}</span>
      <button @click="$emit('removeKeyword', index)" class="p-0 shrink-0 grow-0">×</button>
    </div>
  </div>
  <div class="flex flex-row gap-md my-md">
    <input type="text" v-model="newKeyword" @keyup.enter="addKeyword" class="shrink grow" />
    <button @click="addKeyword" class="bg-brand-blue grow-0 shrink-0 text-white px-md py-sm">Add</button>
    <a class="help flex items-center justify-center" @click="openHelp('/help/keywords.html')">
      <QuestionMarkImg class="h-[1.5em] w-[1.5em] text-black" />
    </a>
  </div>
  <div class="flex flex-row flex-wrap gap-sm">
    <div class="flex flex-row gap-sm items-center mr-md">
      <input type="checkbox" id="complete-match" v-model="completeMatch" />
      <label for="complete-match" class="flex flex-row items-center text-[12px]">
        <CompleteMatchImg class="h-[1.25em] w-[1.25em] mr-sm" />
        Complete Match
      </label>
    </div>
    <div class="flex flex-row gap-sm items-center mr-md">
      <input type="checkbox" id="regex-match" v-model="regexMatch" />
      <label for="regex-match" class="flex flex-row items-center text-[12px]">
        <RegexpImg class="h-[1.25em] w-[1.25em] mr-sm" />
        RegEx
      </label>
    </div>
    <div class="flex flex-row gap-sm items-center mr-md">
      <input type="checkbox" id="case-sensitive" v-model="caseSensitive" />
      <label for="case-sensitive" class="flex flex-row items-center text-[12px]">
        <CaseSensitiveImg class="h-[1em] w-[1em] mr-sm" />
        Case Sensitive
      </label>
    </div>
    <div class="flex flex-row gap-sm items-center">
      <input type="checkbox" id="include-link-url" v-model="includeLinkUrl" />
      <label for="include-link-url" class="flex flex-row items-center text-[12px]">
        <IncludeUrlImg class="h-[1.25em] w-[1.25em] mr-sm" />
        Include Link URL
      </label>
    </div>
  </div>

  <h4>Keyword Groups</h4>
  <div class="flex flex-row flex-wrap gap-sm">
    <div v-for="(group, index) in wordGroups" :key="index"
      class="flex flex-row gap-sm shrink-0 grow-0 bg-brand-blue text-white px-sm justify-center items-center">
      <span type="text">{{ group.name }}</span>
      <button @click="$emit('removeKeyword', index)" class="p-0 shrink-0 grow-0">×</button>
    </div>
  </div>
  <select @change="emit('addKeywordGroup', $event.target?.value)">
    <option value="">----</option>
    <option v-for="group in availableWordGroups" :key="group.global_identifier" :value="group.global_identifier">
      {{ group.name }}
    </option>
  </select>
</template>
<script lang="ts" setup>
import RegexpImg from '~/components/img/Regex.vue'
import CaseSensitiveImg from '~/components/img/CaseSensitive.vue'
import CompleteMatchImg from '~/components/img/CompleteMatch.vue'
import IncludeUrlImg from '~/components/img/IncludeUrl.vue'
import QuestionMarkImg from '~/components/img/QuestionMark.vue'
import { ref, type DeepReadonly } from 'vue'
import type { Word, WordGroup } from '~/types'
import { openHelp } from '~/utils'
import useWordEditor from '~/composables/useWordEditor'

const { clear, keyword, newKeyword, caseSensitive, regexMatch, completeMatch, includeLinkUrl } = useWordEditor()

const { wordGroups } = defineProps<{
  words: Word[];
  wordGroups: DeepReadonly<WordGroup[]>
  availableWordGroups: WordGroup[]
}>();

const emit = defineEmits<{
  (e: 'removeKeyword', type: number): void
  (e: 'addKeyword', word: Word): void
  (e: 'addKeywordGroup', wordGroup: string): void
  (e: 'removeKeywordGroup', groupIndex: number): void
}>()

const addKeyword = () => {
  emit('addKeyword', keyword.value)
  clear()
}
</script>
