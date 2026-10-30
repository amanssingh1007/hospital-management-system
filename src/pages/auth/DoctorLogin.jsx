
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Mail,
  Lock,
  Stethoscope,
  Hospital,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react'

import { loginUser } from '../../services/authService'
import '../../styles/Auth.css'

function DoctorLogin() {
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

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    setLoading(true)

    try {
      loginUser(
        formData.email,
        formData.password,
        'doctor'
      )

      navigate('/doctor/dashboard')
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

          <div className="auth-tag">DOCTOR PORTAL</div>

          <h1>
            Your Expertise,
            <br />
            Better Healthcare.
          </h1>

          <p>
            Welcome back, Doctor. Sign in to manage your
            appointments, view patient requests and organize
            your availability.
          </p>

          <div className="auth-banner-points">
            <div>Manage patient appointments</div>
            <div>Control your available time slots</div>
            <div>Stay connected with patients</div>
          </div>

        </div>
      </section>

      {/* LOGIN FORM */}

      <section className="auth-form-section">
        <div className="auth-form-container">

          <div className="auth-heading">
            <div className="auth-tag">WELCOME BACK</div>
            <h2>Doctor Login</h2>
            <p>Enter your registered credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit}>

            {error && (
              <div className="auth-error">{error}</div>
            )}

            <div className="auth-input-group">
              <label>Email Address</label>

              <div className="auth-input-wrapper">
                <Mail size={21} />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your registered email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Password</label>

              <div className="auth-input-wrapper">
                <Lock size={21} />

                <input
                  type={showPassword ? 'text' : 'password'}
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
            Not registered yet?
            <Link to="/doctor/signup">Create Doctor Account</Link>
          </div>

        </div>
      </section>

    </div>
  )
}

export default DoctorLogin
