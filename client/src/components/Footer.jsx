import { Link } from "react-router-dom";
import { API_BASE } from "../services/api.js";

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <span className="logo-badge-sm">TF</span>
              <span className="footer-logo-title">TECHFEST 2026</span>
            </div>
            <p className="footer-tagline">“Ideas. Innovation. Impact.”</p>
            <p className="footer-desc">
              The premier annual technology celebration. Empowering young engineers, developers, and visionaries to compete, create, and inspire.
            </p>
            <div className="footer-meta-pill">
              <span className="status-dot"></span>
              <span>Atlas Cloud Connected</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Festival</h4>
            <ul className="footer-links">
              <li><Link to="/">Home Overview</Link></li>
              <li><Link to="/events">All Competitions</Link></li>
              <li><Link to="/gallery">Festival Gallery</Link></li>
              <li><Link to="/contact">Helpdesk & Support</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Competitions</h4>
            <ul className="footer-links">
              <li><Link to="/events?category=Coding">Coding Challenges</Link></li>
              <li><Link to="/events?category=Web%20Development">Web Development</Link></li>
              <li><Link to="/events?category=Robotics">Robotics Combat</Link></li>
              <li><Link to="/events?category=Gaming">Esports Tournaments</Link></li>
              <li><Link to="/events?category=Cultural">Cultural Evenings</Link></li>
            </ul>
          </div>

          {/* Academic & Lab Info */}
          <div className="footer-col">
            <h4 className="footer-heading">Laboratory Spec</h4>
            <p className="lab-info-text">
              <strong>Web Technology Lab</strong><br />
              Experiment 5: Security, Version Control, CI/CD & Cloud Deployment.
            </p>
            <ul className="footer-links lab-links">
              <li><Link to="/students">→ Original Student Management</Link></li>
              <li><a href={`${API_BASE}/health`} target="_blank" rel="noreferrer">→ API Health Endpoint</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 TechFest Portal. Built with MERN Stack + Vite + MongoDB Atlas.</p>
          <p className="security-badges">
            <span>🛡 Helmet Secured</span>
            <span>🔒 HttpOnly Auth</span>
            <span>⚡ React 19 + Express 5</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

