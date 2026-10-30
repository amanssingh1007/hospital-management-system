
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Stethoscope,
  Mail,
  Lock,
  LogIn,
  ArrowLeft
} from 'lucide-react'

import '../../styles/AdminLogin.css'

function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    // Demo admin credentials
    const ADMIN_EMAIL = 'admin@medicare.com'
    const ADMIN_PASSWORD = 'Admin@123'

    if (
      email.trim().toLowerCase() === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      const adminUser = {
        id: 'medicare-admin',
        name: 'Administrator',
        email: ADMIN_EMAIL,
        role: 'admin'
      }

      localStorage.setItem(
        'medicareCurrentUser',
        JSON.stringify(adminUser)
      )

      navigate('/admin/dashboard')
    } else {
      setError('Invalid admin email or password.')
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-card">

        <Link to="/" className="auth-back-link">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="auth-heading">
          <div className="auth-logo">
            <Stethoscope size={32} />
          </div>

          <h1>Admin Login</h1>
          <p>Access the MediCare administration portal.</p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <div className="auth-form-group">
            <label>Email Address</label>

            <div className="auth-input-wrapper">
              <Mail size={19} />
              <input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label>Password</label>

            <div className="auth-input-wrapper">
              <Lock size={19} />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn">
            <LogIn size={19} />
            Login as Admin
          </button>

        </form>

        <p className="auth-footer-text">
          Authorized administrators only.
        </p>

      </div>

    </div>
  )
}

export default AdminLogin
