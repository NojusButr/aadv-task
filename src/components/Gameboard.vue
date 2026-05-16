<script setup lang="ts">
import { ref, watch } from 'vue'
import type { RouletteConfig } from '@/schemas/config';

const props = defineProps<{
  config: RouletteConfig
  currentResult: number | null
  isSpinning: boolean
}>()

const flashNumber = ref<number | null>(null)

watch(() => props.currentResult, (val) => {
  if (val === null) return
  flashNumber.value = val
  setTimeout(() => { flashNumber.value = null }, 3000)
})
</script>

<template>
  <div class="grid grid-cols-12 gap-1 w-fit">
    <button
      v-for="value in props.config.positionToId"
      :key="value"
      :style="{ background: props.config.colors[value] }"
      class="w-8 h-8 rounded-full text-white text-xs font-bold transition-all duration-3000"
      :class="{
        'animate-pulse scale-125': flashNumber === value,
        'opacity-50': isSpinning,
      }"
    >
      {{ value }}
    </button>
  </div>
</template>