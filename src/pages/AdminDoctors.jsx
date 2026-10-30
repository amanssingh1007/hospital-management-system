import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, logoutUser } from '../services/authService'
import '../styles/AdminDashboard.css'
import '../styles/AdminDoctors.css'

function AdminDoctors() {
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const user = getCurrentUser()

    if (!user || user.role !== 'admin') {
      navigate('/admin/login')
      return
    }

    const users = JSON.parse(localStorage.getItem('medicareUsers') || '[]')
    setDoctors(users.filter(user => user.role === 'doctor'))
  }, [navigate])

  const handleLogout = () => {
    logoutUser()
    navigate('/admin/login')
  }

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name?.toLowerCase().includes(search.toLowerCase()) ||
    doctor.email?.toLowerCase().includes(search.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="admin-dashboard admin-doctors-page">
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

          <button className="active">
            Doctors
          </button>

          <button onClick={() => navigate('/admin/appointments')}>
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
            <h1>Manage Doctors</h1>
            <p>View and search all registered doctors.</p>
          </div>
        </div>

        <div className="admin-doctor-summary">
          <div className="admin-doctor-summary-card">
            <span>Total Doctors</span>
            <h2>{doctors.length}</h2>
          </div>
        </div>

        <div className="admin-doctor-search">
          <input
            type="text"
            placeholder="Search by name, email or specialization..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-doctor-grid">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map(doctor => (
              <div className="admin-doctor-card" key={doctor.id}>
                <div className="admin-doctor-card-header">
                  <div className="admin-doctor-avatar">
                    {doctor.name?.charAt(0).toUpperCase()}
                  </div>

                  <div className="admin-doctor-details">
                    <h3>{doctor.name}</h3>
                    <p>{doctor.specialization}</p>
                  </div>
                </div>

                <div className="admin-doctor-info">
                  <p><strong>Email:</strong> {doctor.email}</p>
                  <p><strong>Phone:</strong> {doctor.phone}</p>
                  <p><strong>Qualification:</strong> {doctor.qualification}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="admin-empty-state">
              <h3>No doctors found</h3>
              <p>Try another search or register a doctor first.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminDoctors