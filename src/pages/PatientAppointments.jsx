
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  LayoutDashboard,
  CalendarDays,
  Stethoscope,
  UserRound,
  LogOut,
  Clock,
  XCircle,
  ClipboardList
} from 'lucide-react'

import {
  getCurrentUser,
  logoutUser
} from '../services/authService'

import '../styles/PatientAppointments.css'

function PatientAppointments() {
  const navigate = useNavigate()

  const [currentUser] = useState(() => getCurrentUser())
  const [appointments, setAppointments] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'patient') {
      navigate('/patient/login')
      return
    }

    loadAppointments()
  }, [navigate])

  const loadAppointments = () => {
    const allAppointments = JSON.parse(
      localStorage.getItem('medicareAppointments') || '[]'
    )

    const patientAppointments = allAppointments.filter(
      appointment => appointment.patientId === currentUser.id
    )

    patientAppointments.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )

    setAppointments(patientAppointments)
  }

  const handleCancelAppointment = (appointmentId) => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this appointment?'
    )

    if (!confirmCancel) return

    const allAppointments = JSON.parse(
      localStorage.getItem('medicareAppointments') || '[]'
    )

    const appointmentToCancel = allAppointments.find(
      appointment =>
        appointment.id === appointmentId &&
        appointment.patientId === currentUser.id
    )

    if (!appointmentToCancel) {
      setMessage('Appointment not found.')
      return
    }

    if (
      !['PENDING', 'ACCEPTED'].includes(appointmentToCancel.status)
    ) {
      setMessage('This appointment cannot be cancelled.')
      return
    }

    const updatedAppointments = allAppointments.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, status: 'CANCELLED' }
        : appointment
    )

    localStorage.setItem(
      'medicareAppointments',
      JSON.stringify(updatedAppointments)
    )

    // Make the cancelled appointment slot available again
    const allSlots = JSON.parse(
      localStorage.getItem('medicareDoctorAvailability') || '[]'
    )

    const updatedSlots = allSlots.map(slot => {
      const matchesSlot = appointmentToCancel.slotId
        ? slot.id === appointmentToCancel.slotId
        : (
            slot.doctorId === appointmentToCancel.doctorId &&
            slot.date === appointmentToCancel.date &&
            slot.time === appointmentToCancel.time
          )

      return matchesSlot
        ? { ...slot, status: 'AVAILABLE' }
        : slot
    })

    localStorage.setItem(
      'medicareDoctorAvailability',
      JSON.stringify(updatedSlots)
    )

    setMessage('Appointment cancelled successfully.')
    loadAppointments()
  }

  const handleLogout = () => {
    logoutUser()
    navigate('/patient/login')
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'pending'

      case 'ACCEPTED':
        return 'accepted'

      case 'REJECTED':
        return 'rejected'

      case 'COMPLETED':
        return 'completed'

      case 'CANCELLED':
        return 'cancelled'

      default:
        return 'pending'
    }
  }

  if (!currentUser || currentUser.role !== 'patient') {
    return null
  }

  return (
    <div className="patient-appointments-page">

      {/* Sidebar */}
      <aside className="patient-appointments-sidebar">

        <div className="patient-appointments-brand">
          <Stethoscope size={30} />

          <div>
            <h2>MediCare</h2>
            <span>PATIENT PORTAL</span>
          </div>
        </div>

        <div className="patient-appointments-profile">

          <div className="patient-appointments-avatar">
            {currentUser.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3>{currentUser.name}</h3>
            <p>Patient</p>
          </div>

        </div>

        <nav className="patient-appointments-nav">

          <Link to="/patient/dashboard">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            to="/patient/appointments"
            className="active"
          >
            <CalendarDays size={20} />
            My Appointments
          </Link>

          <Link to="/patient/doctors">
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
          className="patient-appointments-logout"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="patient-appointments-main">

        <header className="patient-appointments-header">
          <div>
            <h1>My Appointments</h1>
            <p>
              View and manage your consultation appointments.
            </p>
          </div>
        </header>

        {/* Summary */}
        <section className="patient-appointments-summary">

          <div className="patient-appointments-summary-card">
            <CalendarDays size={25} />
            <div>
              <span>Total Appointments</span>
              <h2>{appointments.length}</h2>
            </div>
          </div>

          <div className="patient-appointments-summary-card">
            <Clock size={25} />
            <div>
              <span>Pending</span>
              <h2>
                {appointments.filter(a => a.status === 'PENDING').length}
              </h2>
            </div>
          </div>

          <div className="patient-appointments-summary-card">
            <ClipboardList size={25} />
            <div>
              <span>Accepted</span>
              <h2>
                {appointments.filter(a => a.status === 'ACCEPTED').length}
              </h2>
            </div>
          </div>

        </section>

        {message && (
          <div className="patient-appointments-message">
            {message}
          </div>
        )}

        {/* Appointment List */}
        <section className="patient-appointments-list-section">

          <div className="patient-appointments-list-heading">
            <h2>Appointment History</h2>
            <span>{appointments.length} appointment(s)</span>
          </div>

          {appointments.length === 0 ? (

            <div className="patient-appointments-empty">
              <CalendarDays size={45} />

              <h3>No Appointments Yet</h3>

              <p>
                You have not booked any appointments.
                Find a doctor and book your first consultation.
              </p>

              <Link
                to="/patient/doctors"
                className="patient-appointments-find-btn"
              >
                Find Doctors
              </Link>
            </div>

          ) : (

            <div className="patient-appointments-list">

              {appointments.map(appointment => (

                <article
                  className="patient-appointment-card"
                  key={appointment.id}
                >

                  <div className="patient-appointment-card-header">

                    <div>
                      <span>DOCTOR</span>
                      <h3>Dr. {appointment.doctorName}</h3>
                      <p>{appointment.specialization}</p>
                    </div>

                    <span
                      className={`patient-appointment-status ${getStatusClass(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>

                  </div>

                  <div className="patient-appointment-details">

                    <div>
                      <CalendarDays size={19} />
                      <span>
                        {new Date(
                          `${appointment.date}T00:00:00`
                        ).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div>
                      <Clock size={19} />
                      <span>{appointment.time}</span>
                    </div>

                  </div>

                  <div className="patient-appointment-card-footer">

                    <span>
                      Requested on:{' '}
                      {new Date(appointment.createdAt).toLocaleDateString(
                        'en-IN'
                      )}
                    </span>

                    {['PENDING', 'ACCEPTED'].includes(appointment.status) && (

                      <button
                        type="button"
                        className="patient-appointment-cancel-btn"
                        onClick={() =>
                          handleCancelAppointment(appointment.id)
                        }
                      >
                        <XCircle size={17} />
                        Cancel Appointment
                      </button>

                    )}

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

export default PatientAppointments
