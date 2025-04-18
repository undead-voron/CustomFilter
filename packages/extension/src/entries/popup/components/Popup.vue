<script setup lang="ts">
import type { Rule } from '~/types'
import { sendMessageToBackground } from 'deco-ext'
import { computed, ref } from 'vue'
import browser from 'webextension-polyfill'
import TopLogo from '~/assets/top_title.png'
import Plus from '~/components/img/Plus.vue'
import { useBrowserStorage } from '~/composables/useBrowserStorage'
import { EXTENSION_DISABLED_STORAGE_KEY, RULES_STORAGE_KEY, wildcardToRegExp } from '~/utils'
import RuleListItem from './RuleListItem.vue'

const props = defineProps<{ activeUrl: string }>()
// const isEnabled = ref(true)
const version = ref(`${browser.runtime.getManifest().version}`)
const showKeywordGroupNote = ref(true)
const topLogoUrl = new URL(TopLogo, import.meta.url).href

const { value: rules } = useBrowserStorage<Rule[]>(RULES_STORAGE_KEY, [])
const { value: isDisabled } = useBrowserStorage<boolean>(EXTENSION_DISABLED_STORAGE_KEY, false)

const activeRules = computed(() => {
  return rules.value.filter((rule) => {
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

async function openPreferences() {
  // TODO: Implement preferences opening logic
  await sendMessageToBackground('openPreferences', undefined)
}

async function createRule() {
  // TODO: Implement rule creation logic
  await sendMessageToBackground('createRule', undefined)
  window.close()
}

async function editRule(rule: Rule) {
  // TODO: Implement rule editing logic
  await sendMessageToBackground('updateRule', { id: rule.rule_id })
  window.close()
}

async function toggleRule(rule: Rule) {
  // TODO: Implement rule editing logic
  await sendMessageToBackground('toggleRule', { id: rule.rule_id })
}

function deleteRule(rule: Rule) {
  sendMessageToBackground('deleteRule', { id: rule.rule_id })
}

// const dismissKeywordGroupNote = () => {
//   showKeywordGroupNote.value = false
//   // TODO: Save dismissal state to storage
// }

async function setEnabledState(isEnabled: boolean) {
  browser.storage.local.set({ [EXTENSION_DISABLED_STORAGE_KEY]: !isEnabled })
}
</script>

<template>
  <div class="popup flex flex-col grow shrink">
    <div class="flex flex-row items-center justify-between">
      <h1><img :src="topLogoUrl" width="156" alt="CustomBlocker"></h1>
      <div class="flex flex-row items-center gap-lg px-md">
        <div class="flex flex-row items-center gap-sm">
          <input id="buttonOn" v-model="isDisabled" type="radio" name="extension_enable" :value="false" @change="setEnabledState(true)">
          <label for="buttonOn">ON</label>
        </div>
        <div class="flex flex-row items-center gap-sm">
          <input id="buttonOff" v-model="isDisabled" type="radio" name="extension_enable" :value="true" @change="setEnabledState(false)">
          <label for="buttonOff">OFF</label>
        </div>
        <a href="#" class="px-lg" @click.prevent="openPreferences">
          <!-- <span>Preferences</span> -->
          <span>Help</span>
        </a>
      </div>
    </div>

    <div class="content flex flex-col grow shrink">
      <div class="flex flex-col gap-md grow shrink">
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

      <div class="flex flex-row justify-end text-[10px]">
        Version <span>{{ version }}</span>
      </div>
      <div class="flex flex-row">
        <a href="#" class="create-rule-button flex flex-row items-center" @click.prevent="createRule">
          <Plus width="1.2em" height="1.2em" class="mr-sm" /> Create a new rule for this site
        </a>
      </div>
    </div>
  </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

.popup {
  width: 480px;
  min-height: 180px;
  margin: 0;
  padding: 7px;
  font-family:
    'Hiragino Kaku Gothic ProN', 'YuGothic', 'Yu Gothic', 'Meiryo', 'MS Gothic', 'Lucida Grande', 'Helvetica', 'Arial',
    sans-serif;
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
  font-size: 14px;
  text-decoration: none;
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
