// Resolve configurable API base URL from Vite environment variable
const rawUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");
export const API_BASE = rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`;

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    credentials: "include", // Ensure HttpOnly cookies are transmitted
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.error || data.message || `Request failed with status ${res.status}`;
      const error = new Error(errorMsg);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      const networkError = new Error(
        "Unable to connect to the TechFest server. Please verify the backend is running."
      );
      networkError.status = 0;
      throw networkError;
    }
    throw err;
  }
}

export const authAPI = {
  login: (credentials) => request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  register: (userData) => request("/auth/register", { method: "POST", body: JSON.stringify(userData) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  getMe: () => request("/auth/me", { method: "GET" }),
};

export const eventsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== "All") query.append("category", params.category);
    if (params.search) query.append("search", params.search);
    if (params.featured) query.append("featured", "true");
    const qs = query.toString() ? `?${query.toString()}` : "";
    return request(`/events${qs}`, { method: "GET" });
  },
  getById: (id) => request(`/events/${id}`, { method: "GET" }),
};

export const registrationsAPI = {
  create: (data) => request("/registrations", { method: "POST", body: JSON.stringify(data) }),
  getMy: () => request("/registrations/my", { method: "GET" }),
};

export const contactAPI = {
  send: (data) => request("/contact", { method: "POST", body: JSON.stringify(data) }),
};

export const healthAPI = {
  check: () => request("/health", { method: "GET" }),
};

export const studentsAPI = {
  getAll: () => request("/students", { method: "GET" }),
  create: (data) => request("/students", { method: "POST", body: JSON.stringify(data) }),
};

export default {
  auth: authAPI,
  events: eventsAPI,
  registrations: registrationsAPI,
  contact: contactAPI,
  health: healthAPI,
  students: studentsAPI,
  API_BASE,
};
