import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../redux/api/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/apiSlice";

export default function LoginPage() {
    const [login] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPass, setShowPass] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
    };

    const handleSubmit = async () => {
        if (!form.email || !form.password) {
            setError("Both feilds are required")
            return;
        }

        setLoading(true);
        setError("");

        try {
            const data = await login(form).unwrap();

            dispatch(setCredentials(data));

            switch (data.user.role) {
                case "admin":
                    navigate("/dashboard/admin");
                    break;
                case "analyst":
                    navigate("/dashboard/analyst");
                    break;
                default:
                    navigate("/dashboard")
                    break;
            }

        } catch (error) {
            setError(err?.data?.error || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSubmit();
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
        @keyframes pulse-gold {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .form-card {
          animation: fadeUp 0.8s ease 0.2s forwards;
          opacity: 0;
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
        .input-field::placeholder {
          color: #3a2e14;
        }
        .input-field:focus {
          border-color: rgba(212,175,55,0.5);
          background: rgba(212,175,55,0.07);
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
      `}</style>

            {/* Left panel — decorative */}
            <div
                className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
                style={{
                    background:
                        "linear-gradient(160deg, #0a0702 0%, #100d03 50%, #080600 100%)",
                    borderRight: "1px solid rgba(212,175,55,0.08)",
                }}
            >
                {/* Grid bg */}
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
                        background:
                            "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)",
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

                {/* Center quote */}
                <div className="relative">
                    <div
                        className="text-6xl mb-6 leading-none"
                        style={{ color: "rgba(212,175,55,0.15)", fontFamily: "'Playfair Display', serif" }}
                    >
                        "
                    </div>
                    <p
                        className="text-2xl leading-snug mb-6"
                        style={{
                            color: "#6b5a30",
                            fontFamily: "'Playfair Display', serif",
                            fontStyle: "italic",
                        }}
                    >
                        Control your finances,
                        <br />
                        <span style={{ color: "#d4af37" }}>control your future.</span>
                    </p>
                    <div
                        className="w-12 h-px"
                        style={{ background: "rgba(212,175,55,0.3)" }}
                    />
                </div>

                {/* Bottom role hint */}
                <div className="relative space-y-3">
                    <p
                        className="text-xs tracking-[0.2em] uppercase mb-4"
                        style={{ color: "#3a2e14", fontFamily: "'DM Mono', monospace" }}
                    >
                        Your access level
                    </p>
                    {[
                        { role: "Viewer", desc: "Dashboard & reports", color: "#4a90d9" },
                        { role: "Analyst", desc: "Insights & trends", color: "#d4af37" },
                        { role: "Admin", desc: "Full control", color: "#e8d5a3" },
                    ].map((r) => (
                        <div key={r.role} className="flex items-center gap-3">
                            <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: r.color }}
                            />
                            <span
                                className="text-xs"
                                style={{
                                    color: r.color,
                                    fontFamily: "'DM Mono', monospace",
                                    opacity: 0.7,
                                }}
                            >
                                {r.role}
                            </span>
                            <span
                                className="text-xs"
                                style={{ color: "#2a2010", fontFamily: "'DM Sans', sans-serif" }}
                            >
                                — {r.desc}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="form-card w-full max-w-md">
                    {/* Header */}
                    <div className="mb-10">
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

                        <p
                            className="text-xs tracking-[0.2em] uppercase mb-3"
                            style={{ color: "#5c4a22", fontFamily: "'DM Mono', monospace" }}
                        >
                            Welcome Back
                        </p>
                        <h1
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "2rem",
                                color: "#e8d5a3",
                                lineHeight: 1.2,
                                marginBottom: "8px",
                            }}
                        >
                            Sign in to your{" "}
                            <span style={{ color: "#d4af37", fontStyle: "italic" }}>
                                account
                            </span>
                        </h1>
                        <p
                            style={{
                                color: "#3a2e14",
                                fontSize: "13px",
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            Access granted based on your assigned role
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

                    {/* Form */}
                    <div className="space-y-4">
                        <div>
                            <label
                                className="block text-xs mb-2 tracking-[0.1em] uppercase"
                                style={{ color: "#5c4a22", fontFamily: "'DM Mono', monospace" }}
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
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label
                                    className="text-xs tracking-[0.1em] uppercase"
                                    style={{
                                        color: "#5c4a22",
                                        fontFamily: "'DM Mono', monospace",
                                    }}
                                >
                                    Password
                                </label>
                                <span
                                    className="text-xs cursor-pointer hover:opacity-80 transition-opacity"
                                    style={{ color: "#8a7340", fontFamily: "'DM Mono', monospace" }}
                                >
                                    Forgot?
                                </span>
                            </div>
                            <div className="relative">
                                <input
                                    className="input-field"
                                    type={showPass ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    style={{ paddingRight: "48px" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass((p) => !p)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs transition-opacity hover:opacity-80"
                                    style={{ color: "#5c4a22", fontFamily: "'DM Mono', monospace" }}
                                >
                                    {showPass ? "HIDE" : "SHOW"}
                                </button>
                            </div>
                        </div>

                        <div style={{ paddingTop: "8px" }}>
                            <button
                                className="submit-btn"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? "Authenticating..." : "Sign In →"}
                            </button>
                        </div>
                    </div>

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

                    {/* Signup link */}
                    <p
                        className="text-center text-sm"
                        style={{ color: "#3a2e14", fontFamily: "'DM Sans', sans-serif" }}
                    >
                        Don't have an account?{" "}
                        <span
                            className="cursor-pointer hover:opacity-80 transition-opacity font-medium"
                            style={{ color: "#d4af37" }}
                            onClick={() => navigate("/signup")}
                        >
                            Create one →
                        </span>
                    </p>

                    {/* Demo hint */}
                    <div
                        className="mt-8 p-4 rounded-xl border"
                        style={{
                            borderColor: "rgba(212,175,55,0.08)",
                            background: "rgba(212,175,55,0.02)",
                        }}
                    >
                        <p
                            className="text-xs mb-2 tracking-[0.1em] uppercase"
                            style={{ color: "#3a2e14", fontFamily: "'DM Mono', monospace" }}
                        >
                            Demo Credentials
                        </p>
                        {[
                            { role: "Admin", email: "admin@demo.com", color: "#e8d5a3" },
                            { role: "Analyst", email: "analyst@demo.com", color: "#d4af37" },
                            { role: "Viewer", email: "viewer@demo.com", color: "#4a90d9" },
                        ].map((d) => (
                            <div
                                key={d.role}
                                className="flex items-center justify-between py-1 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() =>
                                    setForm({ email: d.email, password: "password123" })
                                }
                            >
                                <span
                                    className="text-xs"
                                    style={{ color: d.color, fontFamily: "'DM Mono', monospace", opacity: 0.7 }}
                                >
                                    {d.role}
                                </span>
                                <span
                                    className="text-xs"
                                    style={{
                                        color: "#3a2e14",
                                        fontFamily: "'DM Mono', monospace",
                                    }}
                                >
                                    {d.email}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}