
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  LayoutDashboard,
  CalendarDays,
  Clock,
  UserRound,
  LogOut,
  Stethoscope,
  CheckCircle,
  XCircle,
  ClipboardList,
  Mail,
  Phone
} from 'lucide-react'

import {
  getCurrentUser,
  logoutUser
} from '../services/authService'

import '../styles/DoctorAppointments.css'

function DoctorAppointments() {
  const navigate = useNavigate()

  const [currentUser] = useState(() => getCurrentUser())
  const [appointments, setAppointments] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'doctor') {
      navigate('/doctor/login')
      return
    }

    loadAppointments()
  }, [navigate])

  // Load appointments belonging to logged-in doctor
  const loadAppointments = () => {
    const allAppointments = JSON.parse(
      localStorage.getItem('medicareAppointments') || '[]'
    )

    const doctorAppointments = allAppointments.filter(
      appointment => appointment.doctorId === currentUser.id
    )

    doctorAppointments.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )

    setAppointments(doctorAppointments)
  }

  // Accept or reject an appointment
  const updateAppointmentStatus = (appointmentId, newStatus) => {
    const allAppointments = JSON.parse(
      localStorage.getItem('medicareAppointments') || '[]'
    )

    const selectedAppointment = allAppointments.find(
      appointment =>
        appointment.id === appointmentId &&
        appointment.doctorId === currentUser.id
    )

    if (!selectedAppointment) {
      setMessage('Appointment not found.')
      return
    }

    if (selectedAppointment.status !== 'PENDING') {
      setMessage('This appointment has already been processed.')
      return
    }

    const updatedAppointments = allAppointments.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, status: newStatus }
        : appointment
    )

    localStorage.setItem(
      'medicareAppointments',
      JSON.stringify(updatedAppointments)
    )

    // If doctor rejects, release the booked slot
    if (newStatus === 'REJECTED') {
      const allSlots = JSON.parse(
        localStorage.getItem('medicareDoctorAvailability') || '[]'
      )

      const updatedSlots = allSlots.map(slot => {
        const matchesSlot = selectedAppointment.slotId
          ? slot.id === selectedAppointment.slotId
          : (
              slot.doctorId === selectedAppointment.doctorId &&
              slot.date === selectedAppointment.date &&
              slot.time === selectedAppointment.time
            )

        return matchesSlot
          ? { ...slot, status: 'AVAILABLE' }
          : slot
      })

      localStorage.setItem(
        'medicareDoctorAvailability',
        JSON.stringify(updatedSlots)
      )
    }

    setMessage(
      newStatus === 'ACCEPTED'
        ? 'Appointment accepted successfully.'
        : 'Appointment rejected successfully.'
    )

    loadAppointments()
  }

  // Complete an accepted appointment
  const completeAppointment = (appointmentId) => {
    const allAppointments = JSON.parse(
      localStorage.getItem('medicareAppointments') || '[]'
    )

    const selectedAppointment = allAppointments.find(
      appointment =>
        appointment.id === appointmentId &&
        appointment.doctorId === currentUser.id
    )

    if (!selectedAppointment || selectedAppointment.status !== 'ACCEPTED') {
      setMessage('Only accepted appointments can be completed.')
      return
    }

    const updatedAppointments = allAppointments.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, status: 'COMPLETED' }
        : appointment
    )

    localStorage.setItem(
      'medicareAppointments',
      JSON.stringify(updatedAppointments)
    )

    setMessage('Appointment marked as completed.')
    loadAppointments()
  }

  const handleLogout = () => {
    logoutUser()
    navigate('/doctor/login')
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

  if (!currentUser || currentUser.role !== 'doctor') {
    return null
  }

  return (
    <div className="doctor-appointments-page">

      {/* Sidebar */}
      <aside className="doctor-appointments-sidebar">

        <div className="doctor-appointments-brand">
          <Stethoscope size={30} />

          <div>
            <h2>MediCare</h2>
            <span>DOCTOR PORTAL</span>
          </div>
        </div>

        <div className="doctor-appointments-profile">

          <div className="doctor-appointments-avatar">
            {currentUser.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3>Dr. {currentUser.name}</h3>
            <p>Doctor</p>
          </div>

        </div>

        <nav className="doctor-appointments-nav">

          <Link to="/doctor/dashboard">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            to="/doctor/appointments"
            className="active"
          >
            <CalendarDays size={20} />
            My Appointments
          </Link>

          <Link to="/doctor/availability">
            <Clock size={20} />
            Manage Availability
          </Link>

        </nav>

        <button
          type="button"
          className="doctor-appointments-logout"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="doctor-appointments-main">

        <header className="doctor-appointments-header">
          <div>
            <h1>Manage Appointments</h1>
            <p>
              Review patient requests and manage your consultations.
            </p>
          </div>
        </header>

        {/* Summary Cards */}
        <section className="doctor-appointments-summary">

          <div className="doctor-appointments-summary-card">
            <ClipboardList size={25} />
            <div>
              <span>Total Appointments</span>
              <h2>{appointments.length}</h2>
            </div>
          </div>

          <div className="doctor-appointments-summary-card">
            <Clock size={25} />
            <div>
              <span>Pending Requests</span>
              <h2>
                {appointments.filter(a => a.status === 'PENDING').length}
              </h2>
            </div>
          </div>

          <div className="doctor-appointments-summary-card">
            <CheckCircle size={25} />
            <div>
              <span>Accepted</span>
              <h2>
                {appointments.filter(a => a.status === 'ACCEPTED').length}
              </h2>
            </div>
          </div>

        </section>

        {message && (
          <div className="doctor-appointments-message">
            {message}
          </div>
        )}

        {/* Appointment Requests */}
        <section className="doctor-appointments-list-section">

          <div className="doctor-appointments-list-heading">
            <h2>Patient Appointment Requests</h2>
            <span>{appointments.length} request(s)</span>
          </div>

          {appointments.length === 0 ? (

            <div className="doctor-appointments-empty">
              <CalendarDays size={45} />

              <h3>No Appointments Yet</h3>

              <p>
                Patient appointment requests will appear here
                when someone books a consultation with you.
              </p>
            </div>

          ) : (

            <div className="doctor-appointments-list">

              {appointments.map(appointment => (

                <article
                  className="doctor-appointment-card"
                  key={appointment.id}
                >

                  <div className="doctor-appointment-card-header">

                    <div>
                      <span>PATIENT DETAILS</span>
                      <h3>{appointment.patientName}</h3>
                      <p>Patient</p>
                    </div>

                    <span
                      className={`doctor-appointment-status ${getStatusClass(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>

                  </div>

                  <div className="doctor-appointment-details">

                    <div>
                      <Mail size={18} />
                      <span>{appointment.patientEmail}</span>
                    </div>

                    <div>
                      <CalendarDays size={18} />
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
                      <Clock size={18} />
                      <span>{appointment.time}</span>
                    </div>

                  </div>

                  <div className="doctor-appointment-card-footer">

                    <span>
                      Requested on:{' '}
                      {new Date(appointment.createdAt).toLocaleDateString(
                        'en-IN'
                      )}
                    </span>

                    <div className="doctor-appointment-actions">

                      {appointment.status === 'PENDING' && (
                        <>
                          <button
                            type="button"
                            className="doctor-appointment-accept-btn"
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment.id,
                                'ACCEPTED'
                              )
                            }
                          >
                            <CheckCircle size={17} />
                            Accept
                          </button>

                          <button
                            type="button"
                            className="doctor-appointment-reject-btn"
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment.id,
                                'REJECTED'
                              )
                            }
                          >
                            <XCircle size={17} />
                            Reject
                          </button>
                        </>
                      )}

                      {appointment.status === 'ACCEPTED' && (
                        <button
                          type="button"
                          className="doctor-appointment-complete-btn"
                          onClick={() =>
                            completeAppointment(appointment.id)
                          }
                        >
                          <CheckCircle size={17} />
                          Mark as Completed
                        </button>
                      )}

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

export default DoctorAppointments
