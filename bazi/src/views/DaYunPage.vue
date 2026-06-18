<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBaziStore } from '@/stores/bazi'
import NavBar from '@/components/NavBar.vue'
import BirthInputForm from '@/components/BirthInputForm.vue'
import { calculateDaYun, getLiuNianRange } from '@/engine'
import type { BirthInput, DaYunResult } from '@/engine'

const router = useRouter()
const store = useBaziStore()
const showInput = ref(false)
const dayunResult = ref<DaYunResult | null>(null)
const liuNianList = ref<any[]>([])

function computeDayun(input: BirthInput) {
  const result = store.compute(input)
  dayunResult.value = calculateDaYun(result)
  liuNianList.value = getLiuNianRange(result.dayMasterIndex, result)
  showInput.value = false
}

function fromHistory(idx: number) {
  const r = store.history[idx]
  if (r) {
    store.currentResult = r
    dayunResult.value = calculateDaYun(r)
    liuNianList.value = getLiuNianRange(r.dayMasterIndex, r)
  }
}

onMounted(() => {
  if (store.currentResult) {
    dayunResult.value = calculateDaYun(store.currentResult)
    liuNianList.value = getLiuNianRange(store.currentResult.dayMasterIndex, store.currentResult)
  } else {
    showInput.value = true
  }
})
</script>
<template>
  <div>
    <NavBar />
    <BirthInputForm v-if="showInput" @calculate="computeDayun" />
    <div v-else-if="dayunResult">
      <div class="card" style="text-align:center;">
        <div class="card-title">起运信息</div>
        <p>{{ dayunResult.startAge }}岁起运 · {{ dayunResult.isForward ? '顺排' : '逆排' }}</p>
        <p style="font-size:13px; color:var(--text-light); margin-top:4px;">日主：{{ dayunResult.dayMaster }}({{ dayunResult.dayMasterElement }})</p>
        <p style="font-size:12px; color:#666; margin-top:8px; background:#FFF3E0; padding:8px; border-radius:8px;">{{ dayunResult.summary }}</p>
      </div>

      <div class="card">
        <div class="card-title">大运走势</div>
        <div v-for="(dy, i) in dayunResult.daYunList" :key="i" :class="['dayun-item', { 'dayun-current': i === dayunResult.currentDaYunIndex }]">
          <div class="dayun-age">{{ dy.startAge }}-{{ dy.endAge }}岁</div>
          <div class="dayun-pillar">{{ dy.fullStemBranch }}</div>
          <div class="dayun-ten-god">{{ dy.tenGod }}</div>
          <div class="dayun-desc">{{ dy.description }}</div>
          <div v-if="i === dayunResult.currentDaYunIndex" class="dayun-badge">当前</div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">当前流年 · {{ dayunResult.currentYear }}</div>
        <div v-for="l in liuNianList" :key="l.year" :class="['liunian-item', { 'liunian-current': l.year === dayunResult.currentYear }]">
          <div class="liunian-year">{{ l.year }}</div>
          <div class="liunian-pillar">{{ l.fullStemBranch }}</div>
          <div class="liunian-ten-god">{{ l.tenGod }}</div>
          <div class="liunian-effect">{{ l.effect }}</div>
        </div>
      </div>

      <div class="card" style="text-align:center;">
        <p style="font-size:13px; color:var(--text-light); margin-bottom:12px;">查看完整大运流年解读（含合婚兼容性分析）</p>
        <button class="btn btn-primary" @click="router.push('/pay')">解锁完整报告 →</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.dayun-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-bottom: 1px solid var(--border); font-size: 13px; }
.dayun-item:last-child { border-bottom: none; }
.dayun-current { background: #FFF3E0; border-radius: 8px; margin: 4px 0; }
.dayun-age { width: 70px; font-weight: 500; }
.dayun-pillar { width: 50px; font-weight: 700; color: var(--primary); }
.dayun-ten-god { width: 50px; color: var(--primary-light); }
.dayun-desc { flex: 1; color: var(--text-light); font-size: 12px; }
.dayun-badge { background: var(--primary); color: white; font-size: 11px; padding: 2px 8px; border-radius: 10px; }
.liunian-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-bottom: 1px solid var(--border); font-size: 13px; }
.liunian-item:last-child { border-bottom: none; }
.liunian-current { background: #E8F5E9; border-radius: 8px; }
.liunian-year { width: 50px; font-weight: 500; }
.liunian-pillar { width: 50px; font-weight: 700; color: var(--primary); }
.liunian-ten-god { width: 50px; }
.liunian-effect { flex: 1; color: var(--text-light); font-size: 12px; }
</style>

