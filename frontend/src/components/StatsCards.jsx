const cards = [
    {
        key: "total_income",
        label: "Total Income",
        icon: "↑",
        color: "#22c55e",
        format: (v) => `₹${Number(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
    },
    {
        key: "total_expense",
        label: "Total Expenses",
        icon: "↓",
        color: "#ef4444",
        format: (v) => `₹${Number(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
    },
    {
        key: "net_balance",
        label: "Net Balance",
        icon: "◈",
        color: "#d4af37",
        format: (v) => {
            const val = Number(v || 0);
            return `${val >= 0 ? "+" : ""}₹${Math.abs(val).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
        },
    },
];

export default function StatsCards({ summary, loading }) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="rounded-2xl p-6 animate-pulse"
                        style={{
                            background: "rgba(212,175,55,0.04)",
                            border: "1px solid rgba(212,175,55,0.08)",
                            height: "120px",
                        }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cards.map((card, i) => {
                const value = summary?.[card.key] ?? 0;
                const isNegative = card.key === "net_balance" && value < 0;

                return (
                    <div
                        key={card.key}
                        className="relative rounded-2xl p-6 overflow-hidden group"
                        style={{
                            background: "linear-gradient(135deg, rgba(15,10,3,0.95) 0%, rgba(20,14,4,0.95) 100%)",
                            border: "1px solid rgba(212,175,55,0.1)",
                            animationDelay: `${i * 100}ms`,
                            animation: "fadeUp 0.6s ease forwards",
                            opacity: 0,
                        }}
                    >
                        {/* Hover glow */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                            style={{
                                background: `radial-gradient(circle at 0% 0%, ${card.color}08 0%, transparent 60%)`,
                            }}
                        />

                        {/* Icon */}
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-base mb-4"
                            style={{
                                background: `${card.color}15`,
                                color: card.color,
                                border: `1px solid ${card.color}25`,
                            }}
                        >
                            {card.icon}
                        </div>

                        {/* Label */}
                        <p
                            className="text-xs tracking-[0.12em] uppercase mb-2"
                            style={{
                                color: "#5c4a22",
                                fontFamily: "'DM Mono', monospace",
                            }}
                        >
                            {card.label}
                        </p>

                        {/* Value */}
                        <p
                            className="text-2xl font-bold"
                            style={{
                                color: isNegative ? "#ef4444" : card.color,
                                fontFamily: "'Playfair Display', serif",
                                textShadow: `0 0 20px ${card.color}25`,
                            }}
                        >
                            {card.format(value)}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}