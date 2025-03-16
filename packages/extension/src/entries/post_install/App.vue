<template>
  <div id="app">
    <div id="header" class="header">
      <h1><img src="../img/top_title.png" alt="CustomBlocker for Google Chrome"/></h1>
    </div>
    <h2>Welcome to CustomBlocker!</h2>
    <p>
      Thank you for installing CustomBlocker!<br/>
      You can filter any element on any web site with any condition with this extension.
    </p>
    <p>
      If you use it for the first time, please install preset filters (rules) for your favorite sites from the list below
      and try out them by adding some keywords.
    </p>
    <PresetSection />
  </div>
</template>

<script setup lang="ts">
import PresetSection from './components/PresetSection.vue'
</script>

<style scoped>
h2 {
  font-size: 130%;
  font-weight: normal;
  padding-left: 4px;
  padding-top: 10px;
}

p {
  color: #222;
  padding: 2px 4px;
  margin: 2px 2px;
}

.header {
  padding: 0;
  margin-bottom: 6px;
  position: relative;
}

.header h1 {
  font-size: 150%;
  margin: 0;
  padding: 0;
}
</style> 