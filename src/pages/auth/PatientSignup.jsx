
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  UserRound,
  Mail,
  Phone,
  Lock,
  CalendarDays,
  MapPin,
  Hospital,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react'

import { registerUser } from '../../services/authService'
import '../../styles/Auth.css'

function PatientSignup() {

  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    password: '',
    confirmPassword: ''
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
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
    setSuccess('')

    // Password validation

    if (formData.password.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError('Enter a valid 10-digit phone number.')
      return
    }

    if (new Date(formData.dob) >= new Date()) {
      setError('Date of birth must be in the past.')
      return
    }

    try {

      setLoading(true)

      registerUser({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        address: formData.address.trim(),
        password: formData.password,
        role: 'patient'
      })

      setSuccess('Account created successfully! Redirecting to login...')

      setTimeout(() => {
        navigate('/patient/login')
      }, 1200)

    } catch (err) {

      setError(err.message)

    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="auth-page">

      {/* Left Side */}

      <div className="auth-banner">

        <div className="auth-banner-content">

          <div className="auth-brand">
            <Hospital size={32} />
            <span>MediCare</span>
          </div>

          <span className="auth-tag">PATIENT REGISTRATION</span>

          <h1>
            Your Health Journey
            <br />
            Starts Here.
          </h1>

          <p>
            Create your patient account and experience
            convenient healthcare services. Book appointments,
            connect with doctors and manage your health.
          </p>

          <div className="auth-banner-points">
            <div><ArrowRight size={17} /> Easy appointment booking</div>
            <div><ArrowRight size={17} /> Access to experienced doctors</div>
            <div><ArrowRight size={17} /> Manage your appointments</div>
          </div>

        </div>

      </div>

      {/* Right Side Form */}

      <div className="auth-form-section">

        <div className="auth-form-container">

          <div className="auth-heading">

            <span className="section-tag">JOIN MEDICARE</span>

            <h2>Create Patient Account</h2>

            <p>
              Enter your details to register with MediCare.
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            {success && (
              <div className="auth-success">
                {success}
              </div>
            )}

            <div className="auth-input-group">

              <label>Full Name</label>

              <div className="auth-input-wrapper">
                <UserRound size={19} />

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={80}
                />
              </div>

            </div>

            <div className="auth-input-group">

              <label>Email Address</label>

              <div className="auth-input-wrapper">
                <Mail size={19} />

                <input
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="auth-two-columns">

              <div className="auth-input-group">

                <label>Phone Number</label>

                <div className="auth-input-wrapper">
                  <Phone size={19} />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              <div className="auth-input-group">

                <label>Date of Birth</label>

                <div className="auth-input-wrapper">
                  <CalendarDays size={19} />

                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

              </div>

            </div>

            <div className="auth-two-columns">

              <div className="auth-input-group">

                <label>Gender</label>

                <div className="auth-input-wrapper">
                  <UserRound size={19} />

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

              </div>

              <div className="auth-input-group">

                <label>Address</label>

                <div className="auth-input-wrapper">
                  <MapPin size={19} />

                  <input
                    type="text"
                    name="address"
                    placeholder="Your address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

            </div>

            <div className="auth-input-group">

              <label>Password</label>

              <div className="auth-input-wrapper">
                <Lock size={19} />

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>

              </div>

            </div>

            <div className="auth-input-group">

              <label>Confirm Password</label>

              <div className="auth-input-wrapper">
                <Lock size={19} />

                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>

              </div>

            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight size={19} />}
            </button>

          </form>

          <div className="auth-bottom-text">

            Already have an account?

            <Link to="/patient/login">
              Login Here
            </Link>

          </div>

        </div>

      </div>

    </div>

  )
}

export default PatientSignup
