<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const navs = [
  { path: '/', label: '排盘' },
  { path: '/dayun', label: '大运流年' },
  { path: '/naming', label: '取名' },
  { path: '/hehun', label: '合婚' },
]
function go(p: string) { router.push(p) }
</script>
<template>
  <nav class="nav-bar">
    <button v-for="n in navs" :key="n.path" :class="['nav-item', { active: route.path === n.path }]" @click="go(n.path)">{{ n.label }}</button>
  </nav>
</template>
<style scoped>
.nav-bar { display: flex; gap: 4px; background: var(--card-bg); padding: 6px; border-radius: var(--radius); border: 1px solid var(--border); margin-bottom: 16px; }
.nav-item { flex: 1; padding: 8px; border: none; border-radius: 6px; background: none; font-size: 14px; cursor: pointer; transition: all 0.2s; color: var(--text-light); }
.nav-item.active { background: var(--primary); color: white; font-weight: 500; }
.nav-item:hover:not(.active) { background: var(--bg); }
</style>

