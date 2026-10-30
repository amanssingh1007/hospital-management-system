import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarDays,
  Clock,
  CheckCircle,
  Users,
  UserRound,
  LogOut,
  Stethoscope,
  ArrowRight,
  ClipboardList
} from 'lucide-react'

import { getCurrentUser, logoutUser } from '../services/authService'
import '../styles/DoctorDashboard.css'

function DoctorDashboard() {
  const navigate = useNavigate()

  // Current logged-in doctor
  const [currentUser] = useState(() => getCurrentUser())

  // Doctor's appointments
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'doctor') {
      navigate('/doctor/login')
      return
    }

    const allAppointments = JSON.parse(
      localStorage.getItem('medicareAppointments') || '[]'
    )

    const doctorAppointments = allAppointments.filter(
      appointment => appointment.doctorId === currentUser.id
    )

    setAppointments(doctorAppointments)
  }, [currentUser, navigate])

  const handleLogout = () => {
    logoutUser()
    navigate('/doctor/login')
  }

  if (!currentUser || currentUser.role !== 'doctor') {
    return null
  }

  // Dashboard statistics
  const totalAppointments = appointments.length

  const pendingAppointments = appointments.filter(
    appointment => appointment.status === 'PENDING'
  ).length

  const completedAppointments = appointments.filter(
    appointment => appointment.status === 'COMPLETED'
  ).length

  const totalPatients = new Set(
    appointments.map(appointment => appointment.patientId)
  ).size

  // Latest 5 appointments
  const recentAppointments = [...appointments]
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 5)

  const formatDate = date => {
    if (!date) return 'Not available'

    return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="doctor-dashboard">

      {/* Sidebar */}
      <aside className="doctor-sidebar">

        <div className="doctor-sidebar-brand">
          <Stethoscope size={30} />
          <div>
            <h2>MediCare</h2>
            <span>DOCTOR PORTAL</span>
          </div>
        </div>

        <div className="doctor-sidebar-profile">
          <div className="doctor-avatar">
            {currentUser.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3>{currentUser.name}</h3>
            <p>{currentUser.specialization}</p>
          </div>
        </div>

        <nav className="doctor-sidebar-nav">

          <Link to="/doctor/dashboard" className="active">
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

          <Link to="/doctor/profile">
            <UserRound size={20} />
            My Profile
          </Link>

        </nav>

        <button className="doctor-logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="doctor-main">

        <header className="doctor-topbar">
          <div>
            <h1>Doctor Dashboard</h1>
            <p>Manage your appointments and availability.</p>
          </div>

          <div className="doctor-topbar-user">
            <div className="doctor-avatar small">
              {currentUser.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{currentUser.name}</strong>
              <span>{currentUser.specialization}</span>
            </div>
          </div>
        </header>

        {/* Welcome Section */}
        <section className="doctor-welcome">
          <div>
            <span>DOCTOR PORTAL</span>
            <h2>Welcome, Dr. {currentUser.name}</h2>
            <p>
              Here is an overview of your appointments and practice.
            </p>
          </div>

          <div className="doctor-welcome-icon">
            <Stethoscope size={58} />
          </div>
        </section>

        {/* Dynamic Statistics */}
        <section className="doctor-stats">

          <div className="doctor-stat-card">
            <div className="doctor-stat-icon blue">
              <CalendarDays size={25} />
            </div>
            <div>
              <p>Total Appointments</p>
              <h3>{totalAppointments}</h3>
            </div>
          </div>

          <div className="doctor-stat-card">
            <div className="doctor-stat-icon orange">
              <Clock size={25} />
            </div>
            <div>
              <p>Pending Requests</p>
              <h3>{pendingAppointments}</h3>
            </div>
          </div>

          <div className="doctor-stat-card">
            <div className="doctor-stat-icon green">
              <CheckCircle size={25} />
            </div>
            <div>
              <p>Completed</p>
              <h3>{completedAppointments}</h3>
            </div>
          </div>

          <div className="doctor-stat-card">
            <div className="doctor-stat-icon purple">
              <Users size={25} />
            </div>
            <div>
              <p>Total Patients</p>
              <h3>{totalPatients}</h3>
            </div>
          </div>

        </section>

        {/* Recent Appointments and Profile */}
        <section className="doctor-content-grid">

          <div className="doctor-panel doctor-appointments-panel">

            <div className="doctor-panel-header">
              <div>
                <h2>Recent Appointments</h2>
                <p>Keep track of your patient appointments.</p>
              </div>

              <Link to="/doctor/appointments">
                View All <ArrowRight size={17} />
              </Link>
            </div>

            {recentAppointments.length === 0 ? (

              <div className="doctor-empty-state">
                <div>
                  <ClipboardList size={34} />
                </div>

                <h3>No Appointments Yet</h3>

                <p>
                  Your patient appointments will appear here once patients
                  start booking consultations.
                </p>
              </div>

            ) : (

              <div className="doctor-recent-list">

                {recentAppointments.map(appointment => (

                  <div
                    className="doctor-recent-appointment"
                    key={appointment.id}
                  >

                    <div className="doctor-recent-patient">
                      <div className="doctor-avatar small">
                        {appointment.patientName?.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <h3>{appointment.patientName}</h3>
                        <p>{appointment.patientEmail}</p>
                      </div>
                    </div>

                    <div className="doctor-recent-details">
                      <span>
                        {formatDate(appointment.date)}
                      </span>

                      <span>{appointment.time}</span>
                    </div>

                    <span
                      className={`doctor-recent-status ${appointment.status?.toLowerCase()}`}
                    >
                      {appointment.status}
                    </span>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* Professional Information */}
          <div className="doctor-panel doctor-info-panel">

            <h2>Professional Information</h2>

            <div className="doctor-info-item">
              <span>Specialization</span>
              <strong>
                {currentUser.specialization || 'Not provided'}
              </strong>
            </div>

            <div className="doctor-info-item">
              <span>Qualification</span>
              <strong>
                {currentUser.qualification || 'Not provided'}
              </strong>
            </div>

            <div className="doctor-info-item">
              <span>Email Address</span>
              <strong>{currentUser.email}</strong>
            </div>

            <div className="doctor-info-item">
              <span>Phone Number</span>
              <strong>
                {currentUser.phone || 'Not provided'}
              </strong>
            </div>

          </div>

        </section>

      </main>
    </div>
  )
}

export default DoctorDashboard