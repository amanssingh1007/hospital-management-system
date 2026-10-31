import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, logoutUser } from '../services/authService'
import '../styles/AdminDashboard.css'
import '../styles/AdminAppointments.css'

function AdminAppointments() {
  const navigate = useNavigate()

  const [appointments, setAppointments] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    const user = getCurrentUser()

    if (!user || user.role !== 'admin') {
      navigate('/admin/login')
      return
    }

    const savedAppointments = JSON.parse(
      localStorage.getItem('medicareAppointments') || '[]'
    )

    setAppointments(savedAppointments)
  }, [navigate])

  const handleLogout = () => {
    logoutUser()
    navigate('/admin/login')
  }

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch =
      appointment.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      appointment.doctorName?.toLowerCase().includes(search.toLowerCase()) ||
      appointment.specialization?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === 'ALL' || appointment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusClass = status => {
    return status?.toLowerCase() || 'pending'
  }

  return (
   <div className="admin-dashboard admin-appointments-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <h2>MediCare</h2>
          <p>Administration</p>
        </div>

        <nav className="admin-sidebar-nav">
          <button onClick={() => navigate('/admin/dashboard')}>
            Dashboard
          </button>

          <button onClick={() => navigate('/admin/patients')}>
            Patients
          </button>

          <button onClick={() => navigate('/admin/doctors')}>
            Doctors
          </button>

          <button className="active">
            Appointments
          </button>
        </nav>

        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <h1>Manage Appointments</h1>
            <p>View and monitor all hospital appointments.</p>
          </div>
        </div>

        <div className="admin-appointment-stats">
          <div className="admin-appointment-stat-card">
            <span>Total Appointments</span>
            <h2>{appointments.length}</h2>
          </div>

          <div className="admin-appointment-stat-card">
            <span>Pending</span>
            <h2>
              {appointments.filter(a => a.status === 'PENDING').length}
            </h2>
          </div>

          <div className="admin-appointment-stat-card">
            <span>Accepted</span>
            <h2>
              {appointments.filter(a => a.status === 'ACCEPTED').length}
            </h2>
          </div>

          <div className="admin-appointment-stat-card">
            <span>Completed</span>
            <h2>
              {appointments.filter(a => a.status === 'COMPLETED').length}
            </h2>
          </div>
        </div>

        <div className="admin-appointment-filters">
          <input
            type="text"
            placeholder="Search patient, doctor or specialization..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="admin-appointment-list">
          {filteredAppointments.length > 0 ? (
            filteredAppointments
              .slice()
              .sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
              )
              .map(appointment => (
                <div
                  className="admin-appointment-card"
                  key={appointment.id}
                >
                  <div className="admin-appointment-card-header">
                    <div>
                      <h3>{appointment.patientName}</h3>
                      <p>{appointment.patientEmail}</p>
                    </div>

                    <span
                      className={`admin-appointment-status ${getStatusClass(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  <div className="admin-appointment-details">
                    <div>
                      <span>Doctor</span>
                      <strong>{appointment.doctorName}</strong>
                    </div>

                    <div>
                      <span>Specialization</span>
                      <strong>{appointment.specialization}</strong>
                    </div>

                    <div>
                      <span>Date</span>
                      <strong>{appointment.date}</strong>
                    </div>

                    <div>
                      <span>Time</span>
                      <strong>{appointment.time}</strong>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="admin-appointment-empty">
              <h3>No appointments found</h3>
              <p>There are no appointments matching your search.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminAppointments