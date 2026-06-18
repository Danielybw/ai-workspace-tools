<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBaziStore } from '@/stores/bazi'
import BirthInputForm from '@/components/BirthInputForm.vue'
import type { BirthInput } from '@/engine'
import NavBar from '@/components/NavBar.vue'
const points = computed(() => parseInt(localStorage.getItem('bazi_points') || '0'))

const router = useRouter()
const store = useBaziStore()
const showHistory = ref(false)
const hasHistory = computed(() => store.history.length > 0)

function onCalculate(input: BirthInput) {
  store.compute(input)
  router.push('/result')
}

function goToResult(idx: number) {
  store.currentResult = store.history[idx]
  router.push('/result')
}

function clearAllHistory() {
  if (confirm('确定清空所有历史记录吗？')) {
    store.clearHistory()
    showHistory.value = false
  }
}
</script>

<template>
  <div>
    <!-- Hero -->
    <NavBar />
    <div class="hero">
      <div class="hero-icon">☯</div>
      <h1>八字排盘</h1>
      <p style="font-size:15px; color:var(--text); margin:4px 0 8px;">基于学术化命理框架的传统文化学习工具</p>
      <p style="font-size:12px; color:#999; line-height:1.6;">
        输入出生信息 · 查看四柱八字 · 了解五行格局<br/>
        <span style="font-size:11px;">支持公历年份 {{ 1901 }}-{{ 2100 }} 年</span>
      </p>
    </div>

    <!-- Points -->
    <div style="text-align:center; margin:12px 0;">
      <span style="display:inline-flex; align-items:center; gap:6px; background:#FFF3E0; padding:6px 14px; border-radius:20px; font-size:13px; cursor:pointer;" @click="$router.push('/pay')">
        🪙 {{ points }} 积分
      </span>
    </div>
    <!-- Input form -->
    <BirthInputForm @calculate="onCalculate" />

    <!-- History Toggle -->
    <div style="text-align:center; margin-top:12px;">
      <button v-if="hasHistory" class="btn btn-link" @click="showHistory = !showHistory">
        {{ showHistory ? '收起历史' : `查看历史记录 (${store.history.length})` }}
      </button>
    </div>

    <!-- History -->
    <div v-if="showHistory && hasHistory" class="card history-list">
      <div class="history-header">
        <span class="card-title" style="border:none; margin:0; padding:0;">历史记录</span>
        <button class="btn btn-link btn-clear-all" @click="clearAllHistory">清空全部</button>
      </div>
      <div
        v-for="(item, idx) in store.history"
        :key="idx"
        class="history-item"
        @click="goToResult(idx)"
      >
        <div class="history-info">
          <div>{{ item.summary }}</div>
          <div class="history-date">{{ item.birthInput.year }}年{{ item.birthInput.month }}月{{ item.birthInput.day }}日 {{ item.birthInput.gender === 'male' ? '男' : '女' }}</div>
        </div>
        <button class="history-del" @click.stop="store.deleteHistoryItem(idx)">×</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}
.btn-clear-all {
  font-size: 12px;
  color: #999;
  padding: 4px 8px;
}
.btn-clear-all:hover {
  color: #FF5722;
}
</style>
