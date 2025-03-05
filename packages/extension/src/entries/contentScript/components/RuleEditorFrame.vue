<template>
  <div class="rule-editor-frame">
    <section class="section">
      <div class="section-body">
        <div class="input-section">
          <label>Name</label>
          <input type="text" v-model="rule.title" />
        </div>
      </div>
    </section>

    <section class="section">
      <h2>Target Sites</h2>
      <div class="section-body">
        <div class="input-section">
          <label>URL</label>
          <input type="text" v-model="rule.site_regexp" />
          <a class="help" href="site.html">?</a>
        </div>
        <div class="checkbox-section">
          <input type="checkbox" id="specify-url-regexp" v-model="rule.specify_url_by_regexp" />
          <label for="specify-url-regexp">Use RegExp</label>
        </div>
        <div v-if="!isUrlValid" class="section-alert">
          This expression does not match this site.
        </div>
        <div class="description">
          The asterisk (*) matches zero or more characters.
          This rule is applied on matched sites.
        </div>
      </div>
    </section>

    <section class="section">
      <h2>Elements to Hide</h2>
      <div class="section-body">
        <div class="selector-section">
          <div v-if="!rule.hide_block_by_css" class="input-section">
            <label>
              <span class="count">{{ hideElementsCount }}</span> XPath
            </label>
            <div class="input-group">
              <input type="text" v-model="rule.hide_block_xpath" />
              <button class="xpath-picker" @click="pickPath('hide_xpath')">
                <img :src="wandUrl" alt="Pick" />
              </button>
            </div>
          </div>
          <div v-else class="input-section">
            <label>
              <span class="count">{{ hideElementsCount }}</span> CSS
            </label>
            <div class="input-group">
              <input type="text" v-model="rule.hide_block_css" />
              <button class="xpath-picker" @click="pickPath('hide_css')">
                <img :src="wandUrl" alt="Pick" />
              </button>
            </div>
          </div>
          <div class="selector-type">
            <input type="radio" id="hide-xpath" :value="false" v-model="rule.hide_block_by_css" />
            <label for="hide-xpath">XPath</label>
            <input type="radio" id="hide-css" :value="true" v-model="rule.hide_block_by_css" />
            <label for="hide-css">CSS</label>
          </div>
          <div v-if="hideXPathError" class="section-alert">
            Invalid XPath
          </div>
        </div>
        <div class="description">
          Matched elements will disappear if they meet the condition.
        </div>
      </div>
    </section>

    <section class="section">
      <h2>Condition</h2>
      <div class="section-body">
        <div class="condition-type">
          <div>
            <input type="radio" id="block-anyway" :value="true" v-model="rule.block_anyway" />
            <label for="block-anyway">Block Anyway</label>
            <a class="help" href="block_anyway.html">?</a>
          </div>
          <div>
            <input type="radio" id="block-with-keywords" :value="false" v-model="rule.block_anyway" />
            <label for="block-with-keywords">Filter with Keywords</label>
          </div>
        </div>

        <div v-if="!rule.block_anyway" class="keywords-section">
          <h4>Keywords</h4>
          <div class="keywords-list">
            <div v-for="(keyword, index) in rule.keywords" :key="index" class="keyword-item">
              <input type="text" v-model="rule.keywords[index]" />
              <button @click="removeKeyword(index)">×</button>
            </div>
          </div>
          <div class="new-keyword">
            <input type="text" v-model="newKeyword" @keyup.enter="addKeyword" />
            <button @click="addKeyword">Add</button>
            <a class="help" href="keywords.html">?</a>
          </div>

          <h4>Search Range</h4>
          <div class="selector-section">
            <div v-if="!rule.search_block_by_css" class="input-section">
              <label>
                <span class="count">{{ searchElementsCount }}</span> XPath
              </label>
              <div class="input-group">
                <input type="text" v-model="rule.search_block_xpath" />
                <button class="xpath-picker" @click="pickPath('search_xpath')">
                  <img :src="wandUrl" alt="Pick" />
                </button>
              </div>
            </div>
            <div v-else class="input-section">
              <label>
                <span class="count">{{ searchElementsCount }}</span> CSS
              </label>
              <div class="input-group">
                <input type="text" v-model="rule.search_block_css" />
                <button class="xpath-picker" @click="pickPath('search_css')">
                  <img :src="wandUrl" alt="Pick" />
                </button>
              </div>
            </div>
            <div class="selector-type">
              <input type="radio" id="search-xpath" :value="false" v-model="rule.search_block_by_css" />
              <label for="search-xpath">XPath</label>
              <input type="radio" id="search-css" :value="true" v-model="rule.search_block_by_css" />
              <label for="search-css">CSS</label>
            </div>
            <div v-if="searchXPathError" class="section-alert">
              Invalid XPath
            </div>
          </div>
          <div class="description">
            The filter works when these elements contain "Keywords".
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <button @click="$emit('save')">Save</button>
      <button @click="$emit('test')">Test Rule</button>
      <button @click="$emit('close')">Close</button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { Rule } from '~/services/types';
import { ref, computed } from 'vue'
import PathPicker from './PathPicker.vue'
import { getElementsByCssSelector, getElementsByXPath } from '~/utils';
import wand from '~/assets/wand_transparent.png'

const wandUrl = new URL(wand, import.meta.url).href;

const props = defineProps<{
  rule: Rule
}>()

const emit = defineEmits<{
  (e: 'save'): void
  (e: 'test'): void
  (e: 'close'): void
  (e: 'pick-path', type: string): void
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
  const regexp = props.rule.specify_url_by_regexp
    ? new RegExp(props.rule.site_regexp)
    : new RegExp(props.rule.site_regexp.replace(/\*/g, '.*'))
  return regexp.test(window.location.href)
})

const addKeyword = () => {
  if (newKeyword.value.trim()) {
    props.rule.keywords.push(newKeyword.value.trim())
    newKeyword.value = ''
  }
}

const removeKeyword = (index: number) => {
  props.rule.keywords.splice(index, 1)
}

const pickPath = (type: string) => {
  emit('pick-path', type)
}
</script>

<style scoped>
.rule-editor-frame {
  padding: 16px;
}

.section {
  margin-bottom: 24px;
}

.section h2 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
}

.section-body {
  padding: 0 8px;
}

.input-section {
  margin-bottom: 12px;
}

.input-section label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
}

input[type="text"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.checkbox-section {
  margin: 8px 0;
}

.section-alert {
  color: #d32f2f;
  margin: 4px 0;
  font-size: 14px;
}

.description {
  color: #666;
  font-size: 14px;
  margin-top: 8px;
}

.selector-section {
  margin-bottom: 16px;
}

.selector-type {
  margin: 8px 0;
  display: flex;
  gap: 16px;
}

.keywords-section {
  margin-top: 16px;
}

.keywords-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.keyword-item {
  display: flex;
  gap: 8px;
}

.keyword-item input {
  flex: 1;
}

.keyword-item button {
  padding: 4px 8px;
}

.new-keyword {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.new-keyword input {
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
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

button {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}

button:hover {
  background: #eee;
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
