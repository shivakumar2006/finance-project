import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FloatingOrb = ({ style }) => (
    <div
        className="absolute rounded-full pointer-events-none"
        style={{
            background:
                "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
            ...style,
        }}
    />
);

const Ticker = () => {
    const items = [
        { label: "NET WORTH", value: "+₹2,84,391", change: "+4.2%" },
        { label: "MONTHLY INCOME", value: "₹1,20,000", change: "+12.1%" },
        { label: "EXPENSES", value: "₹43,200", change: "-3.4%" },
        { label: "SAVINGS RATE", value: "64%", change: "+2.1%" },
        { label: "INVESTMENTS", value: "₹8,40,000", change: "+18.7%" },
    ];

    return (
        <div className="overflow-hidden border-y border-amber-900/30 py-3 bg-black/40 backdrop-blur-sm">
            <div
                className="flex gap-16 whitespace-nowrap"
                style={{ animation: "ticker 30s linear infinite" }}
            >
                {[...items, ...items].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 shrink-0">
                        <span
                            className="text-xs tracking-[0.2em] font-medium"
                            style={{ color: "#8a7340", fontFamily: "'DM Mono', monospace" }}
                        >
                            {item.label}
                        </span>
                        <span
                            className="text-sm font-semibold"
                            style={{ color: "#d4af37", fontFamily: "'DM Mono', monospace" }}
                        >
                            {item.value}
                        </span>
                        <span
                            className={`text-xs font-medium ${item.change.startsWith("+")
                                ? "text-emerald-400"
                                : "text-red-400"
                                }`}
                        >
                            {item.change}
                        </span>
                        <span className="text-amber-900/40 text-lg">◆</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, delay }) => (
    <div
        className="group relative p-6 rounded-2xl border border-amber-900/20 hover:border-amber-600/40 transition-all duration-500 cursor-default overflow-hidden"
        style={{
            background:
                "linear-gradient(135deg, rgba(20,15,5,0.9) 0%, rgba(30,22,8,0.9) 100%)",
            animationDelay: `${delay}ms`,
            animation: "fadeUp 0.8s ease forwards",
            opacity: 0,
        }}
    >
        <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
                background:
                    "radial-gradient(circle at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 60%)",
            }}
        />
        <div
            className="text-3xl mb-4"
            style={{ filter: "drop-shadow(0 0 12px rgba(212,175,55,0.4))" }}
        >
            {icon}
        </div>
        <h3
            className="text-base font-semibold mb-2 tracking-wide"
            style={{ color: "#d4af37", fontFamily: "'Playfair Display', serif" }}
        >
            {title}
        </h3>
        <p
            className="text-sm leading-relaxed"
            style={{ color: "#6b5a30", fontFamily: "'DM Sans', sans-serif" }}
        >
            {desc}
        </p>
    </div>
);

const StatPill = ({ value, label }) => (
    <div className="flex flex-col items-center gap-1">
        <span
            className="text-3xl font-bold"
            style={{
                color: "#d4af37",
                fontFamily: "'Playfair Display', serif",
                textShadow: "0 0 30px rgba(212,175,55,0.3)",
            }}
        >
            {value}
        </span>
        <span
            className="text-xs tracking-[0.15em] uppercase"
            style={{ color: "#5c4a22", fontFamily: "'DM Mono', monospace" }}
        >
            {label}
        </span>
    </div>
);

