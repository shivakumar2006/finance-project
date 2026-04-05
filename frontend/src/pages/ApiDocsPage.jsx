import { useState } from "react";
import { useNavigate } from "react-router-dom";

const methodColors = {
    GET: { bg: "rgba(34,197,94,0.12)", color: "#22c55e", border: "rgba(34,197,94,0.25)" },
    POST: { bg: "rgba(74,144,217,0.12)", color: "#4a90d9", border: "rgba(74,144,217,0.25)" },
    PUT: { bg: "rgba(212,175,55,0.12)", color: "#d4af37", border: "rgba(212,175,55,0.25)" },
    DELETE: { bg: "rgba(239,68,68,0.12)", color: "#ef4444", border: "rgba(239,68,68,0.25)" },
};

const apiGroups = [
    {
        group: "Authentication",
        icon: "🔐",
        color: "#22c55e",
        desc: "Register and login endpoints. No auth required.",
        endpoints: [
            {
                method: "POST", path: "/api/v1/auth/register",
                desc: "Register a new user. Role must be one of: viewer, analyst, admin.",
                auth: false, roles: "Public",
                body: `{
  "name": "Shiva Kumar",
  "email": "shiva@demo.com",
  "password": "secret123",
  "role": "analyst"
}`,
                response: `{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716",
    "name": "Shiva Kumar",
    "email": "shiva@demo.com",
    "role": "analyst",
    "status": "active",
    "created_at": "2025-01-01T00:00:00Z"
  }
}`,
            },
            {
                method: "POST", path: "/api/v1/auth/login",
                desc: "Login with email and password. Returns JWT token with role embedded in claims.",
                auth: false, roles: "Public",
                body: `{
  "email": "shiva@demo.com",
  "password": "secret123"
}`,
                response: `{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "role": "analyst", ... }
}`,
            },
        ],
    },
    {
        group: "Transactions",
        icon: "💳",
        color: "#4a90d9",
        desc: "Financial records CRUD. Create and modify restricted to Admin.",
        endpoints: [
            {
                method: "GET", path: "/api/v1/transactions",
                desc: "List all transactions. Supports filtering by type, category, date range and pagination.",
                auth: true, roles: "All roles",
                query: "?type=income&category=Salary&start_date=2025-01-01&end_date=2025-12-31&page=1&limit=10",
                response: `{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "amount": 50000,
      "type": "income",
      "category": "Salary",
      "date": "2025-01-01",
      "notes": "Monthly salary",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 10,
  "total_pages": 5
}`,
            },
            {
                method: "GET", path: "/api/v1/transactions/:id",
                desc: "Get a single transaction by UUID.",
                auth: true, roles: "All roles",
                response: `{
  "id": "550e8400-e29b-41d4-a716",
  "amount": 50000,
  "type": "income",
  "category": "Salary",
  "date": "2025-01-01T00:00:00Z",
  "notes": "Monthly salary"
}`,
            },
            {
                method: "POST", path: "/api/v1/transactions",
                desc: "Create a new transaction. Amount must be > 0. Date format: YYYY-MM-DD.",
                auth: true, roles: "Admin only",
                body: `{
  "amount": 50000,
  "type": "income",
  "category": "Salary",
  "date": "2025-01-01",
  "notes": "January salary"
}`,
                response: `{
  "id": "uuid",
  "user_id": "uuid",
  "amount": 50000,
  "type": "income",
  "category": "Salary",
  "date": "2025-01-01T00:00:00Z",
  "created_at": "2025-01-15T10:30:00Z"
}`,
            },
            {
                method: "PUT", path: "/api/v1/transactions/:id",
                desc: "Update an existing transaction. All fields are optional — only send what you want to change.",
                auth: true, roles: "Admin only",
                body: `{
  "amount": 55000,
  "notes": "Updated salary with bonus"
}`,
                response: `{
  "id": "uuid",
  "amount": 55000,
  "notes": "Updated salary with bonus",
  "updated_at": "2025-01-16T09:00:00Z"
}`,
            },
            {
                method: "DELETE", path: "/api/v1/transactions/:id",
                desc: "Permanently delete a transaction. Returns 204 on success.",
                auth: true, roles: "Admin only",
                response: `204 No Content`,
            },
        ],
    },
    {
        group: "Dashboard",
        icon: "📊",
        color: "#8b5cf6",
        desc: "Analytics and summary endpoints. Trends and categories restricted to Analyst+.",
        endpoints: [
            {
                method: "GET", path: "/api/v1/dashboard",
                desc: "Full financial summary including totals, recent activity, category breakdown, and monthly trends.",
                auth: true, roles: "All roles",
                response: `{
  "total_income": 250000.00,
  "total_expenses": 80000.00,
  "net_balance": 170000.00,
  "category_totals": [
    { "category": "Salary", "type": "income", "total": 150000 },
    { "category": "Rent", "type": "expense", "total": 30000 }
  ],
  "recent_activity": [ ... ],
  "monthly_trends": [ ... ]
}`,
            },
            {
                method: "GET", path: "/api/v1/dashboard/trends",
                desc: "Monthly income vs expense breakdown for the last 12 months. Useful for trend charts.",
                auth: true, roles: "Analyst + Admin",
                response: `{
  "data": [
    {
      "month": "2025-05",
      "income": 50000.00,
      "expense": 15000.00,
      "net": 35000.00
    },
    {
      "month": "2025-04",
      "income": 50000.00,
      "expense": 18000.00,
      "net": 32000.00
    }
  ]
}`,
            },
            {
                method: "GET", path: "/api/v1/dashboard/categories",
                desc: "Total amount grouped by category and type. Used for pie/donut charts.",
                auth: true, roles: "Analyst + Admin",
                response: `{
  "data": [
    { "category": "Salary", "type": "income", "total": 150000.00 },
    { "category": "Freelance", "type": "income", "total": 45000.00 },
    { "category": "Rent", "type": "expense", "total": 30000.00 },
    { "category": "Food", "type": "expense", "total": 12000.00 }
  ]
}`,
            },
        ],
    },
    {
        group: "Users",
        icon: "👥",
        color: "#f97316",
        desc: "User management. All endpoints restricted to Admin only.",
        endpoints: [
            {
                method: "GET", path: "/api/v1/users",
                desc: "List all registered users with their role and status.",
                auth: true, roles: "Admin only",
                response: `{
  "data": [
    {
      "id": "uuid",
      "name": "Shiva Kumar",
      "email": "shiva@demo.com",
      "role": "analyst",
      "status": "active",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}`,
            },
            {
                method: "GET", path: "/api/v1/users/:id",
                desc: "Get a single user by UUID.",
                auth: true, roles: "Admin only",
                response: `{
  "id": "uuid",
  "name": "Shiva Kumar",
  "email": "shiva@demo.com",
  "role": "analyst",
  "status": "active"
}`,
            },
            {
                method: "PUT", path: "/api/v1/users/:id",
                desc: "Update a user's role or status. Use status: inactive to deactivate without deleting.",
                auth: true, roles: "Admin only",
                body: `{
  "role": "admin",
  "status": "active"
}`,
                response: `{
  "id": "uuid",
  "name": "Shiva Kumar",
  "role": "admin",
  "status": "active",
  "updated_at": "2025-01-16T09:00:00Z"
}`,
            },
            {
                method: "DELETE", path: "/api/v1/users/:id",
                desc: "Permanently delete a user and their associated data.",
                auth: true, roles: "Admin only",
                response: `{
  "message": "user deleted successfully"
}`,
            },
        ],
    },
];

