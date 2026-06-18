import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BaziResult, BirthInput } from '@/engine'
import { calculateBazi } from '@/engine'

export const useBaziStore = defineStore('bazi', () => {
  const currentResult = ref<BaziResult | null>(null)
  const history = ref<BaziResult[]>(loadHistory())

  function loadHistory(): BaziResult[] {
    try {
      return JSON.parse(localStorage.getItem('bazi_history') || '[]')
    } catch { return [] }
  }

  function saveHistory() {
    localStorage.setItem('bazi_history', JSON.stringify(history.value.slice(0, 50)))
  }

  function compute(input: BirthInput): BaziResult {
    const result = calculateBazi(input)
    currentResult.value = result
    history.value.unshift(result)
    if (history.value.length > 50) history.value.pop()
    saveHistory()
    return result
  }

  function deleteHistoryItem(index: number) {
    history.value.splice(index, 1)
    saveHistory()
  }

  function clearHistory() {
    history.value = []
    localStorage.removeItem('bazi_history')
  }

  return { currentResult, history, compute, deleteHistoryItem, clearHistory }
})
