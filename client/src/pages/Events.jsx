import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { eventsAPI } from "../services/api.js";
import EventCard from "../components/EventCard.jsx";
import Alert from "../components/Alert.jsx";

const CATEGORIES = ["All", "Coding", "Web Development", "Robotics", "Gaming", "Cultural"];

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Sync category state with query param if it changes from outside
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && CATEGORIES.includes(cat)) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;
    async function fetchEvents() {
      setLoading(true);
      setError("");
      try {
        const data = await eventsAPI.getAll({
          category: selectedCategory,
          search: searchQuery,
        });
        if (isMounted) setEvents(data);
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load events from the server.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    // Debounce search slightly to avoid excessive calls
    const timeout = setTimeout(() => {
      fetchEvents();
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    searchParams.delete("category");
    setSearchParams(searchParams);
  };

  return (
    <div className="events-page">
      <div className="page-header">
        <span className="page-eyebrow">Competitions & Workshops</span>
        <h1 className="page-title">TechFest 2026 Events</h1>
        <p className="page-desc">
          Browse our comprehensive schedule of technical challenges, esports tournaments, and
          creative showcases. Select any event to review complete guidelines or reserve your seat.
        </p>
      </div>

      {/* ── Filter & Search Toolbar ─────────────────────────────────── */}
      <div className="filter-toolbar">
        {/* Search Input */}
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by event name, description, venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`pill-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Status Messages */}
      {error && <Alert type="error" message={error} onClose={() => setError("")} />}

      {/* ── Events Results ─────────────────────────────────────────── */}
      <div className="events-results-container">
        {loading ? (
          <div className="loading-grid">
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-icon">🔎</div>
            <h3>No events found</h3>
            <p>
              We couldn't find any events matching your selected filters: “
              {selectedCategory !== "All" ? selectedCategory : ""} {searchQuery}”.
            </p>
            <button type="button" className="btn-primary" onClick={handleClearFilters}>
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