const errorCodes = [
    { code: "200", label: "OK", desc: "Request succeeded", color: "#22c55e" },
    { code: "201", label: "Created", desc: "Resource created successfully", color: "#22c55e" },
    { code: "204", label: "No Content", desc: "Success with no response body (DELETE)", color: "#22c55e" },
    { code: "400", label: "Bad Request", desc: "Invalid input or missing required fields", color: "#f97316" },
    { code: "401", label: "Unauthorized", desc: "Missing or invalid JWT token", color: "#ef4444" },
    { code: "403", label: "Forbidden", desc: "Valid token but insufficient role permissions", color: "#ef4444" },
    { code: "404", label: "Not Found", desc: "Resource does not exist", color: "#8b5cf6" },
    { code: "429", label: "Too Many Requests", desc: "Rate limit exceeded, slow down", color: "#d4af37" },
    { code: "500", label: "Server Error", desc: "Internal server error", color: "#ef4444" },
];

function MethodBadge({ method }) {
    const c = methodColors[method] || methodColors.GET;
    return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0" style={{
            background: c.bg, color: c.color, border: `1px solid ${c.border}`,
            fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em",
            minWidth: "64px", textAlign: "center",
        }}>{method}</span>
    );
}

function CodeBlock({ code }) {
    return (
        <pre className="rounded-xl p-4 overflow-x-auto text-xs leading-relaxed" style={{
            background: "rgba(6,4,1,0.9)", border: "1px solid rgba(212,175,55,0.08)",
            color: "#8a7340", fontFamily: "'DM Mono', monospace",
        }}>{code}</pre>
    );
}

