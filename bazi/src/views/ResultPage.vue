<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBaziStore } from '@/stores/bazi'
import PillarDisplay from '@/components/PillarDisplay.vue'
import FiveElements from '@/components/FiveElements.vue'
import TenGods from '@/components/TenGods.vue'
import Interpretation from '@/components/Interpretation.vue'
import html2canvas from 'html2canvas'

const router = useRouter()
const store = useBaziStore()
const result = ref(store.currentResult)

onMounted(() => {
  if (!result.value) router.replace('/')
})

async function saveCard() {
  const area = document.getElementById('result-card-area')
  if (!area) return
  try {
    const canvas = await html2canvas(area, {
      backgroundColor: '#FFF8F0',
      scale: 2,
      useCORS: true,
      logging: false
    })
    const link = document.createElement('a')
    link.download = `八字排盘_${result.value?.dayMaster ?? ''}日主_${new Date().toISOString().slice(0, 10)}.png`
    link.href = canvas.toDataURL()
    link.click()
  } catch (e) {
    console.error('截图失败', e)
  }
}

function goBack() { router.push('/') }
</script>

<template>
  <div v-if="result">
    <div id="result-card-area">
      <div class="page-header">
        <button class="header-back" @click="goBack">←</button>
        <span class="header-title">排盘结果</span>
        <button class="header-share" @click="saveCard" title="保存分享图片">💾</button>
      </div>

      <!-- Four Pillars -->
      <PillarDisplay :result="result" />

      <!-- Day Master Analysis -->
      <div class="card">
        <div class="card-title">日主分析</div>
        <div class="dm-grid">
          <div class="dm-item">
            <div class="dm-item-label">日主</div>
            <div class="dm-item-value">{{ result.dayMaster }}（{{ result.dayMasterAnalysis.element }}）</div>
          </div>
          <div class="dm-item">
            <div class="dm-item-label">强弱</div>
            <div class="dm-item-value">{{ result.dayMasterAnalysis.strength }}</div>
          </div>
          <div class="dm-item">
            <div class="dm-item-label">得令</div>
            <div class="dm-item-value" :class="result.dayMasterAnalysis.deLing ? 'dm-yes' : 'dm-no'">{{ result.dayMasterAnalysis.deLing ? '是' : '否' }}</div>
          </div>
          <div class="dm-item">
            <div class="dm-item-label">得地</div>
            <div class="dm-item-value" :class="result.dayMasterAnalysis.deDi ? 'dm-yes' : 'dm-no'">{{ result.dayMasterAnalysis.deDi ? '是' : '否' }}</div>
          </div>
          <div class="dm-item">
            <div class="dm-item-label">得助</div>
            <div class="dm-item-value" :class="result.dayMasterAnalysis.deZhu ? 'dm-yes' : 'dm-no'">{{ result.dayMasterAnalysis.deZhu ? '是' : '否' }}</div>
          </div>
          <div class="dm-item">
            <div class="dm-item-label">喜用 / 忌讳</div>
            <div class="dm-item-value" style="font-size:12px;">
              <span style="color:#4CAF50;">{{ result.dayMasterAnalysis.favorable.join('、') }}</span>
              /
              <span style="color:#FF5722;">{{ result.dayMasterAnalysis.unfavorable.join('、') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Five Elements -->
      <FiveElements :elements="result.fiveElements" :missing="result.missingElement" />

      <!-- Ten Gods -->
      <TenGods :ten-gods="result.tenGods" :day-master="result.dayMaster" />

      <!-- Interpretation -->
      <Interpretation :text="result.interpretation" :summary="result.summary" />

      <!-- Share -->
      <div class="card">
        <div class="card-title">分享保存</div>
        <p style="font-size:13px; color:var(--text-light); margin-bottom:8px;">
          截图保存结果，分享给朋友了解传统文化
        </p>
        <div class="share-section">
          <button class="share-btn" @click="goBack">再测一个</button>
          <button class="share-btn" @click="saveCard">💾 保存分享图片</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-share {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  padding: 4px 8px;
  transition: transform 0.15s;
}
.header-share:hover { transform: scale(1.15); }
</style>
