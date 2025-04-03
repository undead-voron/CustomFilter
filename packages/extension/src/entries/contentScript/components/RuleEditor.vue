<template>
  <div class="rule-editor-frame">
    <section>
      <div class="section-body">
        <div class="input-section flex flex-row justify-center gap-2">
          <label class="shrink-0 grow-0 flex items-center justify-center">Name</label>
          <input type="text" class="flex-1 shrink grow" :value="rule.title" @input="updateTitle($event)" />
        </div>
      </div>
    </section>

    <section class="section border border-black">
      <div class="flex flex-row px-md">
        <h2 class="px-sm">Target Sites</h2>
      </div>
      <div class="section-body flex flex-col gap-sm">
        <div class="flex flex-row justify-center items-center gap-sm">
          <label class="shrink-0 grow-0">URL</label>

          <input type="text" class="flex-1 shrink grow" 
            :value="rule.specify_url_by_regexp ? rule.site_regexp : rule.url" 
            @input="updateSiteUrl($event)" />

          <a class="help shrink-0 grow-0" @click="openHelp('/help/site.html')">
            <QuestionMarkImg class="h-[1.5em] w-[1.5em] text-black" />
          </a>
        </div>
        <div class="flex flex-row gap-sm items-center">
          <input type="checkbox" id="specify-url-regexp" 
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
            :checked="rule.specify_url_by_regexp" 
            @change="updateSpecifyUrlByRegexp($event)" />
          <label for="specify-url-regexp">Use RegExp</label>
        </div>
        <div v-if="!isUrlValid" class="section-alert">
          This expression does not match this site.
        </div>
        <div class="text-details">
          The asterisk (*) matches zero or more characters.
          This rule is applied on matched sites.
        </div>
      </div>
    </section>

    <section class="section border border-black">
      <div class="flex flex-row px-md">
        <h2 class="px-sm">Elements to Hide</h2>
      </div>
      <div class="section-body">
        <div class="selector-section">
          <div class="input-section flex flex-row justify-center gap-sm">
            <label class="shrink-0 grow-0 flex items-center justify-center">
              <span class="count">{{ hideElementsCount }}</span> {{ rule.hide_block_by_css ? 'CSS' : 'XPath' }}
            </label>
            <div class="input-group flex flex-row justify-center shrink grow">
              <input type="text" class="shrink grow" 
                :value="rule.hide_block_by_css ? rule.hide_block_css : rule.hide_block_xpath" 
                @input="updateHideSelector($event)" />
              <button class="bg-brand-green text-white px-md py-sm shrink-0 grow-0 flex flex-row"
                @click="pickPath(rule.hide_block_by_css ? 'hide_css' : 'hide_xpath')">
                <img :src="wandUrl" alt="Pick" class="h-[1.5em]" /> Suggest
              </button>
            </div>
          </div>
          <div class="flex flex-row gap-sm">
            <div class="flex flex-row gap-md">
              <input type="radio" id="hide-xpath" :checked="!rule.hide_block_by_css" 
                @change="updateHideBlockByCss(false)" />
              <label for="hide-xpath">XPath</label>
            </div>
            <div class="flex flex-row gap-sm">
              <input type="radio" id="hide-css" :checked="rule.hide_block_by_css" 
                @change="updateHideBlockByCss(true)" />
              <label for="hide-css">CSS</label>
            </div>
          </div>
          <div v-if="hideXPathError" class="section-alert">
            Invalid XPath
          </div>
        </div>
        <div class="text-details">
          Matched elements will disappear if they meet the condition.
        </div>
      </div>
    </section>

    <section class="section border border-black">
      <div class="flex flex-row px-md">
        <h2 class="px-sm">Condition</h2>
      </div>
      <div class="section-body">
        <div class="flex flex-col gap-sm font-[12px]">
          <div class="flex flex-row gap-sm items-center">
            <input type="radio" id="block-anyway" :checked="rule.block_anyway" 
              @change="updateBlockAnyway(true)" />
            <label for="block-anyway">Block Anyway</label>
            <a class="flex items-center justify-center" @click="openHelp('/help/block_anyway.html')">
              <QuestionMarkImg class="h-[1.5em] w-[1.5em]" />
            </a>
          </div>
          <div class="flex flex-row gap-sm">
            <input type="radio" id="block-with-keywords" :checked="!rule.block_anyway" 
              @change="updateBlockAnyway(false)" />
            <label for="block-with-keywords">Filter with Keywords</label>
          </div>
        </div>

        <div v-if="!rule.block_anyway" class="keywords-section">
          <h4>Keywords</h4>
          <div class="flex flex-row flex-wrap gap-sm">
            <div v-for="(word, index) in rule.words" :key="index"
              class="flex flex-row gap-sm shrink-0 grow-0 bg-brand-blue text-white px-sm justify-center items-center">
              <CompleteMatchImg v-if="word.is_complete_matching" class="h-[1em] w-[1em]" />
              <RegexpImg v-if="word.is_regexp" class="h-[1em] w-[1em]" />
              <CaseSensitiveImg v-if="word.is_case_sensitive" class="h-[1em] w-[1em]" />
              <IncludeUrlImg v-if="word.is_include_href" class="h-[1em] w-[1em]" />
              <span type="text">{{ word.text }}</span>
              <button @click="removeKeyword(index)" class="p-0 shrink-0 grow-0">×</button>
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
            <div v-for="(group, index) in rule.wordGroups" :key="index"
              class="flex flex-row gap-sm shrink-0 grow-0 bg-brand-blue text-white px-sm justify-center items-center">
              <span type="text">{{ group.name }}</span>
              <button @click="removeKeyword(index)" class="p-0 shrink-0 grow-0">×</button>
            </div>
          </div>
          <select @change="addWordGroup($event.target?.value)">
            <option value="">----</option>
            <option v-for="group in availableWordGroups" :key="group.global_identifier" :value="group.global_identifier">
              {{ group.name }}
            </option>
          </select>

          <h4>Search Range</h4>
          <div class="selector-section">
            <div class="input-section flex flex-row justify-center gap-sm">
              <label class="shrink-0 grow-0 flex items-center justify-center">
                <span class="count">{{ searchElementsCount }}</span> {{ rule.search_block_by_css ? 'CSS' : 'XPath' }}
              </label>
              <div class="input-group flex flex-row shrink grow">
                <input type="text" class="shrink grow" 
                  :value="rule.search_block_by_css ? rule.search_block_css : rule.search_block_xpath" 
                  @input="updateSearchSelector($event)" />
                <button class="bg-brand-green px-md py-sm shrink-0 grow-0 text-white flex flex-row"
                  @click="pickPath(rule.search_block_by_css ? 'search_css' : 'search_xpath')">
                  <img :src="wandUrl" alt="Pick" class="h-[1.5em]" /> Suggest
                </button>
              </div>
            </div>
            <div class="flex flex-row gap-md">
              <div class="flex flex-row gap-sm">
                <input type="radio" id="search-xpath" :checked="!rule.search_block_by_css" 
                  @change="updateSearchBlockByCss(false)" />
                <label for="search-xpath">XPath</label>
              </div>
              <div class="flex flex-row gap-sm">
                <input type="radio" id="search-css" :checked="rule.search_block_by_css" 
                  @change="updateSearchBlockByCss(true)" />
                <label for="search-css">CSS</label>
              </div>
            </div>
            <div v-if="searchXPathError" class="section-alert">
              Invalid XPath
            </div>
          </div>
          <div class="text-details">
            The filter works when these elements contain "Keywords".
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <button @click="$emit('save')" class="bg-brand-blue text-white px-md py-sm">Save</button>
      <button @click="$emit('test')" class="bg-brand-green text-white px-md py-sm">Test Rule</button>
      <button @click="$emit('close')" class="bg-brand-gray text-white px-md py-sm">Close</button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { Rule, WordGroup } from '~/types';
