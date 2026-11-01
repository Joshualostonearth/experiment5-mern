# Experiment 5 — Student Management System (MERN Stack)

A full-stack **Student Management System** built with the MERN stack (MongoDB, Express, React, Node.js). This is the baseline application for Experiment 5: Security, Version Control, CI/CD, and Cloud Deployment.

## Tech Stack

| Layer      | Technology                      |
| ---------- | ------------------------------- |
| Frontend   | React 19 + Vite 8               |
| Backend    | Node.js + Express 5 (ES modules)|
| Database   | MongoDB Atlas (cloud-hosted)    |
| Security   | Helmet, CORS                    |
| Env config | dotenv                          |
| Dev server | nodemon                         |

## Project Structure

```
experiment5-mern/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx             # Main component (form + student list)
│   │   ├── App.css             # Styles
│   │   └── main.jsx            # React entry point
│   ├── index.html              # HTML template
│   ├── vite.config.js          # Vite configuration
│   ├── .env.example            # Frontend env variable template
│   ├── .gitignore
│   └── package.json
├── server/                     # Express backend
│   ├── models/
│   │   └── Student.js          # Mongoose schema/model
│   ├── routes/
│   │   └── students.js         # CRUD route handlers
│   ├── server.js               # App entry point (Express + Mongoose)
│   ├── .env.example            # Backend env variable template
│   ├── .gitignore
│   └── package.json
└── README.md
```

---

## Prerequisites

- **Node.js** v18+ and **npm** v9+ installed
- A **MongoDB Atlas** account (free tier works — no local MongoDB needed)

---

## MongoDB Atlas Setup (Step-by-Step)

MongoDB Atlas is a **cloud-hosted** database service. You do **not** need to install MongoDB locally.

### 1. Create an Atlas account

Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) and sign up (or sign in if you already have an account).

### 2. Create a free cluster

- Click **"Build a Database"** (or **"Create a Deployment"**).
- Choose the **Free / Shared** tier (M0).
- Pick a cloud provider and region close to you.
- Click **Create Deployment**.

### 3. Create a database user

- In the **Database Access** section, click **Add New Database User**.
- Choose **Password** authentication.
- Enter a username and a strong password.
- Give the user **Read and Write** access.
- Click **Add User**.

> [!IMPORTANT]
> Remember this username and password — you will need them for the connection string.

### 4. Allow your IP address

- Go to **Network Access** → **Add IP Address**.
- Click **Add Current IP Address** to allow your machine.
- Click **Confirm**.

> [!WARNING]
> Avoid using `0.0.0.0/0` (allow access from anywhere) for production or long-term use. It allows connections from **all IPv4 addresses** and is less secure. Use it temporarily only if your IP changes frequently, and remove it when not needed.

### 5. Get your connection string

- Go to **Database** → click **Connect** on your cluster.
- Choose **Drivers** → select **Node.js**.
- Copy the connection string. It looks like:
  ```
  mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```

### 6. Configure your server/.env

1. Copy the example file:
   ```powershell
   cd experiment5-mern\server
   Copy-Item .env.example .env
   ```

2. Edit `server/.env` and replace the placeholders:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/experiment5?retryWrites=true&w=majority
   CLIENT_URL=http://localhost:5173
   ```

> [!CAUTION]
> - Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your actual Atlas credentials.
> - Add `/experiment5` before the `?` to set the database name.
> - If your password contains special characters like `@`, `#`, `%`, etc., [URL-encode them](https://www.mongodb.com/docs/manual/reference/connection-string/#special-characters-in-connection-string-password) (e.g., `@` → `%40`).
> - **Never** paste real credentials into source code, frontend env files, README files, screenshots, or Git commits.

---

## Installation & Running

Open **two separate PowerShell terminals**.

### Terminal 1 — Backend

```powershell
cd experiment5-mern\server
# If you haven't already:
# npm install
npm run dev
```

You should see:
```
✅  Connected to MongoDB Atlas
🚀  Server listening on http://localhost:5000
```

### Terminal 2 — Frontend

```powershell
cd experiment5-mern\client
# If you haven't already:
# npm install
npm run dev
```

Open the URL shown by Vite (usually **http://localhost:5173**).

---

## API Endpoints

| Method | URL              | Description                          |
| ------ | ---------------- | ------------------------------------ |
| GET    | `/api/health`    | Health check — confirms server is up |
| GET    | `/api/students`  | List all students (newest first)     |
| POST   | `/api/students`  | Create a new student                 |

### POST /api/students — Request Body

```json
{
  "name": "John Doe",
  "department": "Computer Science",
  "email": "john@example.com"
}
```

### Responses

| Status | Meaning                                 |
| ------ | --------------------------------------- |
| 201    | Student created successfully            |
| 400    | Validation error (missing/invalid data) |
| 409    | Duplicate email address                 |
| 500    | Internal server error                   |

---

## Verification Checklist

1. ✅ Configure `server/.env` with your Atlas URI.
2. ✅ Start the backend: `npm run dev` in `server/`.
3. ✅ Visit [http://localhost:5000/api/health](http://localhost:5000/api/health) — should return `{"status":"ok","message":"Server is running"}`.
4. ✅ Start the frontend: `npm run dev` in `client/`.
5. ✅ Open the Vite URL (e.g., `http://localhost:5173`).
6. ✅ Add a test student with name, department, and email.
7. ✅ Verify the student appears in the list below the form.
8. ✅ Refresh the page — the student should still be there (persisted in Atlas).
9. ✅ Try submitting empty fields — should show validation errors.
10. ✅ Try an invalid email (e.g., `notanemail`) — should show an error.
11. ✅ Try adding a student with a duplicate email — should show `"A student with this email already exists"`.

---

## Security Notes

- **Helmet** adds secure HTTP headers to all responses.
- **CORS** is restricted to the configured `CLIENT_URL` (only the frontend origin can call the API).
- **Credentials** are stored in `server/.env`, which is excluded from Git via `.gitignore`.
- **Error responses** never expose stack traces, raw database errors, or secrets.
- The **frontend** never contains `MONGO_URI` or database credentials.

---

## Next Steps (Experiment 5 Stages)

This baseline MERN app is designed to support the following follow-on stages:

1. **OWASP Security Controls** — input sanitization, rate limiting, authentication
2. **Git/GitHub Version Control** — initialize repo, branching strategy, `.gitignore`
3. **GitHub Actions CI Pipeline** — linting, testing, build checks on push/PR
4. **Cloud Deployment** — deploy to a cloud platform (Render, Railway, Vercel, etc.)
5. **Performance Measurement** — Lighthouse, load testing, optimization

---

## Scripts Reference

### Server (`server/`)

| Script          | Command              | Description               |
| --------------- | -------------------- | ------------------------- |
| `npm run dev`   | `nodemon server.js`  | Dev server with hot-reload|
| `npm start`     | `node server.js`     | Production start          |

### Client (`client/`)

| Script          | Command              | Description               |
| --------------- | -------------------- | ------------------------- |
| `npm run dev`   | `vite`               | Dev server with HMR       |
| `npm run build` | `vite build`         | Production build          |
| `npm run preview` | `vite preview`     | Preview production build  |

