import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { loginUser as loginApi } from '../api/authApi'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setToken(storedToken)
        setUser(parsedUser)
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }

    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const data = await loginApi(email, password)
    const { token: newToken, user: newUser } = data

    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

    setToken(newToken)
    setUser(newUser)

    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
