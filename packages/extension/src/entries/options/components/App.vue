<template>
  <main>
    <div class="flex flex-col p-2lg gap-lg">
      <div class="flex flex-row items-center">
        <h1><img src="/img/top_title.png" alt="CustomBlocker browser extension" /></h1>
      </div>
      
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <router-link
            v-for="tab in tabs"
            :key="tab.id"
            :to="tab.path"
            :class="[
              $route.path === tab.path
                ? 'bg-brand-blue grow-0 shrink-0 text-white'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              'whitespace-nowrap border-b-2 py-md px-lg text-sm'
            ]"
          >
            {{ tab.name }}
          </router-link>
        </nav>
      </div>

      <div class="mt-4">
        <router-view></router-view>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { id: 'tutorial', name: 'Tutorial', path: '/tutorial' },
  { id: 'wordGroups', name: 'Word Groups', path: '/word-groups' }
]
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
