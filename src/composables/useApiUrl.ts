import { ref, watch } from 'vue'
import { useLog } from '@/composables/useLog'

const baseUrl = ref('https://dev-games-backend.advbet.com/v1/ab-roulette/1')
const { log } = useLog()

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(baseUrl, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    log(`API URL changed to ${val}`)
  }, 1000)
})

export function useApiUrl() {
  return { baseUrl }
}