export default function HomePage() {
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const features = [
        {
            icon: "⚡",
            title: "Real-Time Analytics",
            desc: "Live financial data with instant insights. Watch your wealth move in real time.",
        },
        {
            icon: "🔐",
            title: "Role-Based Access",
            desc: "Granular permissions for Viewers, Analysts, and Admins. Every role, exactly what they need.",
        },
        {
            icon: "📊",
            title: "Dashboard Intelligence",
            desc: "Monthly trends, category breakdowns, net balance — all rendered beautifully.",
        },
        {
            icon: "🛡️",
            title: "Bank-Grade Security",
            desc: "JWT authentication with bcrypt encryption. Your data stays yours.",
        },
        {
            icon: "📈",
            title: "Income vs Expense",
            desc: "Track every rupee. Categorise, filter, and analyse with surgical precision.",
        },
        {
            icon: "🌐",
            title: "RESTful API",
            desc: "Clean endpoints, consistent responses. Built to power any frontend.",
        },
    ];

    return (
        <div
            className="min-h-screen relative overflow-hidden"
            style={{ background: "#060401", fontFamily: "'DM Sans', sans-serif" }}
        >
            {/* Google Fonts */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse-gold {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .glow-text {
          text-shadow: 0 0 60px rgba(212,175,55,0.25);
        }
        .gold-border {
          border-image: linear-gradient(135deg, #d4af37, #8a7340, #d4af37) 1;
        }
        .hero-badge {
          animation: fadeIn 1s ease 0.2s forwards;
          opacity: 0;
        }
        .hero-heading {
          animation: fadeUp 1s ease 0.4s forwards;
          opacity: 0;
        }
        .hero-sub {
          animation: fadeUp 1s ease 0.6s forwards;
          opacity: 0;
        }
        .hero-cta {
          animation: fadeUp 1s ease 0.8s forwards;
          opacity: 0;
        }
        .hero-stats {
          animation: fadeUp 1s ease 1s forwards;
          opacity: 0;
        }
        .orb-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>

            {/* Background grid */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(212,175,55,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,175,55,0.03) 1px, transparent 1px)
          `,
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Floating orbs */}
            <FloatingOrb
                style={{
                    width: 600,
                    height: 600,
                    top: -200,
                    right: -100,
                    animation: "pulse-gold 6s ease-in-out infinite",
                }}
            />
            <FloatingOrb
                style={{
                    width: 400,
                    height: 400,
                    bottom: 100,
                    left: -100,
                    animation: "pulse-gold 8s ease-in-out infinite 2s",
                }}
            />

            {/* Navbar */}
            <nav
                className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-amber-900/20"
                style={{ backdropFilter: "blur(20px)" }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{
                            background: "linear-gradient(135deg, #d4af37, #8a7340)",
                            color: "#060401",
                        }}
                    >
                        F
                    </div>
                    <span
                        className="text-lg font-semibold tracking-wide"
                        style={{ color: "#d4af37", fontFamily: "'Playfair Display', serif" }}
                    >
                        FinanceOS
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    {[
                        { label: "Features", path: "/features" },
                        { label: "Roles", path: "/roles" },
                        { label: "API", path: "/api" },
                    ].map((item) => (
                        <span
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className="text-sm cursor-pointer hover:opacity-100 transition-opacity duration-200 tracking-wide"
                            style={{
                                color: "#5c4a22",
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "11px",
                                letterSpacing: "0.1em",
                            }}
                        >
                            {item.label}
                        </span>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/login")}
                        className="px-5 py-2 text-sm rounded-lg border transition-all duration-200 hover:border-amber-600/60"
                        style={{
                            color: "#8a7340",
                            borderColor: "rgba(138,115,64,0.3)",
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "12px",
                            letterSpacing: "0.05em",
                        }}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => navigate("/signup")}
                        className="px-5 py-2 text-sm rounded-lg font-medium transition-all duration-200 hover:opacity-90"
                        style={{
                            background: "linear-gradient(135deg, #d4af37, #b8963e)",
                            color: "#060401",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "13px",
                            fontWeight: 600,
                        }}
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Ticker */}
            <Ticker />

            {/* Hero */}
            <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20">
                {/* Badge */}
                <div
                    className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8"
                    style={{
                        borderColor: "rgba(212,175,55,0.25)",
                        background: "rgba(212,175,55,0.05)",
                    }}
                >
                    <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                            background: "#d4af37",
                            animation: "pulse-gold 2s infinite",
                        }}
                    />
                    <span
                        className="text-xs tracking-[0.15em] uppercase"
                        style={{ color: "#8a7340", fontFamily: "'DM Mono', monospace" }}
                    >
                        Finance Intelligence Platform
                    </span>
                </div>

                {/* Heading */}
                <h1
                    className="hero-heading glow-text max-w-4xl mb-6 leading-tight"
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(2.5rem, 6vw, 5rem)",
                        color: "#e8d5a3",
                        lineHeight: 1.1,
                    }}
                >
                    Your Financial Empire,{" "}
                    <span style={{ color: "#d4af37", fontStyle: "italic" }}>
                        Commanded
                    </span>{" "}
                    with Precision
                </h1>

                {/* Sub */}
                <p
                    className="hero-sub max-w-xl mb-10 leading-relaxed"
                    style={{
                        color: "#4a3a18",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "1.05rem",
                    }}
                >
                    Role-based access control. Real-time analytics. Complete financial
                    visibility — for teams that mean business.
                </p>

                {/* CTAs */}
                <div className="hero-cta flex items-center gap-4 flex-wrap justify-center mb-16">
                    <button
                        onClick={() => navigate("/signup")}
                        className="group px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-2"
                        style={{
                            background: "linear-gradient(135deg, #d4af37, #b8963e)",
                            color: "#060401",
                            fontFamily: "'DM Sans', sans-serif",
                            boxShadow: "0 0 40px rgba(212,175,55,0.2)",
                        }}
                    >
                        Start Free
                        <span className="transition-transform duration-200 group-hover:translate-x-1">
                            →
                        </span>
                    </button>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-8 py-4 rounded-xl text-sm border transition-all duration-300 hover:border-amber-600/50 hover:bg-amber-900/10"
                        style={{
                            color: "#8a7340",
                            borderColor: "rgba(138,115,64,0.25)",
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "12px",
                            letterSpacing: "0.08em",
                        }}
                    >
                        View Dashboard →
                    </button>
                </div>

                {/* Stats */}
                <div
                    className="hero-stats flex items-center gap-12 flex-wrap justify-center py-8 px-12 rounded-2xl border"
                    style={{
                        borderColor: "rgba(212,175,55,0.12)",
                        background: "rgba(212,175,55,0.03)",
                    }}
                >
                    <StatPill value="3" label="Access Roles" />
                    <div
                        className="w-px h-10 hidden md:block"
                        style={{ background: "rgba(212,175,55,0.15)" }}
                    />
                    <StatPill value="∞" label="Transactions" />
                    <div
                        className="w-px h-10 hidden md:block"
                        style={{ background: "rgba(212,175,55,0.15)" }}
                    />
                    <StatPill value="12" label="Dashboard APIs" />
                    <div
                        className="w-px h-10 hidden md:block"
                        style={{ background: "rgba(212,175,55,0.15)" }}
                    />
                    <StatPill value="100%" label="Secure" />
                </div>
            </section>

            {/* Features */}
            <section className="relative z-10 px-6 pb-24 max-w-6xl mx-auto">
                <div className="text-center mb-14">
                    <p
                        className="text-xs tracking-[0.25em] uppercase mb-3"
                        style={{ color: "#5c4a22", fontFamily: "'DM Mono', monospace" }}
                    >
                        What's Inside
                    </p>
                    <h2
                        className="text-3xl md:text-4xl"
                        style={{
                            color: "#e8d5a3",
                            fontFamily: "'Playfair Display', serif",
                            textShadow: "0 0 40px rgba(212,175,55,0.15)",
                        }}
                    >
                        Everything you need,{" "}
                        <em style={{ color: "#d4af37" }}>nothing you don't</em>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {features.map((f, i) => (
                        <FeatureCard key={i} {...f} delay={i * 100} />
                    ))}
                </div>
            </section>

            {/* Role section */}
            <section
                className="relative z-10 mx-6 mb-24 rounded-3xl border overflow-hidden max-w-6xl md:mx-auto"
                style={{
                    borderColor: "rgba(212,175,55,0.15)",
                    background:
                        "linear-gradient(135deg, rgba(15,10,3,0.95) 0%, rgba(25,18,5,0.95) 100%)",
                }}
            >
                <div className="p-10 md:p-16">
                    <div className="text-center mb-12">
                        <p
                            className="text-xs tracking-[0.25em] uppercase mb-3"
                            style={{ color: "#5c4a22", fontFamily: "'DM Mono', monospace" }}
                        >
                            Access Control
                        </p>
                        <h2
                            className="text-3xl md:text-4xl"
                            style={{
                                color: "#e8d5a3",
                                fontFamily: "'Playfair Display', serif",
                            }}
                        >
                            Three Roles.{" "}
                            <em style={{ color: "#d4af37" }}>Total Control.</em>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                role: "Viewer",
                                icon: "👁",
                                color: "#4a90d9",
                                perms: [
                                    "View dashboard summary",
                                    "Browse transactions",
                                    "Read-only access",
                                ],
                                denied: ["Create transactions", "Manage users"],
                            },
                            {
                                role: "Analyst",
                                icon: "📊",
                                color: "#d4af37",
                                perms: [
                                    "Everything Viewer can",
                                    "Access monthly trends",
                                    "Category breakdowns",
                                    "Advanced insights",
                                ],
                                denied: ["Manage users"],
                            },
                            {
                                role: "Admin",
                                icon: "⚡",
                                color: "#e8d5a3",
                                perms: [
                                    "Full system access",
                                    "Create & edit transactions",
                                    "Manage all users",
                                    "Change roles & status",
                                ],
                                denied: [],
                            },
                        ].map((r) => (
                            <div
                                key={r.role}
                                className="p-6 rounded-2xl border"
                                style={{
                                    borderColor: `${r.color}22`,
                                    background: `${r.color}08`,
                                }}
                            >
                                <div className="flex items-center gap-3 mb-5">
                                    <span className="text-2xl">{r.icon}</span>
                                    <span
                                        className="font-semibold tracking-wide"
                                        style={{
                                            color: r.color,
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: "1.1rem",
                                        }}
                                    >
                                        {r.role}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {r.perms.map((p) => (
                                        <div key={p} className="flex items-start gap-2">
                                            <span className="text-emerald-400 text-xs mt-0.5">✓</span>
                                            <span
                                                className="text-xs"
                                                style={{
                                                    color: "#6b5a30",
                                                    fontFamily: "'DM Sans', sans-serif",
                                                }}
                                            >
                                                {p}
                                            </span>
                                        </div>
                                    ))}
                                    {r.denied.map((p) => (
                                        <div key={p} className="flex items-start gap-2">
                                            <span className="text-red-500/50 text-xs mt-0.5">✗</span>
                                            <span
                                                className="text-xs"
                                                style={{
                                                    color: "#3a2e14",
                                                    fontFamily: "'DM Sans', sans-serif",
                                                }}
                                            >
                                                {p}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer
                className="relative z-10 border-t px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4"
                style={{ borderColor: "rgba(212,175,55,0.1)" }}
            >
                <div className="flex items-center gap-2">
                    <div
                        className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                        style={{
                            background: "linear-gradient(135deg, #d4af37, #8a7340)",
                            color: "#060401",
                        }}
                    >
                        F
                    </div>
                    <span
                        style={{
                            color: "#3a2e14",
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "11px",
                        }}
                    >
                        FinanceOS © 2025
                    </span>
                </div>
                <span
                    style={{
                        color: "#2a2010",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "11px",
                    }}
                >
                    Built with Go · PostgreSQL · Chi Router
                </span>
            </footer>
        </div>
    );
}