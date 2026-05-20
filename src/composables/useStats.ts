import { ref } from 'vue'
import api from '@/services/api'
import type { Stats } from '@/schemas/stats'
import { useLog } from '@/composables/useLog'

const stats = ref<Stats | null>(null)

export function useStats() {
  const { log } = useLog()

  async function fetchStats() {
    try {
      log('GET .../stats?limit=200')
      const res = await api.get(`/stats?limit=200`)
      stats.value = res.data
    } catch (e) {
      log('Failed to fetch stats, retrying in 1s...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      await fetchStats()
    }
  }

  return { stats, fetchStats }
}