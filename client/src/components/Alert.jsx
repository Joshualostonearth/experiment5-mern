export default function Alert({ type = "info", message, onClose }) {
  if (!message) return null;

  const icons = {
    success: "✓",
    error: "⚠",
    info: "ℹ",
  };

  return (
    <div className={`alert-box alert-${type}`} role="alert">
      <span className="alert-icon">{icons[type] || "•"}</span>
      <span className="alert-text">{message}</span>
      {onClose && (
        <button
          type="button"
          className="alert-close"
          onClick={onClose}
          aria-label="Close message"
        >
          ×
        </button>
      )}
    </div>
  );
}

