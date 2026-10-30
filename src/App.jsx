
import { Routes, Route, Link } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import PatientSignup from './pages/auth/PatientSignup'
import PatientLogin from './pages/auth/PatientLogin'
import PatientDashboard from './pages/PatientDashboard'
import DoctorSignup from './pages/auth/DoctorSignup'
import DoctorLogin from './pages/auth/DoctorLogin'
import DoctorDashboard from './pages/DoctorDashboard'
import DoctorAvailability from './pages/DoctorAvailability'
import PatientDoctors from './pages/PatientDoctors'
import PatientBookAppointment from './pages/PatientBookAppointment'
import PatientAppointments from './pages/PatientAppointments'
import DoctorAppointments from './pages/DoctorAppointments'
import DoctorProfile from './pages/DoctorProfile'
import PatientProfile from './pages/PatientProfile'
import AdminLogin from './pages/auth/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminPatients from './pages/AdminPatients.jsx'
import AdminDoctors from './pages/AdminDoctors.jsx'
import AdminAppointments from './pages/AdminAppointments.jsx'



function ComingSoon() {
  return (
    <div style={{
      minHeight: '55vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '30px'
    }}>

      <h2>Page Coming Soon</h2>

      <p style={{ margin: '12px 0', color: '#667085' }}>
        We are preparing this section for you.
      </p>

      <Link to="/" className="btn btn-primary">
        Back To Home
      </Link>

    </div>
  )
}

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Patient Authentication */}
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/signup" element={<PatientSignup />} />

        {/* Patient Dashboard */}
        <Route
          path="/patient/dashboard"
          element={<PatientDashboard />}
        />
        <Route
  path="/patient/doctors"
  element={<PatientDoctors />}
/>
<Route
  path="/patient/book/:doctorId"
  element={<PatientBookAppointment />}
/>
<Route
  path="/patient/appointments"
  element={<PatientAppointments />}
/>
<Route path="/patient/profile" element={<PatientProfile />} />

        {/* Doctor Authentication */}
       <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/signup" element={<DoctorSignup />} />
        <Route
  path="/doctor/dashboard"
  element={<DoctorDashboard />}
/>
<Route
  path="/doctor/availability"
  element={<DoctorAvailability />}
/>
<Route path="/doctor/appointments" element={<DoctorAppointments />} />
<Route path="/doctor/profile" element={<DoctorProfile />} />

        {/* Admin Authentication */}
        <Route path="/admin/login" element={<AdminLogin />} />
       <Route path="/admin/dashboard" element={<AdminDashboard />} />
       <Route path="/admin/patients" element={<AdminPatients />} />
       <Route path="/admin/doctors" element={<AdminDoctors />} />
       <Route path="/admin/appointments" element={<AdminAppointments />} />

        <Route path="*" element={<ComingSoon />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App
