import { Link } from "react-router-dom";

export default function EventCard({ event }) {
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

  // Category badge colors
  const categoryClass = `badge-cat-${(category || "coding").toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <article className="event-card">
      <div className="event-card-media">
        {image ? (
          <img
            src={image}
            alt={name}
            className="event-card-img"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="event-card-placeholder">
            <span className="placeholder-icon">⚡</span>
          </div>
        )}
        <span className={`event-category-badge ${categoryClass}`}>
          {category}
        </span>
        {registrationFee === 0 ? (
          <span className="event-fee-badge free">Free Entry</span>
        ) : (
          <span className="event-fee-badge paid">₹{registrationFee}</span>
        )}
      </div>

      <div className="event-card-body">
        <h3 className="event-card-title">{name}</h3>
        <p className="event-card-desc">
          {description.length > 110 ? `${description.slice(0, 110)}...` : description}
        </p>

        <div className="event-meta-grid">
          <div className="event-meta-item">
            <span className="meta-icon">📅</span>
            <span>{date}</span>
          </div>
          <div className="event-meta-item">
            <span className="meta-icon">⏰</span>
            <span>{time}</span>
          </div>
          <div className="event-meta-item full-width">
            <span className="meta-icon">📍</span>
            <span>{venue}</span>
          </div>
        </div>

        {/* Seat Availability Bar */}
        <div className="event-seats-wrapper">
          <div className="seats-info-row">
            <span className="seats-label">Seats Remaining</span>
            <span className={`seats-count ${isFull ? "seats-full" : ""}`}>
              {isFull ? "Sold Out" : `${available} / ${totalSeats}`}
            </span>
          </div>
          <div className="seats-progress-bar">
            <div
              className={`seats-progress-fill ${percentFilled > 80 ? "fill-warning" : ""}`}
              style={{ width: `${percentFilled}%` }}
            ></div>
          </div>
        </div>

        <div className="event-card-actions">
          <Link to={`/events/${_id}`} className="btn-card-details">
            Full Details
          </Link>
          <Link
            to={`/events/${_id}/register`}
            className={`btn-card-register ${isFull ? "disabled" : ""}`}
            onClick={(e) => isFull && e.preventDefault()}
          >
            {isFull ? "Fully Booked" : "Register"}
          </Link>
        </div>
      </div>
    </article>
  );
}

