
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  LayoutDashboard,
  CalendarDays,
  Stethoscope,
  UserRound,
  LogOut,
  Search,
  Clock,
  GraduationCap,
  MapPin
} from 'lucide-react'

import {
  getCurrentUser,
  getUsers,
  logoutUser
} from '../services/authService'

import '../styles/PatientDoctors.css'

function PatientDoctors() {
  const navigate = useNavigate()

  const [currentUser] = useState(() => getCurrentUser())

  const [doctors, setDoctors] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('All')
  const [availability, setAvailability] = useState([])

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'patient') {
      navigate('/patient/login')
      return
    }

    // Load all registered doctors
    const allUsers = getUsers()

    const registeredDoctors = allUsers.filter(
      user => user.role === 'doctor'
    )

    setDoctors(registeredDoctors)

    // Load doctor availability
    const savedAvailability = JSON.parse(
      localStorage.getItem('medicareDoctorAvailability') || '[]'
    )

    setAvailability(savedAvailability)

  }, [navigate])

  if (!currentUser || currentUser.role !== 'patient') {
    return null
  }

  // Get all specializations
  const specializations = [
    'All',
    ...new Set(
      doctors
        .map(doctor => doctor.specialization)
        .filter(Boolean)
    )
  ]

  // Get available slots for a particular doctor
  const getDoctorSlots = (doctorId) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return availability.filter(slot => {
      if (!slot.date) return false

      const slotDate = new Date(`${slot.date}T00:00:00`)

      return (
        slot.doctorId === doctorId &&
        slot.status === 'AVAILABLE' &&
        !Number.isNaN(slotDate.getTime()) &&
        slotDate >= today
      )
    })
  }

  // Search and specialization filter
  const filteredDoctors = doctors.filter(doctor => {
    const search = searchTerm.toLowerCase()

    const matchesSearch =
      doctor.name?.toLowerCase().includes(search) ||
      doctor.specialization?.toLowerCase().includes(search) ||
      doctor.qualification?.toLowerCase().includes(search)

    const matchesSpecialization =
      selectedSpecialization === 'All' ||
      doctor.specialization === selectedSpecialization

    return matchesSearch && matchesSpecialization
  })

  // Logout
  const handleLogout = () => {
    logoutUser()
    navigate('/patient/login')
  }

  // Open booking page
  const handleBookAppointment = (doctorId) => {
    navigate(`/patient/book/${doctorId}`)
  }

  return (
    <div className="patient-doctors-page">

      {/* Sidebar */}
      <aside className="patient-doctors-sidebar">

        <div className="patient-doctors-brand">
          <Stethoscope size={30} />

          <div>
            <h2>MediCare</h2>
            <span>PATIENT PORTAL</span>
          </div>
        </div>

        <div className="patient-doctors-profile">

          <div className="patient-doctors-avatar">
            {currentUser.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3>{currentUser.name}</h3>
            <p>Patient</p>
          </div>

        </div>

        <nav className="patient-doctors-nav">

          <Link to="/patient/dashboard">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link to="/patient/appointments">
            <CalendarDays size={20} />
            My Appointments
          </Link>

          <Link
            to="/patient/doctors"
            className="active"
          >
            <Stethoscope size={20} />
            Find Doctors
          </Link>

          <Link to="/patient/profile">
            <UserRound size={20} />
            My Profile
          </Link>

        </nav>

        <button
          type="button"
          className="patient-doctors-logout"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="patient-doctors-main">

        <header className="patient-doctors-header">

          <div>
            <h1>Find Your Doctor</h1>

            <p>
              Explore our registered doctors and their availability.
            </p>
          </div>

        </header>

        {/* Banner */}
        <section className="patient-doctors-banner">

          <div>
            <span>YOUR HEALTH MATTERS</span>

            <h2>
              Find the Right Specialist for Your Health
            </h2>

            <p>
              Browse doctors by name or specialization and check
              their available consultation slots.
            </p>
          </div>

          <Stethoscope size={65} />

        </section>

        {/* Search and Filter */}
        <section className="patient-doctors-search">

          <div className="patient-doctors-search-input">

            <Search size={21} />

            <input
              type="text"
              placeholder="Search doctor name, specialization or qualification..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

          </div>

          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
          >

            {specializations.map(specialization => (

              <option
                key={specialization}
                value={specialization}
              >
                {specialization === 'All'
                  ? 'All Specializations'
                  : specialization}
              </option>

            ))}

          </select>

        </section>

        {/* Doctors List */}
        <section className="patient-doctors-results">

          <div className="patient-doctors-results-heading">

            <div>
              <h2>Our Doctors</h2>

              <p>
                {filteredDoctors.length} doctor(s) found
              </p>
            </div>

          </div>

          {filteredDoctors.length === 0 ? (

            <div className="patient-doctors-empty">

              <Stethoscope size={42} />

              <h3>No Doctors Found</h3>

              <p>
                Try changing your search or specialization filter.
              </p>

            </div>

          ) : (

            <div className="patient-doctors-grid">

              {filteredDoctors.map(doctor => {

                const doctorSlots = getDoctorSlots(doctor.id)

                const sortedDoctorSlots = [...doctorSlots].sort(
                  (a, b) => {
                    const dateDifference = a.date.localeCompare(b.date)

                    if (dateDifference !== 0) {
                      return dateDifference
                    }

                    return (a.time || '').localeCompare(b.time || '')
                  }
                )

                const nextSlot = sortedDoctorSlots[0]

                return (

                  <article
                    className="patient-doctor-card"
                    key={doctor.id}
                  >

                    <div className="patient-doctor-card-top">

                      <div className="patient-doctor-avatar">
                        {doctor.name?.charAt(0).toUpperCase()}
                      </div>

                      <span className="patient-doctor-specialty">
                        {doctor.specialization}
                      </span>

                    </div>

                    <h3>
                      Dr. {doctor.name}
                    </h3>

                    <div className="patient-doctor-detail">

                      <GraduationCap size={18} />

                      <span>
                        {doctor.qualification || 'Qualification not provided'}
                      </span>

                    </div>

                    <div className="patient-doctor-detail">

                      <MapPin size={18} />

                      <span>
                        Consultation at MediCare
                      </span>

                    </div>

                    <div className="patient-doctor-availability">

                      <div>
                        <Clock size={19} />

                        <strong>
                          Available Slots
                        </strong>
                      </div>

                      <span>
                        {doctorSlots.length} slot(s) available
                      </span>

                    </div>

                    {nextSlot ? (

                      <div className="patient-doctor-next-slot">

                        Next available:{' '}

                        {new Date(
                          `${nextSlot.date}T00:00:00`
                        ).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}

                      </div>

                    ) : (

                      <div className="patient-doctor-no-slot">
                        No upcoming slots
                      </div>

                    )}

                    {/* Book Appointment */}
                    <button
                      type="button"
                      className="patient-doctor-book-btn"
                      onClick={() => handleBookAppointment(doctor.id)}
                    >
                      Book Appointment
                    </button>

                  </article>

                )

              })}

            </div>

          )}

        </section>

      </main>

    </div>
  )
}

export default PatientDoctors
