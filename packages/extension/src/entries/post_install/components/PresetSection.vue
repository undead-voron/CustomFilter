<template>
  <div class="presetSection">
    <input
      type="checkbox"
      id="checkAll"
      v-model="allChecked"
      @change="toggleAll"
      :disabled="allDisabled"
    />
    <label for="checkAll">All</label>
    <ul id="sites" class="sites">
      <SiteItem
        v-for="site in siteWrappers"
        :key="site.site.name"
        :siteWrapper="site"
        @update:checked="updateSiteChecked"
      />
    </ul>
    <div>
      <input
        type="button"
        value="Install Checked Filters"
        class="buttonUse"
        @click="useChecked"
        :disabled="!hasCheckedRules"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Site, SiteWrapper, Rule } from '../types'
import SiteItem from './SiteItem.vue'
import { PRESET_RULES } from '../welcome/preset_en'

declare const chrome: any
declare const cbStorage: any

const siteWrappers = ref<SiteWrapper[]>([])
const allChecked = ref(true)

const hasCheckedRules = computed(() => {
  return siteWrappers.value.some(site =>
    site.ruleWrappers.some(rule => !rule.isAlreadyImported && rule.isChecked)
  )
})

const allDisabled = computed(() => {
  return siteWrappers.value.every(site => site.isDisabled)
})

const createSiteWrapper = (site: Site): SiteWrapper => {
  return {
    site,
    ruleWrappers: site.rules.map(rule => ({
      label: rule.title,
      rule: {
        ...rule,
        search_block_by_css: !!rule.search_block_by_css,
        hide_block_by_css: !!rule.hide_block_by_css,
        title: `${site.name} | ${rule.title}`,
        is_disabled: false,
        site_regexp: rule.site_regexp || '',
        example_url: rule.example_url || '',
        specify_url_by_regexp: !!rule.specify_url_by_regexp,
        search_block_xpath: rule.search_block_xpath || '',
        search_block_css: rule.search_block_css || '',
        hide_block_xpath: rule.hide_block_xpath || '',
        hide_block_css: rule.hide_block_css || '',
        user_identifier: null,
        global_identifier: null,
        insert_date: 0,
        update_date: 0,
        delete_date: 0
      },
      isChecked: true,
      isAlreadyImported: false
    })),
    isOpen: false,
    isDisabled: false
  }
}

const toggleAll = () => {
  siteWrappers.value.forEach(site => {
    if (!site.isDisabled) {
      site.ruleWrappers.forEach(rule => {
        rule.isChecked = allChecked.value
      })
    }
  })
}

const updateSiteChecked = (site: SiteWrapper, checked: boolean) => {
  site.ruleWrappers.forEach(rule => {
    if (!site.isDisabled) {
      rule.isChecked = checked
    }
  })
}

const useChecked = () => {
  const rulesToUse = siteWrappers.value.flatMap(site =>
    site.ruleWrappers.filter(rule => rule.isChecked && !rule.isAlreadyImported)
  )

  rulesToUse.forEach(ruleWrapper => {
    cbStorage.saveRule(ruleWrapper.rule, null)
    ruleWrapper.isAlreadyImported = true
  })

  try {
    const bgWindow = chrome.extension.getBackgroundPage()
    bgWindow.reloadLists()
  } catch (ex) {
    alert(ex)
  }
}

const disableDuplicateRules = (existingRule: Rule) => {
  siteWrappers.value.forEach(site => {
    let hasNewRules = false
    site.ruleWrappers.forEach(ruleWrapper => {
      if (
        ruleWrapper.rule.site_regexp === existingRule.site_regexp &&
        ruleWrapper.rule.search_block_css === existingRule.search_block_css &&
        ruleWrapper.rule.hide_block_css === existingRule.hide_block_css &&
        ruleWrapper.rule.specify_url_by_regexp === existingRule.specify_url_by_regexp &&
        !ruleWrapper.isAlreadyImported
      ) {
        ruleWrapper.isAlreadyImported = true
        ruleWrapper.isChecked = false
      }
      if (!ruleWrapper.isAlreadyImported) {
        hasNewRules = true
      }
    })
    if (!hasNewRules && !site.isDisabled) {
      site.isDisabled = true
    }
  })
}

onMounted(() => {
  siteWrappers.value = PRESET_RULES.map(createSiteWrapper)
  cbStorage.loadAll((rules: Rule[]) => {
    rules.forEach(disableDuplicateRules)
  })
})
</script>

<style scoped>
.presetSection {
  padding: 4px;
}

.presetSection ul.sites {
  margin: 2px;
}

.sites {
  border: 1px solid #888;
  height: 420px;
  overflow-y: auto;
  list-style-type: none;
  padding-left: 8px;
  line-height: 100%;
}

.buttonUse {
  font-size: 120%;
  margin-top: 4px;
}
</style> 