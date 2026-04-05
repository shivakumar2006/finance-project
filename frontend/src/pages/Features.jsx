import { useNavigate } from "react-router-dom";

const techStack = [
    { name: "Go", version: "1.22", role: "Backend Language", icon: "🐹", desc: "Compiled, statically typed, blazing fast" },
    { name: "Chi Router", version: "v5", role: "HTTP Router", icon: "⚡", desc: "Lightweight, idiomatic Go HTTP router" },
    { name: "PostgreSQL", version: "15", role: "Database", icon: "🐘", desc: "Relational DB with powerful aggregations" },
    { name: "JWT", version: "v5", role: "Authentication", icon: "🔐", desc: "Stateless auth with role claims embedded" },
    { name: "bcrypt", version: "—", role: "Password Hashing", icon: "🛡️", desc: "Adaptive hashing, cost factor 12" },
    { name: "React", version: "18", role: "Frontend", icon: "⚛️", desc: "Component-based UI with hooks" },
    { name: "Tailwind CSS", version: "v3", role: "Styling", icon: "🎨", desc: "Utility-first CSS framework" },
    { name: "Recharts", version: "latest", role: "Charts", icon: "📊", desc: "Composable charting built on D3" },
    { name: "Docker", version: "latest", role: "Containerization", icon: "🐳", desc: "One command setup with compose" },
];

const features = [
    {
        icon: "🔐",
        title: "JWT Authentication",
        desc: "Stateless auth with role embedded in claims. Token verified on every protected request via middleware.",
        tag: "Security",
        tagColor: "#22c55e",
    },
    {
        icon: "👥",
        title: "Role-Based Access Control",
        desc: "Three-tier RBAC — Viewer, Analyst, Admin. Enforced at middleware level, not just UI.",
        tag: "RBAC",
        tagColor: "#d4af37",
    },
    {
        icon: "💳",
        title: "Financial Records CRUD",
        desc: "Create, read, update, delete transactions with type, category, date, amount and notes.",
        tag: "Core",
        tagColor: "#4a90d9",
    },
    {
        icon: "📊",
        title: "Dashboard Analytics",
        desc: "Total income, expenses, net balance, category totals, recent activity — all via aggregated SQL.",
        tag: "Analytics",
        tagColor: "#8b5cf6",
    },
    {
        icon: "📈",
        title: "Monthly Trends",
        desc: "12-month income vs expense breakdown using PostgreSQL GROUP BY with TO_CHAR date formatting.",
        tag: "Analytics",
        tagColor: "#8b5cf6",
    },
    {
        icon: "🔍",
        title: "Filtering & Pagination",
        desc: "Dynamic SQL filtering by type, category, date range. Offset-based pagination with total count.",
        tag: "Core",
        tagColor: "#4a90d9",
    },
    {
        icon: "⚡",
        title: "Rate Limiting",
        desc: "Token bucket algorithm per IP. 10 req/sec globally, 3 req/sec on auth routes to prevent brute force.",
        tag: "Security",
        tagColor: "#22c55e",
    },
    {
        icon: "✅",
        title: "Input Validation",
        desc: "Validated at handler + service layer. Proper HTTP status codes — 400, 401, 403, 404, 429.",
        tag: "Reliability",
        tagColor: "#f97316",
    },
    {
        icon: "🐳",
        title: "Docker Ready",
        desc: "docker-compose up and you're running. Postgres + Go backend + schema auto-migration.",
        tag: "DevOps",
        tagColor: "#06b6d4",
    },
];

function Navbar() {
    const navigate = useNavigate();
    return (
        <nav
            className="sticky top-0 z-20 flex items-center justify-between px-8 py-4 border-b"
            style={{
                background: "rgba(6,4,1,0.95)",
                backdropFilter: "blur(20px)",
                borderColor: "rgba(212,175,55,0.08)",
            }}
        >
            <div className="flex items-center gap-6">
                <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ background: "linear-gradient(135deg, #d4af37, #8a7340)", color: "#060401", fontFamily: "'Playfair Display', serif" }}
                    >F</div>
                    <span style={{ color: "#d4af37", fontFamily: "'Playfair Display', serif", fontSize: "1rem" }}>FinanceOS</span>
                </button>
                <span style={{ color: "#2a2010" }}>›</span>
                <span style={{ color: "#5c4a22", fontFamily: "'DM Mono', monospace", fontSize: "12px" }}>Features</span>
            </div>
            <div className="flex items-center gap-4">
                {[{ label: "Roles", path: "/roles" }, { label: "API Docs", path: "/api-docs" }].map((l) => (
                    <button
                        key={l.path}
                        onClick={() => navigate(l.path)}
                        style={{ color: "#3a2e14", fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.08em" }}
                        className="hover:opacity-80 transition-opacity"
                    >
                        {l.label}
                    </button>
                ))}
                <button
                    onClick={() => navigate("/signup")}
                    className="px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #d4af37, #b8963e)", color: "#060401", fontFamily: "'DM Sans', sans-serif" }}
                >
                    Get Started
                </button>
            </div>
        </nav>
    );
}