import { ref, computed, type DeepReadonly } from 'vue'
import { getElementsByCssSelector, getElementsByXPath } from '~/utils';
import wand from '~/assets/wand_transparent.png'
import browser from 'webextension-polyfill';
import RegexpImg from '~/components/img/Regex.vue'
import CaseSensitiveImg from '~/components/img/CaseSensitive.vue'
import CompleteMatchImg from '~/components/img/CompleteMatch.vue'
import IncludeUrlImg from '~/components/img/IncludeUrl.vue'
import QuestionMarkImg from '~/components/img/QuestionMark.vue'

const wandUrl = new URL(wand, import.meta.url).href;
const props = defineProps<{
  rule: Rule
  wordGroups: DeepReadonly<WordGroup[]>
}>()

const availableWordGroups = computed(() => {
  return props.wordGroups
    .filter(
      group => !props.rule.wordGroups.find(({global_identifier}) => group.global_identifier === global_identifier)
    )
})

const caseSensitive = ref(false)
const regexMatch = ref(false)
const completeMatch = ref(false)
const includeLinkUrl = ref(false)

const emit = defineEmits<{
  (e: 'save'): void
  (e: 'test'): void
  (e: 'close'): void
  (e: 'pick-path', type: string): void
  (e: 'update:rule', rule: Rule): void
}>()

const newKeyword = ref('')
const hideXPathError = ref(false)
const searchXPathError = ref(false)

const hideElementsCount = computed(() => {
  try {
    if (props.rule.hide_block_by_css) {
      return getElementsByCssSelector(props.rule.hide_block_css || '').length
    } else {
      return getElementsByXPath(props.rule.hide_block_xpath || '').length
    }
  } catch {
    return 0
  }
})

