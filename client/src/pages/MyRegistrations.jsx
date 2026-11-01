import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { registrationsAPI } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Alert from "../components/Alert.jsx";

export default function MyRegistrations() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function fetchRegistrations() {
      if (!isAuthenticated) return;
      try {
        setLoading(true);
        setError("");
        const data = await registrationsAPI.getMy();
        if (isMounted) setRegistrations(data);
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load your event registrations.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchRegistrations();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="container" style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <div className="spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <h2>Sign In Required</h2>
        <p>Please log in to view your registered events and entry passes.</p>
        <Link to="/login" className="btn-primary" style={{ marginTop: "1rem", display: "inline-block" }}>
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="my-registrations-page container">
      <div className="page-header">
        <span className="page-eyebrow">Participant Passbook</span>
        <h1 className="page-title">My Registered Events</h1>
        <p className="page-desc">
          Welcome back, <strong>{user?.name}</strong>. Below are all the competitions and tracks you
          have reserved for TechFest 2026.
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError("")} />}

      {loading ? (
        <div className="loading-grid">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
      ) : registrations.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon">🎟</div>
          <h3>No event registrations yet</h3>
          <p>You haven't signed up for any TechFest 2026 competitions yet.</p>
          <Link to="/events" className="btn-primary" style={{ marginTop: "1rem" }}>
            Explore Competitions & Register →
          </Link>
        </div>
      ) : (
        <div className="registrations-list">
          {registrations.map((reg) => {
            const event = reg.event || {};
            return (
              <div key={reg._id} className="registration-ticket-card">
                <div className="ticket-left">
                  <div className="ticket-badge-row">
                    <span className="badge-confirmed">{reg.status?.toUpperCase() || "CONFIRMED"}</span>
                    {event.category && (
                      <span className="event-category-badge-sm">{event.category}</span>
                    )}
                  </div>
                  <h3 className="ticket-title">{event.name || "Special Competition"}</h3>
                  <div className="ticket-meta-grid">
                    <div>
                      <span className="meta-label">Date & Time</span>
                      <span className="meta-val">
                        {event.date || "TBA"} • {event.time || "TBA"}
                      </span>
                    </div>
                    <div>
                      <span className="meta-label">Venue</span>
                      <span className="meta-val">{event.venue || "Campus Lab"}</span>
                    </div>
                    <div>
                      <span className="meta-label">Registered Name</span>
                      <span className="meta-val">{reg.name}</span>
                    </div>
                    <div>
                      <span className="meta-label">Registered Email</span>
                      <span className="meta-val">{reg.email}</span>
                    </div>
                  </div>
                </div>

                <div className="ticket-right">
                  <div className="ticket-fee">
                    <span className="ticket-fee-label">Entry Fee</span>
                    <span className="ticket-fee-val">
                      {event.registrationFee === 0 ? "FREE" : `₹${event.registrationFee || 0}`}
                    </span>
                  </div>
                  {event._id && (
                    <Link to={`/events/${event._id}`} className="btn-view-ticket-event">
                      View Event Page →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

