import { computed, DeepReadonly, ref } from 'vue'
import { Word, WordGroup } from '~/types'

function useWordGroupEditor() {
  const editingWordGroup = ref<WordGroup>({
    global_identifier: `${Date.now()}`,
    name: 'New Keywords Group',
    words: [],
  })
  const name = computed(() => editingWordGroup.value.name)
  const keywords = computed<Word[]>(() => editingWordGroup.value.words || [])

  const addKeyword = (keyword: Word) => {
    const doesExist = keywords.value.some(k => k.text === keyword.text && k.is_regexp === keyword.is_regexp && k.is_complete_matching === keyword.is_complete_matching && k.is_case_sensitive === keyword.is_case_sensitive && k.is_include_href === keyword.is_include_href)
    if (!doesExist) {
      const updatedKeywords = [...keywords.value, keyword]
      editingWordGroup.value = { ...editingWordGroup.value, words: updatedKeywords }
    }
  }

  const removeKeyword = (keywordIndex: number) => {
    const updatedKeywords = keywords.value.filter((_, index) => index !== keywordIndex)
    editingWordGroup.value = { ...editingWordGroup.value, words: updatedKeywords }
  }

  const updateName = (newName: string) => {
    editingWordGroup.value = { ...editingWordGroup.value, name: newName }
  }

  const reset = (editingGroup?: DeepReadonly<WordGroup>) => {
    editingWordGroup.value = JSON.parse(JSON.stringify(editingGroup || {
      global_identifier: `${Date.now()}`,
      name: 'New Keywords Group',
      words: [],
    }))
  }

  return { addKeyword, removeKeyword, name, keywords, reset, updateName, keywordsGroup: computed(() => editingWordGroup.value) }
}

export default useWordGroupEditor
