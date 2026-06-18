<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBaziStore } from '@/stores/bazi'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const store = useBaziStore()
const surname = ref('')
const gender = ref<'male' | 'female'>('male')

const xiYong = computed(() => store.currentResult?.dayMasterAnalysis.favorable || ['火', '土'])

const nameSuggestions = computed(() => {
  if (!surname.value) return []
  const fav = xiYong.value
  const names: Record<string, { chars: string; elem: string; meaning: string }[]> = {
    '火': [
      { chars: '煜、炜、烨、昕、昭', elem: '火', meaning: '光明照耀，事业有成' },
      { chars: '彤、璟、晴、暖、旭', elem: '火', meaning: '温暖明亮，前途光明' },
      { chars: '灿、煊、燃、烁、煌', elem: '火', meaning: '灿烂辉煌，人生精彩' },
    ],
    '土': [
      { chars: '安、宇、辰、城、峰', elem: '土', meaning: '稳重踏实，根基深厚' },
      { chars: '峻、岚、峥、崇、巍', elem: '土', meaning: '高山仰止，品格高尚' },
      { chars: '圣、坚、坤、坦、培', elem: '土', meaning: '坚实可靠，厚德载物' },
    ],
    '木': [
      { chars: '森、林、桐、柏、桥', elem: '木', meaning: '生机勃勃，成长向上' },
      { chars: '梓、楠、栋、松、柳', elem: '木', meaning: '栋梁之才，坚韧不拔' },
      { chars: '楷、彬、柯、植、荣', elem: '木', meaning: '欣欣向荣，前程似锦' },
    ],
    '金': [
      { chars: '铭、锐、钧、锦、铠', elem: '金', meaning: '金玉满堂，才华出众' },
      { chars: '锋、钧、鑫、钊、铮', elem: '金', meaning: '锋芒毕露，锐意进取' },
    ],
    '水': [
      { chars: '浩、涵、润、泽、源', elem: '水', meaning: '浩瀚深远，智慧通达' },
      { chars: '涛、澜、瀚、沛、泓', elem: '水', meaning: '胸怀宽广，包容万物' },
    ],
  }
  const suggestions: { name: string; fiveElements: string; meaning: string; description: string }[] = []
  for (const f of fav) {
    const pool = names[f]
    if (pool) {
      for (const n of pool) {
        const char = n.chars.split('、')[0]
        suggestions.push({
          name: surname.value + char,
          fiveElements: n.elem,
          meaning: n.meaning,
          description: `五行属${n.elem}，${n.meaning}`
        })
      }
    }
  }
  return suggestions.slice(0, 6)
})
</script>
<template>
  <div>
    <NavBar />
    <div class="card">
      <div class="card-title">取名参考</div>
      <p style="font-size:13px; color:var(--text-light); margin-bottom:16px;">
        根据日主喜用五行，推荐适配的字。先排盘或从历史记录中选择一个结果。
      </p>
      <div v-if="!store.currentResult" style="text-align:center; padding:20px;">
        <p style="color:var(--text-light);">请先在首页排盘后再来取名</p>
        <button class="btn btn-primary" style="margin-top:12px;" @click="router.push('/')">去排盘</button>
      </div>
      <template v-else>
        <div class="form-group">
          <label class="form-label">姓氏</label>
          <input v-model="surname" class="form-input" placeholder="请输入姓氏" />
        </div>
        <div class="form-group">
          <label class="form-label">性别</label>
          <div class="form-row" style="flex-direction:row; gap:8px;">
            <label class="form-select" style="text-align:center; cursor:pointer;">
              <input type="radio" v-model="gender" value="male" style="accent-color:var(--primary);" /> 男
            </label>
            <label class="form-select" style="text-align:center; cursor:pointer;">
              <input type="radio" v-model="gender" value="female" style="accent-color:var(--primary);" /> 女
            </label>
          </div>
        </div>
        <div v-if="surname" style="margin-top:8px;">
          <div style="font-size:13px; color:var(--text-light); margin-bottom:8px;">
            喜用五行：<span v-for="f in xiYong" :key="f" style="display:inline-block; background:#FFF3E0; padding:2px 8px; border-radius:4px; margin:0 4px;">{{ f }}</span>
          </div>
          <div v-for="(s, i) in nameSuggestions" :key="i" class="name-item">
            <div class="name-text">{{ s.name }}</div>
            <div class="name-elem">五行：{{ s.fiveElements }}</div>
            <div class="name-meaning">{{ s.meaning }}</div>
          </div>
          <div style="text-align:center; margin-top:16px;">
            <button class="btn btn-primary" @click="router.push('/pay')">AI 深度取名 →</button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<style scoped>
.name-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 8px; }
.name-text { font-size: 20px; font-weight: 700; color: var(--primary); width: 100px; }
.name-elem { font-size: 13px; color: var(--primary-light); width: 80px; }
.name-meaning { flex: 1; font-size: 13px; color: var(--text-light); }
</style>

