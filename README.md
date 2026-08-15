# TaskPilot — Enterprise Operations & Task Management Dashboard

A modular, scalable, and resilient **Internal Task & Operations Management Platform** engineered with Node.js (Express), PostgreSQL, React 18, Vite, and Tailwind CSS. Built with clean architecture principles, database-level pagination/filtering, automated CI/CD validation, and full containerization support.

---

## 🌟 Architecture Highlights & Capabilities

* **📊 Executive Operations Dashboard**
* **Real-time Pipeline Aggregations:** 6 stat indicators covering total backlog, pending, in-progress, completed, overdue alerts, and direct personal assignments.
* **Dynamic Metrics & Urgency Visuals:** Workflow completion percentages, status distribution breakdown bars, and priority urgency meters.
* **Actionable Overdue Queue:** Dedicated attention list surfacing high-risk deliverables with quick-action resolution controls.


* **📋 High-Performance Task Engine**
* **Database-Level Querying:** Server-side parameterized execution for filtering (status, priority, assignee) preventing SQL injection.
* **Debounced Full-Text Search:** Optimized title and description querying with client-side debounce hooks.
* **Multi-Column Sorting & Pagination:** Server-side pagination (`limit`, `page`) with dynamic column ordering (`created_at`, `due_date`, `title`, `priority`, `status`).
* **Optimistic UI Updates:** Inline row status switches and instant modal feedback for fluid user interaction.


* **💬 Collaboration & Identity Context**
* **Audit Timeline:** Chronological comment and activity feeds with user avatars, system roles, and real-time relative timestamps.
* **RBAC & User Context Switcher:** Native runtime account toggle allowing developers to inspect active roles, permissions, and assigned backlogs.


* **🛡️ Resilient External Integrations**
* **Fault-Tolerant Directory Sync:** Integrates external user directories (`/api/external/users`) with circuit breaker mechanisms (5-second hard timeouts, retry loops, and in-memory cache fallbacks).


* **📐 Clean Architecture & Design System**
* **Decoupled Backend:** Strict Repository-Service-Controller-Schema (Joi) layered architecture.
* **Reusable Atomic UI Kit:** Built with accessible Tailwind tokens (Modals, ConfirmDrawers, Tables, Badges, Toast notifications, Skeleton loaders, and Dark Mode themes).



---

## 🏗️ Monorepo Structure

```text
taskpilot/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions pipeline (Lint, Test, Docker Build)
├── backend/
│   ├── database/              # PostgreSQL connection pool & schema migrations
│   ├── models/                # Domain models & enum definitions
│   ├── schemas/               # Joi request validation schemas
│   ├── repositories/          # Data access layer (Parameterized SQL queries)
│   ├── services/              # Business logic, aggregations & external API clients
│   ├── routes/                # Express router endpoints
│   ├── utils/                 # Centralized loggers, constants & error handlers
│   ├── tests/                 # Automated API integration test suite
│   ├── Dockerfile             # Multi-stage backend container setup
│   └── server.js              # Application entrypoint
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI kit, layouts, dashboard & task modules
│   │   ├── pages/             # Route views (Dashboard, Tasks, Audit Logs, External Users)
│   │   ├── context/           # React Contexts (Auth, User, Toast)
│   │   ├── hooks/             # Custom hooks (useTasks, useDebounce)
│   │   ├── services/          # Axios API abstraction layer
│   │   └── App.jsx            # Core application layout & route state
│   ├── Dockerfile             # Multi-stage production Nginx frontend container
│   └── vite.config.js         # Vite build configuration
├── docker-compose.yml         # Production container orchestration
├── seed_data.json             # Bootstrap seed dataset
└── README.md

```

---

## ⚡ Quickstart

### Option 1: Docker Compose (Recommended)

Spin up the entire stack (PostgreSQL, Express Backend, and Nginx Frontend) with a single command:

```bash
docker compose up --build -d

```

Access the application at `http://localhost:5173` (or `http://localhost`).

---

### Option 2: Local Development Setup

#### Prerequisites

* **Node.js**: `v18.x` or higher
* **PostgreSQL**: `v14.x` or higher running on `localhost:5432`

