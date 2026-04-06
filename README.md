# FinanceOS — Finance Data Processing and Access Control Backend

A full-stack finance dashboard system with role-based access control, built with **Go**, **PostgreSQL**, and **React**. Features JWT authentication, three-tier RBAC, financial records management, and real-time dashboard analytics.

> 🐳 Docker images published on Docker Hub — no local setup required.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Go 1.22, Chi Router v5 |
| Database | PostgreSQL 15 |
| Auth | JWT (golang-jwt/jwt v5) + bcrypt |
| Frontend | React 18, Tailwind CSS v3 |
| Charts | Recharts |
| Container | Docker + Docker Compose |

---

## 🏗️ Architecture

```
MVC-style Monolith — clean layer separation

HTTP Request
    ↓
Rate Limiter Middleware
    ↓
JWT Auth Middleware
    ↓
Role Check Middleware (RBAC)
    ↓
Handler  →  Service  →  Repository  →  PostgreSQL
```

### Project Structure

```
finance-backend/
├── cmd/
│   └── main.go                  # Entry point, DI wiring
├── config/
│   └── config.go                # Env config loader
├── db/
│   ├── postgres.go              # DB connection + pool
│   └── schema.sql               # Table definitions
├── internal/
│   ├── handlers/                # HTTP layer
│   ├── services/                # Business logic
│   ├── repository/              # DB queries
│   ├── middleware/              # JWT + Rate limiter
│   └── models/                  # Structs + request types
├── .env.example
├── Dockerfile
├── docker-compose.yml
└── README.md

finance-frontend/
├── src/
│   ├── pages/                   # HomePage, Login, Signup, Dashboard, Docs
│   ├── components/              # Sidebar, Charts, Tables, Forms
│   ├── App.jsx
│   └── main.jsx
├── Dockerfile
└── nginx.conf
```

---

## 👥 Role-Based Access Control

| Action | Viewer | Analyst | Admin |
|---|:---:|:---:|:---:|
| View dashboard summary | ✓ | ✓ | ✓ |
| Browse transactions | ✓ | ✓ | ✓ |
| Filter transactions | ✓ | ✓ | ✓ |
| Monthly trends | ✗ | ✓ | ✓ |
| Category breakdown | ✗ | ✓ | ✓ |
| Create transaction | ✗ | ✗ | ✓ |
| Edit transaction | ✗ | ✗ | ✓ |
| Delete transaction | ✗ | ✗ | ✓ |
| View users | ✗ | ✗ | ✓ |
| Manage users | ✗ | ✗ | ✓ |

RBAC is enforced at the **middleware level** — not just the UI. Even direct API calls return `403 Forbidden` if the role does not match.

---

## 🚀 Quick Start

### Option 1 — Docker Hub (Fastest, no build needed)

> Requires only Docker Desktop. No Go, Node, or PostgreSQL needed locally.

```bash
# 1. Clone repo (for docker-compose.yml)
git clone https://github.com/shivakumar2006/finance-backend.git
cd finance-backend

# 2. Run — pulls images from Docker Hub automatically
docker-compose up -d
```

**Running in seconds:**
- 🌐 Frontend → http://localhost:5173
- ⚡ Backend API → http://localhost:8080
- ❤️ Health check → http://localhost:8080/health

**Docker Hub Images:**
- `shivakumar2006/finance-backend:latest`
- `shivakumar2006/finance-frontend:latest`

---

### Option 2 — Build from Source

```bash
git clone https://github.com/shivakumar2006/finance-backend.git
cd finance-backend
docker-compose up --build -d
```

---

### Option 3 — Local Setup (without Docker)

**Prerequisites:** Go 1.22+, PostgreSQL 15+, Node.js 18+

**Backend:**
```bash
cp .env.example .env
psql -U postgres -c "CREATE DATABASE finance_db;"
psql -U postgres -d finance_db -f db/schema.sql
go mod tidy
go run cmd/main.go
```

**Frontend:**
```bash
cd finance-frontend
yarn install
yarn dev
```

