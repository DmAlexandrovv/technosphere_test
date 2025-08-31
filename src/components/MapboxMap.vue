<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useMap} from '../composables/useMap.ts'

import type {MapMouseEvent} from 'mapbox-gl';
import type {Segment, SegmentGeometry, SpreadGeometry} from '../interfaces/Segment.ts'

import {SEGMENT_SOURCE_ID, SPREAD_LAYER_ID, SPREAD_SOURCE_ID} from '../const';
import {calculateArcPoints, calculateAzimuth, calculateEndpoint} from '../utils';

import SegmentTool from './SegmentTool.vue'
import SegmentEditor from './SegmentEditor.vue';

const mapContainer = ref<HTMLElement | null>(null)
const segments = ref<Segment[]>([])
const selectedSegment = ref<Segment | null>(null)

const { initialize, map } = useMap()

onMounted(async () => {
  if (mapContainer.value) {
    try {
      await initialize({
        container: mapContainer.value,
        style: 'mapbox://styles/mapbox/light-v10',
        center: [37.6173, 55.7558],
        zoom: 12
      }).then(() => {
        map.value?.onLayer('mouseenter', SPREAD_LAYER_ID, () => {
          map.value?.setCanvasStyle({ cursor: 'pointer' })
        });

        map.value?.onLayer('mouseleave', SPREAD_LAYER_ID, () => {
          map.value?.setCanvasStyle({ cursor: '' })
        });

        map.value?.onLayer('click', SPREAD_LAYER_ID, (e: MapMouseEvent) => {
          const features = map.value?.map.queryRenderedFeatures(e.point, {
            layers: [SPREAD_LAYER_ID]
          });

          const currentId = features && features[0]?.properties?.id

          if (currentId) {
            selectedSegment.value = segments.value.find(({ id }) => id === currentId) || null
          }

          if (selectedSegment.value) {
            map.value?.highlightSegment(calcSpreadGeometry(selectedSegment.value))
          }
        });
      })
    } catch (error) {
      console.error('Не удалось инициализировать карту:', error)
    }
  }
});

const calcSpreadGeometry = (segment: Segment): SpreadGeometry => {
  const baseAzimuth = calculateAzimuth(segment.startPoint, segment.azimuthPoint)
  const spreadAngle = Math.abs(segment.spread)
  const startAngle = baseAzimuth - spreadAngle
  const endAngle = baseAzimuth + spreadAngle
  const arcPoints = calculateArcPoints(segment.startPoint, segment.distance, startAngle, endAngle)
  const allPoints = [segment.startPoint, ...arcPoints, segment.startPoint]

  return {
    type: 'Polygon',
    coordinates: [allPoints],
    properties: {
      id: segment.id
    },
  }
}

const rerenderLayer = () => {
  const { segmentGeometry, spreadGeometry } = segments.value
    .reduce((acc: { segmentGeometry: SegmentGeometry[], spreadGeometry: SpreadGeometry[] }, segment: Segment) => {
      const endPoint = calculateEndpoint(segment.startPoint, segment.azimuth, segment.distance);
      const segmentGeometry: SegmentGeometry = {
        type: 'LineString',
        coordinates: [segment.startPoint, endPoint],
      };
      const spreadGeometry: SpreadGeometry = calcSpreadGeometry(segment)

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

const createSegment = (item: Segment) => {
  segments.value.push(item)

  rerenderLayer()
}

const handleDeleteSegment = () => {
  segments.value = segments.value.filter(({ id }) => id !== selectedSegment.value?.id)
  selectedSegment.value = null

  map.value?.removeHighlightSegment()

  rerenderLayer()
}

const handleCloseInfo = () => {
  selectedSegment.value = null

  map.value?.removeHighlightSegment()
}
</script>

<template>
  <div ref="mapContainer" id="#map" class="map-container" />

  <segment-tool v-if="map !== null" @segment-created="createSegment" />
  <segment-editor
    v-if="selectedSegment"
    :segment="selectedSegment"
    @delete="handleDeleteSegment"
    @close="handleCloseInfo"
  />
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