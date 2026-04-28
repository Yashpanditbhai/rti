import axios from 'axios'

const api = axios.create({ baseURL: '/api/auth' })

export const loginUser = async (email, password) => {
  const response = await api.post('/login', { email, password })
  return response.data
}

export const registerUser = async (data) => {
  const response = await api.post('/register', data)
  return response.data
}

export const getMe = async (token) => {
  const response = await api.get('/me', {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}
