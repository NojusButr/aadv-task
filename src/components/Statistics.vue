<script setup lang="ts">
import { computed } from 'vue'
import type { Stats } from '@/schemas/stats'
import type { RouletteConfig } from '@/schemas/config'

const props = defineProps<{
  stats: Stats
  config: RouletteConfig
}>()

const hotNumbers = computed(() => new Set(props.stats.slice(-5).map(e => e.result)))
const coldNumbers = computed(() => new Set(props.stats.slice(0, 5).map(e => e.result)))

function getStatus(result: number) {
  if (hotNumbers.value.has(result)) return 'hot'
  if (coldNumbers.value.has(result)) return 'cold'
  return 'neutral'
}

function getColor(result: number) {
  return props.config.colors[result]
}

const coldSpan = computed(() => props.stats.filter(e => coldNumbers.value.has(e.result)).length)
const neutralSpan = computed(() => props.stats.filter(e => getStatus(e.result) === 'neutral').length)
const hotSpan = computed(() => props.stats.filter(e => hotNumbers.value.has(e.result)).length)
</script>

<template>
  <div class="w-full">
    <div class="overflow-x-auto">
      <table class="text-sm whitespace-nowrap border-collapse w-full">
        <thead>
          <tr class="border-y border-gray-400">
            <th class="w-10"></th>
            <th
              :colspan="coldSpan"
              class="py-1 px-2 text-md font-semibold text-left bg-blue-200"
            >
              Cold
            </th>
            <th
              :colspan="neutralSpan"
              class="py-1 px-2 text-md font-semibold text-left"
            >
              Neutral
            </th>
            <th
              :colspan="hotSpan"
              class="py-1 px-2 text-md font-semibold text-left bg-red-200"
            >
              Hot
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="px-2 text-md font-semibold">Slot</td>
            <td
              v-for="entry in stats"
              :key="entry.result"
              class="px-0.5 py-1 text-center"
              :class="{
                'bg-blue-200': getStatus(entry.result) === 'cold',
                'bg-red-200': getStatus(entry.result) === 'hot',
              }"
            >
              <span
                class="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs"
                :style="{ background: getColor(entry.result) }"
              >
                {{ entry.result }}
              </span>
            </td>
          </tr>
          <tr class="border-y border-gray-400">
            <td class="px-2 text-md font-semibold">Hits</td>
            <td
              v-for="entry in stats"
              :key="entry.result"
              class="px-0.5 py-1 text-center text-xs text-gray-700"
              :class="{
                'bg-blue-200': getStatus(entry.result) === 'cold',
                'bg-red-200': getStatus(entry.result) === 'hot',
              }"
            >
              {{ entry.count }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>