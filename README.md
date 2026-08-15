# TaskPilot - Production-Ready Internal Task & Management Dashboard

A full-stack, modular, and scalable **Internal Task & Operations Management Dashboard** built with **Node.js, Express, PostgreSQL, React, Vite, and Tailwind CSS**.

---

## 🌟 Executive Summary & Features

- **📊 Comprehensive Operations Dashboard:**
  - 6 Real-time Stat Cards: Total Tasks, Pending, In Progress, Completed, Overdue (with warning indicators), and Tasks Assigned to Me.
  - Workflow Completion progress percentage indicator.
  - Visual distribution bars for workflow status and priority urgency.
  - Overdue tasks attention list with direct quick actions.
  - Recent activity and task updates timeline.

- **📋 High-Performance Task Management:**
  - Database-level parameterized filtering (Status, Priority, Assignee).
  - Debounced keyword search across task title and description.
  - Multi-column server-side sorting (`created_at`, `due_date`, `title`, `priority`, `status`).
  - Dynamic server-side pagination with custom page limits (5, 10, 20, 50).
  - Inline quick-action status switcher directly on table rows.
  - Full CRUD operations with rich modal creation and editing forms.

- **💬 Collaboration & Activity Timeline:**
  - Chronological note/comment timeline with author avatars, roles, and relative timestamps.
  - Integrated active user switcher ("Me" toggle) allowing instant switching between team members to test assigned tasks and author attribution.

- **🌐 Resilient External Integration:**
  - Synchronizes team directory profiles via `/api/external/users` from JSONPlaceholder.
  - Built-in 5-second timeout, error resilience, retry triggers, and cached fallback directory.
  - Filter by departments (Engineering, Product, Design, Marketing, etc.).

- **🛡️ Clean Decoupled Architecture:**
  - Strict separation of concerns across Repositories (data access), Services (business logic), Schemas (Joi request validation), and Routers.
  - Reusable UI kit (Button, Modal, ConfirmModal, Input, Select, Textarea, Badges, Table, Pagination, Skeleton, EmptyState, Toast).

---

## 🏗️ Architecture & Project Layout

```text
assignment/
├── backend/
│   ├── database/
│   │   └── database.js          # PostgreSQL connection pool & schema initialization
│   ├── models/
│   │   ├── User.js              # User schema definition
│   │   ├── Task.js              # Task schema & enum definitions
│   │   └── Comment.js           # Comment schema definition
│   ├── schemas/
│   │   ├── user.schema.js       # Joi user validation schemas
│   │   ├── task.schema.js       # Joi task CRUD, query & status validation schemas
│   │   └── comment.schema.js    # Joi comment validation schema
│   ├── repositories/
│   │   ├── user.repository.js   # User SQL queries
│   │   ├── task.repository.js   # Task SQL queries (search, filter, sort, pagination)
│   │   └── comment.repository.js # Comment SQL queries
│   ├── services/
│   │   ├── user.service.js      # User business logic
│   │   ├── task.service.js      # Task business logic & cascade handling
│   │   ├── dashboard.service.js # Metric aggregations & overdue calculations
│   │   └── external.service.js  # External API client with timeout & fallback
│   ├── routes/
│   │   ├── dashboard.routes.js  # GET /api/dashboard
│   │   ├── tasks.routes.js      # CRUD & comment endpoints for tasks
│   │   ├── users.routes.js      # User management endpoints
│   │   └── external.routes.js   # External API integration endpoint
│   ├── utils/
│   │   ├── constants.js         # Statuses, priorities, roles, pagination limits
│   │   ├── logger.js            # HTTP request logger
│   │   ├── errorHandler.js      # Centralized error handler
│   │   └── seeder.js            # Database seeder
│   ├── tests/
│   │   └── api.test.js          # Automated endpoint integration test suite
│   ├── .env.example
│   ├── server.js                # Express app entrypoint
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Atomic reusable UI components (Button, Modal, Table, etc.)
│   │   │   ├── layout/          # Layout, Sidebar, Header with Active User switcher
│   │   │   ├── dashboard/       # StatCard, TaskDistribution, RecentActivity
│   │   │   └── tasks/           # TaskTable, TaskFilters, TaskModal, TaskDetailDrawer, CommentSection
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx     # Overview dashboard
│   │   │   ├── TasksPage.jsx         # Full task backlog & filters
│   │   │   ├── TaskDetailPage.jsx    # Standalone task detail view
│   │   │   └── ExternalUsersPage.jsx # External team sync directory
│   │   ├── services/            # Axios API abstraction layer
│   │   ├── context/             # UserContext and ToastContext
│   │   ├── hooks/               # useTasks, useDebounce
│   │   ├── utils/               # formatters, constants
│   │   ├── App.jsx              # Main App router
│   │   └── index.css            # Tailwind CSS & design tokens
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── seed_data.json               # Seed dataset with 5 users, 16 tasks, 10 comments
└── README.md
```

