import { ref } from 'vue'
import api from '@/services/api'
import type { Game } from '@/schemas/game'
import { useLog } from '@/composables/useLog'

const countdown = ref(0)
const isSpinning = ref(false)
const events = ref<string[]>([])
const currentResult = ref<number | null>(null)
const nextGameId = ref<number | null>(null)

let countdownTimer: ReturnType<typeof setInterval> | null = null

export function useGames() {
  const { log } = useLog()

  async function fetchNextGame() {
    try {
      log('GET .../nextGame')
      const res = await api.get('/nextGame')
      const nextGame: Game = res.data

      nextGameId.value = nextGame.id
      log(`sleeping for fakeStartDelta ${nextGame.fakeStartDelta} sec`)
      startCountdown(nextGame.fakeStartDelta, nextGame.uuid, nextGame.id)
    } catch (e) {
      log('Failed to fetch next game, retrying in 5s...')
      await new Promise(resolve => setTimeout(resolve, 5000))
      await fetchNextGame()
    }
  }

  function startCountdown(seconds: number, uuid: string, id: number) {
    countdown.value = seconds
    isSpinning.value = false
    currentResult.value = null

    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(countdownTimer!)
        startSpinning(uuid, id)
      }
    }, 1000)
  }

  async function startSpinning(uuid: string, id: number) {
    log('Spinning the wheel')
    isSpinning.value = true
    await pollForResult(id)
  }

  async function pollForResult(id: number) {
    const MAX_RETRIES = 10
    let attempts = 0

    while (attempts < MAX_RETRIES) {
      try {
        log(`GET .../game/${id}`)
        const res = await api.get(`/game/${id}`)
        const game: Game = res.data

        if (game.result !== null) {
          log(`result is ${game.result}`)
          isSpinning.value = false
          currentResult.value = game.result
          events.value.unshift(`Game ${id} ended, result is ${game.result}`)
          await fetchNextGame()
          return
        }
      } catch (e) {
        log(`Failed to fetch game ${id}, retrying...`)
      }
      attempts++
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    events.value.unshift(`Game ${id} failed to get result after ${MAX_RETRIES} attempts`)
    isSpinning.value = false
    await fetchNextGame()
  }

  return {
    countdown,
    isSpinning,
    events,
    currentResult,
    fetchNextGame,
    nextGameId,
  }
}