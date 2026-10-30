
import {
  ArrowRight,
  CalendarDays,
  Clock,
  ShieldCheck,
  HeartPulse,
  Stethoscope,
  Brain,
  Bone,
  Baby,
  Eye,
  Activity,
  Phone,
  Star
} from 'lucide-react'

import { Link } from 'react-router-dom'
import '../styles/Home.css'

const specialties = [
  {
    name: 'Cardiology',
    description: 'Expert care for your heart and cardiovascular health.',
    icon: HeartPulse
  },
  {
    name: 'Neurology',
    description: 'Advanced treatment for brain and nervous system.',
    icon: Brain
  },
  {
    name: 'Orthopedics',
    description: 'Complete care for bones, joints and muscles.',
    icon: Bone
  },
  {
    name: 'Pediatrics',
    description: 'Dedicated healthcare for infants and children.',
    icon: Baby
  },
  {
    name: 'Ophthalmology',
    description: 'Professional eye care and vision treatment.',
    icon: Eye
  },
  {
    name: 'General Medicine',
    description: 'Comprehensive healthcare for everyday needs.',
    icon: Activity
  }
]

const doctors = [
  {
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    experience: '12 Years Experience',
    image: 'photo-1559839734-2b71ea197ec2'
  },
  {
    name: 'Dr. Michael Chen',
    specialization: 'Neurologist',
    experience: '10 Years Experience',
    image: 'photo-1612349317150-e413f6a5b16d'
  },
  {
    name: 'Dr. Emily Williams',
    specialization: 'Pediatrician',
    experience: '8 Years Experience',
    image: 'photo-1594824476967-48c8b964273f'
  }
]

