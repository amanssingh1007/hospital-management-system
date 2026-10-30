
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarDays,
  Stethoscope,
  UserRound,
  LogOut,
  Save,
  ArrowLeft
} from 'lucide-react'

import {
  getCurrentUser,
  logoutUser
} from '../services/authService'

import '../styles/PatientProfile.css'

function PatientProfile() {
  const navigate = useNavigate()

  const [currentUser, setCurrentUser] = useState(() => getCurrentUser())

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    dob: currentUser?.dob || '',
    gender: currentUser?.gender || '',
    address: currentUser?.address || ''
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  if (!currentUser || currentUser.role !== 'patient') {
    navigate('/patient/login', { replace: true })
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setMessage('')
    setError('')

    if (!formData.name.trim()) {
      setError('Please enter your full name.')
      return
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number.')
      return
    }

    const users = JSON.parse(
      localStorage.getItem('medicareUsers') || '[]'
    )

    const updatedUsers = users.map(user =>
      user.id === currentUser.id
        ? {
            ...user,
            name: formData.name.trim(),
            phone: formData.phone,
            dob: formData.dob,
            gender: formData.gender,
            address: formData.address
          }
        : user
    )

    localStorage.setItem(
      'medicareUsers',
      JSON.stringify(updatedUsers)
    )

    const updatedCurrentUser = {
      ...currentUser,
      name: formData.name.trim(),
      phone: formData.phone,
      dob: formData.dob,
      gender: formData.gender,
      address: formData.address
    }

    localStorage.setItem(
      'medicareCurrentUser',
      JSON.stringify(updatedCurrentUser)
    )

    setCurrentUser(updatedCurrentUser)
    setMessage('Profile updated successfully.')
  }

  const handleLogout = () => {
    logoutUser()
    navigate('/patient/login', { replace: true })
  }

  return (
    <div className="patient-profile-page">

      <aside className="patient-profile-sidebar">

        <div className="patient-profile-brand">
          <Stethoscope size={30} />
          <div>
            <h2>MediCare</h2>
            <span>PATIENT PORTAL</span>
          </div>
        </div>

        <nav className="patient-profile-nav">

          <Link to="/patient/dashboard">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link to="/patient/appointments">
            <CalendarDays size={20} />
            My Appointments
          </Link>

          <Link to="/patient/doctors">
            <Stethoscope size={20} />
            Find Doctors
          </Link>

          <Link to="/patient/profile" className="active">
            <UserRound size={20} />
            My Profile
          </Link>

        </nav>

        <button
          type="button"
          className="patient-profile-logout"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </button>

      </aside>

      <main className="patient-profile-main">

        <header className="patient-profile-header">
          <div>
            <h1>My Profile</h1>
            <p>View and manage your personal information.</p>
          </div>

          <Link
            to="/patient/dashboard"
            className="patient-profile-back"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </header>

        <section className="patient-profile-card">

          <div className="patient-profile-card-heading">
            <div className="patient-profile-avatar">
              {formData.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2>{formData.name || 'Patient Name'}</h2>
              <p>Patient Account</p>
            </div>
          </div>

          <div className="patient-profile-form-heading">
            <h2>Personal Information</h2>
            <p>Update your details below.</p>
          </div>

          {message && (
            <div className="patient-profile-success">
              {message}
            </div>
          )}

          {error && (
            <div className="patient-profile-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="patient-profile-form-grid">

              <div className="patient-profile-field">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="patient-profile-field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                />
              </div>

              <div className="patient-profile-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  placeholder="Enter 10-digit phone number"
                  required
                />
              </div>

              <div className="patient-profile-field">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>

              <div className="patient-profile-field">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="patient-profile-field full-width">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  rows={4}
                />
              </div>

            </div>

            <div className="patient-profile-actions">
              <button type="submit">
                <Save size={19} />
                Save Changes
              </button>
            </div>

          </form>

        </section>

      </main>

    </div>
  )
}

export default PatientProfile
