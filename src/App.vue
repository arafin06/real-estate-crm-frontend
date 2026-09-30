<template>
  <RouterView />

  <!-- Opened from anywhere: the axios 402 handler dispatches show-upgrade-modal -->
  <UpgradeModal :show="upgradeOpen" :detail="upgradeDetail" @close="closeUpgrade" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import UpgradeModal from '@/components/UpgradeModal.vue'

const upgradeOpen = ref(false)
const upgradeDetail = ref(null)

function openUpgrade(e) {
  upgradeDetail.value = e.detail ?? null
  upgradeOpen.value = true
}

function closeUpgrade() {
  upgradeOpen.value = false
}

onMounted(() => window.addEventListener('show-upgrade-modal', openUpgrade))
onUnmounted(() => window.removeEventListener('show-upgrade-modal', openUpgrade))
</script>
