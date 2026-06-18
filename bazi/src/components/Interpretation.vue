<script setup lang="ts">
defineProps<{
  text: string
  summary: string
}>()
</script>

<template>
  <div class="card">
    <div class="card-title">基础解读</div>
    <div class="interp-text">
      <p><strong>{{ summary }}</strong></p>
      <p>{{ text }}</p>
    </div>
  </div>
</template>
