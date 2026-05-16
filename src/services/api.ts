import axios from 'axios'
import { useApiUrl } from '@/composables/useApiUrl'

const api = axios.create({
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const { baseUrl } = useApiUrl()
  config.baseURL = baseUrl.value
  return config
})

export const fetchData = async <T>(endpoint: string) => {
  try {
    console.log(endpoint)
    const response = await api.get<T>(endpoint)
    return response.data
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error)
    throw error
  }
}

export default api