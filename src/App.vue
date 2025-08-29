<template>
  <div id="app">
    <main class="app-main">
      <MapboxMap />
    </main>
  </div>
</template>

<script setup lang="ts">
import MapboxMap from './components/MapboxMap.vue'

</script>

<style>
#app {
  height: 100vh;
}

.app-main {
  height: 100%;
}
</style>