<template>
  <header class="header">
    <h1>
      <img :src="logoImageUrl" alt="CustomBlocker for Google Chrome">
    </h1>
  </header>
</template>
<script setup lang="ts">
import logo from "~/assets/logo.svg";

const logoImageUrl = new URL(logo, import.meta.url).href;
</script>

<style module>
.header {
  padding: 0;
  margin-bottom: 6px;
  position: relative;
}
</style>
