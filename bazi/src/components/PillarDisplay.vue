<script setup lang="ts">
import type { BaziResult } from '@/engine'
import { TEN_GODS_MATRIX } from '@/engine'

const props = defineProps<{ result: BaziResult }>()

const pillars = [
  { label: '年柱', pillar: props.result.yearPillar, stemIndex: props.result.yearPillar.stemIndex },
  { label: '月柱', pillar: props.result.monthPillar, stemIndex: props.result.monthPillar.stemIndex },
  { label: '日柱', pillar: props.result.dayPillar, stemIndex: props.result.dayPillar.stemIndex },
  { label: '时柱', pillar: props.result.hourPillar, stemIndex: props.result.hourPillar.stemIndex }
]

function getTenGod(stemIdx: number): string {
  return TEN_GODS_MATRIX[props.result.dayMasterIndex][stemIdx]
}
</script>

<template>
  <div class="card">
    <div class="card-title">四柱八字</div>
    <div class="pillars-grid">
      <div v-for="p in pillars" :key="p.label" class="pillar-card">
        <div class="pillar-label">{{ p.label }}</div>
        <div class="pillar-stem">{{ p.pillar.stem }}</div>
        <div class="pillar-branch">{{ p.pillar.branch }}</div>
        <div class="pillar-ten-god">{{ getTenGod(p.stemIndex) }}</div>
        <div class="pillar-full">{{ p.pillar.fullStemBranch }}</div>
      </div>
    </div>
    <div style="text-align:center; font-size:13px; color:var(--text-light); margin-top:4px;">
      日主：<strong style="color:var(--primary);">{{ result.dayMaster }}</strong>
    </div>
  </div>
</template>
