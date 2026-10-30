import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarDays,
  Clock,
  UserRound,
  LogOut,
  Stethoscope,
  Save,
  Mail,
  Phone,
  GraduationCap
} from 'lucide-react'

import {
  getCurrentUser,
  logoutUser
} from '../services/authService'

import '../styles/DoctorProfile.css'

function DoctorProfile() {
  const navigate = useNavigate()

  const [currentUser, setCurrentUser] = useState(() => getCurrentUser())
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    specialization: currentUser?.specialization || '',
    qualification: currentUser?.qualification || ''
  })

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'doctor') {
      navigate('/doctor/login')
    }
  }, [currentUser, navigate])

  if (!currentUser || currentUser.role !== 'doctor') {
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    setMessage('')
    setError('')
  }

  const handleSave = (e) => {
    e.preventDefault()

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.specialization.trim() ||
      !formData.qualification.trim()
    ) {
      setError('Please fill in all fields.')
      return
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number.')
      return
    }

    const allUsers = JSON.parse(
      localStorage.getItem('medicareUsers') || '[]'
    )

    const emailAlreadyUsed = allUsers.some(
      user =>
        user.email.toLowerCase() === formData.email.trim().toLowerCase() &&
        user.id !== currentUser.id
    )

    if (emailAlreadyUsed) {
      setError('This email address is already registered.')
      return
    }

    const updatedUser = {
      ...currentUser,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      specialization: formData.specialization.trim(),
      qualification: formData.qualification.trim()
    }

    const updatedUsers = allUsers.map(user =>
      user.id === currentUser.id ? updatedUser : user
    )

    localStorage.setItem(
      'medicareUsers',
      JSON.stringify(updatedUsers)
    )

    const { password, ...safeUser } = updatedUser

    localStorage.setItem(
      'medicareCurrentUser',
      JSON.stringify(safeUser)
    )

    setCurrentUser(safeUser)
    setMessage('Profile updated successfully.')
    setError('')
  }

  const handleLogout = () => {
    logoutUser()
    navigate('/doctor/login')
  }

  return (
    <div className="doctor-profile-page">

      {/* Sidebar */}
      <aside className="doctor-profile-sidebar">

        <div className="doctor-profile-brand">
          <Stethoscope size={30} />
          <div>
            <h2>MediCare</h2>
            <span>DOCTOR PORTAL</span>
          </div>
        </div>

        <div className="doctor-profile-sidebar-user">
          <div className="doctor-profile-avatar">
            {currentUser.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3>{currentUser.name}</h3>
            <p>{currentUser.specialization}</p>
          </div>
        </div>

        <nav className="doctor-profile-nav">

          <Link to="/doctor/dashboard">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link to="/doctor/appointments">
            <CalendarDays size={20} />
            My Appointments
          </Link>

          <Link to="/doctor/availability">
            <Clock size={20} />
            Manage Availability
          </Link>

          <Link to="/doctor/profile" className="active">
            <UserRound size={20} />
            My Profile
          </Link>

        </nav>

        <button
          className="doctor-profile-logout"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="doctor-profile-main">

        <header className="doctor-profile-header">
          <div>
            <h1>My Profile</h1>
            <p>View and update your professional information.</p>
          </div>
        </header>

        <section className="doctor-profile-welcome">

          <div className="doctor-profile-large-avatar">
            {currentUser.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <span>DOCTOR PROFILE</span>
            <h2>Dr. {currentUser.name}</h2>
            <p>{currentUser.specialization}</p>
          </div>

        </section>

        <section className="doctor-profile-form-card">

          <div className="doctor-profile-section-heading">
            <h2>Personal & Professional Details</h2>
            <p>Keep your information accurate and up to date.</p>
          </div>

          <form onSubmit={handleSave}>

            <div className="doctor-profile-form-grid">

              <div className="doctor-profile-field">
                <label htmlFor="doctor-name">Full Name</label>
                <input
                  id="doctor-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="doctor-profile-field">
                <label htmlFor="doctor-email">
                  <Mail size={16} /> Email Address
                </label>
                <input
                  id="doctor-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="doctor-profile-field">
                <label htmlFor="doctor-phone">
                  <Phone size={16} /> Phone Number
                </label>
                <input
                  id="doctor-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  required
                />
              </div>

              <div className="doctor-profile-field">
                <label htmlFor="doctor-specialization">
                  <Stethoscope size={16} /> Specialization
                </label>
                <input
                  id="doctor-specialization"
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="doctor-profile-field full-width">
                <label htmlFor="doctor-qualification">
                  <GraduationCap size={16} /> Qualification
                </label>
                <input
                  id="doctor-qualification"
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            {error && (
              <p className="doctor-profile-error">{error}</p>
            )}

            {message && (
              <p className="doctor-profile-success">{message}</p>
            )}

            <div className="doctor-profile-form-footer">

              <button type="submit" className="doctor-profile-save-btn">
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

export default DoctorProfile