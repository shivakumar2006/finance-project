import { useState } from "react";
import { useNavigate } from "react-router-dom";

const roles = [
    {
        value: "viewer",
        label: "Viewer",
        icon: "👁",
        desc: "Read-only access to dashboard and transactions",
        color: "#4a90d9",
        perms: ["View dashboard", "Browse transactions"],
    },
    {
        value: "analyst",
        label: "Analyst",
        icon: "📊",
        desc: "Full analytics access with trends and insights",
        color: "#d4af37",
        perms: ["Everything Viewer has", "Monthly trends", "Category breakdown"],
    },
    {
        value: "admin",
        label: "Admin",
        icon: "⚡",
        desc: "Complete system control and user management",
        color: "#e8d5a3",
        perms: ["Full access", "Create transactions", "Manage users"],
    },
];

export default function SignupPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [step, setStep] = useState(1); // 1 = details, 2 = role select

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
    };

    const handleNext = () => {
        if (!form.name || !form.email || !form.password) {
            setError("All fields are required.");
            return;
        }
        if (form.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailReg.test(form.email)) {
            setError("Please enter a valid email.");
            return;
        }
        setError("");
        setStep(2);
    };

    const handleSubmit = async () => {
        if (!form.role) {
            setError("Please select a role to continue.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:8080/api/v1/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Registration failed.");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            switch (data.user.role) {
                case "admin":
                    navigate("/dashboard/admin");
                    break;
                case "analyst":
                    navigate("/dashboard/analyst");
                    break;
                default:
                    navigate("/dashboard");
            }
        } catch {
            setError("Server unreachable. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex"
            style={{ background: "#060401", fontFamily: "'DM Sans', sans-serif" }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse-gold {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .form-card {
          animation: fadeUp 0.8s ease 0.2s forwards;
          opacity: 0;
        }
        .step2 {
          animation: slideLeft 0.4s ease forwards;
        }
        .input-field {
          background: rgba(212,175,55,0.04);
          border: 1px solid rgba(212,175,55,0.15);
          color: #e8d5a3;
          transition: border-color 0.2s, background 0.2s;
          outline: none;
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
        }
        .input-field::placeholder { color: #3a2e14; }
        .input-field:focus {
          border-color: rgba(212,175,55,0.5);
          background: rgba(212,175,55,0.07);
        }
        .role-card {
          border: 1px solid rgba(212,175,55,0.1);
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.25s ease;
          background: rgba(212,175,55,0.02);
          position: relative;
          overflow: hidden;
        }
        .role-card:hover {
          border-color: rgba(212,175,55,0.3);
          background: rgba(212,175,55,0.05);
          transform: translateY(-2px);
        }
        .role-card.selected {
          transform: translateY(-2px);
        }
        .submit-btn {
          background: linear-gradient(135deg, #d4af37, #b8963e);
          color: #060401;
          font-weight: 700;
          border: none;
          width: 100%;
          padding: 15px;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
          letter-spacing: 0.05em;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .next-btn {
          background: transparent;
          border: 1px solid rgba(212,175,55,0.3);
          color: #d4af37;
          width: 100%;
          padding: 15px;
          border-radius: 12px;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.2s;
        }
        .next-btn:hover {
          background: rgba(212,175,55,0.08);
          border-color: rgba(212,175,55,0.5);
        }
        .progress-bar {
          height: 2px;
          border-radius: 99px;
          transition: width 0.4s ease;
          background: linear-gradient(90deg, #d4af37, #b8963e);
        }
      `}</style>

            {/* Left panel */}
            <div
                className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
                style={{
                    background: "linear-gradient(160deg, #0a0702 0%, #100d03 50%, #080600 100%)",
                    borderRight: "1px solid rgba(212,175,55,0.08)",
                }}
            >
                {/* Grid */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px)
            `,
                        backgroundSize: "50px 50px",
                    }}
                />

                {/* Orb */}
                <div
                    className="absolute"
                    style={{
                        width: 500,
                        height: 500,
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)",
                        filter: "blur(40px)",
                        animation: "pulse-gold 6s ease-in-out infinite",
                    }}
                />

                {/* Logo */}
                <div className="relative flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base"
                        style={{
                            background: "linear-gradient(135deg, #d4af37, #8a7340)",
                            color: "#060401",
                            fontFamily: "'Playfair Display', serif",
                        }}
                    >
                        F
                    </div>
                    <span
                        style={{
                            color: "#d4af37",
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "1.2rem",
                            fontWeight: 600,
                        }}
                    >
                        FinanceOS
                    </span>
                </div>

                {/* Center content */}
                <div className="relative">
                    <p
                        className="text-xs tracking-[0.2em] uppercase mb-5"
                        style={{ color: "#3a2e14", fontFamily: "'DM Mono', monospace" }}
                    >
                        Join the platform
                    </p>
                    <h2
                        className="text-3xl leading-tight mb-6"
                        style={{
                            color: "#6b5a30",
                            fontFamily: "'Playfair Display', serif",
                            fontStyle: "italic",
                        }}
                    >
                        One platform.
                        <br />
                        <span style={{ color: "#d4af37" }}>Every financial lens.</span>
                    </h2>

                    {/* Steps preview */}
                    <div className="space-y-4 mt-10">
                        {[
                            { n: "01", label: "Enter your details", done: step >= 1 },
                            { n: "02", label: "Choose your role", done: step >= 2 },
                            { n: "03", label: "Access granted", done: false },
                        ].map((s) => (
                            <div key={s.n} className="flex items-center gap-4">
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300"
                                    style={{
                                        background: s.done
                                            ? "linear-gradient(135deg, #d4af37, #b8963e)"
                                            : "rgba(212,175,55,0.08)",
                                        color: s.done ? "#060401" : "#3a2e14",
                                        fontFamily: "'DM Mono', monospace",
                                        border: s.done ? "none" : "1px solid rgba(212,175,55,0.1)",
                                    }}
                                >
                                    {s.done ? "✓" : s.n}
                                </div>
                                <span
                                    className="text-sm transition-all duration-300"
                                    style={{
                                        color: s.done ? "#8a7340" : "#2a2010",
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                >
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom */}
                <div className="relative">
                    <div
                        className="w-12 h-px mb-4"
                        style={{ background: "rgba(212,175,55,0.2)" }}
                    />
                    <p
                        className="text-xs"
                        style={{ color: "#2a2010", fontFamily: "'DM Sans', sans-serif" }}
                    >
                        Secured with JWT · bcrypt · PostgreSQL
                    </p>
                </div>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="form-card w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                            style={{
                                background: "linear-gradient(135deg, #d4af37, #8a7340)",
                                color: "#060401",
                            }}
                        >
                            F
                        </div>
                        <span
                            style={{
                                color: "#d4af37",
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "1rem",
                            }}
                        >
                            FinanceOS
                        </span>
                    </div>

                    {/* Progress */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <span
                                className="text-xs tracking-[0.15em] uppercase"
                                style={{ color: "#5c4a22", fontFamily: "'DM Mono', monospace" }}
                            >
                                Step {step} of 2
                            </span>
                            <span
                                className="text-xs"
                                style={{ color: "#3a2e14", fontFamily: "'DM Mono', monospace" }}
                            >
                                {step === 1 ? "Your Details" : "Choose Role"}
                            </span>
                        </div>
                        <div
                            className="w-full rounded-full"
                            style={{ height: "2px", background: "rgba(212,175,55,0.1)" }}
                        >
                            <div
                                className="progress-bar"
                                style={{ width: step === 1 ? "50%" : "100%" }}
                            />
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "1.9rem",
                                color: "#e8d5a3",
                                lineHeight: 1.2,
                                marginBottom: "8px",
                            }}
                        >
                            {step === 1 ? (
                                <>
                                    Create your{" "}
                                    <span style={{ color: "#d4af37", fontStyle: "italic" }}>
                                        account
                                    </span>
                                </>
                            ) : (
                                <>
                                    Select your{" "}
                                    <span style={{ color: "#d4af37", fontStyle: "italic" }}>
                                        role
                                    </span>
                                </>
                            )}
                        </h1>
                        <p
                            style={{
                                color: "#3a2e14",
                                fontSize: "13px",
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            {step === 1
                                ? "Fill in your details to get started"
                                : "Your role determines your access level"}
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div
                            className="mb-5 px-4 py-3 rounded-xl text-sm border"
                            style={{
                                background: "rgba(220,38,38,0.08)",
                                borderColor: "rgba(220,38,38,0.2)",
                                color: "#f87171",
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {/* Step 1 — Details */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <label
                                    className="block text-xs mb-2 tracking-[0.1em] uppercase"
                                    style={{
                                        color: "#5c4a22",
                                        fontFamily: "'DM Mono', monospace",
                                    }}
                                >
                                    Full Name
                                </label>
                                <input
                                    className="input-field"
                                    type="text"
                                    name="name"
                                    placeholder="Shiva Kumar"
                                    value={form.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label
                                    className="block text-xs mb-2 tracking-[0.1em] uppercase"
                                    style={{
                                        color: "#5c4a22",
                                        fontFamily: "'DM Mono', monospace",
                                    }}
                                >
                                    Email Address
                                </label>
                                <input
                                    className="input-field"
                                    type="email"
                                    name="email"
                                    placeholder="you@company.com"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label
                                    className="block text-xs mb-2 tracking-[0.1em] uppercase"
                                    style={{
                                        color: "#5c4a22",
                                        fontFamily: "'DM Mono', monospace",
                                    }}
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        className="input-field"
                                        type={showPass ? "text" : "password"}
                                        name="password"
                                        placeholder="Min 6 characters"
                                        value={form.password}
                                        onChange={handleChange}
                                        style={{ paddingRight: "48px" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass((p) => !p)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs transition-opacity hover:opacity-80"
                                        style={{
                                            color: "#5c4a22",
                                            fontFamily: "'DM Mono', monospace",
                                        }}
                                    >
                                        {showPass ? "HIDE" : "SHOW"}
                                    </button>
                                </div>
                            </div>

                            <div style={{ paddingTop: "8px" }}>
                                <button className="next-btn" onClick={handleNext}>
                                    CONTINUE → SELECT ROLE
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2 — Role */}
                    {step === 2 && (
                        <div className="step2">
                            <div className="space-y-3 mb-6">
                                {roles.map((r) => (
                                    <div
                                        key={r.value}
                                        className={`role-card ${form.role === r.value ? "selected" : ""}`}
                                        style={
                                            form.role === r.value
                                                ? {
                                                    borderColor: `${r.color}55`,
                                                    background: `${r.color}10`,
                                                    boxShadow: `0 0 20px ${r.color}15`,
                                                }
                                                : {}
                                        }
                                        onClick={() => {
                                            setForm((prev) => ({ ...prev, role: r.value }));
                                            setError("");
                                        }}
                                    >
                                        {/* Selected indicator */}
                                        {form.role === r.value && (
                                            <div
                                                className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                                                style={{
                                                    background: `linear-gradient(135deg, ${r.color}, ${r.color}99)`,
                                                    color: "#060401",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                ✓
                                            </div>
                                        )}

                                        <div className="flex items-start gap-4">
                                            <span
                                                className="text-xl"
                                                style={{
                                                    filter:
                                                        form.role === r.value
                                                            ? `drop-shadow(0 0 8px ${r.color}66)`
                                                            : "none",
                                                }}
                                            >
                                                {r.icon}
                                            </span>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span
                                                        className="font-semibold text-sm"
                                                        style={{
                                                            color:
                                                                form.role === r.value ? r.color : "#6b5a30",
                                                            fontFamily: "'Playfair Display', serif",
                                                            transition: "color 0.2s",
                                                        }}
                                                    >
                                                        {r.label}
                                                    </span>
                                                </div>
                                                <p
                                                    className="text-xs mb-2"
                                                    style={{
                                                        color: "#3a2e14",
                                                        fontFamily: "'DM Sans', sans-serif",
                                                    }}
                                                >
                                                    {r.desc}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {r.perms.map((p) => (
                                                        <span
                                                            key={p}
                                                            className="text-xs px-2 py-0.5 rounded-full"
                                                            style={{
                                                                background:
                                                                    form.role === r.value
                                                                        ? `${r.color}18`
                                                                        : "rgba(212,175,55,0.05)",
                                                                color:
                                                                    form.role === r.value ? r.color : "#3a2e14",
                                                                fontFamily: "'DM Mono', monospace",
                                                                fontSize: "10px",
                                                                transition: "all 0.2s",
                                                            }}
                                                        >
                                                            {p}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    className="next-btn"
                                    style={{ width: "auto", padding: "15px 20px", flexShrink: 0 }}
                                    onClick={() => {
                                        setStep(1);
                                        setError("");
                                    }}
                                >
                                    ← BACK
                                </button>
                                <button
                                    className="submit-btn"
                                    onClick={handleSubmit}
                                    disabled={loading || !form.role}
                                >
                                    {loading ? "Creating Account..." : "Create Account →"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-7">
                        <div
                            className="flex-1 h-px"
                            style={{ background: "rgba(212,175,55,0.08)" }}
                        />
                        <span
                            className="text-xs"
                            style={{ color: "#2a2010", fontFamily: "'DM Mono', monospace" }}
                        >
                            OR
                        </span>
                        <div
                            className="flex-1 h-px"
                            style={{ background: "rgba(212,175,55,0.08)" }}
                        />
                    </div>

                    <p
                        className="text-center text-sm"
                        style={{ color: "#3a2e14", fontFamily: "'DM Sans', sans-serif" }}
                    >
                        Already have an account?{" "}
                        <span
                            className="cursor-pointer hover:opacity-80 transition-opacity font-medium"
                            style={{ color: "#d4af37" }}
                            onClick={() => navigate("/login")}
                        >
                            Sign in →
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}