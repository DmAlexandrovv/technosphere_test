<script setup lang="ts">
import type { PropType } from 'vue'
import type { SegmentPanelProps } from '../interfaces/Segment.ts'

const { segment } = defineProps({
  segment: {
    type: Object as PropType<SegmentPanelProps>,
    required: true
  }
});
</script>

<template>
  <div class="segment-tool">
    <div class="segment-tool__info">
      <div>Азимут: {{ segment.azimuth }}°</div>
      <div>Расстояние: {{ segment.distance.toFixed(2) }}м</div>
      <div v-if="segment.spread !== 0">Створ: ±{{ segment.spread }}°</div>
    </div>

    <slot></slot>
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
</style>