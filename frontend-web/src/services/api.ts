import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rl_token')
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Erro ao comunicar com o servidor'

    if (error.response?.status === 401) {
      localStorage.removeItem('rl_token')
      window.location.href = '/login'
      return Promise.reject(error)
    }

    if (error.response?.status !== 404) {
      toast.error(typeof message === 'string' ? message : JSON.stringify(message))
    }

    return Promise.reject(error)
  },
)

export default api
