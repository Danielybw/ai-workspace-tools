<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const paid = ref(false)
const inviteCode = ref('BAZI' + Date.now().toString(36).toUpperCase())
const qrSrc = ref(localStorage.getItem('bazi_qr') || '')

function markPaid() {
  paid.value = true
  localStorage.setItem('bazi_paid', 'true')
}
</script>
<template>
  <div>
    <NavBar />
    <div class="card" style="text-align:center;">
      <div class="card-title">解锁完整功能</div>
      <p style="font-size:13px; color:var(--text-light); margin-bottom:16px;">
        付费后可解锁：AI深度取名、完整合婚报告、大运流年详细解读
      </p>

      <div v-if="!paid" class="pay-section">
        <div style="margin:16px auto; width:200px; height:200px; background:#f0ebe5; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-direction:column;">
          <img v-if="qrSrc" :src="qrSrc || ''" style="width:180px; height:180px;" />
          <div v-else style="text-align:center; color:#999;">
            <div style="font-size:48px; margin-bottom:8px;">📱</div>
            <div style="font-size:13px;">微信扫码支付</div>
            <div style="font-size:14px; font-weight:700; color:var(--primary); margin-top:4px;">¥9.9</div>
          </div>
        </div>
        <p style="font-size:12px; color:#999; margin-bottom:12px;">扫描上方二维码支付 ¥9.9</p>
        <button class="btn btn-primary" @click="markPaid">我已付款 →</button>

        <div class="invite-section">
          <div style="font-size:14px; font-weight:500; margin:20px 0 8px;">邀请好友免费获取积分</div>
          <div style="background:#FFF3E0; padding:10px; border-radius:8px; font-size:12px;">
            <p>邀请码：<strong>{{ inviteCode }}</strong></p>
            <p style="color:var(--text-light); margin-top:4px;">每邀请1人，获取10积分。30积分可兑换1份付费报告。</p>
          </div>
        </div>
      </div>

      <div v-else>
        <div style="background:#E8F5E9; padding:20px; border-radius:12px;">
          <div style="font-size:48px; margin-bottom:8px;">✅</div>
          <p style="font-size:16px; font-weight:500; color:#2E7D32;">已解锁全部功能</p>
          <p style="font-size:13px; color:#666; margin-top:4px;">感谢您的支持！</p>
          <button class="btn btn-primary" style="margin-top:16px;" @click="router.push('/dayun')">查看大运流年 →</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.invite-section { border-top: 1px solid var(--border); margin-top: 24px; padding-top: 16px; }
</style>

