<script setup lang="ts">
import { ELEMENT_COLORS, ELEMENT_ICONS } from '@/engine'
import type { FiveElementCount } from '@/engine'

const props = defineProps<{
  elements: FiveElementCount[]
  missing: string | null
}>()
</script>

<template>
  <div class="card">
    <div class="card-title">五行统计</div>
    <div v-for="fe in elements" :key="fe.element" class="element-bar-item">
      <span class="element-icon">{{ ELEMENT_ICONS[fe.element] }}</span>
      <span class="element-name">{{ fe.element }}</span>
      <div class="element-bar-wrap">
        <div
          class="element-bar-fill"
          :style="{ width: Math.max(fe.percentage, 5) + '%', background: ELEMENT_COLORS[fe.element] }"
        >
          <span v-if="fe.count > 0" class="element-bar-text">{{ fe.count }}</span>
        </div>
      </div>
    </div>
    <div v-if="missing" class="element-missing">
      ⚠️ {{ missing }}
    </div>
  </div>
</template>
