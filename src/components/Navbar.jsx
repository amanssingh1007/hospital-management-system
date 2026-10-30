
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu,
  X,
  Hospital,
  ChevronDown
} from 'lucide-react'

import '../styles/Navbar.css'

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

  const closeMenu = () => {
    setMenuOpen(false)
    setLoginOpen(false)
  }

  return (
    <header className="navbar">

      <div className="nav-container">

        {/* Logo */}

        <Link to="/" className="nav-logo" onClick={closeMenu}>

          <div className="logo-icon">
            <Hospital size={25} />
          </div>

          <div className="logo-text">
            <h2>MediCare</h2>
            <span>HOSPITAL & HEALTHCARE</span>
          </div>

        </Link>

        {/* Mobile Menu Button */}

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>

        {/* Navigation Links */}

        <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>

          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          <a href="#about" onClick={closeMenu}>
            About Us
          </a>

          <a href="#specialities" onClick={closeMenu}>
            Specialities
          </a>

          <a href="#doctors" onClick={closeMenu}>
            Our Doctors
          </a>

          <a href="#contact" onClick={closeMenu}>
            Contact
          </a>

          {/* Login Dropdown */}

          <div className="login-dropdown">

            <button
              className="nav-login-btn"
              onClick={() => setLoginOpen(!loginOpen)}
            >
              Login / Sign Up
              <ChevronDown size={16} />
            </button>

            {loginOpen && (

              <div className="dropdown-menu">

                <Link to="/patient/login" onClick={closeMenu}>
                  Patient Login
                </Link>

                <Link to="/doctor/login" onClick={closeMenu}>
                  Doctor Login
                </Link>

                <Link to="/admin/login" onClick={closeMenu}>
                  Admin Login
                </Link>

              </div>

            )}

          </div>

        </nav>

      </div>

    </header>
  )
}

export default Navbar
