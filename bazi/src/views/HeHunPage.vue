<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBaziStore } from '@/stores/bazi'
import NavBar from '@/components/NavBar.vue'
import BirthInputForm from '@/components/BirthInputForm.vue'
import { calculateBazi, calculateDaYun, BRANCH_LIUCHONG, BRANCH_LIUHE, STEM_ELEMENT, ELEMENT_INDEX, TEN_GODS_MATRIX } from '@/engine'
import type { BirthInput, BaziResult } from '@/engine'

const router = useRouter()
const store = useBaziStore()
const personB = ref<BaziResult | null>(null)
const showFormB = ref(false)

const resultA = ref(store.currentResult)

function computeB(input: BirthInput) {
  personB.value = calculateBazi(input)
  showFormB.value = false
}

const hehunScore = ref<number | null>(null)
const hehunAnalysis = ref<any>(null)

function calculateHeHun() {
  if (!resultA.value || !personB.value) return
  const a = resultA.value
  const b = personB.value

  // 日主五行得分
  const ae = a.dayMasterAnalysis.element
  const be = STEM_ELEMENT[b.dayMasterIndex]
  const aIdx = ELEMENT_INDEX[ae]
  const bIdx = ELEMENT_INDEX[be]
  const elemScore = aIdx === bIdx ? 60 : ((aIdx + 1) % 5 === bIdx || (aIdx + 4) % 5 === bIdx) ? 80 : 40

  // 冲合
  const conflicts: string[] = []
  const branchPairs = [
    ['年支', a.yearPillar.branchIndex, b.yearPillar.branchIndex],
    ['月支', a.monthPillar.branchIndex, b.monthPillar.branchIndex],
    ['日支', a.dayPillar.branchIndex, b.dayPillar.branchIndex],
    ['时支', a.hourPillar.branchIndex, b.hourPillar.branchIndex],
  ]
  let conflictPenalty = 0
  let harmonyBonus = 0
  for (const [pos, biA, biB] of branchPairs) {
    if (BRANCH_LIUCHONG[biA as number] === biB) {
      conflicts.push(`${pos}相冲`)
      conflictPenalty -= 10
    }
    if (BRANCH_LIUHE[biA as number] === biB) {
      conflicts.push(`${pos}相合`)
      harmonyBonus += 10
    }
  }

  // 喜用神兼容性
  const favA = a.dayMasterAnalysis.favorable
  const favB = b.dayMasterAnalysis.favorable
  const commonFav = favA.filter(f => favB.includes(f))
  const favScore = commonFav.length * 10

  // 大运兼容性（简单对比）
  const daYunA = calculateDaYun(a)
  const daYunB = calculateDaYun(b)
  const daYunScore = daYunA.isForward === daYunB.isForward ? 20 : 10

  const total = Math.min(100, Math.max(0, elemScore + conflictPenalty + harmonyBonus + favScore + daYunScore))
  hehunScore.value = total
  hehunAnalysis.value = {
    elementScore: elemScore,
    conflict: conflicts,
    favScore,
    daYunScore,
    total,
    analysis: total >= 80 ? '五行契合度很高，比较和谐。' : total >= 60 ? '总体较和谐，个别方面需相互包容。' : '存在一些相冲之处，需要更多理解与磨合。'
  }
}
</script>
<template>
  <div>
    <NavBar />
    <div class="card">
      <div class="card-title">合婚分析</div>
      <p style="font-size:13px; color:var(--text-light); margin-bottom:16px;">对比两人的八字，分析五行契合度和大运兼容性。</p>

      <div v-if="!resultA" style="text-align:center; padding:20px;">
        <p style="color:var(--text-light);">请先在首页排盘（A方）后再来合婚</p>
        <button class="btn btn-primary" style="margin-top:12px;" @click="router.push('/')">去排盘</button>
      </div>
      <template v-else>
        <div class="hehun-person">
          <strong>A方：</strong>{{ resultA.birthInput.year }}年 {{ resultA.birthInput.month }}月 {{ resultA.birthInput.day }}日 {{ resultA.dayMaster }}日主
          <span style="display:inline-block; background:#E8F5E9; padding:0 8px; border-radius:4px; margin-left:8px;">✓ 已排盘</span>
        </div>

        <div v-if="!personB" style="text-align:center; margin:16px 0;">
          <button class="btn btn-secondary" @click="showFormB = true">输入B方信息</button>
        </div>

        <BirthInputForm v-if="showFormB" @calculate="computeB" />

        <div v-if="personB" class="hehun-person" style="margin-top:8px;">
          <strong>B方：</strong>{{ personB.birthInput.year }}年 {{ personB.birthInput.month }}月 {{ personB.birthInput.day }}日 {{ personB.dayMaster }}日主
        </div>

        <div v-if="personB && !hehunScore" style="text-align:center; margin-top:16px;">
          <button class="btn btn-primary" @click="calculateHeHun">开始合婚分析 →</button>
        </div>

        <div v-if="hehunScore !== null && hehunAnalysis" style="margin-top:16px;">
          <div class="score-ring">
            <div class="score-value">{{ hehunScore }}</div>
            <div class="score-label">契合度</div>
          </div>
          <p style="text-align:center; font-size:14px; margin:12px 0;">{{ hehunAnalysis.analysis }}</p>

          <div style="margin-top:12px;">
            <div class="hehun-row"><span>日主五行</span><span>{{ hehunAnalysis.elementScore }}分</span></div>
            <div class="hehun-row"><span>大运兼容</span><span>{{ hehunAnalysis.daYunScore }}分</span></div>
            <div class="hehun-row" v-if="hehunAnalysis.conflict.length"><span>冲合</span><span style="color:#FF5722;">{{ hehunAnalysis.conflict.join('、') }}</span></div>
          </div>

          <div style="text-align:center; margin-top:16px;">
            <button class="btn btn-primary" @click="router.push('/pay')">解锁完整报告 →</button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<style scoped>
.hehun-person { padding: 10px 12px; background: var(--bg); border-radius: 8px; font-size: 13px; margin-bottom: 8px; }
.score-ring { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--primary-light)); display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto; color: white; }
.score-value { font-size: 28px; font-weight: 700; line-height: 1; }
.score-label { font-size: 11px; }
.hehun-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
</style>

