
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  LogOut,
  Search,
  UserRound,
  Phone,
  Mail
} from 'lucide-react'

import { getCurrentUser, logoutUser } from '../services/authService'
import '../styles/AdminDashboard.css'
import '../styles/AdminPatients.css'

function AdminPatients() {
  const navigate = useNavigate()

  const [currentUser] = useState(() => getCurrentUser())
  const [patients, setPatients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/admin/login', { replace: true })
      return
    }

    loadPatients()
  }, [currentUser, navigate])

  const loadPatients = () => {
    const users = JSON.parse(
      localStorage.getItem('medicareUsers') || '[]'
    )

    setPatients(users.filter(user => user.role === 'patient'))
  }

  const handleLogout = () => {
    logoutUser()
    navigate('/admin/login', { replace: true })
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return null
  }

  const filteredPatients = patients.filter(patient => {
    const search = searchTerm.toLowerCase()

    return (
      patient.name?.toLowerCase().includes(search) ||
      patient.email?.toLowerCase().includes(search) ||
      patient.phone?.includes(search)
    )
  })

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

          <Link to="/admin/dashboard">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link to="/admin/patients" className="active">
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
            <h1>Manage Patients</h1>
            <p>View and manage registered patient records.</p>
          </div>
        </header>

        {/* PATIENT SUMMARY */}

        <section className="admin-stats">

          <div className="admin-stat-card">
            <div className="admin-stat-icon blue">
              <Users size={25} />
            </div>

            <div>
              <span>Total Registered Patients</span>
              <h2>{patients.length}</h2>
            </div>
          </div>

        </section>

        {/* SEARCH */}

        <section className="admin-section">

          <div className="admin-section-heading">
            <div>
              <h2>Patient Records</h2>
              <p>Search and view patient information.</p>
            </div>
          </div>

          <div className="admin-patient-search">
            <Search size={20} />

            <input
              type="text"
              placeholder="Search by patient name, email or phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* PATIENT LIST */}

          {filteredPatients.length === 0 ? (

            <div className="admin-empty">
              <Users size={40} />
              <h3>No patients found</h3>
              <p>
                {searchTerm
                  ? 'Try searching with another name, email or phone number.'
                  : 'Registered patients will appear here.'}
              </p>
            </div>

          ) : (

            <div className="admin-patient-grid">

              {filteredPatients.map(patient => (

                <article
                  className="admin-patient-card"
                  key={patient.id}
                >

                  <div className="admin-patient-card-header">

                    <div className="admin-patient-avatar">
                      {patient.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3>{patient.name}</h3>
                      <span>Patient</span>
                    </div>

                  </div>

                  <div className="admin-patient-details">

                    <div>
                      <Mail size={17} />
                      <span>{patient.email}</span>
                    </div>

                    <div>
                      <Phone size={17} />
                      <span>{patient.phone || 'Not provided'}</span>
                    </div>

                    <div>
                      <UserRound size={17} />
                      <span>{patient.gender || 'Not provided'}</span>
                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </main>
    </div>
  )
}

export default AdminPatients
