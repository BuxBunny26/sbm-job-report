import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CUSTOMER } from '../config/appConfig'
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import sbmLogo from '../components/SBM OFFSHORE LOGO.png'
import wearCheckLogo from '../WearCheck Logo.png'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgotPassword, setForgotPassword] = useState(false)
  const { signIn, resetPassword } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

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

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!email) {
      setError('Please enter your email address')
      setLoading(false)
      return
    }

    try {
      const { error } = await resetPassword(email)
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Password reset email sent! Check your inbox.')
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
            <img src={sbmLogo} alt="SBM Offshore" style={{ width: 80, height: 80, objectFit: 'contain' }} />
          </div>
          <h1>{CUSTOMER.name} Job Report</h1>
          <p>Sign in to access the system</p>
        </div>

        {forgotPassword ? (
          <form className="login-form" onSubmit={handleForgotPassword}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            {success && (
              <div className="success-message">
                {success}
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

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <button
              type="button"
              className="back-to-login"
              onClick={() => {
                setForgotPassword(false)
                setError('')
                setSuccess('')
              }}
            >
              <ArrowLeft size={16} />
              Back to Sign In
            </button>
          </form>
        ) : (
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

            <button
              type="button"
              className="forgot-password-link"
              onClick={() => {
                setForgotPassword(true)
                setError('')
              }}
            >
              Forgot Password?
            </button>
          </form>
        )}

        <div className="login-footer">
          <img src={wearCheckLogo} alt="WearCheck Reliability Solutions" style={{ height: 32, marginBottom: 8 }} />
          <p>© 2026 WearCheck Reliability Solutions</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
