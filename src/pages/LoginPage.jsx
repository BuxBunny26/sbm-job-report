import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CUSTOMER } from '../config/appConfig'
import { Ship, Mail, Lock, Eye, EyeOff } from 'lucide-react'

// Demo users for testing without Supabase
const DEMO_USERS = [
  { email: 'admin@wearcheck.com', password: 'admin123', role: 'admin', name: 'Admin User' },
  { email: 'supervisor@wearcheck.com', password: 'super123', role: 'supervisor', name: 'John Supervisor' },
  { email: 'tech@wearcheck.com', password: 'tech123', role: 'technician', name: 'Mike Technician' }
]

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, demoLogin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Check for demo login first
    const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password)
    if (demoUser) {
      demoLogin(demoUser)
      navigate('/')
      return
    }

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      } else {
        navigate('/')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <Ship size={48} />
          </div>
          <h1>{CUSTOMER.name} Job Report</h1>
          <p>Sign in to access the system</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <Mail size={20} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <div className="demo-credentials">
            <p><strong>Demo Logins:</strong></p>
            <p>Admin: admin@wearcheck.com / admin123</p>
            <p>Supervisor: supervisor@wearcheck.com / super123</p>
            <p>Technician: tech@wearcheck.com / tech123</p>
          </div>
          <p>© 2026 WearCheck Reliability Solutions</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
