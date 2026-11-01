import { useState } from "react";
import { contactAPI } from "../services/api.js";
import Alert from "../components/Alert.jsx";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.name.trim()) return "Name is required.";
    if (!formData.email.trim()) return "Email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return "Please provide a valid email address.";
    }
    if (!formData.subject.trim()) return "Subject is required.";
    if (!formData.message.trim()) return "Message cannot be empty.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validate();
    if (errorMsg) {
      setAlert({ type: "error", message: errorMsg });
      return;
    }

    setLoading(true);
    setAlert({ type: "", message: "" });

    try {
      const res = await contactAPI.send(formData);
      setAlert({
        type: "success",
        message: res.message || "Your message has been sent successfully! We will contact you soon.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Failed to deliver message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page container">
      <div className="page-header">
        <span className="page-eyebrow">Connect With Us</span>
        <h1 className="page-title">Festival Helpdesk & Inquiries</h1>
        <p className="page-desc">
          Have questions regarding team registrations, event guidelines, sponsorship, or campus
          accommodation? Reach out to our student coordination council.
        </p>
      </div>

      <div className="contact-grid">
        {/* Contact Info Column */}
        <div className="contact-info-card">
          <h2>Get in Touch</h2>
          <p className="contact-intro">
            We are here to help you get the most out of TechFest 2026. Reach out directly or visit
            our physical registration kiosk on campus.
          </p>

          <div className="info-items-list">
            <div className="info-item">
              <span className="info-item-icon">📍</span>
              <div>
                <strong>Central Campus Venue</strong>
                <p>Technology Complex, Turing Auditorium Block, Innovation Way</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-item-icon">✉️</span>
              <div>
                <strong>Official Helpdesk Email</strong>
                <p>techfest2026@university.edu</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-item-icon">📞</span>
              <div>
                <strong>Student Coordination Hotline</strong>
                <p>+91 (080) 4567-8900 / +91 98765 43210</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-item-icon">⏰</span>
              <div>
                <strong>Helpdesk Hours</strong>
                <p>Monday – Saturday: 09:00 AM – 06:00 PM IST</p>
              </div>
            </div>
          </div>

          <div className="faq-box">
            <h4>💡 Quick Tip for Participants</h4>
            <p>
              If you have already registered for an event, your digital entry pass is available
              under <strong>My Events</strong> in the top navigation.
            </p>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="contact-form-card">
          <h2>Send Us a Message</h2>
          <p className="form-subtext">Fill in the form below and we'll reply within 24 hours.</p>

          {alert.message && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert({ type: "", message: "" })}
            />
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-control"
                placeholder="e.g. Maya Chen"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Your Email Address *</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="e.g. maya@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                id="subject"
                name="subject"
                type="text"
                className="form-control"
                placeholder="e.g. Query regarding CodeStorm rules"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                className="form-control"
                placeholder="Write your question or request here..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn-primary-block" disabled={loading}>
              {loading ? "Sending Message..." : "Submit Message →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

