import axios from 'axios'

const api = axios.create({
  baseURL: '/api/rti',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const getAllRTIs = async (params = {}) => {
  const response = await api.get('/', { params })
  return response.data
}

export const getRTIById = async (id) => {
  const response = await api.get(`/${id}`)
  return response.data
}

export const createRTI = async (formData) => {
  const response = await api.post('/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const updateRTI = async (id, formData) => {
  const response = await api.put(`/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const deleteRTI = async (id) => {
  const response = await api.delete(`/${id}`)
  return response.data
}

export default api
