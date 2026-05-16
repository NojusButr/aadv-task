import { ref } from 'vue'

const logs = ref<{ timestamp: string; message: string }[]>([])

export function useLog() {
  function log(message: string) {
    logs.value.push({
      timestamp: new Date().toISOString(),
      message,
    })
  }

  return { logs, log }
}