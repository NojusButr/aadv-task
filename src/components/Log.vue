<script setup lang="ts">
import { useLog } from '@/composables/useLog'

const { logs } = useLog()
</script>

<template>
  <div class="w-full font-mono text-xs border overflow-y-auto max-h-64">
    <div
      v-for="(entry, index) in logs"
      :key="index"
      class="px-3 py-1 border-b border-gray-100 last:border-0 text-gray-600"
    >
      <span class="text-gray-400 mr-2">{{ entry.timestamp }}</span>
      {{ entry.message }}
    </div>
  </div>
</template>