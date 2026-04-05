import { useNavigate } from "react-router-dom";

const roles = [
    {
        name: "Viewer",
        icon: "👁",
        color: "#4a90d9",
        badge: "Read Only",
        desc: "Basic read access to financial overview and transaction history. Perfect for stakeholders who need visibility without edit rights.",
        can: [
            "View dashboard summary (income, expense, balance)",
            "Browse all transactions",
            "Filter transactions by type, category, date",
            "See recent activity feed",
        ],
        cannot: [
            "Create, edit or delete transactions",
            "Access monthly trends chart",
            "Access category breakdown",
            "View or manage users",
        ],
        endpoints: ["GET /transactions", "GET /transactions/:id", "GET /dashboard"],
    },
    {
        name: "Analyst",
        icon: "📊",
        color: "#d4af37",
        badge: "Read + Insights",
        desc: "Full analytics access with deep financial insights and trend analysis. Built for data-driven decision making.",
        can: [
            "Everything Viewer can do",
            "Access monthly income vs expense trends",
            "View category-wise totals (pie chart)",
            "Dashboard analytics endpoints",
            "12-month trend breakdown",
        ],
        cannot: [
            "Create, edit or delete transactions",
            "View or manage users",
        ],
        endpoints: ["GET /transactions", "GET /transactions/:id", "GET /dashboard", "GET /dashboard/trends", "GET /dashboard/categories"],
    },
    {
        name: "Admin",
        icon: "⚡",
        color: "#e8d5a3",
        badge: "Full Access",
        desc: "Complete system control — manages data, users and all configurations. Full CRUD on everything.",
        can: [
            "Everything Analyst can do",
            "Create new transactions",
            "Edit existing transactions",
            "Delete transactions",
            "View all system users",
            "Update user roles and status",
            "Deactivate or delete users",
        ],
        cannot: [],
        endpoints: ["All endpoints"],
    },
];

const matrixRows = [
    { action: "View dashboard summary", viewer: true, analyst: true, admin: true },
    { action: "Browse transactions", viewer: true, analyst: true, admin: true },
    { action: "Filter transactions", viewer: true, analyst: true, admin: true },
    { action: "Monthly trends", viewer: false, analyst: true, admin: true },
    { action: "Category breakdown", viewer: false, analyst: true, admin: true },
    { action: "Create transaction", viewer: false, analyst: false, admin: true },
    { action: "Edit transaction", viewer: false, analyst: false, admin: true },
    { action: "Delete transaction", viewer: false, analyst: false, admin: true },
    { action: "View users", viewer: false, analyst: false, admin: true },
    { action: "Manage users", viewer: false, analyst: false, admin: true },
];

