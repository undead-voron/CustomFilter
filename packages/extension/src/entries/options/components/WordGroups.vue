<script setup lang="ts">
import { computed, DeepReadonly, unref } from 'vue'
import browser from 'webextension-polyfill'
import Delete from '~/components/img/Delete.vue'
import Edit from '~/components/img/Edit.vue'
import Plus from '~/components/img/Plus.vue'
import { useBrowserStorage } from '~/composables/useBrowserStorage'
import useKeywordEditor from '~/composables/useKeywordEditor'
import useWordGroupEditor from '~/composables/useWordGroupsEditor'
import { WordGroup } from '~/types'
import WordGroupEditor from './WordGroupEditor.vue'
import { WORD_GROUPS_STORAGE_KEY } from '~/utils'

const { value: wordGroups } = useBrowserStorage(WORD_GROUPS_STORAGE_KEY, [] as WordGroup[])

const { addKeyword, removeKeyword, name, keywords, reset, updateName, keywordsGroup } = useWordGroupEditor()

const { newKeyword, completeMatch, regexMatch, caseSensitive, includeLinkUrl, clear, isValid, keyword: newComputedKeyword } = useKeywordEditor()

function checkAndAddKeyword() {
  if (isValid.value) {
    const exists = keywords.value.find(keyword => keyword.text === newComputedKeyword.value.text && keyword.is_case_sensitive === newComputedKeyword.value.is_case_sensitive && keyword.is_complete_matching === newComputedKeyword.value.is_complete_matching && keyword.is_include_href === newComputedKeyword.value.is_include_href && keyword.is_regexp === newComputedKeyword.value.is_regexp)
    if (!exists) {
      addKeyword(newComputedKeyword.value)
    }
    clear()
  }
}

const writeWordGroupsToStorage = async (value: WordGroup[] | DeepReadonly<WordGroup>[]) => browser.storage.local.set({ [WORD_GROUPS_STORAGE_KEY]: JSON.parse(JSON.stringify(value)) });

async function save() {
  const existingGroupIndex = wordGroups.value.findIndex(group => group.global_identifier === keywordsGroup.value.global_identifier)
  const copy = [...wordGroups.value]
  const cleanedKeywords = JSON.parse(JSON.stringify(unref(keywordsGroup.value)))
  if (existingGroupIndex > -1) {
    copy[existingGroupIndex] = cleanedKeywords
  }
  else {
    copy.push(cleanedKeywords)
  }

  await writeWordGroupsToStorage(copy)

  clear()
  reset()
}

async function deleteGroup(group: WordGroup | DeepReadonly<WordGroup>) {
  const copy = [...wordGroups.value]
  copy.splice(copy.findIndex(g => g.global_identifier === group.global_identifier), 1)

  await writeWordGroupsToStorage(copy)

  if (keywordsGroup.value.global_identifier === group.global_identifier) {
    clear()
    reset()
  }
}

const isDuplicatedGroup = computed(() => !!wordGroups.value.find(
  group => group.global_identifier !== keywordsGroup.value.global_identifier && group.name.trim() === keywordsGroup.value.name.trim(),
))
</script>

<template>
  <div class="px-4">
    <h2 class="text-lg font-semibold">
      Word Groups
    </h2>
    <div class="flex flex-row gap-4">
      <div class="flex flex-col gap-2 w-[350px] max-w-[450px] min-w-[350px]">
        <a class="flex flex-row items-center my-2 cursor-pointer underline" @click.prevent="reset()">
          <Plus width="1.2em" height="1.2em" class="mr-sm" /> Create a new rule for this site
        </a>
        <h2 v-if="!wordGroups.length" class="text-gray-600">
          No keyword groups found.
        </h2>
        <div v-for="wordGroup in wordGroups" :key="wordGroup.global_identifier" class="flex flex-row justify-between align-middle">
          <h3 class="truncate">{{ wordGroup.name }}</h3>
          <div class="flex flex-row gap-2">
            <button class="w-[14px] h-[14px]" @click="reset(wordGroup)">
              <Edit />
            </button>
            <button class="w-[14px] h-[14px]" @click="deleteGroup(wordGroup)">
              <Delete />
            </button>
          </div>
        </div>
      </div>
      <div class="flex flex-col">
        <WordGroupEditor
          v-model:is-complete-match="completeMatch"
          v-model:is-regex="regexMatch"
          v-model:is-case-sensitive="caseSensitive"
          v-model:is-include-link-url="includeLinkUrl"
          v-model:new-keyword="newKeyword"
          :is-duplicated-group-name="isDuplicatedGroup"
          :name="name"
          :words="keywords"
          @save="save"
          @remove-keyword="removeKeyword"
          @add-keyword="checkAndAddKeyword"
          @update:name="updateName"
        />
      </div>
    </div>
  </div>
</template>
