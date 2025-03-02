<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PRESET_RULES } from '../preset_en'
import type { Rule } from '~/services/types' // You'll need to define types

interface SiteWrapper {
  site: any
  ruleWrappers: RuleWrapper[]
  open: boolean
  duplicate: boolean
  checked: boolean
}

interface RuleWrapper {
  rule: Rule
  duplicate: boolean
  checked: boolean
}

const sites = ref<any[]>([])
const checkAll = ref(true)

// Initialize sites
const initSites = () => {
  // TODO: fix it

  sites.value = PRESET_RULES.map(site => ({
    site,
    ruleWrappers: site.rules.map(rule => ({
      rule,
      duplicate: false,
      checked: true
    })),
    open: false,
    duplicate: false,
    checked: true
  }))
}

const toggleAll = () => {
  sites.value.forEach(site => {
    site.checked = checkAll.value
    site.ruleWrappers.forEach(rule => rule.checked = checkAll.value)
  })
}

const useChecked = async () => {
  const rulesToUse = sites.value.flatMap(site =>
    site.ruleWrappers
      .filter(rule => rule.checked && !rule.duplicate)
      .map(rule => rule.rule)
  )

  try {
    // TODO: fix it

    /*await Promise.all(rulesToUse.map(rule =>
      new Promise((resolve) => cbStorage.saveRule(rule, resolve))
    )*/
    // Reload logic
  } catch (error) {
    console.error('Error saving rules:', error)
  }
}

onMounted(() => {
  initSites()
  // Load existing rules and check duplicates
})
</script>

<template>
  <div class="welcome-install">
    <h2>Welcome to CustomBlocker!</h2>
    <p>Thank you for installing CustomBlocker!<br>
      You can filter any element on any web site with any condition with this extension.
    </p>

    <div class="preset-section">
      <div class="check-all">
        <input v-model="checkAll" type="checkbox" id="checkAll">
        <label for="checkAll">All</label>
      </div>

      <ul class="sites">
        <li v-for="(site, index) in sites" :key="index" :class="{ duplicate: site.duplicate }">
          <input v-model="site.checked" type="checkbox" :disabled="site.duplicate">
          <img :src="`chrome://favicon/${site.site.url}`" alt="Favicon" class="favicon">
          <span class="site-title">{{ site.site.name }}</span>

          <ul class="rules">
            <li v-for="(rule, ruleIndex) in site.ruleWrappers" :key="ruleIndex" :class="{ duplicate: rule.duplicate }">
              <input v-model="rule.checked" type="checkbox" :disabled="rule.duplicate">
              {{ rule.rule.title }}
            </li>
          </ul>
        </li>
      </ul>

      <button @click="useChecked" class="button-use">
        Install Checked Filters
      </button>
    </div>
  </div>
</template>

<style module>
.welcome-install {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.preset-section {
  margin-top: 20px;
  border: 1px solid #888;
  padding: 10px;
}

.sites {
  height: 420px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
}

.site-title {
  margin-left: 10px;
  vertical-align: middle;
}

.button-use {
  margin-top: 15px;
  padding: 8px 20px;
  background: #0db3ea;
  color: white;
  border: none;
  cursor: pointer;
}

/* Add more styles based on original CSS */
</style>
