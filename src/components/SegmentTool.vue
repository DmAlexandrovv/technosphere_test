<script setup lang="ts">
import { ref, onUnmounted, onMounted } from 'vue'

import type { MapMouseEvent } from 'mapbox-gl'
import type { SegmentGeometry, SpreadGeometry, Segment } from '../interfaces/Segment.ts'

import { useMap } from '../composables/useMap.ts'

import { calculateAzimuth, calculateDistance, calculateEndpoint, calculateArcPoints } from '../utils'
import { SEGMENT_TEMP_SOURCE_ID, SPREAD_TEMP_SOURCE_ID } from '../const';

const { map } = useMap()

const emit = defineEmits(['segment-created']);

const isDrawing = ref(false);
const isSettingSpread = ref(false);
const startPoint = ref<[number, number] | null>(null);
const azimuthPoint = ref<[number, number] | null>(null);
const currentAzimuth = ref(0);
const currentDistance = ref(0);
const currentSpread = ref(0);
const currentMousePosition = ref<[number, number] | null>(null);

onMounted(() => {
  map.value?.on('click', handleMapClick);
  map.value?.on('mousemove', handleMouseMove);
})

onUnmounted(() => {
  map.value?.cleanupDrawing(SEGMENT_TEMP_SOURCE_ID, SPREAD_TEMP_SOURCE_ID)

  map.value?.off('click', handleMapClick);
  map.value?.off('mousemove', handleMouseMove);
});

const startDrawing = () => {
  if (!map.value) {
    return
  }

  map.value.setCanvasStyle({ cursor: 'crosshair' })

  isDrawing.value = true
  isSettingSpread.value = false
  startPoint.value = null
  azimuthPoint.value = null
  currentAzimuth.value = 0
  currentDistance.value = 0
  currentSpread.value = 0
};

const cancelDrawing = () => {
  map.value?.cleanupDrawing(SEGMENT_TEMP_SOURCE_ID, SPREAD_TEMP_SOURCE_ID)
  map.value?.setCanvasStyle({ cursor: '' });

  isDrawing.value = false;
  isSettingSpread.value = false;
};

const handleMapClick = (e: MapMouseEvent) => {
  if (!map.value || !e.lngLat) return;

  if (!startPoint.value) {
    startPoint.value = [e.lngLat.lng, e.lngLat.lat]

    map.value.setCanvasStyle({ cursor: 'crosshair' })
  } else if (!azimuthPoint.value) {
    azimuthPoint.value = [e.lngLat.lng, e.lngLat.lat]

    updateAzimuthAndDistance()

    isSettingSpread.value = true

    map.value.setCanvasStyle({ cursor: 'ew-resize' })
  } else {
    completeSegment()
  }
};

const handleMouseMove = (e: MapMouseEvent) => {
  if (!map.value || !e.lngLat) return;

  currentMousePosition.value = [e.lngLat.lng, e.lngLat.lat];

  if (startPoint.value && azimuthPoint.value && isSettingSpread.value) {
    updateSpread();
  } else if (startPoint.value && !azimuthPoint.value) {
    updateAzimuthVisualization();
  }
};

const updateAzimuthAndDistance = () => {
  if (!startPoint.value || !azimuthPoint.value) return;

  currentAzimuth.value = calculateAzimuth(startPoint.value, azimuthPoint.value);
  currentDistance.value = calculateDistance(startPoint.value, azimuthPoint.value);
};

const updateAzimuthVisualization = () => {
  if (!map.value || !startPoint.value || !currentMousePosition.value) return;

  const azimuth = calculateAzimuth(startPoint.value, currentMousePosition.value);
  const distance = calculateDistance(startPoint.value, currentMousePosition.value);

  currentAzimuth.value = Math.round(azimuth);
  currentDistance.value = distance;

  const endPoint = calculateEndpoint(startPoint.value, azimuth, distance);
  const segmentGeometry: SegmentGeometry = {
    type: 'LineString',
    coordinates: [startPoint.value, endPoint]
  };

  map.value?.updateSegmentLayer(SEGMENT_TEMP_SOURCE_ID, [segmentGeometry])
};

const updateSpread = () => {
  if (!startPoint.value || !azimuthPoint.value || !currentMousePosition.value) return;

  const mouseAzimuth = calculateAzimuth(startPoint.value, currentMousePosition.value);
  const baseAzimuth = calculateAzimuth(startPoint.value, azimuthPoint.value);

  let spread = mouseAzimuth - baseAzimuth;

  if (spread > 180) spread -= 360;
  if (spread < -180) spread += 360;

  currentSpread.value = spread;

  updateSpreadVisualization();
};

const updateSpreadVisualization = () => {
  if (!map.value || !startPoint.value || !azimuthPoint.value) return;

  const baseAzimuth = calculateAzimuth(startPoint.value, azimuthPoint.value);
  const distance = calculateDistance(startPoint.value, azimuthPoint.value);

  const endPoint = calculateEndpoint(startPoint.value, baseAzimuth, distance);
  const segmentGeometry: SegmentGeometry = {
    type: 'LineString',
    coordinates: [startPoint.value, endPoint]
  };

  const spreadAngle = Math.abs(currentSpread.value);
  const startAngle = baseAzimuth - spreadAngle;
  const endAngle = baseAzimuth + spreadAngle;
  const arcPoints = calculateArcPoints(startPoint.value, distance, startAngle, endAngle);
  const allPoints = [startPoint.value, ...arcPoints, startPoint.value];

  const spreadGeometry: SpreadGeometry = {
    type: 'Polygon',
    coordinates: [allPoints]
  };

  map.value?.updateMapLayers(
    SEGMENT_TEMP_SOURCE_ID,
    SPREAD_TEMP_SOURCE_ID,
    [segmentGeometry],
    [spreadGeometry],
  )
};

const completeSegment = () => {
  if (!startPoint.value || !azimuthPoint.value) return;

  const segment: Segment = {
    id: Date.now().toString(),
    startPoint: startPoint.value,
    azimuth: currentAzimuth.value,
    distance: currentDistance.value,
    spread: Math.abs(currentSpread.value),
    azimuthPoint: azimuthPoint.value,
  };

  emit('segment-created', segment);

  map.value?.cleanupDrawing(SEGMENT_TEMP_SOURCE_ID, SPREAD_TEMP_SOURCE_ID)

  isDrawing.value = false
  isSettingSpread.value = false

  if (map.value) {
    map.value.setCanvasStyle({ cursor: '' })
  }
};
</script>

<template>
  <div class="segment-tool">
    <div v-if="isDrawing" class="segment-tool__info">
      <div>Азимут: {{ currentAzimuth }}°</div>
      <div>Расстояние: {{ currentDistance.toFixed(2) }}м</div>
      <div v-if="currentSpread !== 0">Створ: ±{{ currentSpread }}°</div>
    </div>

    <div class="segment-tool__control">
      <button class="segment-tool__button" :disabled="isDrawing" @click="startDrawing">
        Создать сегмент
      </button>
      <button v-if="isDrawing" class="segment-tool__button" @click="cancelDrawing">
        Отмена
      </button>
    </div>
  </div>
</template>

<style scoped>
.segment-tool {
  position: absolute;
  top: 20px;
  left: 20px;
  background: #FFF;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.segment-tool__info {
  margin-bottom: 10px;
  padding: 5px;
  background: #f5f5f5;
  border-radius: 3px;
}

.segment-tool__button {
  margin-right: 5px;
  border-color: #000;
  cursor: pointer;
}
</style>