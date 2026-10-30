
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  UserRound,
  Mail,
  Phone,
  Lock,
  Stethoscope,
  GraduationCap,
  Hospital,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react'

import { registerUser } from '../../services/authService'
import '../../styles/Auth.css'

function DoctorSignup() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    qualification: '',
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

    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Enter a valid 10-digit phone number.')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }

    setLoading(true)

    try {
      registerUser({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: 'doctor'
      })

      navigate('/doctor/login')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">

      <section className="auth-banner">
        <div className="auth-banner-content">

          <div className="auth-brand">
            <Hospital size={42} />
            <span>MediCare</span>
          </div>

          <div className="auth-tag">DOCTOR PORTAL</div>

          <h1>
            Join Our Medical
            <br />
            Community.
          </h1>

          <p>
            Register with MediCare and connect with patients.
            Manage your appointments through one convenient platform.
          </p>

          <div className="auth-banner-points">
            <div>Manage your professional profile</div>
            <div>Set your appointment availability</div>
            <div>Connect with patients</div>
          </div>

        </div>
      </section>

      <section className="auth-form-section">
        <div className="auth-form-container">

          <div className="auth-heading">
            <div className="auth-tag">JOIN MEDICARE</div>
            <h2>Doctor Registration</h2>
            <p>Create your doctor account.</p>
          </div>

          <form onSubmit={handleSubmit}>

            {error && (
              <div className="auth-error">{error}</div>
            )}

            <div className="auth-input-group">
              <label>Full Name</label>
              <div className="auth-input-wrapper">
                <UserRound size={21} />
                <input
                  type="text"
                  name="name"
                  placeholder="Dr. Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={21} />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Phone Number</label>
              <div className="auth-input-wrapper">
                <Phone size={21} />
                <input
                  type="tel"
                  name="phone"
                  placeholder="10-digit phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Specialization</label>
              <div className="auth-input-wrapper">
                <Stethoscope size={21} />
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select specialization</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Gynecology">Gynecology</option>
                  <option value="Ophthalmology">Ophthalmology</option>
                </select>
              </div>
            </div>

            <div className="auth-input-group">
              <label>Qualification</label>
              <div className="auth-input-wrapper">
                <GraduationCap size={21} />
                <input
                  type="text"
                  name="qualification"
                  placeholder="e.g. MBBS, MD"
                  value={formData.qualification}
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
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={21} /> : <Eye size={21} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Doctor Account'}
              {!loading && <ArrowRight size={21} />}
            </button>

          </form>

          <div className="auth-bottom-text">
            Already registered?
            <Link to="/doctor/login">Doctor Login</Link>
          </div>

        </div>
      </section>

    </div>
  )
}

export default DoctorSignup