function EndpointCard({ ep }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="rounded-xl border overflow-hidden transition-all duration-200" style={{
            borderColor: open ? "rgba(212,175,55,0.2)" : "rgba(212,175,55,0.07)",
            background: open ? "rgba(15,10,3,0.95)" : "rgba(10,7,1,0.7)",
        }}>
            <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-4 px-5 py-4 text-left">
                <MethodBadge method={ep.method} />
                <code className="flex-1 text-sm" style={{ color: "#c4a55a", fontFamily: "'DM Mono', monospace" }}>
                    {ep.path}
                    {ep.query && <span style={{ color: "#2a2010" }}>{ep.query}</span>}
                </code>
                <span className="text-xs hidden md:block max-w-xs truncate" style={{ color: "#3a2e14", fontFamily: "'DM Sans', sans-serif" }}>
                    {ep.desc}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                    {ep.auth ? (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{
                            background: "rgba(212,175,55,0.08)", color: "#5c4a22",
                            fontFamily: "'DM Mono', monospace", fontSize: "10px",
                        }}>🔐 JWT</span>
                    ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{
                            background: "rgba(34,197,94,0.08)", color: "#22c55e",
                            fontFamily: "'DM Mono', monospace", fontSize: "10px",
                        }}>Public</span>
                    )}
                    <span style={{ color: "#3a2e14", fontSize: "12px", transition: "transform 0.2s", display: "inline-block", transform: open ? "rotate(180deg)" : "none" }}>▾</span>
                </div>
            </button>

            {open && (
                <div className="px-5 pb-5 space-y-4 border-t" style={{ borderColor: "rgba(212,175,55,0.07)" }}>
                    <div className="flex flex-wrap gap-6 pt-4">
                        <div>
                            <p style={{ color: "#3a2e14", fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", marginBottom: "4px" }}>DESCRIPTION</p>
                            <p style={{ color: "#6b5a30", fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}>{ep.desc}</p>
                        </div>
                        <div>
                            <p style={{ color: "#3a2e14", fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", marginBottom: "4px" }}>ACCESS</p>
                            <p style={{ color: "#8a7340", fontFamily: "'DM Mono', monospace", fontSize: "12px" }}>{ep.roles}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ep.body && (
                            <div>
                                <p style={{ color: "#3a2e14", fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", marginBottom: "8px" }}>REQUEST BODY</p>
                                <CodeBlock code={ep.body} />
                            </div>
                        )}
                        {ep.response && (
                            <div>
                                <p style={{ color: "#3a2e14", fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", marginBottom: "8px" }}>RESPONSE</p>
                                <CodeBlock code={ep.response} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function Navbar() {
    const navigate = useNavigate();
    return (
        <nav className="sticky top-0 z-20 flex items-center justify-between px-8 py-4 border-b"
            style={{ background: "rgba(6,4,1,0.95)", backdropFilter: "blur(20px)", borderColor: "rgba(212,175,55,0.08)" }}>
            <div className="flex items-center gap-6">
                <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ background: "linear-gradient(135deg, #d4af37, #8a7340)", color: "#060401", fontFamily: "'Playfair Display', serif" }}>F</div>
                    <span style={{ color: "#d4af37", fontFamily: "'Playfair Display', serif", fontSize: "1rem" }}>FinanceOS</span>
                </button>
                <span style={{ color: "#2a2010" }}>›</span>
                <span style={{ color: "#5c4a22", fontFamily: "'DM Mono', monospace", fontSize: "12px" }}>API Reference</span>
            </div>
            <div className="flex items-center gap-4">
                {[{ label: "Features", path: "/features" }, { label: "Roles", path: "/roles" }].map((l) => (
                    <button key={l.path} onClick={() => navigate(l.path)}
                        style={{ color: "#3a2e14", fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.08em" }}
                        className="hover:opacity-80 transition-opacity">{l.label}</button>
                ))}
                <button onClick={() => navigate("/signup")}
                    className="px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #d4af37, #b8963e)", color: "#060401", fontFamily: "'DM Sans', sans-serif" }}>
                    Get Started
                </button>
            </div>
        </nav>
    );
}

export default function ApiDocsPage() {
    const navigate = useNavigate();
    const [activeGroup, setActiveGroup] = useState("Authentication");

    return (
        <div className="min-h-screen" style={{ background: "#060401", fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse-gold { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
        .group-content { animation: fadeIn 0.3s ease forwards; }
      `}</style>

            <div className="fixed inset-0 pointer-events-none" style={{
                backgroundImage: `linear-gradient(rgba(212,175,55,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.025) 1px, transparent 1px)`,
                backgroundSize: "60px 60px",
            }} />
            <div className="fixed pointer-events-none" style={{
                width: 500, height: 500, top: 100, left: -150, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)",
                filter: "blur(40px)", animation: "pulse-gold 8s ease-in-out infinite",
            }} />

            <Navbar />

            {/* Hero */}
            <div className="relative text-center px-8 py-14 border-b" style={{ borderColor: "rgba(212,175,55,0.08)" }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
                    style={{ borderColor: "rgba(212,175,55,0.2)", background: "rgba(212,175,55,0.04)" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#d4af37" }} />
                    <span className="text-xs tracking-[0.15em] uppercase" style={{ color: "#8a7340", fontFamily: "'DM Mono', monospace" }}>
                        REST API · v1.0
                    </span>
                </div>
                <h1 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    color: "#e8d5a3", lineHeight: 1.1, marginBottom: "16px",
                    textShadow: "0 0 60px rgba(212,175,55,0.15)",
                }}>
                    API <em style={{ color: "#d4af37" }}>Reference</em>
                </h1>
                <p className="max-w-lg mx-auto mb-8" style={{ color: "#4a3a18", fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", lineHeight: 1.6 }}>
                    All 13 endpoints documented with request bodies, responses and access control.
                </p>

                {/* Base URL */}
                <div className="inline-flex items-center gap-4 px-5 py-3 rounded-xl border" style={{
                    borderColor: "rgba(212,175,55,0.15)", background: "rgba(212,175,55,0.04)",
                }}>
                    <span style={{ color: "#3a2e14", fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.1em" }}>BASE URL</span>
                    <code style={{ color: "#d4af37", fontFamily: "'DM Mono', monospace", fontSize: "14px" }}>
                        http://localhost:8080/api/v1
                    </code>
                </div>
            </div>

            {/* Main layout — sidebar + content */}
            <div className="flex max-w-7xl mx-auto">

                {/* Left sidebar — groups */}
                <aside className="hidden lg:block w-64 shrink-0 sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto border-r py-8 px-6"
                    style={{ borderColor: "rgba(212,175,55,0.06)" }}>
                    <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "#3a2e14", fontFamily: "'DM Mono', monospace" }}>Endpoints</p>
                    <div className="space-y-1">
                        {apiGroups.map((g) => (
                            <button
                                key={g.group}
                                onClick={() => setActiveGroup(g.group)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
                                style={{
                                    background: activeGroup === g.group ? "rgba(212,175,55,0.08)" : "transparent",
                                    borderLeft: activeGroup === g.group ? `2px solid ${g.color}` : "2px solid transparent",
                                }}
                            >
                                <span>{g.icon}</span>
                                <div>
                                    <p style={{ color: activeGroup === g.group ? g.color : "#5c4a22", fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}>{g.group}</p>
                                    <p style={{ color: "#2a2010", fontFamily: "'DM Mono', monospace", fontSize: "10px" }}>{g.endpoints.length} endpoints</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Auth info */}
                    <div className="mt-8 p-4 rounded-xl border" style={{ borderColor: "rgba(212,175,55,0.08)", background: "rgba(212,175,55,0.02)" }}>
                        <p className="text-xs tracking-[0.1em] uppercase mb-2" style={{ color: "#3a2e14", fontFamily: "'DM Mono', monospace" }}>Auth Header</p>
                        <code className="text-xs break-all" style={{ color: "#5c4a22", fontFamily: "'DM Mono', monospace" }}>
                            Authorization: Bearer {"{token}"}
                        </code>
                    </div>
                </aside>

                {/* Right — endpoint list */}
                <main className="flex-1 px-8 py-10 min-w-0">
                    {apiGroups.map((g) => (
                        activeGroup === g.group && (
                            <div key={g.group} className="group-content">
                                {/* Group header */}
                                <div className="flex items-start gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                                        style={{ background: `${g.color}15`, border: `1px solid ${g.color}25` }}>
                                        {g.icon}
                                    </div>
                                    <div>
                                        <h2 style={{ color: "#e8d5a3", fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", marginBottom: "4px" }}>{g.group}</h2>
                                        <p style={{ color: "#3a2e14", fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}>{g.desc}</p>
                                    </div>
                                </div>

                                {/* Mobile group tabs */}
                                <div className="flex gap-2 flex-wrap mb-6 lg:hidden">
                                    {apiGroups.map((ag) => (
                                        <button key={ag.group} onClick={() => setActiveGroup(ag.group)}
                                            className="px-3 py-1.5 rounded-lg text-xs"
                                            style={{
                                                background: activeGroup === ag.group ? `${ag.color}15` : "rgba(212,175,55,0.04)",
                                                color: activeGroup === ag.group ? ag.color : "#3a2e14",
                                                border: `1px solid ${activeGroup === ag.group ? ag.color + "30" : "rgba(212,175,55,0.08)"}`,
                                                fontFamily: "'DM Mono', monospace",
                                            }}>{ag.group}</button>
                                    ))}
                                </div>

                                <div className="space-y-3">
                                    {g.endpoints.map((ep) => (
                                        <EndpointCard key={ep.path + ep.method} ep={ep} />
                                    ))}
                                </div>
                            </div>
                        )
                    ))}

                    {/* HTTP Status Codes */}
                    <div className="mt-14">
                        <div className="mb-6">
                            <p className="text-xs tracking-[0.25em] uppercase mb-2" style={{ color: "#5c4a22", fontFamily: "'DM Mono', monospace" }}>Reference</p>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#e8d5a3" }}>
                                HTTP Status <em style={{ color: "#d4af37" }}>Codes</em>
                            </h2>
                        </div>
                        <div className="rounded-2xl border overflow-hidden" style={{
                            borderColor: "rgba(212,175,55,0.1)",
                            background: "linear-gradient(135deg, rgba(15,10,3,0.95) 0%, rgba(20,14,4,0.9) 100%)",
                        }}>
                            {errorCodes.map((e, i) => (
                                <div key={e.code}
                                    className="flex items-center gap-6 px-6 py-3.5 transition-colors hover:bg-amber-900/5"
                                    style={{ borderBottom: i < errorCodes.length - 1 ? "1px solid rgba(212,175,55,0.04)" : "none" }}>
                                    <span className="font-bold shrink-0 w-10" style={{ color: e.color, fontFamily: "'DM Mono', monospace", fontSize: "14px" }}>{e.code}</span>
                                    <span className="shrink-0 w-32" style={{ color: e.color, fontFamily: "'DM Mono', monospace", fontSize: "12px", opacity: 0.8 }}>{e.label}</span>
                                    <span style={{ color: "#4a3a18", fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}>{e.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Error response format */}
                    <div className="mt-8 p-6 rounded-2xl border" style={{ borderColor: "rgba(212,175,55,0.1)", background: "rgba(212,175,55,0.02)" }}>
                        <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "#3a2e14", fontFamily: "'DM Mono', monospace" }}>Error Response Format</p>
                        <CodeBlock code={`{
  "error": "descriptive error message here"
}`} />
                        <p className="mt-3 text-xs" style={{ color: "#3a2e14", fontFamily: "'DM Sans', sans-serif" }}>
                            All errors follow this consistent format — check the error field for the reason.
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-2xl border"
                        style={{ borderColor: "rgba(212,175,55,0.12)", background: "rgba(212,175,55,0.02)" }}>
                        <div>
                            <h3 style={{ color: "#e8d5a3", fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "6px" }}>
                                Ready to <em style={{ color: "#d4af37" }}>get started?</em>
                            </h3>
                            <p style={{ color: "#3a2e14", fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}>
                                Create an account and start building.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => navigate("/roles")}
                                className="px-5 py-3 rounded-xl text-sm border transition-all hover:border-amber-600/40"
                                style={{ color: "#8a7340", borderColor: "rgba(212,175,55,0.2)", fontFamily: "'DM Mono', monospace", fontSize: "12px" }}>
                                View Roles →
                            </button>
                            <button onClick={() => navigate("/signup")}
                                className="px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                                style={{ background: "linear-gradient(135deg, #d4af37, #b8963e)", color: "#060401", fontFamily: "'DM Sans', sans-serif" }}>
                                Get Started →
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            <footer className="border-t px-8 py-6 flex items-center justify-between flex-wrap gap-4" style={{ borderColor: "rgba(212,175,55,0.08)" }}>
                <span style={{ color: "#2a2010", fontFamily: "'DM Mono', monospace", fontSize: "11px" }}>FinanceOS © 2025 · 13 Endpoints · REST API</span>
                <div className="flex gap-6">
                    {[{ label: "Features", path: "/features" }, { label: "Roles", path: "/roles" }, { label: "Home", path: "/" }].map((l) => (
                        <button key={l.path} onClick={() => navigate(l.path)}
                            style={{ color: "#2a2010", fontFamily: "'DM Mono', monospace", fontSize: "11px" }}>{l.label}</button>
                    ))}
                </div>
            </footer>
        </div>
    );
}