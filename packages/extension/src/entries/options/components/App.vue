<template>
  <main>
    <div class="flex flex-col p-2lg gap-lg">
      <div class="flex flex-row items-center">
        <h1><img src="/img/top_title.png" alt="CustomBlocker browser extension" /></h1>
      </div>
      <HelpEn />
    </div>
  </main>
</template>

<script setup lang="ts">
import HelpEn from "./HelpEn.vue";

// const activeTab = ref('help');
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
