<script setup lang="ts">
import type { PropType } from 'vue'
import type { SegmentPanelProps } from '../interfaces/Segment.ts'

import SegmentInfo from './SegmentInfo.vue'

defineEmits(['delete', 'close', 'edit'])

const { segment } = defineProps({
  segment: {
    type: Object as PropType<SegmentPanelProps>,
    required: true
  }
})
</script>

<template>
  <segment-info :segment="segment">
    <button class="segment-tool__button" @click="$emit('delete')">
      Удалить
    </button>
    <button class="segment-tool__button" @click="$emit('close')">
      Закрыть
    </button>
    <button class="segment-tool__button" @click="$emit('edit')">
      Редактировать
    </button>
  </segment-info>
</template>

<style scoped>
.segment-tool__button {
  margin-right: 5px;
  border-color: #000;
  cursor: pointer;
}
</style>