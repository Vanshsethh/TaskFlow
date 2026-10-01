# TaskFlow — Modern Task & Team Management Platform

[![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20Vite%20%2B%20Redux%20%2B%20Tailwind-teal.svg)](https://github.com/Vanshsethh/TaskFlow)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

TaskFlow is a production-ready, full-stack task and team collaboration platform designed for modern engineering teams. It features real-time task analytics, server-side filtering, an interactive drag-and-drop task board, dark mode theming, and robust role-aware access controls.

---

## 🌐 Live Demo

- **Frontend:** [https://task-flow-nu-sooty.vercel.app](https://task-flow-nu-sooty.vercel.app)
- **Backend API:** [https://taskflow-qlfe.onrender.com](https://taskflow-qlfe.onrender.com)

---

## 🌟 Key Features & Highlights

- **JWT Authentication & Security**: Secure registration, login, bcrypt password hashing, protected API endpoints, and **Remember Me** session control (30-day token in `localStorage` vs. 1-day session in `sessionStorage`).
- **Dashboard & Real-time Metrics**: Metric cards showing Total, Pending, In Progress, and Completed tasks, plus completion rate and overdue tracking.
- **Bonus 1 — Interactive Charts**: SVG-powered Status Distribution Donut Chart and Priority Breakdown Bar Chart for instant visual health metrics.
- **Bonus 2 — Drag & Drop Task Board**: Native HTML5 drag-and-drop task board with optimistic UI updates and immediate database synchronization across workflow stages (`Pending` → `In Progress` → `Completed`).
- **Bonus 3 — Dark / Light Mode**: High-contrast, accessibility-tested dark mode with system preference detection and `localStorage` persistence.
- **Bonus 4 — Docker Containerization**: Multi-stage `Dockerfile` configurations and `docker-compose.yml` for 1-command orchestration of MongoDB, Backend API, and Nginx-served Frontend.
- **Extra Bonuses — Pagination & Toast Notifications**: Responsive pagination with range counters and floating toast alerts for all user actions and error feedback.
- **Advanced Server-Side Filtering & Search**: Query params (`?search=&status=&priority=&sort=&page=&limit=`) with client-side input debouncing.
- **Creator Access Control**: All team members can view tasks, while only task creators possess permissions to edit or delete task records.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite | High-performance SPA with fast HMR |
| **State Management** | Redux Toolkit, React-Redux | Centralized auth and task state |
| **Routing** | React Router v7 | Declarative routing with Lazy Loading & Suspense |
| **Styling** | Tailwind CSS v3 | Custom dark mode palette and glassmorphism |
| **HTTP Client** | Axios | Request/Response interceptors for JWT & error handling |
| **Backend** | Node.js, Express | RESTful API server with error middleware |
| **Database** | MongoDB, Mongoose | Schema validation, relationships, and aggregation |
| **Validation** | Express-Validator | Robust input sanitization and verification |
| **Containerization** | Docker, Docker Compose | Production-grade multi-stage container deployment |

---

## 🗂 Project Structure

```
TaskFlow/
├── frontend/                   # Frontend Application (React + Vite)
│   ├── public/                 # Static assets & favicon
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Charts.jsx      # SVG Status Donut & Priority Bar Charts
│   │   │   ├── Layout.jsx      # Shell layout with Navbar & Sidebar
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx      # Top navigation with theme toggle & user menu
│   │   │   ├── Pagination.jsx  # Page numbers & range indicators
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Sidebar.jsx     # Nav links & quick status metrics
│   │   │   ├── StatCard.jsx    # Metric cards with glassmorphism
│   │   │   ├── TaskCard.jsx    # Draggable task card with badges
│   │   │   ├── TaskFilterBar.jsx# Search input & filter dropdowns
│   │   │   └── TaskModal.jsx   # Create & Edit task dialog
│   │   ├── context/            # Context providers (ThemeContext, ToastContext)
│   │   ├── hooks/              # Custom hooks (useForm, useDebounce, useTheme)
│   │   ├── pages/              # Lazy-loaded page views
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── TaskBoardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── TaskDetailsPage.jsx
│   │   │   └── TasksPage.jsx
│   │   ├── services/           # Axios API services (auth, tasks, users)
│   │   ├── store/              # Redux Toolkit store and slices
│   │   ├── utils/              # Application constants & formatters
│   │   │   ├── constants.js
│   │   │   ├── formatters.js
│   │   │   └── index.js
│   │   ├── App.jsx             # Route definitions with Suspense
│   │   ├── index.css           # Tailwind base styles and dark mode layer
│   │   └── main.jsx            # Application root
│   ├── Dockerfile              # Multi-stage production build + Nginx
│   ├── nginx.conf              # Nginx SPA rewrite rules
│   ├── tailwind.config.js      # Tailwind configuration
│   └── vercel.json             # Vercel SPA rewrite configuration
│
├── backend/                    # Backend Application (Node.js + Express)
│   ├── config/
│   │   └── db.js               # MongoDB connection handler
│   ├── controllers/            # Request handlers (auth, tasks, users)
│   ├── middleware/             # JWT auth guard & validation middleware
│   ├── models/                 # Mongoose schemas (User, Task)
│   ├── routes/                 # REST endpoints
│   ├── scripts/
│   │   └── seed.js             # Database seeder script
│   ├── Dockerfile              # Server production container
│   ├── server.js               # Express application entry point
│   └── package.json
│
├── docs/
│   └── TaskFlow.postman_collection.json # Exported Postman collection
├── docker-compose.yml          # Local multi-service orchestration
├── package.json                # Root workspace scripts
└── README.md                   # Documentation
```

---

## ⚡ Quick Start & Setup

### Prerequisites
- Node.js (v18 or newer)
- MongoDB instance (local or MongoDB Atlas connection string)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Vanshsethh/TaskFlow.git
cd TaskFlow
```

### 2. Configure Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=generate_a_unique_secure_random_value
CLIENT_URL=http://localhost:5173
NODE_ENV=development
SEED_TEST_USER_PASSWORD=set_a_unique_test_password
SEED_COLLEAGUE_PASSWORD=set_a_unique_test_password
SEED_DESIGNER_PASSWORD=set_a_unique_test_password
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=https://taskflow-qlfe.onrender.com
```

### 3. Install Dependencies
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 4. Seed the Database
Run the pre-configured seed script to populate users and realistic demo tasks:
```bash
cd backend
npm run seed
```

### 5. Run the Application

In **Terminal 1** (Backend):
```bash
cd backend
npm start
# Server listens on http://localhost:5001
```

In **Terminal 2** (Frontend):
```bash
cd frontend
npm run dev
# Vite runs on http://localhost:5173
```

---

## 🔑 Test Credentials

Configure the seed-password environment variables above before running `npm run seed`. The seeded accounts use these email addresses:

| Role | Email |
|---|---|
| **Default Reviewer Account** | `testuser@example.com` |
| **Colleague Account (for Assignment)** | `alex.rivera@example.com` |
| **Designer Account** | `sarah.chen@example.com` |

Do not commit passwords. Store the deployed reviewer password securely and share it only with the intended evaluator.

---

## 🐳 Docker Deployment (Bonus)

To run the complete stack including MongoDB, Backend, and Frontend in Docker:

```bash
# From project root
JWT_SECRET="your-secure-random-value" docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5001`
- MongoDB: `localhost:27017`

To run database seeding inside the Docker network:
```bash
docker-compose exec backend npm run seed
```

---

## 📡 REST API Reference

All protected endpoints require the HTTP header: `Authorization: Bearer <token>`.

### Authentication & Users
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Create new account (`name`, `email`, `password`) |
| `POST` | `/login` | Public | Authenticate user & return JWT (`email`, `password`, `rememberMe`) |
| `GET` | `/me` | Private | Retrieve authenticated user profile |
| `GET` | `/users` | Private | Retrieve registered team members for task assignment |

### Tasks
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/tasks/stats` | Private | Aggregated metrics: total, status counts, priority breakdown, completion rate |
| `GET` | `/tasks` | Private | Fetch tasks with query params: `search`, `status`, `priority`, `sort`, `page`, `limit`, `all` |
| `GET` | `/tasks/:id` | Private | Retrieve single task with populated assignee and creator details |
| `POST` | `/tasks` | Private | Create new task (`title`, `description`, `priority`, `status`, `dueDate`, `assignedUser`) |
| `PUT` | `/tasks/:id` | Private | Update task details (creator) or update task status (assignee) |
| `DELETE` | `/tasks/:id` | Private | Delete task (restricted to task creator) |

---

## 📮 API Collection (Postman)

A complete Postman collection is located at:
[`docs/TaskFlow.postman_collection.json`](docs/TaskFlow.postman_collection.json)

To import into Postman:
1. Open Postman → click **Import**.
2. Select `docs/TaskFlow.postman_collection.json`.
3. The collection is pre-configured with collection variables and automated scripts to save the JWT token on login.

---

## 🚀 Cloud Deployment Guide

### Frontend Deployment (Vercel)
1. Push your repository to GitHub.
2. Link the repository in [Vercel](https://vercel.com).
3. Set **Root Directory** to `frontend`.
4. Configure Build Command: `npm run build` and Output Directory: `dist`.
5. Set Environment Variable:
   - `VITE_API_URL`: `https://taskflow-qlfe.onrender.com`.
6. The included `frontend/vercel.json` automatically ensures client-side routes (e.g. `/task-board`, `/dashboard`) resolve smoothly without 404 errors on refresh.

### Backend Deployment (Render)
1. Create a **New Web Service** on [Render](https://render.com) connected to your repo.
2. Set **Root Directory** to `backend`.
3. Set **Build Command**: `npm install`.
4. Set **Start Command**: `node server.js`.
5. Add Environment Variables:
   - `PORT`: `5001` (or leave default for Render to assign)
   - `MONGODB_URI`: Your MongoDB Atlas connection URI
   - `JWT_SECRET`: A secure random secret string
   - `CLIENT_URL`: `https://task-flow-nu-sooty.vercel.app`
   - `NODE_ENV`: `production`
6. *Note on Render Cold Starts*: Free-tier instances spin down after inactivity. Initial API requests may experience a 30–50 second cold start delay.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
