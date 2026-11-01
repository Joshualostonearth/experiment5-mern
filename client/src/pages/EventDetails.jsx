import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { eventsAPI } from "../services/api.js";
import Alert from "../components/Alert.jsx";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function fetchEventDetails() {
      setLoading(true);
      setError("");
      try {
        const data = await eventsAPI.getById(id);
        if (isMounted) setEvent(data);
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load event details.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchEventDetails();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="event-details-loading">
        <div className="spinner"></div>
        <p>Loading event information...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-details-error container">
        <Alert type="error" message={error || "Event not found."} />
        <Link to="/events" className="btn-primary" style={{ marginTop: "1.5rem", display: "inline-block" }}>
          ← Back to All Events
        </Link>
      </div>
    );
  }

  const {
    _id,
    name,
    description,
    category,
    date,
    time,
    venue,
    registrationFee,
    totalSeats,
    registeredCount = 0,
    image,
  } = event;

  const available = Math.max(0, totalSeats - registeredCount);
  const isFull = available === 0;
  const percentFilled = Math.min(100, Math.round((registeredCount / totalSeats) * 100));

  return (
    <div className="event-details-page">
      {/* Back Link */}
      <div className="back-link-wrapper">
        <button type="button" onClick={() => navigate(-1)} className="btn-back">
          ← Back
        </button>
        <span className="breadcrumb-separator">/</span>
        <Link to="/events" className="breadcrumb-link">
          Events
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{name}</span>
      </div>

      <div className="event-details-grid">
        {/* Main Content Column */}
        <div className="event-main-content">
          <div className="event-hero-banner">
            {image && (
              <img src={image} alt={name} className="details-banner-img" loading="lazy" />
            )}
            <div className="banner-overlay">
              <span className={`event-category-badge badge-cat-${category.toLowerCase().replace(/\s+/g, "-")}`}>
                {category}
              </span>
              <h1 className="details-event-title">{name}</h1>
            </div>
          </div>

          <section className="details-section">
            <h2>About This Competition</h2>
            <p className="details-description-text">{description}</p>
          </section>

          <section className="details-section">
            <h2>Competition Guidelines & Rules</h2>
            <ul className="guidelines-list">
              <li>Open to all registered university and college students with valid student ID.</li>
              <li>Participants must arrive at the venue at least 20 minutes prior to the scheduled start time.</li>
              <li>Original code and solutions must be generated during the allotted competition period.</li>
              <li>Certificate of Participation awarded to all registered attendees.</li>
              <li>Certificate of Excellence and cash prizes awarded to top 3 winning teams.</li>
            </ul>
          </section>

          <section className="details-section">
            <h2>Perks & Prizes</h2>
            <div className="perks-grid">
              <div className="perk-box">
                <span className="perk-icon">🏆</span>
                <h4>Prize Pool</h4>
                <p>Trophies, certificates, and attractive cash awards.</p>
              </div>
              <div className="perk-box">
                <span className="perk-icon">🍕</span>
                <h4>Refreshments</h4>
                <p>Snacks and beverages provided to all participants.</p>
              </div>
              <div className="perk-box">
                <span className="perk-icon">📜</span>
                <h4>Certificates</h4>
                <p>Official TechFest 2026 digital certificate.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Summary Card */}
        <aside className="event-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-pricing">
              <span className="pricing-label">Registration Fee</span>
              <span className="pricing-value">
                {registrationFee === 0 ? "FREE" : `₹${registrationFee}`}
              </span>
            </div>

            {/* Seat status */}
            <div className="sidebar-seats-box">
              <div className="seats-meta-row">
                <span>Available Seats</span>
                <strong className={isFull ? "text-error" : "text-cyan"}>
                  {isFull ? "Fully Booked" : `${available} of ${totalSeats}`}
                </strong>
              </div>
              <div className="seats-progress-bar">
                <div
                  className="seats-progress-fill"
                  style={{ width: `${percentFilled}%` }}
                ></div>
              </div>
            </div>

            {/* Schedule details */}
            <div className="sidebar-info-list">
              <div className="info-row">
                <span className="icon">📅</span>
                <div>
                  <div className="label">Date</div>
                  <div className="value">{date}</div>
                </div>
              </div>
              <div className="info-row">
                <span className="icon">⏰</span>
                <div>
                  <div className="label">Time</div>
                  <div className="value">{time}</div>
                </div>
              </div>
              <div className="info-row">
                <span className="icon">📍</span>
                <div>
                  <div className="label">Venue</div>
                  <div className="value">{venue}</div>
                </div>
              </div>
              <div className="info-row">
                <span className="icon">🏷</span>
                <div>
                  <div className="label">Category</div>
                  <div className="value">{category}</div>
                </div>
              </div>
            </div>

            {/* Registration CTA button */}
            <div className="sidebar-cta-wrapper">
              <Link
                to={`/events/${_id}/register`}
                className={`btn-primary-block ${isFull ? "disabled" : ""}`}
                onClick={(e) => isFull && e.preventDefault()}
              >
                {isFull ? "Registration Closed" : "Proceed to Register"}
              </Link>
              <p className="sidebar-cta-note">
                Instant confirmation saved to your TechFest account.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

