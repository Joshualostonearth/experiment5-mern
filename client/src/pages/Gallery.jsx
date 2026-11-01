import { useState } from "react";

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "CodeStorm Algorithmic Championship",
    category: "Hackathons",
    caption: "Intense coding session during the annual 3-hour competitive programming showdown.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Steel Arena Robot Combat",
    category: "Robotics",
    caption: "Custom battle robots colliding inside the reinforced combat cage.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "24-Hour WebCraft Hackathon",
    category: "Hackathons",
    caption: "Teams collaborating non-stop building web apps for real-world campus problems.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Esports Arena Grand Finals",
    category: "Gaming",
    caption: "Packed student audience cheering during the 5v5 tactical shooter showdown.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "Autonomous Line Follower Maze",
    category: "Robotics",
    caption: "Microcontroller bots navigating high-speed tracks with sensor arrays.",
    image: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    title: "Keynote: Future of Artificial Intelligence",
    category: "Keynotes",
    caption: "Industry tech leaders sharing insights on agents, LLMs, and cloud infrastructure.",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    title: "UI/UX Pixel Sprint Workshop",
    category: "Hackathons",
    caption: "Designers prototyping wireframes and interactive systems in the design studio.",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 8,
    title: "Synthwave Cultural Night Finale",
    category: "Cultural",
    caption: "Laser mapping, live electronic music, and open-mic performances at the amphitheatre.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 9,
    title: "Project Innovation Expo",
    category: "Keynotes",
    caption: "Student innovators presenting IoT prototypes and patented lab research projects.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
  },
];

const CATEGORIES = ["All", "Hackathons", "Robotics", "Gaming", "Keynotes", "Cultural"];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeItem, setActiveItem] = useState(null);

  const filteredItems =
    selectedCategory === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <div className="gallery-page container">
      <div className="page-header">
        <span className="page-eyebrow">Visual Highlights</span>
        <h1 className="page-title">TechFest Festival Gallery</h1>
        <p className="page-desc">
          A glimpse into the energy, competitive spirit, and engineering brilliance of TechFest. Click
          any photograph to view full-resolution showcase details.
        </p>
      </div>

      {/* Category Pills */}
      <div className="category-pills gallery-filter-pills">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`pill-btn ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="gallery-grid">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="gallery-item-card"
            onClick={() => setActiveItem(item)}
            tabIndex={0}
            role="button"
            aria-label={`View photo: ${item.title}`}
            onKeyDown={(e) => e.key === "Enter" && setActiveItem(item)}
          >
            <div className="gallery-img-wrapper">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="gallery-img"
              />
              <div className="gallery-overlay">
                <span className="gallery-zoom-icon">🔍</span>
                <span className="gallery-cat-tag">{item.category}</span>
                <h3 className="gallery-overlay-title">{item.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Lightbox */}
      {activeItem && (
        <div
          className="gallery-modal-backdrop"
          onClick={() => setActiveItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="gallery-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="gallery-modal-close"
              onClick={() => setActiveItem(null)}
              aria-label="Close modal"
            >
              ×
            </button>
            <img
              src={activeItem.image}
              alt={activeItem.title}
              className="gallery-modal-img"
            />
            <div className="gallery-modal-info">
              <span className="gallery-cat-tag">{activeItem.category}</span>
              <h2>{activeItem.title}</h2>
              <p>{activeItem.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

