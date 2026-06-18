<script setup lang="ts">
import type { TenGodItem } from '@/engine'

defineProps<{
  tenGods: TenGodItem[]
  dayMaster: string
}>()
</script>

<template>
  <div class="card">
    <div class="card-title">十神标注（日主 {{ dayMaster }}）</div>
    <div class="ten-god-grid">
      <div v-for="(tg, idx) in tenGods" :key="idx" class="ten-god-item">
        <span>{{ tg.stem }}</span>
        <span class="ten-god-name">{{ tg.tenGod }}</span>
      </div>
    </div>
  </div>
</template>
