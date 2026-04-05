import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div
            className="px-4 py-3 rounded-xl border text-sm"
            style={{
                background: "#0a0702",
                borderColor: "rgba(212,175,55,0.2)",
                fontFamily: "'DM Mono', monospace",
            }}
        >
            <p
                className="text-xs mb-2 tracking-widest uppercase"
                style={{ color: "#5c4a22" }}
            >
                {label}
            </p>
            {payload.map((p) => (
                <div key={p.name} className="flex items-center gap-2 mb-1">
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: p.color }}
                    />
                    <span style={{ color: "#8a7340" }}>{p.name}:</span>
                    <span style={{ color: p.color }}>
                        ₹{Number(p.value).toLocaleString("en-IN")}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default function TrendsChart({ data, loading }) {
    if (loading) {
        return (
            <div
                className="rounded-2xl p-6 animate-pulse"
                style={{
                    background: "rgba(212,175,55,0.04)",
                    border: "1px solid rgba(212,175,55,0.08)",
                    height: "320px",
                }}
            />
        );
    }

    const chartData = (data || []).map((d) => ({
        month: d.month,
        Income: Number(d.income || 0),
        Expense: Number(d.expense || 0),
        Net: Number(d.net || 0),
    })).reverse();

    return (
        <div
            className="rounded-2xl p-6"
            style={{
                background: "linear-gradient(135deg, rgba(15,10,3,0.95) 0%, rgba(20,14,4,0.95) 100%)",
                border: "1px solid rgba(212,175,55,0.1)",
            }}
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p
                        className="text-xs tracking-[0.2em] uppercase mb-1"
                        style={{ color: "#5c4a22", fontFamily: "'DM Mono', monospace" }}
                    >
                        Monthly Overview
                    </p>
                    <h3
                        style={{
                            color: "#e8d5a3",
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "1.2rem",
                        }}
                    >
                        Income vs Expenses
                    </h3>
                </div>
                <div
                    className="px-3 py-1 rounded-full text-xs border"
                    style={{
                        borderColor: "rgba(212,175,55,0.15)",
                        color: "#5c4a22",
                        fontFamily: "'DM Mono', monospace",
                    }}
                >
                    Last 12 months
                </div>
            </div>

            {chartData.length === 0 ? (
                <div
                    className="flex items-center justify-center"
                    style={{ height: "240px" }}
                >
                    <p
                        style={{
                            color: "#3a2e14",
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "13px",
                        }}
                    >
                        No trend data available yet
                    </p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#d4af37" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(212,175,55,0.05)"
                        />
                        <XAxis
                            dataKey="month"
                            tick={{
                                fill: "#3a2e14",
                                fontSize: 11,
                                fontFamily: "'DM Mono', monospace",
                            }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{
                                fill: "#3a2e14",
                                fontSize: 11,
                                fontFamily: "'DM Mono', monospace",
                            }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "11px",
                                color: "#5c4a22",
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="Income"
                            stroke="#22c55e"
                            strokeWidth={2}
                            fill="url(#incomeGrad)"
                        />
                        <Area
                            type="monotone"
                            dataKey="Expense"
                            stroke="#ef4444"
                            strokeWidth={2}
                            fill="url(#expenseGrad)"
                        />
                        <Area
                            type="monotone"
                            dataKey="Net"
                            stroke="#d4af37"
                            strokeWidth={2}
                            fill="url(#netGrad)"
                            strokeDasharray="4 2"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}