import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Loader2, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const navigate = useNavigate()
  const { user, login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const validate = () => {
    const newErrors = {}
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      await login(email, password)
      toast.success('Logged in successfully')
      navigate('/', { replace: true })
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Invalid credentials. Please try again.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel */}
      <div className="lg:w-1/2 flex flex-col items-center justify-center px-8 py-12 lg:py-0" style={{ backgroundColor: '#1e3a5f' }}>

        <div className="flex flex-col items-center text-center max-w-md">
          <div className="w-24 h-24 rounded-full border-2 border-white/60 flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-white tracking-wide">SAU</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">SOUTH ASIAN UNIVERSITY</h1>
          <h2 className="text-lg text-white/80 mb-6">RTI Management System</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Manage and track Right to Information applications efficiently.
            Submit, monitor, and resolve RTI requests with a streamlined digital workflow.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="lg:w-1/2 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back</h2>
          <p className="text-gray-500 mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
                  }}
                  placeholder="Enter your email"
                  className={`w-full rounded-lg border ${
                    errors.email ? 'border-red-400' : 'border-gray-300'
                  } pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }))
                  }}
                  placeholder="Enter your password"
                  className={`w-full rounded-lg border ${
                    errors.password ? 'border-red-400' : 'border-gray-300'
                  } pl-10 pr-11 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600 cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg text-white font-medium text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-2.5">
            <Info size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-500 leading-relaxed">
              <span className="font-medium text-gray-600">Demo:</span>{' '}
              admin@rti.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
