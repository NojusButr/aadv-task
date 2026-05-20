import { ref } from 'vue'
import api from '@/services/api'
import type { Game } from '@/schemas/game'
import { useLog } from '@/composables/useLog'
import { useStats } from '@/composables/useStats'

const countdown = ref(0)
const isSpinning = ref(false)
const events = ref<string[]>([])
const currentResult = ref<number | null>(null)
const nextGameId = ref<number | null>(null)

let countdownTimer: ReturnType<typeof setInterval> | null = null
let polling = false

export function useGames() {
  const { log } = useLog()
  const { fetchStats } = useStats()

  async function fetchNextGame() {
    try {
      log('GET .../nextGame')
      const res = await api.get('/nextGame')
      const nextGame: Game = res.data

      nextGameId.value = nextGame.id
      log(`sleeping for fakeStartDelta ${nextGame.fakeStartDelta} sec`)
      startCountdown(nextGame.fakeStartDelta, nextGame.id)
    } catch (e) {
      log('Failed to fetch next game, retrying in 5s...')
      await new Promise(resolve => setTimeout(resolve, 5000))
      await fetchNextGame()
    }
  }

  function startCountdown(seconds: number, id: number) {
    if (countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }

    countdown.value = seconds
    isSpinning.value = false
    currentResult.value = null
    polling = false

    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(countdownTimer!)
        countdownTimer = null
        startSpinning(id)
      }
    }, 1000)
  }

  async function startSpinning(id: number) {
    if (polling) return
    polling = true
    log('Spinning the wheel')
    isSpinning.value = true
    await pollForResult(id)
  }

  async function pollForResult(id: number) {
    while (polling) {
      try {
        log(`GET .../game/${id}`)
        const res = await api.get(`/game/${id}`)
        const game: Game = res.data

        if (game.result !== null) {
          polling = false
          log(`result is ${game.result}`)
          isSpinning.value = false
          currentResult.value = game.result
          events.value.unshift(`Game ${id} ended, result is ${game.result}`)
          await fetchStats()
          await fetchNextGame()
          return
        }
      } catch (e) {
        log(`Failed to fetch game ${id}, retrying...`)
      }

      await new Promise(resolve => setTimeout(resolve, 1000))
    }
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