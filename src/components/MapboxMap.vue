<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMap } from '../composables/useMap.ts'

import SegmentTool from './SegmentTool.vue'

import type { Segment, SegmentGeometry, SpreadGeometry } from '../interfaces/Segment.ts'

import { SEGMENT_SOURCE_ID, SPREAD_SOURCE_ID } from '../const';
import { calculateArcPoints, calculateAzimuth, calculateEndpoint } from '../utils';

const mapContainer = ref<HTMLElement | null>(null)
const segments = ref<Segment[]>([])

const { initialize, map } = useMap()

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
});

const createSegment = (item: Segment) => {
  segments.value.push(item)

  const { segmentGeometry, spreadGeometry } = segments.value.reduce((acc: Record<string, Array>, segment: Segment) => {
    const endPoint = calculateEndpoint(segment.startPoint, segment.azimuth, segment.distance);
    const segmentGeometry: SegmentGeometry = {
      type: 'LineString',
      coordinates: [segment.startPoint, endPoint]
    };

    const baseAzimuth = calculateAzimuth(segment.startPoint, segment.azimuthPoint);
    const spreadAngle = Math.abs(segment.spread);
    const startAngle = baseAzimuth - spreadAngle;
    const endAngle = baseAzimuth + spreadAngle;
    const arcPoints = calculateArcPoints(segment.startPoint, segment.distance, startAngle, endAngle);
    const allPoints = [segment.startPoint, ...arcPoints, segment.startPoint];

    const spreadGeometry: SpreadGeometry = {
      type: 'Polygon',
      coordinates: [allPoints]
    };

    return {
      segmentGeometry: [...acc.segmentGeometry, segmentGeometry],
      spreadGeometry: [...acc.spreadGeometry, spreadGeometry],
    }
  }, { segmentGeometry: [], spreadGeometry: [] })

  map.value?.updateMapLayers(
      SEGMENT_SOURCE_ID,
      SPREAD_SOURCE_ID,
      segmentGeometry,
      spreadGeometry,
  )
}
</script>

<template>
  <div ref="mapContainer" id="#map" class="map-container" />

  <segment-tool v-if="map !== null" @segment-created="createSegment" />
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