export default function FeaturesPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen" style={{ background: "#060401", fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-gold {
          0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; }
        }
        .fade-up { animation: fadeUp 0.6s ease forwards; opacity: 0; }
      `}</style>

            {/* Grid bg */}
            <div className="fixed inset-0 pointer-events-none" style={{
                backgroundImage: `linear-gradient(rgba(212,175,55,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.025) 1px, transparent 1px)`,
                backgroundSize: "60px 60px",
            }} />
            <div className="fixed pointer-events-none" style={{
                width: 500, height: 500, top: -100, right: -100, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)",
                filter: "blur(40px)", animation: "pulse-gold 8s ease-in-out infinite",
            }} />

            <Navbar />

            {/* Hero */}
            <div className="relative text-center px-8 py-16 border-b" style={{ borderColor: "rgba(212,175,55,0.08)" }}>
                <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
                    style={{ borderColor: "rgba(212,175,55,0.2)", background: "rgba(212,175,55,0.04)" }}
                >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#d4af37" }} />
                    <span className="text-xs tracking-[0.15em] uppercase" style={{ color: "#8a7340", fontFamily: "'DM Mono', monospace" }}>
                        What we built
                    </span>
                </div>
                <h1 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    color: "#e8d5a3", lineHeight: 1.1, marginBottom: "16px",
                    textShadow: "0 0 60px rgba(212,175,55,0.15)",
                }}>
                    Features &{" "}
                    <em style={{ color: "#d4af37" }}>Capabilities</em>
                </h1>
                <p className="max-w-lg mx-auto" style={{ color: "#4a3a18", fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", lineHeight: 1.6 }}>
                    Everything that powers FinanceOS — from security to analytics, built with production-grade patterns.
                </p>

                {/* Stats row */}
                <div className="flex items-center justify-center gap-10 mt-10 flex-wrap">
                    {[{ v: "9", l: "Core Features" }, { v: "3", l: "Security Layers" }, { v: "9", l: "Technologies" }, { v: "100%", l: "Type Safe" }].map((s) => (
                        <div key={s.l} className="text-center">
                            <p style={{ color: "#d4af37", fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 600 }}>{s.v}</p>
                            <p style={{ color: "#3a2e14", fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase" }}>{s.l}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-8 py-14 space-y-20">

                {/* Features grid */}
                <section>
                    <div className="mb-10">
                        <p className="text-xs tracking-[0.25em] uppercase mb-3" style={{ color: "#5c4a22", fontFamily: "'DM Mono', monospace" }}>Core Features</p>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#e8d5a3" }}>
                            Built for <em style={{ color: "#d4af37" }}>real backend thinking</em>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {features.map((f, i) => (
                            <div
                                key={f.title}
                                className="fade-up group relative p-6 rounded-2xl border hover:border-amber-700/30 transition-all duration-300 overflow-hidden"
                                style={{
                                    background: "linear-gradient(135deg, rgba(15,10,3,0.95) 0%, rgba(20,14,4,0.9) 100%)",
                                    borderColor: "rgba(212,175,55,0.08)",
                                    animationDelay: `${i * 60}ms`,
                                }}
                            >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                    style={{ background: "radial-gradient(circle at 0% 0%, rgba(212,175,55,0.05) 0%, transparent 60%)" }}
                                />
                                <div className="flex items-start justify-between mb-4">
                                    <span className="text-2xl">{f.icon}</span>
                                    <span className="text-xs px-2 py-0.5 rounded-full" style={{
                                        background: `${f.tagColor}15`, color: f.tagColor,
                                        border: `1px solid ${f.tagColor}30`,
                                        fontFamily: "'DM Mono', monospace", fontSize: "10px",
                                    }}>{f.tag}</span>
                                </div>
                                <h3 className="mb-2" style={{ color: "#c4a55a", fontFamily: "'Playfair Display', serif", fontSize: "1rem" }}>{f.title}</h3>
                                <p style={{ color: "#4a3a18", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", lineHeight: 1.6 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tech Stack */}
                <section>
                    <div className="mb-10">
                        <p className="text-xs tracking-[0.25em] uppercase mb-3" style={{ color: "#5c4a22", fontFamily: "'DM Mono', monospace" }}>Built With</p>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#e8d5a3" }}>
                            The <em style={{ color: "#d4af37" }}>Technology Stack</em>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {techStack.map((tech, i) => (
                            <div
                                key={tech.name}
                                className="fade-up group p-5 rounded-2xl border hover:border-amber-700/30 transition-all duration-300 relative overflow-hidden"
                                style={{
                                    background: "linear-gradient(135deg, rgba(15,10,3,0.95) 0%, rgba(20,14,4,0.9) 100%)",
                                    borderColor: "rgba(212,175,55,0.08)",
                                    animationDelay: `${i * 60}ms`,
                                }}
                            >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                    style={{ background: "radial-gradient(circle at 100% 100%, rgba(212,175,55,0.04) 0%, transparent 60%)" }}
                                />
                                <div className="flex items-start gap-4">
                                    <span className="text-2xl">{tech.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 style={{ color: "#c4a55a", fontFamily: "'Playfair Display', serif", fontSize: "1rem" }}>{tech.name}</h3>
                                            <span className="text-xs px-2 py-0.5 rounded-full" style={{
                                                background: "rgba(212,175,55,0.08)", color: "#5c4a22",
                                                fontFamily: "'DM Mono', monospace", fontSize: "10px",
                                            }}>{tech.version}</span>
                                        </div>
                                        <p className="text-xs mb-2" style={{ color: "#8a7340", fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em" }}>{tech.role}</p>
                                        <p style={{ color: "#3a2e14", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", lineHeight: 1.5 }}>{tech.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Architecture note */}
                    <div className="mt-8 p-6 rounded-2xl border" style={{ borderColor: "rgba(212,175,55,0.1)", background: "rgba(212,175,55,0.02)" }}>
                        <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "#3a2e14", fontFamily: "'DM Mono', monospace" }}>Architecture Pattern</p>
                        <div className="flex items-center gap-3 flex-wrap mb-4">
                            {["Handler (HTTP)", "→", "Service (Logic)", "→", "Repository (DB)", "→", "PostgreSQL"].map((item, i) =>
                                item === "→" ? (
                                    <span key={i} style={{ color: "#2a2010" }}>→</span>
                                ) : (
                                    <span key={i} className="px-3 py-1.5 rounded-lg text-xs" style={{
                                        background: "rgba(212,175,55,0.08)", color: "#8a7340",
                                        border: "1px solid rgba(212,175,55,0.12)", fontFamily: "'DM Mono', monospace",
                                    }}>{item}</span>
                                )
                            )}
                        </div>
                        <p style={{ color: "#3a2e14", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", lineHeight: 1.6 }}>
                            Monolith MVC-style with clean layer separation. Each layer has a single responsibility — handlers parse HTTP, services enforce business rules, repositories handle SQL. Dependency injection via constructor pattern throughout.
                        </p>
                    </div>
                </section>

                {/* CTA */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-2xl border" style={{ borderColor: "rgba(212,175,55,0.12)", background: "rgba(212,175,55,0.02)" }}>
                    <div>
                        <h3 style={{ color: "#e8d5a3", fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", marginBottom: "6px" }}>
                            Ready to <em style={{ color: "#d4af37" }}>explore more?</em>
                        </h3>
                        <p style={{ color: "#3a2e14", fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}>
                            Check out the role system or dive into the API reference.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate("/roles")}
                            className="px-5 py-3 rounded-xl text-sm border transition-all hover:border-amber-600/40"
                            style={{ color: "#8a7340", borderColor: "rgba(212,175,55,0.2)", fontFamily: "'DM Mono', monospace", fontSize: "12px" }}
                        >
                            View Roles →
                        </button>
                        <button
                            onClick={() => navigate("/api-docs")}
                            className="px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                            style={{ background: "linear-gradient(135deg, #d4af37, #b8963e)", color: "#060401", fontFamily: "'DM Sans', sans-serif" }}
                        >
                            API Docs →
                        </button>
                    </div>
                </div>
            </div>

            <footer className="border-t px-8 py-6 flex items-center justify-between flex-wrap gap-4" style={{ borderColor: "rgba(212,175,55,0.08)" }}>
                <span style={{ color: "#2a2010", fontFamily: "'DM Mono', monospace", fontSize: "11px" }}>FinanceOS © 2025 · Go + PostgreSQL + React</span>
                <div className="flex gap-6">
                    {[{ label: "Roles", path: "/roles" }, { label: "API Docs", path: "/api-docs" }, { label: "Home", path: "/" }].map((l) => (
                        <button key={l.path} onClick={() => navigate(l.path)} style={{ color: "#2a2010", fontFamily: "'DM Mono', monospace", fontSize: "11px" }}>{l.label}</button>
                    ))}
                </div>
            </footer>
        </div>
    );
}