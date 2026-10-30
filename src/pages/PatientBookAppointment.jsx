
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarDays,
  Stethoscope,
  UserRound,
  LogOut,
  Clock,
  GraduationCap,
  CheckCircle,
  ArrowLeft
} from 'lucide-react'

import {
  getCurrentUser,
  getUsers,
  logoutUser
} from '../services/authService'

import '../styles/PatientBookAppointment.css'

function PatientBookAppointment() {
  const navigate = useNavigate()
  const { doctorId } = useParams()

  const [currentUser] = useState(() => getCurrentUser())
  const [doctor, setDoctor] = useState(null)
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [message, setMessage] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'patient') {
      navigate('/patient/login')
      return
    }

    const allUsers = getUsers()

    const selectedDoctor = allUsers.find(
      user => user.id === doctorId && user.role === 'doctor'
    )

    if (!selectedDoctor) {
      navigate('/patient/doctors')
      return
    }

    setDoctor(selectedDoctor)

    const savedSlots = JSON.parse(
      localStorage.getItem('medicareDoctorAvailability') || '[]'
    )

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const availableSlots = savedSlots.filter(slot => {
      const slotDate = new Date(`${slot.date}T00:00:00`)

      return (
        slot.doctorId === doctorId &&
        slot.status === 'AVAILABLE' &&
        slotDate >= today
      )
    })

    setSlots(availableSlots)
  }, [doctorId, navigate, currentUser])

  const handleBooking = () => {
    setMessage('')
    setBookingSuccess(false)

    if (!selectedSlot) {
      setMessage('Please select an appointment slot.')
      return
    }

    try {
      const allSlots = JSON.parse(
        localStorage.getItem('medicareDoctorAvailability') || '[]'
      )

      const chosenSlot = allSlots.find(
        slot =>
          slot.id === selectedSlot &&
          slot.doctorId === doctorId &&
          slot.status === 'AVAILABLE'
      )

      if (!chosenSlot) {
        setMessage('This slot is no longer available. Please refresh.')
        return
      }

      const allAppointments = JSON.parse(
        localStorage.getItem('medicareAppointments') || '[]'
      )

      const newAppointment = {
        id: crypto.randomUUID(),
        patientId: currentUser.id,
        patientName: currentUser.name,
        patientEmail: currentUser.email,
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialization: doctor.specialization,
        date: chosenSlot.date,
        time: chosenSlot.time,
        slotId: chosenSlot.id,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      }

      localStorage.setItem(
        'medicareAppointments',
        JSON.stringify([...allAppointments, newAppointment])
      )

      const updatedSlots = allSlots.map(slot =>
        slot.id === chosenSlot.id
          ? { ...slot, status: 'BOOKED' }
          : slot
      )

      localStorage.setItem(
        'medicareDoctorAvailability',
        JSON.stringify(updatedSlots)
      )

      setSlots(previous =>
        previous.filter(slot => slot.id !== chosenSlot.id)
      )

      setSelectedSlot('')
      setBookingSuccess(true)
      setMessage('')

    } catch (error) {
      console.error('Booking error:', error)
      setMessage('Something went wrong while booking. Please try again.')
    }
  }

  const handleLogout = () => {
    logoutUser()
    navigate('/patient/login')
  }

  if (!currentUser || currentUser.role !== 'patient') {
    return null
  }

  if (!doctor) {
    return null
  }

  const sortedSlots = [...slots].sort((a, b) => {
    const dateDifference = a.date.localeCompare(b.date)

    if (dateDifference !== 0) {
      return dateDifference
    }

    return a.time.localeCompare(b.time)
  })

  return (
    <div className="patient-booking-page">

      <aside className="patient-booking-sidebar">

        <div className="patient-booking-brand">
          <Stethoscope size={30} />
          <div>
            <h2>MediCare</h2>
            <span>PATIENT PORTAL</span>
          </div>
        </div>

        <div className="patient-booking-profile">
          <div className="patient-booking-avatar">
            {currentUser.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3>{currentUser.name}</h3>
            <p>Patient</p>
          </div>
        </div>

        <nav className="patient-booking-nav">
          <Link to="/patient/dashboard">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link to="/patient/appointments">
            <CalendarDays size={20} />
            My Appointments
          </Link>

          <Link to="/patient/doctors" className="active">
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
          className="patient-booking-logout"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </button>

      </aside>

      <main className="patient-booking-main">

        <header className="patient-booking-header">
          <div>
            <h1>Book an Appointment</h1>
            <p>Select an available consultation slot.</p>
          </div>
        </header>

        <Link
          to="/patient/doctors"
          className="patient-booking-back"
        >
          <ArrowLeft size={18} />
          Back to Doctors
        </Link>

        <section className="patient-booking-doctor-card">

          <div className="patient-booking-doctor-avatar">
            {doctor.name?.charAt(0).toUpperCase()}
          </div>

          <div className="patient-booking-doctor-info">
            <span>SELECTED DOCTOR</span>
            <h2>Dr. {doctor.name}</h2>

            <p>
              <Stethoscope size={17} />
              {doctor.specialization}
            </p>

            <p>
              <GraduationCap size={17} />
              {doctor.qualification || 'Qualification not provided'}
            </p>
          </div>

        </section>

        {bookingSuccess && (
          <div className="patient-booking-success">
            <CheckCircle size={25} />

            <div>
              <h3>Appointment Request Submitted!</h3>
              <p>
                Your appointment has been sent to the doctor
                for confirmation.
              </p>
            </div>
          </div>
        )}

        <section className="patient-booking-slots">

          <div className="patient-booking-section-heading">
            <div>
              <h2>Available Consultation Slots</h2>
              <p>Choose one date and time for your appointment.</p>
            </div>

            <span>{slots.length} slots available</span>
          </div>

          {sortedSlots.length === 0 ? (
            <div className="patient-booking-empty">
              <CalendarDays size={42} />
              <h3>No Available Slots</h3>
              <p>
                This doctor currently has no upcoming available
                consultation slots.
              </p>

              <Link
                to="/patient/doctors"
                className="patient-booking-browse-btn"
              >
                Browse Other Doctors
              </Link>
            </div>
          ) : (
            <div className="patient-booking-slot-grid">

              {sortedSlots.map(slot => (
                <button
                  type="button"
                  key={slot.id}
                  className={`patient-booking-slot ${
                    selectedSlot === slot.id ? 'selected' : ''
                  }`}
                  onClick={() => {
                    setSelectedSlot(slot.id)
                    setMessage('')
                  }}
                >
                  <CalendarDays size={21} />

                  <strong>
                    {new Date(`${slot.date}T00:00:00`).toLocaleDateString(
                      'en-IN',
                      {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      }
                    )}
                  </strong>

                  <span>
                    <Clock size={16} />
                    {slot.time}
                  </span>

                  {selectedSlot === slot.id && (
                    <CheckCircle size={19} />
                  )}
                </button>
              ))}

            </div>
          )}

          {message && (
            <p className="patient-booking-error">
              {message}
            </p>
          )}

          {sortedSlots.length > 0 && (
            <div className="patient-booking-submit-area">

              <p>
                {selectedSlot
                  ? 'One consultation slot selected.'
                  : 'Please select a slot to continue.'}
              </p>

              <button
                type="button"
                className="patient-booking-submit-btn"
                onClick={handleBooking}
              >
                <CalendarDays size={19} />
                Book Appointment
              </button>

            </div>
          )}

        </section>

      </main>

    </div>
  )
}

export default PatientBookAppointment