function Home() {
  return (
    <div className="home-page">

      {/* HERO SECTION */}

      <section className="hero-section">

        <div className="container hero-container">

          <div className="hero-content">

            <div className="hero-tag">
              <span></span>
              YOUR HEALTH, OUR PRIORITY
            </div>

            <h1>
              Quality Healthcare
              <br />
              <span>For A Better Life.</span>
            </h1>

            <p className="hero-description">
              Experience compassionate care, advanced medical
              technology and expert doctors dedicated to your
              health and well-being.
            </p>

            <div className="hero-buttons">

              <Link to="/patient/signup" className="btn btn-accent">
                Book An Appointment
                <ArrowRight size={18} />
              </Link>

              <a href="#doctors" className="hero-secondary-btn">
                Meet Our Doctors
              </a>

            </div>

            <div className="hero-trust">

              <div className="trust-item">
                <ShieldCheck size={20} />
                <span>Trusted Healthcare</span>
              </div>

              <div className="trust-item">
                <Clock size={20} />
                <span>24/7 Support</span>
              </div>

            </div>

          </div>

          <div className="hero-visual">

            <img
              className="hero-image"
              src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=1000&auto=format&fit=crop&q=85"
              alt="Medical professional in a hospital"
            />

            <div className="hero-image-overlay"></div>

            <div className="hero-info-card">

              <div className="hero-info-icon">
                <CalendarDays size={23} />
              </div>

              <div>
                <h4>Easy Appointments</h4>
                <p>Book your doctor online</p>
              </div>

            </div>

            <div className="hero-rating-card">
              <div className="rating-stars">
                <Star size={15} fill="currentColor" />
                <Star size={15} fill="currentColor" />
                <Star size={15} fill="currentColor" />
                <Star size={15} fill="currentColor" />
                <Star size={15} fill="currentColor" />
              </div>
              <h3>Patient First</h3>
              <p>Care you can trust</p>
            </div>

          </div>

        </div>

      </section>

      {/* STATISTICS */}

      <section className="stats-section">
        <div className="container stats-container">

          <div className="stat-item">
            <h2>25+</h2>
            <p>Years of Experience</p>
          </div>

          <div className="stat-item">
            <h2>50+</h2>
            <p>Expert Doctors</p>
          </div>

          <div className="stat-item">
            <h2>15+</h2>
            <p>Medical Specialties</p>
          </div>

          <div className="stat-item">
            <h2>24/7</h2>
            <p>Emergency Support</p>
          </div>

        </div>
      </section>

      {/* ABOUT SECTION */}

      <section className="about-section" id="about">

        <div className="container about-container">

          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&auto=format&fit=crop&q=85"
              alt="Doctor consulting a patient"
            />

            <div className="about-experience">
              <h2>25+</h2>
              <p>Years of Medical Excellence</p>
            </div>
          </div>

          <div className="about-content">

            <span className="section-tag">ABOUT MEDICARE</span>

            <h2>
              Your Health Is Our
              <span> Greatest Priority</span>
            </h2>

            <p>
              At MediCare, we believe everyone deserves access
              to quality healthcare. Our experienced medical
              professionals combine expertise, compassion and
              modern technology to provide exceptional care.
            </p>

            <div className="about-feature">
              <ShieldCheck size={21} />
              <div>
                <h4>Experienced Medical Team</h4>
                <p>Qualified doctors and healthcare professionals.</p>
              </div>
            </div>

            <div className="about-feature">
              <HeartPulse size={21} />
              <div>
                <h4>Patient-Centered Care</h4>
                <p>Personalized treatment for every patient.</p>
              </div>
            </div>

            <a href="#specialities" className="about-link">
              Discover Our Services <ArrowRight size={17} />
            </a>

          </div>

        </div>

      </section>

      {/* SPECIALTIES */}

      <section className="specialties-section" id="specialities">

        <div className="container">

          <div className="section-heading">
            <span className="section-tag">OUR SPECIALITIES</span>
            <h2>Comprehensive Medical Care</h2>
            <p>
              Expert treatment and personalized care across
              multiple medical departments.
            </p>
          </div>

          <div className="specialties-grid">

            {specialties.map((item, index) => {
              const Icon = item.icon

              return (
                <div className="specialty-card" key={index}>

                  <div className="specialty-icon">
                    <Icon size={28} />
                  </div>

                  <h3>{item.name}</h3>

                  <p>{item.description}</p>

                  <a href="#doctors">
                    Learn More <ArrowRight size={15} />
                  </a>

                </div>
              )
            })}

          </div>

        </div>

      </section>

      {/* DOCTORS */}

      <section className="doctors-section" id="doctors">

        <div className="container">

          <div className="section-heading">
            <span className="section-tag">OUR MEDICAL TEAM</span>
            <h2>Meet Our Expert Doctors</h2>
            <p>
              Experienced professionals committed to
              delivering the best healthcare.
            </p>
          </div>

          <div className="doctors-grid">

            {doctors.map((doctor, index) => (
              <div className="doctor-card" key={index}>

                <div className="doctor-image">
                  <img
                    src={`https://images.unsplash.com/${doctor.image}?w=600&auto=format&fit=crop&q=80`}
                    alt={doctor.name}
                  />
                </div>

                <div className="doctor-details">

                  <span className="doctor-specialty">
                    {doctor.specialization}
                  </span>

                  <h3>{doctor.name}</h3>

                  <p>{doctor.experience}</p>

                  <Link to="/patient/signup">
                    Book Appointment <ArrowRight size={16} />
                  </Link>

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* APPOINTMENT CTA */}

      <section className="appointment-section">

        <div className="container appointment-container">

          <div>
            <span>YOUR HEALTH MATTERS</span>

            <h2>
              Take The First Step
              Towards Better Health.
            </h2>

            <p>
              Schedule an appointment with our experienced
              doctors and get the care you deserve.
            </p>
          </div>

          <Link to="/patient/signup" className="btn appointment-btn">
            Book Appointment
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

      {/* CONTACT */}

      <section className="contact-section" id="contact">

        <div className="container contact-container">

          <div>
            <span className="section-tag">NEED ASSISTANCE?</span>
            <h2>We Are Here To Help</h2>
            <p>
              Have questions about our services or appointments?
              Get in touch with our healthcare team.
            </p>
          </div>

          <div className="contact-info">
            <Phone size={23} />
            <div>
              <span>Call Us Anytime</span>
              <h3>+91 98765 43210</h3>
            </div>
          </div>

        </div>

      </section>

    </div>
  )
}

export default Home
