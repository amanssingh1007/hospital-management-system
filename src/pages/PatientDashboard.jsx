
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarDays,
  Stethoscope,
  UserRound,
  Clock,
  CheckCircle,
  LogOut,
  ArrowRight,
  Plus,
  ClipboardList
} from 'lucide-react'

import { getCurrentUser, logoutUser } from '../services/authService'
import '../styles/PatientDashboard.css'

function PatientDashboard() {
  const navigate = useNavigate()

  const [currentUser] = useState(() => getCurrentUser())
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'patient') {
      navigate('/patient/login', { replace: true })
      return
    }

    loadAppointments()
  }, [currentUser, navigate])

  const loadAppointments = () => {
    const allAppointments = JSON.parse(
      localStorage.getItem('medicareAppointments') || '[]'
    )

    const patientAppointments = allAppointments.filter(
      appointment => String(appointment.patientId) === String(currentUser.id)
    )

    patientAppointments.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )

    setAppointments(patientAppointments)
  }

  if (!currentUser || currentUser.role !== 'patient') {
    return null
  }

  const handleLogout = () => {
    logoutUser()
    navigate('/patient/login', { replace: true })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(`${appointment.date}T00:00:00`)
    return (
      ['PENDING', 'ACCEPTED'].includes(appointment.status) &&
      appointmentDate >= today
    )
  })

  const completedAppointments = appointments.filter(
    appointment => appointment.status === 'COMPLETED'
  )

  const recentAppointments = appointments.slice(0, 5)

  const getStatusClass = status => {
    switch (status) {
      case 'PENDING': return 'pending'
      case 'ACCEPTED': return 'accepted'
      case 'REJECTED': return 'rejected'
      case 'COMPLETED': return 'completed'
      case 'CANCELLED': return 'cancelled'
      default: return 'pending'
    }
  }

  return (
    <div className="patient-dashboard">

      <aside className="patient-sidebar">
        <div className="dashboard-logo">
          <Stethoscope size={30} />
          <span>MediCare</span>
        </div>

        <div className="sidebar-label">MAIN MENU</div>

        <nav className="sidebar-navigation">
          <Link to="/patient/dashboard" className="sidebar-link active">
            <LayoutDashboard size={21} />
            Dashboard
          </Link>

          <Link to="/patient/appointments" className="sidebar-link">
            <CalendarDays size={21} />
            My Appointments
          </Link>

          <Link to="/patient/doctors" className="sidebar-link">
            <Stethoscope size={21} />
            Find Doctors
          </Link>

          <Link to="/patient/profile" className="sidebar-link">
            <UserRound size={21} />
            My Profile
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <button className="sidebar-link logout-link" onClick={handleLogout}>
            <LogOut size={21} />
            Logout
          </button>
        </div>
      </aside>

      <main className="patient-main">

        <header className="patient-topbar">
          <div>
            <h2>Patient Dashboard</h2>
            <p>Manage your healthcare journey</p>
          </div>

          <div className="patient-user-info">
            <div className="patient-avatar">
              {currentUser.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{currentUser.name}</strong>
              <span>Patient</span>
            </div>
          </div>
        </header>

        <section className="patient-welcome">
          <div>
            <p>WELCOME TO MEDICARE</p>
            <h1>Hello, {currentUser.name}!</h1>
            <span>
              Your health matters to us. Let's take care of it together.
            </span>
          </div>

          <div className="welcome-icon">
            <Stethoscope size={75} />
          </div>
        </section>

        <section className="patient-stats">

          <div className="patient-stat-card">
            <div className="stat-icon blue">
              <CalendarDays size={25} />
            </div>
            <div>
              <span>Total Appointments</span>
              <h2>{appointments.length}</h2>
            </div>
          </div>

          <div className="patient-stat-card">
            <div className="stat-icon orange">
              <Clock size={25} />
            </div>
            <div>
              <span>Upcoming Appointments</span>
              <h2>{upcomingAppointments.length}</h2>
            </div>
          </div>

          <div className="patient-stat-card">
            <div className="stat-icon green">
              <CheckCircle size={25} />
            </div>
            <div>
              <span>Completed Appointments</span>
              <h2>{completedAppointments.length}</h2>
            </div>
          </div>

        </section>

        <section className="patient-section">
          <div className="patient-section-heading">
            <div>
              <h2>Quick Actions</h2>
              <p>Access your healthcare services</p>
            </div>
          </div>

          <div className="quick-action-grid">

            <Link to="/patient/doctors" className="quick-action-card">
              <div className="quick-action-icon teal">
                <Stethoscope size={27} />
              </div>
              <h3>Find a Doctor</h3>
              <p>Explore doctors and their specialities.</p>
              <span>Explore Doctors <ArrowRight size={17} /></span>
            </Link>

            <Link to="/patient/doctors" className="quick-action-card">
              <div className="quick-action-icon blue">
                <Plus size={27} />
              </div>
              <h3>Book Appointment</h3>
              <p>Choose a doctor and schedule a visit.</p>
              <span>Book Now <ArrowRight size={17} /></span>
            </Link>

            <Link to="/patient/appointments" className="quick-action-card">
              <div className="quick-action-icon purple">
                <ClipboardList size={27} />
              </div>
              <h3>My Appointments</h3>
              <p>View and manage your appointments.</p>
              <span>View Appointments <ArrowRight size={17} /></span>
            </Link>

          </div>
        </section>

        <section className="patient-section recent-section">
          <div className="patient-section-heading">
            <div>
              <h2>Recent Appointments</h2>
              <p>Keep track of your doctor visits</p>
            </div>

            <Link to="/patient/appointments" className="view-all-link">
              View All <ArrowRight size={17} />
            </Link>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="empty-appointments">
              <div className="empty-appointment-icon">
                <CalendarDays size={35} />
              </div>
              <h3>No appointments yet</h3>
              <p>
                You haven't booked any appointments.
                Find a doctor and schedule your first visit.
              </p>
              <Link to="/patient/doctors" className="dashboard-primary-btn">
                Find a Doctor <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <div className="patient-recent-list">
              {recentAppointments.map(appointment => (
                <article className="patient-recent-card" key={appointment.id}>
                  <div className="patient-recent-doctor">
                    <div className="patient-recent-avatar">
                      <Stethoscope size={22} />
                    </div>
                    <div className="patient-recent-details">
                      <strong>Dr. {appointment.doctorName}</strong>
                      <span>{appointment.specialization}</span>
                      <span>
                        {new Date(`${appointment.date}T00:00:00`).toLocaleDateString(
                          'en-IN',
                          { day: 'numeric', month: 'long', year: 'numeric' }
                        )} · {appointment.time}
                      </span>
                    </div>
                  </div>

                  <span className={`patient-recent-status ${getStatusClass(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  )
}

export default PatientDashboard
