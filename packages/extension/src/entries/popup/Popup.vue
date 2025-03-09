<template>
  <div class="popup">
    <div class="flex flex-row items-center justify-between">
      <h1><img src="../img/top_title.png" width="156" alt="CustomBlocker" /></h1>
      <div class="flex flex-row items-center gap-md">
        <div class="flex flex-row items-center gap-sm">
          <input type="radio" name="extension_enable" id="buttonOn" v-model="isEnabled" :value="true" @change="setEnabledState($event.target.checked)" />
          <label for="buttonOn">ON</label>
        </div>
        <div class="flex flex-row items-center gap-sm">
          <input type="radio" name="extension_enable" id="buttonOff" v-model="isEnabled" :value="false" @change="setEnabledState(!$event.target.checked)" />
          <label for="buttonOff">OFF</label>
        </div>
        <a href="#" @click.prevent="openPreferences">
          <span>Preferences</span>
        </a>
      </div>
      
    </div>

    <div class="content">
      <div class="rule-section">
        <div class="rule-section-header">
          <h2>Active Rules</h2>
        </div>
        <ul class="active-rules">
          <template v-if="activeRules.length">
            <RuleListItem
              v-for="rule in activeRules"
              :key="rule.rule_id"
              :rule="rule"
              @edit="editRule"
              @delete="deleteRule"
              @toggle="toggleRule"
            />
          </template>
          <li v-else class="empty">
            No rules defined for this site.
          </li>
        </ul>
      </div>

      <div class="version">Version <span>{{ version }}</span></div>
      <div>
        <a href="#" class="create-rule-button" @click.prevent="createRule">
          Create a new rule for this site
        </a>
      </div>

      <div v-if="showKeywordGroupNote" class="note note--dismissable">
        <a :href="keywordGroupUrl" target="_blank" class="note__link">
          Keyword groups feature is supported in version 4.x!
        </a>
        <a href="#" class="note__dismiss" @click.prevent="dismissKeywordGroupNote">×</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import RuleListItem from './components/RuleListItem.vue'
import type { Rule } from '../types'
import {sendMessageToBackground} from 'deco-ext'
import browser from 'webextension-polyfill'
import { isExtensionEnabled, RULES_STORAGE_KEY, setExtensionEnabledState, useBrowserStorage, wildcardToRegExp } from '~/utils'

const isEnabled = ref(true)
const version = ref(`${browser.runtime.getManifest().version}`)
const showKeywordGroupNote = ref(true)
const keywordGroupUrl = 'pref/word_group.html'

const props = defineProps<{activeUrl: string}>()

const {value: rules} = useBrowserStorage<Rule[]>(RULES_STORAGE_KEY, [])

const activeRules = computed(() => {
  return rules.value.filter(rule => {
    try {
        let regex
        if (rule.specify_url_by_regexp) {
          regex = new RegExp(rule.site_regexp, 'i')
        }
        else {
          regex = new RegExp(wildcardToRegExp(rule.url), 'i')
        }
        return regex.test(props.activeUrl)
      }
      catch (e) {
        console.log(e)
      }
      return false
  })
})

const openPreferences = async () => {
  // TODO: Implement preferences opening logic
  await sendMessageToBackground('openPreferences', undefined)
}

const createRule = async () => {
  // TODO: Implement rule creation logic
  await sendMessageToBackground('createRule', undefined)
  window.close();
  
}

const editRule = async (rule: Rule) => {
  // TODO: Implement rule editing logic
  await sendMessageToBackground('updateRule', {id: rule.rule_id})
  window.close();
}

const toggleRule = async (rule: Rule) => {
  // TODO: Implement rule editing logic
  await sendMessageToBackground('toggleRule', {id: rule.rule_id})
}

const deleteRule = (rule: Rule) => {
  // TODO: Implement rule deletion logic
}

const dismissKeywordGroupNote = () => {
  showKeywordGroupNote.value = false
  // TODO: Save dismissal state to storage
}

const setEnabledState = async (isEnabled: boolean) => {
  await setExtensionEnabledState(isEnabled)
}

const updateEnabledState = async () => {
  isEnabled.value = await isExtensionEnabled()
}

onMounted(async () => {
  // TODO: Load initial state
  // - Load active rules
  // - Load version
  // - Load keyword group note dismissal state
  await updateEnabledState()
  // const dismissed = await sendMessageToBackground('getKeywordGroupNoteDismissalState', {})
  // showKeywordGroupNote.value = dismissed
})
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

.popup {
  width: 480px;
  margin: 0;
  padding: 7px;
  font-family: 'Hiragino Kaku Gothic ProN', 'YuGothic', 'Yu Gothic', 'Meiryo', 'MS Gothic', 'Lucida Grande', 'Helvetica', 'Arial', sans-serif;
}

.header {
  height: 30px;
  line-height: 30px;
  padding-top: 7px;
  padding-right: 6px;
}

.header .menu {
  width: 280px;
  height: inherit;
  float: right;
  text-align: right;
  font-size: 10px;
}

.header h1 {
  font-size: 1.4px;
  margin: 0 200px 0 4px;
  padding: 0;
  height: inherit;
  color: #333;
  font-weight: normal;
}


.rule-section {
  margin-bottom: 6px;
}

.rule-section-header {
  line-height: 22px;
  height: 22px;
  color: #333;
  font-weight: bold;
  text-indent: 4px;
  font-size: 13px;
  border-bottom: solid 1px #ddd;
}

.rule-section-header h2 {
  font-size: 12px;
  margin: 0;
  padding: 0;
  font-weight: normal;
  display: inline;
}

.active-rules {
  margin: 0;
  padding: 0;
}

.active-rules .empty {
  line-height: 24px;
  font-size: 80%;
  text-indent: 4px;
  color: #444;
}

.version {
  color: #444;
  text-align: right;
  float: right;
  width: 100px;
  font-size: 80%;
  line-height: 150%;
}

.create-rule-button {
  color: #666;
  background: url(../assets/img/button/add.png) no-repeat;
  background-size: 16px 16px;
  text-indent: 20px;
  display: inline-block;
  height: 16px;
  font-size: 14px;
  text-decoration: none;
  margin: 0.5em 0;
}

.create-rule-button:hover {
  text-decoration: underline;
}

.note {
  background-color: #cdedf8;
  border: solid 1px #249bc3;
  padding: 0.5em;
  position: relative;
  color: #249bc3;
}

.note__link {
  color: #249bc3;
}

.note__dismiss {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url(../assets/img/keyword_delete.png) no-repeat 4px 4px;
  background-size: 7px 7px;
  text-indent: -9999px;
  position: absolute;
  top: 0;
  right: 0;
}
</style> 