import axios from 'axios'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3001/api/v1'

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

export default api
