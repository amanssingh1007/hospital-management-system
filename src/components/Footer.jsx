
import { Link } from 'react-router-dom'
import {
  Hospital,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight
} from 'lucide-react'

import '../styles/Footer.css'

function Footer() {
  return (
    <footer className="footer">

      <div className="container">

        <div className="footer-main">

          {/* Hospital Information */}

          <div className="footer-brand">

            <Link to="/" className="footer-logo">

              <div className="footer-logo-icon">
                <Hospital size={25} />
              </div>

              <div>
                <h2>MediCare</h2>
                <span>HOSPITAL & HEALTHCARE</span>
              </div>

            </Link>

            <p>
              Providing compassionate healthcare and
              advanced medical services with a commitment
              to improving lives and building a healthier
              community.
            </p>

          </div>

          {/* Quick Links */}

          <div className="footer-column">

            <h3>Quick Links</h3>

            <Link to="/">Home</Link>
            <a href="/#about">About Us</a>
            <a href="/#specialities">Specialities</a>
            <a href="/#doctors">Our Doctors</a>
            <a href="/#contact">Contact</a>

          </div>

          {/* Patient Services */}

          <div className="footer-column">

            <h3>Patient Services</h3>

            <Link to="/patient/login">Patient Login</Link>
            <Link to="/patient/signup">Patient Registration</Link>
            <Link to="/doctor/login">Doctor Login</Link>
            <Link to="/doctor/signup">Doctor Registration</Link>
            <Link to="/admin/login">Admin Portal</Link>

          </div>

          {/* Contact Information */}

          <div className="footer-column footer-contact">

            <h3>Contact Information</h3>

            <div>
              <MapPin size={18} />
              <span>Mumbai, Maharashtra, India</span>
            </div>

            <div>
              <Phone size={18} />
              <span>+91 98765 43210</span>
            </div>

            <div>
              <Mail size={18} />
              <span>support@medicare.com</span>
            </div>

            <div>
              <Clock size={18} />
              <span>Available 24/7</span>
            </div>

          </div>

        </div>

        {/* Footer Bottom */}

        <div className="footer-bottom">

          <p>
            © {new Date().getFullYear()} MediCare Hospital.
            All rights reserved.
          </p>

          <p>
            Designed for better healthcare.
          </p>

        </div>

      </div>

    </footer>
  )
}

export default Footer