#### 1. Database Configuration

Ensure PostgreSQL is active and create the target database:

```sql
CREATE DATABASE task_dashboard;

```

#### 2. Backend Setup & Seeding

```bash
cd backend

# Install dependencies
npm ci

# Configure environment variables (or rely on defaults in .env.example)
cp .env.example .env

# Seed database with baseline data (5 users, 16 tasks, 10 comments)
npm run seed

# Run automated integration test suite
npm test

# Start Express server (Default: http://localhost:8000)
npm run dev

```

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm ci

# Start Vite development server (Default: http://localhost:5173)
npm run dev

```

---

## ⚙️ Environment Variables

### Backend Config (`backend/.env`)

| Key | Type | Default Value | Description |
| --- | --- | --- | --- |
| `PORT` | `Number` | `8000` | Port for Express HTTP server |
| `DATABASE_URL` | `String` | `postgresql://postgres:postgrespassword@localhost:5432/task_dashboard` | PostgreSQL connection URI |
| `NODE_ENV` | `String` | `development` | Application runtime environment (`development` / `production` / `test`) |
| `JWT_SECRET` | `String` | `supersecret_task_dashboard_jwt_key_2026` | Cryptographic secret for auth tokens |

---

## 📡 API Specification

### Operational Health Check

```http
GET /health

```

**Response (200 OK):**

```json
{ "status": "UP", "timestamp": "2026-08-15T15:55:41.000Z" }

```

---

### 1. Dashboard Metrics

```http
GET /api/dashboard?user_id={id}

```

* **Query Parameters:** `user_id` *(optional)* — Computes personal workload metrics (`assigned_to_me`).
* **Response (200 OK):** Returns pipeline summaries, completion rates, overdue totals, status distributions, and recent audit logs.

---

### 2. Task Backlog Management

#### Query Backlog (Paginated & Filtered)

```http
GET /api/tasks?status=in_progress&priority=high&search=index&page=1&limit=10&sort_by=due_date&order=asc

```

**Parameters:**

* `status`: `pending` | `in_progress` | `completed` | `blocked`
* `priority`: `low` | `medium` | `high` | `urgent`
* `assignee`: User ID (`integer`) or `unassigned`
* `search`: Full-text substring search on `title` and `description`
* `page` / `limit`: Pagination parameters (`limit` max: 100)
* `sort_by`: `created_at` | `updated_at` | `due_date` | `title` | `priority` | `status`

#### Create Task

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Migrate database indexes",
  "description": "Optimize high-traffic query benchmarks",
  "status": "pending",
  "priority": "high",
  "assigned_to": 1,
  "due_date": "2026-08-25T00:00:00.000Z"
}

```

#### Quick Patch Status

```http
PATCH /api/tasks/:id/status
Content-Type: application/json

{ "status": "completed" }

```

#### Cascade Delete Task

```http
DELETE /api/tasks/:id

```

---

### 3. Collaboration Thread

```http
POST /api/tasks/:id/comments
Content-Type: application/json

{
  "user_id": 1,
  "comment": "Database index optimization applied successfully."
}

```

---

### 4. Resilient External User Directory

```http
GET /api/external/users

```

* Queries external enterprise user directory with exponential retries and fallback caching.

---

## 🧪 Automated Testing & Quality Assurance

The backend repository includes an automated integration testing harness using Node's test framework.

```bash
cd backend
npm test

```

### End-to-End Suite Coverage:

1. **Health Verification:** Ensures DB connection pool and HTTP server health.
2. **Aggregations & Metrics:** Validates statistical calculations and overdue threshold logic.
3. **Data Access Boundaries:** Tests SQL limit/offset pagination limits and invalid query handling.
4. **Validation Pipeline:** Asserts Joi schema rejection (`400 Bad Request`) on invalid payloads.
5. **State Transitions:** Tests lifecycle flow (`POST` -> `GET` -> `PUT` -> `PATCH` -> `DELETE`).
6. **Thread Cascade Cleanup:** Verifies orphan removal of task-related comments on task deletion.
7. **External Resilience:** Validates fallback behavior during external API outages.