<template>
  <main>
    <div class="flex flex-col p-2lg gap-lg">
      <div class="flex flex-row items-center">
        <h1><img src="/img/top_title.png" alt="CustomBlocker browser extension" /></h1>
      </div>

      <!-- Tab navigation -->
      <!-- <div class="flex border-b border-gray-200">
        <button 
          class="py-2 px-4 font-medium text-sm" 
          :class="{ 'bg-brand-blue text-white': activeTab === 'rules', 'text-black bg-white': activeTab !== 'rules' }"
          @click="activeTab = 'rules'"
        >
          Rules Editor
        </button>
        <button 
          class="py-2 px-4 font-medium text-sm" 
          :class="{ 'bg-brand-blue text-white': activeTab === 'help', 'text-black bg-white': activeTab !== 'help' }"
          @click="activeTab = 'help'"
        >
          Help
        </button>
      </div> -->

      <!-- Tab content -->
      <!-- <div class="flex flex-row items-center" v-if="activeTab === 'rules'">
        <RulesEditor />
      </div> -->
      <!-- <div v-if="activeTab === 'help'"> -->
        <HelpEn />
      <!-- </div> -->
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// import RulesEditor from "./RulesEditor.vue";
import HelpEn from "./HelpEn.vue";

// const activeTab = ref('help');
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
