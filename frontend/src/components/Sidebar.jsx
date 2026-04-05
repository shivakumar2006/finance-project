import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = {
    viewer: [
        { icon: "◈", label: "Overview", path: "/dashboard" },
        { icon: "◎", label: "Transactions", path: "/dashboard/transactions" },
    ],
    analyst: [
        { icon: "◈", label: "Overview", path: "/dashboard" },
        { icon: "◎", label: "Transactions", path: "/dashboard/transactions" },
        { icon: "▲", label: "Trends", path: "/dashboard/trends" },
        { icon: "◉", label: "Categories", path: "/dashboard/categories" },
    ],
    admin: [
        { icon: "◈", label: "Overview", path: "/dashboard" },
        { icon: "◎", label: "Transactions", path: "/dashboard/transactions" },
        { icon: "▲", label: "Trends", path: "/dashboard/trends" },
        { icon: "◉", label: "Categories", path: "/dashboard/categories" },
        { icon: "⬡", label: "Users", path: "/dashboard/users" },
    ],
};

const roleColors = {
    admin: "#e8d5a3",
    analyst: "#d4af37",
    viewer: "#4a90d9",
};

export default function Sidebar({ user, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const items = navItems[user?.role] || navItems.viewer;
    const roleColor = roleColors[user?.role] || "#4a90d9";

    return (
        <aside
            className="flex flex-col h-screen sticky top-0 transition-all duration-300"
            style={{
                width: collapsed ? "72px" : "240px",
                background: "linear-gradient(180deg, #0a0702 0%, #080600 100%)",
                borderRight: "1px solid rgba(212,175,55,0.08)",
                flexShrink: 0,
            }}
        >
            {/* Logo */}
            <div
                className="flex items-center gap-3 px-4 py-5 border-b"
                style={{ borderColor: "rgba(212,175,55,0.08)" }}
            >
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0"
                    style={{
                        background: "linear-gradient(135deg, #d4af37, #8a7340)",
                        color: "#060401",
                        fontFamily: "'Playfair Display', serif",
                    }}
                >
                    F
                </div>
                {!collapsed && (
                    <span
                        style={{
                            color: "#d4af37",
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "1rem",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                        }}
                    >
                        FinanceOS
                    </span>
                )}
                <button
                    onClick={() => setCollapsed((c) => !c)}
                    className="ml-auto text-xs transition-opacity hover:opacity-80"
                    style={{ color: "#3a2e14" }}
                >
                    {collapsed ? "→" : "←"}
                </button>
            </div>

            {/* User badge */}
            {!collapsed && (
                <div
                    className="mx-3 mt-4 mb-2 p-3 rounded-xl border"
                    style={{
                        borderColor: `${roleColor}22`,
                        background: `${roleColor}08`,
                    }}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: roleColor }}
                        />
                        <span
                            className="text-xs font-medium"
                            style={{ color: roleColor, fontFamily: "'DM Mono', monospace" }}
                        >
                            {user?.role?.toUpperCase()}
                        </span>
                    </div>
                    <p
                        className="text-sm font-medium truncate"
                        style={{ color: "#8a7340", fontFamily: "'DM Sans', sans-serif" }}
                    >
                        {user?.name}
                    </p>
                    <p
                        className="text-xs truncate"
                        style={{ color: "#3a2e14", fontFamily: "'DM Sans', sans-serif" }}
                    >
                        {user?.email}
                    </p>
                </div>
            )}

            {/* Nav items */}
            <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
                {items.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left"
                            style={{
                                background: active
                                    ? "rgba(212,175,55,0.1)"
                                    : "transparent",
                                borderLeft: active
                                    ? "2px solid #d4af37"
                                    : "2px solid transparent",
                            }}
                        >
                            <span
                                className="text-base shrink-0"
                                style={{
                                    color: active ? "#d4af37" : "#3a2e14",
                                    transition: "color 0.2s",
                                }}
                            >
                                {item.icon}
                            </span>
                            {!collapsed && (
                                <span
                                    className="text-sm"
                                    style={{
                                        color: active ? "#d4af37" : "#5c4a22",
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontWeight: active ? 500 : 400,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {item.label}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Logout */}
            <div
                className="p-3 border-t"
                style={{ borderColor: "rgba(212,175,55,0.08)" }}
            >
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-red-900/10"
                >
                    <span style={{ color: "#5c2a2a", fontSize: "14px" }}>⊗</span>
                    {!collapsed && (
                        <span
                            className="text-sm"
                            style={{ color: "#5c2a2a", fontFamily: "'DM Sans', sans-serif" }}
                        >
                            Sign Out
                        </span>
                    )}
                </button>
            </div>
        </aside>
    );
}