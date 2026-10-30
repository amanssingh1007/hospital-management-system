
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Mail,
  Lock,
  Hospital,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react'

import { loginUser } from '../../services/authService'
import '../../styles/Auth.css'

function PatientLogin() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)

    try {
      loginUser(
        formData.email,
        formData.password,
        'patient'
      )

      navigate('/patient/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">

      {/* LEFT BANNER */}

      <section className="auth-banner">
        <div className="auth-banner-content">

          <div className="auth-brand">
            <Hospital size={42} />
            <span>MediCare</span>
          </div>

          <div className="auth-tag">
            PATIENT PORTAL
          </div>

          <h1>
            Your Health,
            <br />
            Our Priority.
          </h1>

          <p>
            Welcome back to MediCare. Sign in to manage
            your appointments, connect with doctors and
            stay updated with your healthcare journey.
          </p>

          <div className="auth-banner-points">
            <div>Secure patient account</div>
            <div>Manage your appointments</div>
            <div>Access your healthcare information</div>
          </div>

        </div>
      </section>

      {/* LOGIN FORM */}

      <section className="auth-form-section">
        <div className="auth-form-container">

          <div className="auth-heading">
            <div className="auth-tag">WELCOME BACK</div>
            <h2>Patient Login</h2>
            <p>
              Enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <div className="auth-input-group">
              <label htmlFor="email">Email Address</label>

              <div className="auth-input-wrapper">
                <Mail size={21} />

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your registered email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label htmlFor="password">Password</label>

              <div className="auth-input-wrapper">
                <Lock size={21} />

                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword
                    ? <EyeOff size={21} />
                    : <Eye size={21} />
                  }
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}

              {!loading && <ArrowRight size={21} />}
            </button>

          </form>

          <div className="auth-bottom-text">
            Don't have an account?
            <Link to="/patient/signup">
              Create Account
            </Link>
          </div>

        </div>
      </section>

    </div>
  )
}

export default PatientLogin
