<script setup lang="ts">
import { ref, computed } from 'vue'
import type { BirthInput } from '@/engine'

const emit = defineEmits<{ calculate: [input: BirthInput] }>()

const MIN_YEAR = 1901
const MAX_YEAR = 2100

const year = ref(new Date().getFullYear())
const month = ref(new Date().getMonth() + 1)
const day = ref(new Date().getDate())
const hour = ref(12)
const minute = ref(0)
const gender = ref<'male' | 'female'>('male')
const yearWarning = ref('')

// Dynamic days per month
const daysInMonth = computed(() => {
  return new Date(year.value, month.value, 0).getDate()
})

// Fix day when month changes and current day exceeds new month's max
function onMonthChange() {
  if (day.value > daysInMonth.value) {
    day.value = daysInMonth.value
  }
}

function onYearChange() {
  if (year.value < MIN_YEAR || year.value > MAX_YEAR) {
    yearWarning.value = `⚠️ 当前仅支持 ${MIN_YEAR}-${MAX_YEAR} 年的排盘`
  } else {
    yearWarning.value = ''
  }
  if (day.value > daysInMonth.value) {
    day.value = daysInMonth.value
  }
}

function submit() {
  if (!year.value || !month.value || !day.value) return
  if (year.value < MIN_YEAR || year.value > MAX_YEAR) {
    yearWarning.value = `⚠️ 当前仅支持 ${MIN_YEAR}-${MAX_YEAR} 年的排盘`
    return
  }
  yearWarning.value = ''
  emit('calculate', {
    year: year.value,
    month: month.value,
    day: day.value,
    hour: hour.value,
    minute: minute.value,
    gender: gender.value
  })
}

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 121 }, (_, i) => currentYear - i)
const months = Array.from({ length: 12 }, (_, i) => i + 1)
const hours = Array.from({ length: 24 }, (_, i) => i)
</script>

<template>
  <div class="card">
    <form @submit.prevent="submit">
      <div class="form-group">
        <label class="form-label">出生日期</label>
        <div class="form-row" style="gap:8px; flex-direction:row;">
          <select v-model.number="year" class="form-select" @change="onYearChange">
            <option v-for="y in years" :key="y" :value="y">{{ y }} 年</option>
          </select>
          <select v-model.number="month" class="form-select" @change="onMonthChange">
            <option v-for="m in months" :key="m" :value="m">{{ m }} 月</option>
          </select>
          <select v-model.number="day" class="form-select">
            <option v-for="d in daysInMonth" :key="d" :value="d">{{ d }} 日</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">出生时间</label>
        <div class="form-row" style="gap:8px; flex-direction:row;">
          <select v-model.number="hour" class="form-select">
            <option v-for="h in hours" :key="h" :value="h">{{ String(h).padStart(2,'0') }} 时</option>
          </select>
          <select v-model.number="minute" class="form-select">
            <option v-for="m in [0,30]" :key="m" :value="m">{{ String(m).padStart(2,'0') }} 分</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">性别</label>
        <div class="form-row" style="gap:8px; flex-direction:row;">
          <label class="form-select" style="text-align:center; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;">
            <input type="radio" v-model="gender" value="male" style="accent-color:var(--primary);" /> 男
          </label>
          <label class="form-select" style="text-align:center; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;">
            <input type="radio" v-model="gender" value="female" style="accent-color:var(--primary);" /> 女
          </label>
        </div>
      </div>

      <button type="submit" class="btn btn-primary">开始排盘 →</button>

      <div v-if="yearWarning" style="margin-top:12px; padding:10px; background:#FFF3E0; border-radius:8px; font-size:13px; color:#E65100; text-align:center;">
        {{ yearWarning }}
      </div>
      <div style="margin-top:16px; font-size:11px; text-align:center; color:var(--text-light);">
        基于传统命理学理论，仅供参考学习。支持公历年份范围：{{ MIN_YEAR }} - {{ MAX_YEAR }} 年。
      </div>
    </form>
  </div>
</template>
