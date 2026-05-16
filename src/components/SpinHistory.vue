<script setup lang="ts">
defineProps<{
  events: string[]
  countdown: number
  isSpinning: boolean
  nextGameId: number | null
}>()
</script>

<template>
  <div class="w-full">
    <div class="border border-gray-200 rounded-lg divide-y divide-gray-200">
      <div class="px-4 py-2.5 text-sm font-medium text-gray-700">
        <span v-if="isSpinning">Spinning...</span>
        <span v-else>Next game {{ nextGameId }} spin in {{ countdown }}s</span>
      </div>
      <div class="overflow-y-auto max-h-64 divide-y divide-gray-200">
        <div
          v-for="(event, index) in events"
          :key="index"
          class="px-4 py-2.5 text-sm text-gray-700"
        >
          {{ event }}
        </div>
      </div>
    </div>
  </div>
</template>