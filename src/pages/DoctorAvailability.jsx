
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  CalendarDays,
  Clock,
  Plus,
  Trash2,
  LayoutDashboard,
  UserRound,
  LogOut,
  Stethoscope,
  Save
} from 'lucide-react'

import {
  getCurrentUser,
  logoutUser
} from '../services/authService'

import '../styles/DoctorAvailability.css'

const TIME_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM'
]

function DoctorAvailability() {
  const navigate = useNavigate()
  const currentUser = getCurrentUser()

  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [availability, setAvailability] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'doctor') {
      navigate('/doctor/login')
      return
    }

    const savedAvailability = JSON.parse(
      localStorage.getItem('medicareDoctorAvailability') || '[]'
    )

    const doctorAvailability = savedAvailability.filter(
      item => item.doctorId === currentUser.id
    )

    setAvailability(doctorAvailability)
  }, [currentUser, navigate])

  if (!currentUser || currentUser.role !== 'doctor') {
    return null
  }

  const saveAvailability = (updatedAvailability) => {
    const allAvailability = JSON.parse(
      localStorage.getItem('medicareDoctorAvailability') || '[]'
    )

    const otherDoctorsAvailability = allAvailability.filter(
      item => item.doctorId !== currentUser.id
    )

    const updatedData = [
      ...otherDoctorsAvailability,
      ...updatedAvailability
    ]

    localStorage.setItem(
      'medicareDoctorAvailability',
      JSON.stringify(updatedData)
    )

    setAvailability(updatedAvailability)
  }

  const handleAddSlot = () => {
    if (!selectedDate || !selectedTime) {
      setMessage('Please select both date and time.')
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const chosenDate = new Date(`${selectedDate}T00:00:00`)

    if (chosenDate < today) {
      setMessage('Please select a future date.')
      return
    }

    const alreadyExists = availability.some(
      item =>
        item.date === selectedDate &&
        item.time === selectedTime
    )

    if (alreadyExists) {
      setMessage('This time slot already exists.')
      return
    }

    const newSlot = {
      id: crypto.randomUUID(),
      doctorId: currentUser.id,
      doctorName: currentUser.name,
      date: selectedDate,
      time: selectedTime,
      status: 'AVAILABLE'
    }

    saveAvailability([...availability, newSlot])

    setSelectedTime('')
    setMessage('Availability added successfully.')
  }

  const handleDeleteSlot = (slotId) => {
    const updatedAvailability = availability.filter(
      item => item.id !== slotId
    )

    saveAvailability(updatedAvailability)
    setMessage('Time slot removed successfully.')
  }

  const handleLogout = () => {
    logoutUser()
    navigate('/doctor/login')
  }

  const sortedAvailability = [...availability].sort(
    (a, b) =>
      new Date(`${a.date}T00:00:00`) -
      new Date(`${b.date}T00:00:00`)
  )

  return (
    <div className="availability-page">

      <aside className="availability-sidebar">

        <div className="availability-brand">
          <Stethoscope size={30} />
          <div>
            <h2>MediCare</h2>
            <span>DOCTOR PORTAL</span>
          </div>
        </div>

        <div className="availability-doctor-profile">
          <div className="availability-avatar">
            {currentUser.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3>{currentUser.name}</h3>
            <p>{currentUser.specialization}</p>
          </div>
        </div>

        <nav className="availability-nav">
          <Link to="/doctor/dashboard">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link to="/doctor/appointments">
            <CalendarDays size={20} />
            My Appointments
          </Link>

          <Link to="/doctor/availability" className="active">
            <Clock size={20} />
            Manage Availability
          </Link>

          <Link to="/doctor/profile">
            <UserRound size={20} />
            My Profile
          </Link>
        </nav>

        <button
          className="availability-logout"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </button>

      </aside>

      <main className="availability-main">

        <header className="availability-header">
          <div>
            <h1>Manage Availability</h1>
            <p>Set your consultation dates and available time slots.</p>
          </div>
        </header>

        <section className="availability-welcome">
          <div>
            <span>YOUR SCHEDULE</span>
            <h2>Manage Your Consultation Hours</h2>
            <p>
              Add the dates and times when patients can book appointments
              with you.
            </p>
          </div>

          <CalendarDays size={65} />
        </section>

        <section className="availability-form-card">

          <div className="availability-section-heading">
            <h2>Add New Availability</h2>
            <p>Select a date and consultation time.</p>
          </div>

          <div className="availability-form">

            <div className="availability-field">
              <label htmlFor="available-date">
                Select Date
              </label>

              <input
                id="available-date"
                type="date"
                min={new Date().toLocaleDateString('en-CA')}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value)
                  setMessage('')
                }}
              />
            </div>

            <div className="availability-field">
              <label htmlFor="available-time">
                Select Time Slot
              </label>

              <select
                id="available-time"
                value={selectedTime}
                onChange={(e) => {
                  setSelectedTime(e.target.value)
                  setMessage('')
                }}
              >
                <option value="">Choose a time</option>

                {TIME_SLOTS.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="availability-add-btn"
              onClick={handleAddSlot}
            >
              <Plus size={19} />
              Add Slot
            </button>

          </div>

          {message && (
            <p className="availability-message">
              {message}
            </p>
          )}

        </section>

        <section className="availability-list-card">

          <div className="availability-section-heading">
            <div>
              <h2>My Available Slots</h2>
              <p>
                {availability.length} time slot(s) added
              </p>
            </div>

            <div className="availability-total-icon">
              <Save size={23} />
            </div>
          </div>

          {sortedAvailability.length === 0 ? (

            <div className="availability-empty">
              <CalendarDays size={40} />
              <h3>No Availability Added</h3>
              <p>
                Your available consultation dates and times
                will appear here.
              </p>
            </div>

          ) : (

            <div className="availability-slot-list">

              {sortedAvailability.map(slot => (

                <div className="availability-slot" key={slot.id}>

                  <div className="availability-slot-date">
                    <CalendarDays size={21} />
                    <div>
                      <span>Date</span>
                      <strong>
                        {new Date(
                          `${slot.date}T00:00:00`
                        ).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </strong>
                    </div>
                  </div>

                  <div className="availability-slot-time">
                    <Clock size={21} />
                    <div>
                      <span>Time</span>
                      <strong>{slot.time}</strong>
                    </div>
                  </div>

                  <span className="availability-status">
                    Available
                  </span>

                  <button
                    className="availability-delete-btn"
                    onClick={() => handleDeleteSlot(slot.id)}
                    title="Remove this slot"
                  >
                    <Trash2 size={19} />
                  </button>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  )
}

export default DoctorAvailability
