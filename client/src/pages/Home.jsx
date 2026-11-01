import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { eventsAPI } from "../services/api.js";
import EventCard from "../components/EventCard.jsx";
import Alert from "../components/Alert.jsx";

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadFeatured() {
      try {
        setLoading(true);
        const data = await eventsAPI.getAll({ featured: true });
        if (isMounted) {
          // Fall back to first 4 if no featured flag returned
          setFeaturedEvents(data.slice(0, 4));
        }
      } catch (err) {
        if (isMounted) {
          setError("Unable to load featured events right now.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="home-page">
      {/* ── Hero Section ────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-glow-blob top-left"></div>
        <div className="hero-glow-blob bottom-right"></div>
        <div className="hero-container">
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            <span>Annual Flagship Technology Festival</span>
          </div>

          <h1 className="hero-title">
            TECHFEST <span className="title-gradient">2026</span>
          </h1>

          <p className="hero-tagline">“Ideas. Innovation. Impact.”</p>

          <p className="hero-description">
            Experience the pinnacle of college engineering and innovation. Join 1,500+ student
            developers, robotics engineers, and gamers for three unforgettable days of competitive
            coding, battle robotics, hackathons, and cultural celebrations.
          </p>

          {/* Festival Date Card */}
          <div className="festival-date-banner">
            <span className="cal-icon">📅</span>
            <span className="date-text">March 20 – 22, 2026</span>
            <span className="date-separator">•</span>
            <span className="venue-text">Main Campus & Technology Labs</span>
          </div>

          {/* Call to Actions */}
          <div className="hero-actions">
            <Link to="/events" className="btn-hero-primary">
              ⚡ Explore Events
            </Link>
            <Link to="/register" className="btn-hero-secondary">
              🚀 Register Now
            </Link>
            <Link to="/gallery" className="btn-hero-outline">
              📸 Festival Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* ── Festival Stats Row ──────────────────────────────────────── */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-value">10+</span>
            <span className="stat-label">Competitions & Tracks</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">₹1.5L+</span>
            <span className="stat-label">Cash Prize Pool</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">500+</span>
            <span className="stat-label">Active Participants</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">3 Days</span>
            <span className="stat-label">Non-Stop Innovation</span>
          </div>
        </div>
      </section>

      {/* ── Featured Events Section ─────────────────────────────────── */}
      <section className="featured-section">
        <div className="section-header">
          <span className="section-eyebrow">Compete & Excel</span>
          <h2 className="section-title">Featured Competitions</h2>
          <p className="section-subtitle">
            Hand-picked flagship contests with the biggest challenges and prizes.
          </p>
        </div>

        {error && <Alert type="error" message={error} />}

        {loading ? (
          <div className="loading-grid">
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>
        ) : (
          <div className="events-grid">
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}

        <div className="section-cta-center">
          <Link to="/events" className="btn-view-all">
            Browse All 10+ Events →
          </Link>
        </div>
      </section>

      {/* ── Pillars / Categories Grid ───────────────────────────────── */}
      <section className="pillars-section">
        <div className="section-header">
          <span className="section-eyebrow">Festival Tracks</span>
          <h2 className="section-title">Tracks Designed For Every Passion</h2>
        </div>

        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon">💻</div>
            <h3>Coding & Algorithms</h3>
            <p>High-speed competitive programming, algorithmic challenges, and bug bounty sprints.</p>
            <Link to="/events?category=Coding" className="pillar-link">
              Explore Coding →
            </Link>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon">🌐</div>
            <h3>Web Development</h3>
            <p>24-hour hackathons, modern UI/UX design sprints, and full-stack REST API relays.</p>
            <Link to="/events?category=Web%20Development" className="pillar-link">
              Explore Web Tracks →
            </Link>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon">🤖</div>
            <h3>Robotics & Automation</h3>
            <p>Custom combat bots in the steel cage and autonomous line-following maze runners.</p>
            <Link to="/events?category=Robotics" className="pillar-link">
              Explore Robotics →
            </Link>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon">🎮</div>
            <h3>Gaming & Esports</h3>
            <p>5v5 tactical shooter showdowns and console tournaments on PS5 with live shoutcasting.</p>
            <Link to="/events?category=Gaming" className="pillar-link">
              Explore Gaming →
            </Link>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon">🎭</div>
            <h3>Cultural & Quizzes</h3>
            <p>Tech trivia championships and our grand Synthwave EDM cultural finale under the stars.</p>
            <Link to="/events?category=Cultural" className="pillar-link">
              Explore Cultural →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Call to Action Banner ───────────────────────────────────── */}
      <section className="cta-banner-section">
        <div className="cta-banner-card">
          <h2>Ready to Shape the Future?</h2>
          <p>
            Secure your spot in TechFest 2026 today. Create your participant account, browse
            competitions, and confirm your seats before registrations close.
          </p>
          <div className="cta-banner-buttons">
            <Link to="/register" className="btn-cta-white">
              Create Account & Register
            </Link>
            <Link to="/contact" className="btn-cta-glass">
              Contact Organizing Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

