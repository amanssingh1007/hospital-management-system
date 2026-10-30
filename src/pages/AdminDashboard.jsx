
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  Clock,
  LogOut,
  ClipboardList
} from 'lucide-react'

import { getCurrentUser, logoutUser } from '../services/authService'
import '../styles/AdminDashboard.css'

function AdminDashboard() {
  const navigate = useNavigate()

  const [currentUser] = useState(() => getCurrentUser())
  const [users, setUsers] = useState([])
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/admin/login', { replace: true })
      return
    }

    loadDashboardData()
  }, [currentUser, navigate])

  const loadDashboardData = () => {
    const savedUsers = JSON.parse(
      localStorage.getItem('medicareUsers') || '[]'
    )

    const savedAppointments = JSON.parse(
      localStorage.getItem('medicareAppointments') || '[]'
    )

    setUsers(savedUsers)
    setAppointments(
      savedAppointments.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    )
  }

  const handleLogout = () => {
    logoutUser()
    navigate('/admin/login', { replace: true })
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return null
  }

  const patients = users.filter(user => user.role === 'patient')
  const doctors = users.filter(user => user.role === 'doctor')

  const pendingAppointments = appointments.filter(
    appointment => appointment.status === 'PENDING'
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
    <div className="admin-dashboard">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="admin-brand">
          <Stethoscope size={30} />
          <div>
            <h2>MediCare</h2>
            <span>ADMIN PORTAL</span>
          </div>
        </div>

        <nav className="admin-navigation">

          <Link to="/admin/dashboard" className="active">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link to="/admin/patients">
            <Users size={20} />
            Patients
          </Link>

          <Link to="/admin/doctors">
            <Stethoscope size={20} />
            Doctors
          </Link>

          <Link to="/admin/appointments">
            <CalendarDays size={20} />
            Appointments
          </Link>

        </nav>

        <button
          type="button"
          className="admin-logout"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </button>

      </aside>

      {/* MAIN CONTENT */}

      <main className="admin-main">

        <header className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage your hospital operations.</p>
          </div>

          <div className="admin-user">
            <div className="admin-avatar">A</div>
            <div>
              <strong>{currentUser.name}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        {/* STATISTICS */}

        <section className="admin-stats">

          <div className="admin-stat-card">
            <div className="admin-stat-icon blue">
              <Users size={25} />
            </div>
            <div>
              <span>Total Patients</span>
              <h2>{patients.length}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon teal">
              <Stethoscope size={25} />
            </div>
            <div>
              <span>Total Doctors</span>
              <h2>{doctors.length}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon purple">
              <CalendarDays size={25} />
            </div>
            <div>
              <span>Total Appointments</span>
              <h2>{appointments.length}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon orange">
              <Clock size={25} />
            </div>
            <div>
              <span>Pending Appointments</span>
              <h2>{pendingAppointments.length}</h2>
            </div>
          </div>

        </section>

        {/* QUICK MANAGEMENT */}

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <h2>Management</h2>
              <p>Manage hospital information and records.</p>
            </div>
          </div>

          <div className="admin-management-grid">

            <Link to="/admin/patients" className="admin-management-card">
              <Users size={28} />
              <h3>Manage Patients</h3>
              <p>View registered patient information.</p>
            </Link>

            <Link to="/admin/doctors" className="admin-management-card">
              <Stethoscope size={28} />
              <h3>Manage Doctors</h3>
              <p>View registered doctors and their details.</p>
            </Link>

            <Link to="/admin/appointments" className="admin-management-card">
              <ClipboardList size={28} />
              <h3>Manage Appointments</h3>
              <p>Monitor all hospital appointments.</p>
            </Link>

          </div>
        </section>

        {/* RECENT APPOINTMENTS */}

        <section className="admin-section">

          <div className="admin-section-heading">
            <div>
              <h2>Recent Appointments</h2>
              <p>Latest appointment activity.</p>
            </div>

            <Link to="/admin/appointments" className="admin-view-all">
              View All
            </Link>
          </div>

          {recentAppointments.length === 0 ? (

            <div className="admin-empty">
              <CalendarDays size={40} />
              <h3>No appointments available</h3>
              <p>Appointments will appear here when patients book them.</p>
            </div>

          ) : (

            <div className="admin-appointment-list">

              {recentAppointments.map(appointment => (

                <article className="admin-appointment-card" key={appointment.id}>

                  <div className="admin-appointment-info">
                    <strong>Dr. {appointment.doctorName}</strong>
                    <span>Patient: {appointment.patientName}</span>
                    <span>
                      {appointment.date} · {appointment.time}
                    </span>
                  </div>

                  <span className={`admin-status ${getStatusClass(appointment.status)}`}>
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

export default AdminDashboard
