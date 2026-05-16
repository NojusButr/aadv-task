import { ref } from 'vue'
import type { RouletteConfig } from '@/schemas/config'
import api from '@/services/api'
import { useLog } from '@/composables/useLog'

const config = ref<RouletteConfig | null>(null)

export function useRouletteConfig() {
  const { log } = useLog()

  async function fetchConfig() {
    try {
      log('Loading game board')
      log('GET .../configuration')
      const res = await api.get(`/configuration`)
      config.value = res.data
    } catch (e) {
      log('Failed to fetch configuration, retrying in 5s...')
      await new Promise(resolve => setTimeout(resolve, 5000))
      await fetchConfig()
    }
  }

  return { config, fetchConfig }
}