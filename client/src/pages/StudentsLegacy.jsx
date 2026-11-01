import { useState, useEffect } from "react";
import { studentsAPI } from "../services/api.js";
import Alert from "../components/Alert.jsx";

export default function StudentsLegacy() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", department: "", email: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    setLoading(true);
    try {
      const data = await studentsAPI.getAll();
      setStudents(data);
      setStatus({ type: "", message: "" });
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err.message ||
          "Could not load students. Make sure the backend is running and the database is connected.",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    if (!form.name.trim()) return "Name is required";
    if (!form.department.trim()) return "Department is required";
    if (!form.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      return "Please enter a valid email address";
    return null;
  }

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
      const data = await studentsAPI.create(form);
      setStatus({
        type: "success",
        message: `Student "${data.name}" added successfully to MongoDB Atlas!`,
      });
      setForm({ name: "", department: "", email: "" });
      fetchStudents();
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Failed to create student record.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container" style={{ padding: "2rem 1rem", maxWidth: "800px", margin: "0 auto" }}>
      <div className="page-header" style={{ textAlign: "center", marginBottom: "2rem" }}>
        <span className="page-eyebrow">Experiment 5 Baseline Module</span>
        <h1 className="page-title">Student Management Directory</h1>
        <p className="page-desc">
          Preserved baseline functionality for Web Technology Lab Experiment 5. Records are stored
          directly in MongoDB Atlas via <code>/api/students</code>.
        </p>
      </div>

      {status.message && (
        <Alert
          type={status.type}
          message={status.message}
          onClose={() => setStatus({ type: "", message: "" })}
        />
      )}

      {/* Add Student Form */}
      <form className="student-form" onSubmit={handleSubmit}>
        <h2>Add Student Record</h2>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            className="form-control"
            placeholder="e.g. John Doe"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="department">Department *</label>
          <input
            id="department"
            name="department"
            type="text"
            className="form-control"
            placeholder="e.g. Computer Science"
            value={form.department}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-control"
            placeholder="e.g. john@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Adding to Atlas..." : "Add Student"}
        </button>
      </form>

      {/* Student List */}
      <div className="student-list" style={{ marginTop: "2rem" }}>
        <h2>Registered Students ({students.length})</h2>
        {loading ? (
          <p className="info">Loading students from Atlas...</p>
        ) : students.length === 0 ? (
          <p className="info">No student records yet in this database. Add one above!</p>
        ) : (
          <div className="table-responsive">
            <table className="techfest-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Enrolled</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s._id}>
                    <td>{i + 1}</td>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.department}</td>
                    <td>{s.email}</td>
                    <td>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "Just now"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

