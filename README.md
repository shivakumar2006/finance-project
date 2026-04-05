# FinanceOS — Finance Data Processing and Access Control Backend

A full-stack finance dashboard system with role-based access control, built with **Go**, **PostgreSQL**, and **React**. Features JWT authentication, three-tier RBAC, financial records management, and real-time dashboard analytics.

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
│   │   ├── auth.go
│   │   ├── user.go
│   │   ├── transaction.go
│   │   └── dashboard.go
│   ├── services/                # Business logic
│   │   ├── auth.go
│   │   ├── user.go
│   │   ├── transaction.go
│   │   └── dashboard.go
│   ├── repository/              # DB queries
│   │   ├── auth.go
│   │   ├── user.go
│   │   ├── transaction.go
│   │   └── dashboard.go
│   ├── middleware/
│   │   ├── auth.go              # JWT verification
│   │   └── ratelimiter.go       # Token bucket per IP
│   └── models/                  # Structs + request types
│       ├── user.go
│       ├── transaction.go
│       ├── auth.go
│       └── dashboard.go
├── .env.example
├── Dockerfile
├── docker-compose.yml
└── README.md

finance-frontend/
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── FeaturesPage.jsx
│   │   ├── RolesPage.jsx
│   │   └── ApiDocsPage.jsx
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── StatsCards.jsx
│   │   ├── TrendsChart.jsx
│   │   ├── CategoryChart.jsx
│   │   ├── TransactionTable.jsx
│   │   ├── TransactionForm.jsx
│   │   └── UserTable.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
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

RBAC is enforced at the **middleware level** — not just the UI. Even direct API calls will return `403 Forbidden` if the role doesn't match.

---

## 🚀 Quick Start

### Option 1 — Docker (Recommended)

```bash
# Clone the repo
git clone https://github.com/shivakumar2006/finance-backend.git
cd finance-backend

# Copy env file
cp .env.example .env

# Run everything
docker-compose up --build
```

That's it. Backend on `http://localhost:8080`, Frontend on `http://localhost:3000`.

---

### Option 2 — Local Setup

**Prerequisites:**
- Go 1.22+
- PostgreSQL 15+
- Node.js 18+

**Backend:**

```bash
# Clone and enter
git clone https://github.com/shivakumar2006/finance-backend.git
cd finance-backend

# Copy and fill env
cp .env.example .env

# Create database
psql -U postgres -c "CREATE DATABASE finance_db;"

# Run schema
psql -U postgres -d finance_db -f db/schema.sql

# Install dependencies
go mod tidy

# Run server
go run cmd/main.go
```

**Frontend:**

```bash
cd finance-frontend

# Install dependencies
yarn install

# Run dev server
yarn dev
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
# App
APP_PORT=8080
APP_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=finance_db
DB_SSLMODE=disable

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRY=24h

# Bcrypt
BCRYPT_COST=12
```

> ⚠️ Change `JWT_SECRET` to a strong random string in production.

---

## 🌱 Seed Data

Create demo users and transactions in one command:

```bash
chmod +x scripts/seed.sh
./scripts/seed.sh
```

**Demo credentials (after seeding):**

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
| POST | `/transactions` | Admin |
| PUT | `/transactions/:id` | Admin |
| DELETE | `/transactions/:id` | Admin |

**Query params for listing:**
```
?type=income
?category=Salary
?start_date=2025-01-01
?end_date=2025-12-31
?page=1&limit=10
```

### Dashboard

| Method | Endpoint | Access |
|---|---|---|
| GET | `/dashboard` | All roles |
| GET | `/dashboard/trends` | Analyst + Admin |
| GET | `/dashboard/categories` | Analyst + Admin |

### Users

| Method | Endpoint | Access |
|---|---|---|
| GET | `/users` | Admin |
| GET | `/users/:id` | Admin |
| PUT | `/users/:id` | Admin |
| DELETE | `/users/:id` | Admin |

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

# Create transaction (admin)
curl -X POST http://localhost:8080/api/v1/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"amount":50000,"type":"income","category":"Salary","date":"2025-01-01","notes":"Monthly salary"}'

# Get dashboard
curl http://localhost:8080/api/v1/dashboard \
  -H "Authorization: Bearer <token>"

# List transactions with filters
curl "http://localhost:8080/api/v1/transactions?type=income&page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

---

## 🔒 Security

- **JWT** — Role embedded in claims, verified on every request via middleware
- **bcrypt** — Password hashing with cost factor 12
- **Rate Limiting** — Token bucket per IP: 10 req/sec globally, 3 req/sec on auth routes
- **Input Validation** — Validated at both handler and service layer
- **Error Messages** — Intentionally vague on auth failures (prevents user enumeration)

---

## 📊 Dashboard Analytics

The `/dashboard` endpoint returns aggregated data computed via PostgreSQL:

- **Total Income** — `SUM` of all income transactions
- **Total Expenses** — `SUM` of all expense transactions
- **Net Balance** — `income - expenses`
- **Category Totals** — `GROUP BY category, type`
- **Recent Activity** — Last 5 transactions by `created_at`
- **Monthly Trends** — 12-month `GROUP BY TO_CHAR(date, 'YYYY-MM')`

---

## 🧠 Assumptions Made

1. **Role assignment at registration** — Any role can be assigned at signup. In a real system, only admins would assign roles.
2. **Soft delete not implemented** — Users and transactions are hard deleted. Can be added with a `deleted_at` column.
3. **No refresh tokens** — JWT expires in 24h. User must re-login after expiry.
4. **Single currency** — All amounts assumed to be in INR (₹).
5. **No file uploads** — Transaction notes are text only.

---

## 🐳 Docker

```bash
# Build and run everything
docker-compose up --build

# Run in background
docker-compose up -d

# Stop
docker-compose down

# Stop and remove volumes (clears DB)
docker-compose down -v

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 📝 License

Built for assessment purposes. MIT License.
