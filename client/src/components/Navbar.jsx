import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <div className="logo-badge">TF</div>
          <div className="logo-text">
            <span className="logo-title">TECHFEST</span>
            <span className="logo-year">2026</span>
          </div>
        </Link>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className={`bar ${mobileMenuOpen ? "open" : ""}`}></span>
          <span className={`bar ${mobileMenuOpen ? "open" : ""}`}></span>
          <span className={`bar ${mobileMenuOpen ? "open" : ""}`}></span>
        </button>

        {/* Navigation Links */}
        <nav className={`navbar-nav ${mobileMenuOpen ? "nav-open" : ""}`}>
          <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/events" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeMenu}>
              Events
            </NavLink>
            <NavLink to="/gallery" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeMenu}>
              Gallery
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeMenu}>
              Contact
            </NavLink>
            <NavLink to="/students" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link student-portal-link")} onClick={closeMenu} title="Experiment 5 Baseline Student Directory">
              Student System
            </NavLink>
          </div>

          {/* Auth Actions */}
          <div className="nav-auth">
            {isAuthenticated ? (
              <div className="auth-logged-in">
                <NavLink to="/my-registrations" className="nav-pill" onClick={closeMenu}>
                  My Events
                </NavLink>
                <div className="user-badge" title={`Signed in as ${user.email}`}>
                  <span className="user-avatar">{user.name ? user.name[0].toUpperCase() : "U"}</span>
                  <span className="user-name">{user.name}</span>
                </div>
                <button type="button" className="btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-guest">
                <Link to="/login" className="btn-login-link" onClick={closeMenu}>
                  Sign In
                </Link>
                <Link to="/register" className="btn-register-cta" onClick={closeMenu}>
                  Join Portal
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

