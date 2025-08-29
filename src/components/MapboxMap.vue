<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import mapboxgl from 'mapbox-gl'

const mapContainer = ref<HTMLDivElement | null>(null)
const map = ref<mapboxgl.Map | null>(null)

onMounted(() => {
  if (!mapContainer.value) return

  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

  map.value = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/standard',
    center: [37.6173, 55.7558],
    zoom: 10
  });
})

onUnmounted(() => {
  map.value?.remove()
})
</script>

<template>
  <div ref="mapContainer" class="map-container" />
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