---

## 🐳 Docker Commands

```bash
# Start (pulls from Docker Hub automatically)
docker-compose up -d

# Build from source
docker-compose up --build -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop
docker-compose down

# Stop + clear database
docker-compose down -v

# Update to latest images
docker-compose pull && docker-compose up -d
```

> ⚠️ **Port conflict fix:** If port 5432 is already in use (local PostgreSQL running), remove the `ports` section under postgres in `docker-compose.yml` — the backend connects to it internally via service name anyway.

---

## ⚙️ Environment Variables

```env
APP_PORT=8080
APP_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=finance_db
DB_SSLMODE=disable
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRY=24h
BCRYPT_COST=12
```

> ⚠️ Always change `JWT_SECRET` in production.

---

## 🌱 Seed Data

```bash
chmod +x scripts/seed.sh
./scripts/seed.sh
```

**Demo credentials:**

| Role | Email | Password |
|---|---|---|
| Admin | admin@demo.com | password123 |
| Analyst | analyst@demo.com | password123 |
| Viewer | viewer@demo.com | password123 |

---

## 📡 API Reference

**Base URL:** `http://localhost:8080/api/v1`

**Auth header:** `Authorization: Bearer <token>`

### Authentication
| Method | Endpoint | Access |
|---|---|---|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |

### Transactions
| Method | Endpoint | Access |
|---|---|---|
| GET | `/transactions` | All roles |
| GET | `/transactions/:id` | All roles |
| POST | `/transactions` | Admin only |
| PUT | `/transactions/:id` | Admin only |
| DELETE | `/transactions/:id` | Admin only |

**Query params:** `?type=income&category=Salary&start_date=2025-01-01&page=1&limit=10`

### Dashboard
| Method | Endpoint | Access |
|---|---|---|
| GET | `/dashboard` | All roles |
| GET | `/dashboard/trends` | Analyst + Admin |
| GET | `/dashboard/categories` | Analyst + Admin |

### Users
| Method | Endpoint | Access |
|---|---|---|
| GET | `/users` | Admin only |
| GET | `/users/:id` | Admin only |
| PUT | `/users/:id` | Admin only |
| DELETE | `/users/:id` | Admin only |

### Sample Requests

```bash
# Register
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Shiva","email":"shiva@demo.com","password":"pass123","role":"admin"}'

# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"shiva@demo.com","password":"pass123"}'

# Create transaction
curl -X POST http://localhost:8080/api/v1/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"amount":50000,"type":"income","category":"Salary","date":"2025-01-01"}'

# Dashboard summary
curl http://localhost:8080/api/v1/dashboard \
  -H "Authorization: Bearer <token>"
```

---

## 🔒 Security

- **JWT** — Role embedded in claims, verified on every request via middleware
- **bcrypt** — Password hashing with cost factor 12
- **Rate Limiting** — Token bucket per IP: 10 req/sec globally, 3 req/sec on auth routes
- **Input Validation** — Validated at handler and service layer both
- **Error Messages** — Intentionally vague on auth failures (prevents user enumeration)

---

## 📊 Dashboard Analytics

All aggregations computed via PostgreSQL:

- **Total Income / Expenses** — `SUM` grouped by type
- **Net Balance** — `income - expenses`
- **Category Totals** — `GROUP BY category, type ORDER BY total DESC`
- **Recent Activity** — Last 5 transactions by `created_at`
- **Monthly Trends** — 12-month `GROUP BY TO_CHAR(date, 'YYYY-MM')`

---

## 🧠 Assumptions Made

1. **Role at registration** — Any role assignable at signup. In production, only admins would promote users.
2. **Hard delete** — No soft delete. Can be extended with `deleted_at` for audit trails.
3. **No refresh tokens** — JWT expires in 24h, user re-logs in after.
4. **Single currency** — All amounts in INR (₹).
5. **Single instance rate limiter** — Token bucket works per instance. Redis needed for multi-instance.

---

## 📝 License

Built for assessment purposes. MIT License.