function Navbar() {
    const navigate = useNavigate();
    return (
        <nav
            className="sticky top-0 z-20 flex items-center justify-between px-8 py-4 border-b"
            style={{ background: "rgba(6,4,1,0.95)", backdropFilter: "blur(20px)", borderColor: "rgba(212,175,55,0.08)" }}
        >
            <div className="flex items-center gap-6">
                <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ background: "linear-gradient(135deg, #d4af37, #8a7340)", color: "#060401", fontFamily: "'Playfair Display', serif" }}>F</div>
                    <span style={{ color: "#d4af37", fontFamily: "'Playfair Display', serif", fontSize: "1rem" }}>FinanceOS</span>
                </button>
                <span style={{ color: "#2a2010" }}>›</span>
                <span style={{ color: "#5c4a22", fontFamily: "'DM Mono', monospace", fontSize: "12px" }}>Roles</span>
            </div>
            <div className="flex items-center gap-4">
                {[{ label: "Features", path: "/features" }, { label: "API Docs", path: "/api-docs" }].map((l) => (
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

export default function RolesPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen" style={{ background: "#060401", fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-gold { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
        .fade-up { animation: fadeUp 0.6s ease forwards; opacity: 0; }
      `}</style>

            <div className="fixed inset-0 pointer-events-none" style={{
                backgroundImage: `linear-gradient(rgba(212,175,55,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.025) 1px, transparent 1px)`,
                backgroundSize: "60px 60px",
            }} />
            <div className="fixed pointer-events-none" style={{
                width: 600, height: 600, bottom: -200, left: -100, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)",
                filter: "blur(40px)", animation: "pulse-gold 8s ease-in-out infinite",
            }} />

            <Navbar />

            {/* Hero */}
            <div className="relative text-center px-8 py-16 border-b" style={{ borderColor: "rgba(212,175,55,0.08)" }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
                    style={{ borderColor: "rgba(212,175,55,0.2)", background: "rgba(212,175,55,0.04)" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#d4af37" }} />
                    <span className="text-xs tracking-[0.15em] uppercase" style={{ color: "#8a7340", fontFamily: "'DM Mono', monospace" }}>
                        Access Control
                    </span>
                </div>
                <h1 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    color: "#e8d5a3", lineHeight: 1.1, marginBottom: "16px",
                    textShadow: "0 0 60px rgba(212,175,55,0.15)",
                }}>
                    Three Roles,{" "}
                    <em style={{ color: "#d4af37" }}>Total Control</em>
                </h1>
                <p className="max-w-lg mx-auto" style={{ color: "#4a3a18", fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", lineHeight: 1.6 }}>
                    Every user has exactly the access they need — nothing more, nothing less. Enforced at the backend middleware level.
                </p>
            </div>

            <div className="max-w-6xl mx-auto px-8 py-14 space-y-16">

                {/* RBAC Flow */}
                <section>
                    <p className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: "#5c4a22", fontFamily: "'DM Mono', monospace" }}>How it works</p>
                    <div className="p-6 rounded-2xl border" style={{ borderColor: "rgba(212,175,55,0.1)", background: "rgba(212,175,55,0.02)" }}>
                        <div className="flex items-center gap-3 flex-wrap mb-6">
                            {[
                                { label: "HTTP Request", color: "#5c4a22" },
                                "→",
                                { label: "JWT Middleware", color: "#4a90d9" },
                                "→",
                                { label: "Role Check", color: "#d4af37" },
                                "→",
                                { label: "Handler", color: "#22c55e" },
                                "→",
                                { label: "Service", color: "#8b5cf6" },
                                "→",
                                { label: "PostgreSQL", color: "#f97316" },
                            ].map((item, i) =>
                                item === "→" ? (
                                    <span key={i} style={{ color: "#2a2010" }}>→</span>
                                ) : (
                                    <span key={i} className="px-3 py-1.5 rounded-lg text-xs" style={{
                                        background: `${item.color}15`, color: item.color,
                                        border: `1px solid ${item.color}25`, fontFamily: "'DM Mono', monospace",
                                    }}>{item.label}</span>
                                )
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            {[
                                { step: "01", title: "JWT Decoded", desc: "Every protected request — middleware extracts and verifies the JWT token." },
                                { step: "02", title: "Role Extracted", desc: "Role is read from token claims — no extra DB query needed per request." },
                                { step: "03", title: "Access Granted or 403", desc: "RequireRole middleware checks if user's role is in the allowed list." },
                            ].map((s) => (
                                <div key={s.step} className="flex gap-4">
                                    <span style={{ color: "#2a2010", fontFamily: "'DM Mono', monospace", fontSize: "1.5rem", fontWeight: 600, lineHeight: 1 }}>{s.step}</span>
                                    <div>
                                        <p style={{ color: "#8a7340", fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", marginBottom: "4px" }}>{s.title}</p>
                                        <p style={{ color: "#3a2e14", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", lineHeight: 1.5 }}>{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Role cards */}
                <section>
                    <div className="mb-10">
                        <p className="text-xs tracking-[0.25em] uppercase mb-3" style={{ color: "#5c4a22", fontFamily: "'DM Mono', monospace" }}>Role Breakdown</p>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#e8d5a3" }}>
                            What each role <em style={{ color: "#d4af37" }}>can do</em>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {roles.map((role, i) => (
                            <div
                                key={role.name}
                                className="fade-up rounded-2xl border overflow-hidden"
                                style={{ borderColor: `${role.color}20`, background: `${role.color}06`, animationDelay: `${i * 100}ms` }}
                            >
                                {/* Header */}
                                <div className="px-6 py-6 border-b" style={{ borderColor: `${role.color}15` }}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                                            style={{ background: `${role.color}15`, border: `1px solid ${role.color}25` }}>
                                            {role.icon}
                                        </div>
                                        <div>
                                            <h3 style={{ color: role.color, fontFamily: "'Playfair Display', serif", fontSize: "1.2rem" }}>{role.name}</h3>
                                            <span className="text-xs px-2 py-0.5 rounded-full" style={{
                                                background: `${role.color}15`, color: role.color, opacity: 0.8,
                                                fontFamily: "'DM Mono', monospace", fontSize: "10px",
                                            }}>{role.badge}</span>
                                        </div>
                                    </div>
                                    <p style={{ color: "#4a3a18", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", lineHeight: 1.5 }}>{role.desc}</p>
                                </div>

                                {/* Permissions */}
                                <div className="px-6 py-5">
                                    <p className="text-xs tracking-[0.12em] uppercase mb-3" style={{ color: "#3a2e14", fontFamily: "'DM Mono', monospace" }}>Can do</p>
                                    <div className="space-y-2 mb-5">
                                        {role.can.map((p) => (
                                            <div key={p} className="flex items-start gap-2">
                                                <span className="text-xs mt-0.5 shrink-0" style={{ color: "#22c55e" }}>✓</span>
                                                <span style={{ color: "#6b5a30", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", lineHeight: 1.5 }}>{p}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {role.cannot.length > 0 && (
                                        <>
                                            <p className="text-xs tracking-[0.12em] uppercase mb-3" style={{ color: "#2a2010", fontFamily: "'DM Mono', monospace" }}>Restricted</p>
                                            <div className="space-y-2 mb-5">
                                                {role.cannot.map((p) => (
                                                    <div key={p} className="flex items-start gap-2">
                                                        <span className="text-xs mt-0.5 shrink-0" style={{ color: "#5c2a2a" }}>✗</span>
                                                        <span style={{ color: "#2a1a1a", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", lineHeight: 1.5 }}>{p}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {/* Allowed endpoints */}
                                    <p className="text-xs tracking-[0.12em] uppercase mb-2" style={{ color: "#3a2e14", fontFamily: "'DM Mono', monospace" }}>API Access</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {role.endpoints.map((ep) => (
                                            <span key={ep} className="text-xs px-2 py-1 rounded-lg" style={{
                                                background: `${role.color}10`, color: role.color, opacity: 0.7,
                                                fontFamily: "'DM Mono', monospace", fontSize: "10px",
                                                border: `1px solid ${role.color}20`,
                                            }}>{ep}</span>
                                        ))}
                                    </div>

                                    {role.cannot.length === 0 && (
                                        <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl" style={{
                                            background: `${role.color}10`, border: `1px solid ${role.color}20`,
                                        }}>
                                            <span style={{ color: role.color, fontSize: "12px" }}>⚡</span>
                                            <span style={{ color: role.color, fontFamily: "'DM Mono', monospace", fontSize: "11px", opacity: 0.8 }}>No restrictions</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Permission matrix */}
                <section>
                    <div className="mb-8">
                        <p className="text-xs tracking-[0.25em] uppercase mb-3" style={{ color: "#5c4a22", fontFamily: "'DM Mono', monospace" }}>Quick Reference</p>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#e8d5a3" }}>
                            Permission <em style={{ color: "#d4af37" }}>Matrix</em>
                        </h2>
                    </div>

                    <div className="rounded-2xl border overflow-hidden" style={{
                        borderColor: "rgba(212,175,55,0.1)",
                        background: "linear-gradient(135deg, rgba(15,10,3,0.95) 0%, rgba(20,14,4,0.9) 100%)",
                    }}>
                        <table className="w-full">
                            <thead>
                                <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.08)" }}>
                                    <th className="text-left px-6 py-4" style={{ color: "#3a2e14", fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.1em" }}>
                                        ACTION
                                    </th>
                                    {roles.map((r) => (
                                        <th key={r.name} className="px-6 py-4 text-center" style={{ color: r.color, fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.1em" }}>
                                            {r.icon} {r.name.toUpperCase()}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {matrixRows.map((row, i) => (
                                    <tr key={row.action}
                                        className="transition-colors hover:bg-amber-900/5"
                                        style={{ borderBottom: i < matrixRows.length - 1 ? "1px solid rgba(212,175,55,0.04)" : "none" }}>
                                        <td className="px-6 py-3.5">
                                            <span style={{ color: "#6b5a30", fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}>{row.action}</span>
                                        </td>
                                        {[row.viewer, row.analyst, row.admin].map((allowed, j) => (
                                            <td key={j} className="px-6 py-3.5 text-center">
                                                <span style={{ fontSize: "14px", color: allowed ? "#22c55e" : "#2a1a1a" }}>
                                                    {allowed ? "✓" : "✗"}
                                                </span>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* CTA */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-2xl border"
                    style={{ borderColor: "rgba(212,175,55,0.12)", background: "rgba(212,175,55,0.02)" }}>
                    <div>
                        <h3 style={{ color: "#e8d5a3", fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", marginBottom: "6px" }}>
                            See the <em style={{ color: "#d4af37" }}>API in action?</em>
                        </h3>
                        <p style={{ color: "#3a2e14", fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}>
                            Check all 13 endpoints and try them out.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => navigate("/features")}
                            className="px-5 py-3 rounded-xl text-sm border transition-all hover:border-amber-600/40"
                            style={{ color: "#8a7340", borderColor: "rgba(212,175,55,0.2)", fontFamily: "'DM Mono', monospace", fontSize: "12px" }}>
                            Features →
                        </button>
                        <button onClick={() => navigate("/api-docs")}
                            className="px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                            style={{ background: "linear-gradient(135deg, #d4af37, #b8963e)", color: "#060401", fontFamily: "'DM Sans', sans-serif" }}>
                            API Docs →
                        </button>
                    </div>
                </div>
            </div>

            <footer className="border-t px-8 py-6 flex items-center justify-between flex-wrap gap-4" style={{ borderColor: "rgba(212,175,55,0.08)" }}>
                <span style={{ color: "#2a2010", fontFamily: "'DM Mono', monospace", fontSize: "11px" }}>FinanceOS © 2025 · Role-Based Access Control</span>
                <div className="flex gap-6">
                    {[{ label: "Features", path: "/features" }, { label: "API Docs", path: "/api-docs" }, { label: "Home", path: "/" }].map((l) => (
                        <button key={l.path} onClick={() => navigate(l.path)}
                            style={{ color: "#2a2010", fontFamily: "'DM Mono', monospace", fontSize: "11px" }}>{l.label}</button>
                    ))}
                </div>
            </footer>
        </div>
    );
}