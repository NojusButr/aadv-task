<script setup lang="ts">
import Input from './components/Input.vue'
import { useApiUrl } from '@/composables/useApiUrl'
import { useRouletteConfig } from '@/composables/useConfig'
import { onMounted } from 'vue'
import { useStats } from '@/composables/useStats'
import Statistics from '@/components/Statistics.vue'
import Gameboard from '@/components/Gameboard.vue'
import SpinHistory from '@/components/SpinHistory.vue'
import { useGames } from '@/composables/useGame'
import Log from '@/components/Log.vue'

const { baseUrl } = useApiUrl()
const { fetchConfig, config } = useRouletteConfig()
const { fetchStats, stats } = useStats()
const { countdown, isSpinning, events, currentResult, fetchNextGame, nextGameId } = useGames()

onMounted(() => {
  fetchConfig()
  fetchStats()
  fetchNextGame()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-7xl mx-auto flex flex-col gap-6">

      <div class="bg-white rounded-xl border border-gray-300 shadow-sm p-4">
        <h1 class="text-xl font-bold text-gray-800 mb-4">AARDVARK FRONTEND TASK BY NOJUS BUTRIMAVIČIUS</h1>
        <Input v-model="baseUrl" label="API base URL" placeholder="Enter Base API URL..." />
      </div>

      <div v-if="stats && config" class="bg-white rounded-xl border border-gray-300 shadow-sm p-4">
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Statistics (last 200)</h2>
        <Statistics :stats="stats" :config="config" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="flex flex-col gap-6">
          <div v-if="config" class="bg-white rounded-xl border border-gray-300 shadow-sm p-4">
            <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Game Board</h2>
            <Gameboard :config="config" :current-result="currentResult" :is-spinning="isSpinning" />
          </div>

          <div class="bg-white rounded-xl border border-gray-300 shadow-sm p-4">
            <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Spin History</h2>
            <SpinHistory :events="events" :countdown="countdown" :is-spinning="isSpinning" :next-game-id="nextGameId" />
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-300 shadow-sm p-4">
          <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Action Log</h2>
          <Log />
        </div>
      </div>

    </div>
  </div>
</template>