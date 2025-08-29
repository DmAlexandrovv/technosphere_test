<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMap } from '../composables/useMap.ts'

const mapContainer = ref<HTMLElement | null>(null)
const { initialize } = useMap()

onMounted(async () => {
  if (mapContainer.value) {
    try {
      await initialize({
        container: mapContainer.value,
        style: 'mapbox://styles/mapbox/light-v10',
        center: [37.6173, 55.7558],
        zoom: 12
      })
    } catch (error) {
      console.error('Не удалось инициализировать карту:', error)
    }
  }
})
</script>

<template>
  <div ref="mapContainer" id="#map" class="map-container" />
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  min-height: 400px;

  overflow: hidden;
}

:deep(.map-container) {
  position: relative;
}

:deep(.mapboxgl-canvas-container) {
  width: 100%;
}

:deep(.mapboxgl-control-container) {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>