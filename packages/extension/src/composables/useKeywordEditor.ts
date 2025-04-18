import { computed, ref } from 'vue'

export default () => {
  const caseSensitive = ref(false)
  const regexMatch = ref(false)
  const completeMatch = ref(false)
  const includeLinkUrl = ref(false)

  const newKeyword = ref('')

  const keyword = computed(() => ({
    text: newKeyword.value.trim(),
    is_regexp: regexMatch.value,
    is_complete_matching: completeMatch.value,
    is_case_sensitive: caseSensitive.value,
    is_include_href: includeLinkUrl.value,
  }))

  const clear = () => {
    newKeyword.value = ''
    completeMatch.value = false
    regexMatch.value = false
    caseSensitive.value = false
    includeLinkUrl.value = false
  }

  const isValid = computed(() => keyword.value.text.trim() !== '')

  return { clear, keyword, newKeyword, caseSensitive, regexMatch, completeMatch, includeLinkUrl, isValid }
}