---

## ⚡ Quickstart Guide

### Prerequisites
- **Node.js**: v18+ (tested on Node v26)
- **PostgreSQL**: PostgreSQL 14+ installed

### 1. Database Setup
If using the bundled local PostgreSQL cluster:
```bash
# Start local PostgreSQL cluster
cd backend
npm run db:start

# (Optional) Verify PostgreSQL is accepting connections
npm run db:status
```

### 2. Backend Setup & Seeding
```bash
cd backend
npm install

# Seed the database with 5 users, 16 tasks, and 10 comments
npm run seed

# Run the automated backend integration test suite
npm run test

# Start the Express server on http://localhost:8000
npm start
# Or for dev mode with auto-reload:
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start the Vite development server on http://localhost:5173
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=8000
DATABASE_URL=postgresql://postgres@localhost:5432/task_dashboard
NODE_ENV=development
```

---

## 📡 REST API Reference

### Health Check
- `GET /health` — Returns server health status.

### 1. Dashboard Metrics
- **`GET /api/dashboard?user_id={id}`**
  - **Query Params:** `user_id` (optional, calculates `assigned_to_me` for specified user).
  - **Returns:** Total tasks, pending, in_progress, completed, blocked, overdue count, completion rate %, status distribution, priority distribution, overdue task items, and recent tasks.

### 2. Tasks CRUD & Filtering
- **`GET /api/tasks`**
  - **Query Parameters:**
    - `status`: `pending` | `in_progress` | `completed` | `blocked`
    - `priority`: `low` | `medium` | `high` | `urgent`
    - `assignee`: User ID integer or `unassigned`
    - `search`: Searches across task `title` and `description` (case-insensitive)
    - `page`: Page number (default: 1)
    - `limit`: Items per page (default: 10, max: 100)
    - `sort_by`: `created_at` | `updated_at` | `due_date` | `title` | `priority` | `status`
    - `order`: `asc` | `desc`
  - **Returns:** `{ success: true, data: [...], pagination: { total, page, limit, total_pages, has_next_page, has_prev_page } }`

- **`GET /api/tasks/:id`**
  - **Returns:** Single task with assignee details and chronological array of `comments`.

- **`POST /api/tasks`**
  - **Payload:**
    ```json
    {
      "title": "Migrate database indexes",
      "description": "Optimize high-traffic query benchmarks",
      "status": "pending",
      "priority": "high",
      "assigned_to": 1,
      "due_date": "2026-08-25T00:00:00.000Z"
    }
    ```
  - **Validation:** `title` is required (min 3 chars). Returns `400 Bad Request` on validation failure.

- **`PUT /api/tasks/:id`**
  - **Payload:** Updates any task fields (`title`, `description`, `status`, `priority`, `assigned_to`, `due_date`).

- **`PATCH /api/tasks/:id/status`**
  - **Payload:** `{ "status": "completed" }`
  - **Returns:** Updated task object.

- **`DELETE /api/tasks/:id`**
  - **Returns:** Cascades and deletes associated comments and returns confirmation.

- **`POST /api/tasks/:id/comments`**
  - **Payload:** `{ "user_id": 1, "comment": "Note text" }`
  - **Returns:** Created comment with user metadata and timestamp.

### 3. Users Management
- **`GET /api/users`** — Returns list of team members.
- **`POST /api/users`** — Creates new user (`{ "name": "...", "email": "...", "role": "Member" }`).

### 4. External Integration
- **`GET /api/external/users`** — Connects to external API with 5s timeout and fallback cache, returning mapped enterprise team profiles.

---

## 🧪 Testing & Verification

Run the full end-to-end integration test suite:
```bash
cd backend
npm test
```

### Verified Test Cases:
1. `GET /health` (200 OK)
2. `GET /api/dashboard` (Metrics, overdue counts, distributions)
3. `GET /api/users` & `POST /api/users` (Seeding & user creation)
4. `GET /api/tasks?page=1&limit=5` (SQL-level pagination boundaries)
5. `GET /api/tasks?status=in_progress` & `GET /api/tasks?priority=urgent` (Filtering)
6. `GET /api/tasks?search=database` (Case-insensitive keyword search)
7. `POST /api/tasks` validation error handling (Missing title yields 400 with details)
8. `POST /api/tasks`, `GET /api/tasks/:id`, `PUT /api/tasks/:id`, `PATCH /api/tasks/:id/status`
9. `POST /api/tasks/:id/comments` (Comment timeline thread)
10. `DELETE /api/tasks/:id` (Cascading delete & 404 verification)
11. `GET /api/external/users` (Resilient external API integration)
12. Frontend production bundle build (`npm run build`)
