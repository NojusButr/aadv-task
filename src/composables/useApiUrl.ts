import { ref } from 'vue'

const baseUrl = ref('https://dev-games-backend.advbet.com/v1/ab-roulette/1')

export function useApiUrl() {
  return { baseUrl }
}