import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { eventsAPI, registrationsAPI } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Alert from "../components/Alert.jsx";

export default function EventRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [allEvents, setAllEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(id || "");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchingEvents, setFetchingEvents] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [successRegistration, setSuccessRegistration] = useState(null);

  // Populate form with user info if authenticated
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        college: user.college || prev.college,
      }));
    }
  }, [user]);

  // Load events list
  useEffect(() => {
    let isMounted = true;
    async function loadEvents() {
      try {
        setFetchingEvents(true);
        const data = await eventsAPI.getAll();
        if (isMounted) {
          setAllEvents(data);
          const initial = id ? data.find((e) => e._id === id) : data[0];
          if (initial) {
            setSelectedEventId(initial._id);
            setSelectedEvent(initial);
          }
        }
      } catch (err) {
        if (isMounted) {
          setAlert({ type: "error", message: "Failed to load events list." });
        }
      } finally {
        if (isMounted) setFetchingEvents(false);
      }
    }
    loadEvents();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Update selected event object when dropdown changes
  const handleEventChange = (e) => {
    const eventId = e.target.value;
    setSelectedEventId(eventId);
    const found = allEvents.find((item) => item._id === eventId);
    setSelectedEvent(found || null);
    setAlert({ type: "", message: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!selectedEventId) return "Please choose an event to register for.";
    if (!formData.name.trim()) return "Full name is required.";
    if (!formData.email.trim()) return "Email address is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return "Please enter a valid email address.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setAlert({ type: "error", message: validationError });
      return;
    }

    setLoading(true);
    setAlert({ type: "", message: "" });

    try {
      const response = await registrationsAPI.create({
        eventId: selectedEventId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        college: formData.college,
      });

      setSuccessRegistration(response.registration);
      setAlert({
        type: "success",
        message: response.message || "Registration confirmed successfully!",
      });
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Failed to complete registration.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || fetchingEvents) {
    return (
      <div className="registration-loading container">
        <div className="spinner"></div>
        <p>Loading registration portal...</p>
      </div>
    );
  }

  // If not logged in, prompt to login or register first
  if (!isAuthenticated) {
    return (
      <div className="auth-required-page container">
        <div className="auth-required-card">
          <div className="card-badge">Authentication Required</div>
          <h2>Sign In to Register for TechFest Events</h2>
          <p>
            To prevent duplicate registrations and provide your official digital pass, you must be
            signed in to your TechFest 2026 account.
          </p>
          <div className="auth-prompt-actions">
            <Link
              to={`/login?redirect=${encodeURIComponent(id ? `/events/${id}/register` : "/register-event")}`}
              className="btn-primary"
            >
              Sign In to Existing Account
            </Link>
            <Link
              to={`/register?redirect=${encodeURIComponent(id ? `/events/${id}/register` : "/register-event")}`}
              className="btn-secondary"
            >
              Create New Account
            </Link>
          </div>
          <p className="privacy-note">
            Protected by HttpOnly session cookies & Bcrypt password encryption.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="event-registration-page container">
      <div className="registration-wrapper">
        <div className="registration-header">
          <span className="page-eyebrow">Event Registration</span>
          <h1>Confirm Your Competition Seat</h1>
          <p>
            Fill out the details below to reserve your entry for TechFest 2026. Your registration will
            be instantly stored in MongoDB Atlas and linked to your profile.
          </p>
        </div>

        {alert.message && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ type: "", message: "" })}
          />
        )}

        {successRegistration ? (
          <div className="registration-success-card">
            <div className="success-icon-badge">🎉</div>
            <h2>Registration Confirmed!</h2>
            <p className="success-tagline">
              You are officially registered for{" "}
              <strong>{selectedEvent?.name || "TechFest 2026 Event"}</strong>.
            </p>

            <div className="registration-pass-box">
              <div className="pass-row">
                <span>Participant:</span>
                <strong>{successRegistration.name}</strong>
              </div>
              <div className="pass-row">
                <span>Email:</span>
                <strong>{successRegistration.email}</strong>
              </div>
              <div className="pass-row">
                <span>Date & Time:</span>
                <strong>
                  {selectedEvent?.date} • {selectedEvent?.time}
                </strong>
              </div>
              <div className="pass-row">
                <span>Venue:</span>
                <strong>{selectedEvent?.venue}</strong>
              </div>
              <div className="pass-row">
                <span>Status:</span>
                <span className="badge-confirmed">CONFIRMED</span>
              </div>
            </div>

            <div className="success-actions">
              <Link to="/my-registrations" className="btn-primary">
                View All My Registrations
              </Link>
              <Link to="/events" className="btn-secondary">
                Browse More Events
              </Link>
            </div>
          </div>
        ) : (
          <form className="registration-form-card" onSubmit={handleSubmit}>
            {/* Event Selection */}
            <div className="form-group">
              <label htmlFor="eventId">Select Competition / Track *</label>
              <select
                id="eventId"
                name="eventId"
                className="form-control"
                value={selectedEventId}
                onChange={handleEventChange}
                required
              >
                {allEvents.map((evt) => (
                  <option key={evt._id} value={evt._id}>
                    {evt.name} ({evt.category}) — {evt.date} • {evt.registrationFee === 0 ? "Free" : `₹${evt.registrationFee}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Event Quick Overview */}
            {selectedEvent && (
              <div className="selected-event-pill">
                <div className="pill-item">
                  <span className="pill-label">Category:</span>
                  <span className="pill-val">{selectedEvent.category}</span>
                </div>
                <div className="pill-item">
                  <span className="pill-label">Date:</span>
                  <span className="pill-val">{selectedEvent.date}</span>
                </div>
                <div className="pill-item">
                  <span className="pill-label">Venue:</span>
                  <span className="pill-val">{selectedEvent.venue}</span>
                </div>
                <div className="pill-item">
                  <span className="pill-label">Fee:</span>
                  <span className="pill-val text-cyan">
                    {selectedEvent.registrationFee === 0 ? "FREE" : `₹${selectedEvent.registrationFee}`}
                  </span>
                </div>
              </div>
            )}

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="name">Participant Full Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Alex Johnson"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Registered Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="e.g. alex@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="phone">Phone / WhatsApp Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="form-control"
                  placeholder="e.g. +91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="college">College / University Name</label>
                <input
                  id="college"
                  name="college"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Department of Computer Science"
                  value={formData.college}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn-submit-registration" disabled={loading}>
              {loading ? "Confirming Registration..." : "Complete Registration →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

