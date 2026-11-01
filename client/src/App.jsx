import { useState, useEffect } from "react";
import "./App.css";

// Use the Vite env variable, fall back to localhost for development
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", department: "", email: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch students on mount ──────────────────────────────────────
  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/students`);
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data);
      setStatus({ type: "", message: "" });
    } catch (err) {
      setStatus({
        type: "error",
        message:
          "Could not load students. Make sure the backend is running and the database is connected.",
      });
    } finally {
      setLoading(false);
    }
  }

  // ── Handle form input changes ────────────────────────────────────
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // ── Client-side validation ───────────────────────────────────────
  function validate() {
    if (!form.name.trim()) return "Name is required";
    if (!form.department.trim()) return "Department is required";
    if (!form.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      return "Please enter a valid email address";
    return null;
  }

  // ── Submit the form ──────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setStatus({ type: "error", message: validationError });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch(`${API_URL}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", message: data.error || "Something went wrong" });
        return;
      }

      setStatus({ type: "success", message: `Student "${data.name}" added successfully!` });
      setForm({ name: "", department: "", email: "" });
      fetchStudents();
    } catch (err) {
      setStatus({
        type: "error",
        message: "Could not reach the server. Make sure the backend is running.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="container">
      <h1>🎓 Student Management System</h1>

      {/* Status messages */}
      {status.message && (
        <div className={`alert ${status.type}`}>{status.message}</div>
      )}

      {/* Add Student Form */}
      <form className="student-form" onSubmit={handleSubmit}>
        <h2>Add Student</h2>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. John Doe"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="department">Department</label>
          <input
            id="department"
            name="department"
            type="text"
            placeholder="e.g. Computer Science"
            value={form.department}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="e.g. john@example.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Student"}
        </button>
      </form>

      {/* Student List */}
      <div className="student-list">
        <h2>Students ({students.length})</h2>
        {loading ? (
          <p className="info">Loading students...</p>
        ) : students.length === 0 ? (
          <p className="info">No students yet. Add one above!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Department</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s._id}>
                  <td>{i + 1}</td>
                  <td>{s.name}</td>
                  <td>{s.department}</td>
                  <td>{s.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;