const searchElementsCount = computed(() => {
  try {
    if (props.rule.search_block_by_css) {
      return getElementsByCssSelector(props.rule.search_block_css || '').length
    } else {
      return getElementsByXPath(props.rule.search_block_xpath || '').length
    }
  } catch {
    return 0
  }
})

const isUrlValid = computed(() => {
  try {
    const regexp = props.rule.specify_url_by_regexp
      ? new RegExp(props.rule.site_regexp, 'i')
      : new RegExp(props.rule.site_regexp.replace(/\*/g, '.*'), 'i')
    return regexp.test(window.location.href)
  } catch(e) {
    return false
  }
})

const updateRule = (updatedFields: Partial<Rule>) => {
  emit('update:rule', { ...props.rule, ...updatedFields })
}

const updateTitle = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  updateRule({ title: value })
}

const updateSiteUrl = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  if (props.rule.specify_url_by_regexp) {
    updateRule({ site_regexp: value })
  } else {
    updateRule({ url: value })
  }
}

const updateSpecifyUrlByRegexp = (event: Event) => {
  const value = (event.target as HTMLInputElement).checked
  updateRule({ specify_url_by_regexp: value })
}

const updateHideSelector = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  if (props.rule.hide_block_by_css) {
    updateRule({ hide_block_css: value })
  } else {
    updateRule({ hide_block_xpath: value })
  }
}

const updateHideBlockByCss = (value: boolean) => {
  updateRule({ hide_block_by_css: value })
}

const updateSearchSelector = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  if (props.rule.search_block_by_css) {
    updateRule({ search_block_css: value })
  } else {
    updateRule({ search_block_xpath: value })
  }
}

const updateSearchBlockByCss = (value: boolean) => {
  updateRule({ search_block_by_css: value })
}

const updateBlockAnyway = (value: boolean) => {
  updateRule({ block_anyway: value })
}

const addKeyword = () => {
  if (newKeyword.value.trim()) {
    const exists = props.rule.words.some(
      word => word.text === newKeyword.value.trim()
        && word.is_regexp === regexMatch.value
        && word.is_complete_matching === completeMatch.value
        && word.is_case_sensitive === caseSensitive.value
        && word.is_include_href === includeLinkUrl.value
    )
    
    if (!exists) {
      const updatedWords = [...props.rule.words, {
        text: newKeyword.value.trim(),
        is_regexp: regexMatch.value,
        is_complete_matching: completeMatch.value,
        is_case_sensitive: caseSensitive.value,
        is_include_href: includeLinkUrl.value,
      }]
      
      updateRule({ words: updatedWords })
    }
    
    newKeyword.value = ''
    completeMatch.value = false
    regexMatch.value = false
    caseSensitive.value = false
    includeLinkUrl.value = false
  }
}

const removeKeyword = (index: number) => {
  const updatedWords = [...props.rule.words]
  updatedWords.splice(index, 1)
  updateRule({ words: updatedWords })
}

const addWordGroup = (groupId: string) => {
  const group = props.wordGroups.find(group => group.global_identifier === groupId)
  if (group) {
    const updatedWordGroups = [...props.rule.wordGroups, group]
    updateRule({ wordGroups: updatedWordGroups })
  }
}

const pickPath = (type: string) => {
  emit('pick-path', type)
}

const openHelp = (url: string) => {
  const fullUrl = browser.runtime.getURL(url)
  window.open(fullUrl, 'new', 'width=450,height=500')
}
</script>

<style scoped>
.rule-editor-frame {
  padding: 8px 16px;
}

.section {
  margin-bottom: 8px;
  padding-bottom: 8px;
  margin-top: 8px;
}

.section h2 {
  font-size: 16px;
  font-weight: 500;
  transform: translateY(-5px);
  background-color: white;
}

.section-body {
  padding: 0 8px;
}

.input-section {
  margin-bottom: 6px;
}

.checkbox-section {
  margin: 8px 0;
}

.section-alert {
  color: #d32f2f;
  margin: 4px 0;
  font-size: 14px;
}

.selector-section {
  margin-bottom: 6px;
}

.selector-type {
  margin: 0;
  display: flex;
  gap: 16px;
}

.keywords-section {
  margin-top: 6px;
}

.keywords-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 4px;
}

.keyword-item input {
  flex: 1;
}

.help {
  color: #1976d2;
  text-decoration: none;
  margin-left: 8px;
}

.help:hover {
  text-decoration: underline;
}

.footer {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid #eee;
}

.count {
  display: inline-block;
  min-width: 24px;
  text-align: center;
  background: #e0e0e0;
  border-radius: 12px;
  padding: 2px 6px;
  font-size: 12px;
  margin-right: 4px;
}

.input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.xpath-picker {
  background-color: #2fb947;
  border: none;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.xpath-picker:hover {
  background-color: #2aa440;
}

.xpath-picker img {
  width: 16px;
  height: 16px;
  filter: brightness(0) invert(1);
}
</style>
