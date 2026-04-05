import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";

const COLORS = [
    "#d4af37", "#22c55e", "#4a90d9", "#ef4444",
    "#8b5cf6", "#f97316", "#06b6d4", "#ec4899",
];

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    return (
        <div
            className="px-4 py-3 rounded-xl border text-sm"
            style={{
                background: "#0a0702",
                borderColor: "rgba(212,175,55,0.2)",
                fontFamily: "'DM Mono', monospace",
            }}
        >
            <p style={{ color: "#8a7340" }}>{d.name}</p>
            <p style={{ color: d.payload.fill }}>
                ₹{Number(d.value).toLocaleString("en-IN")}
            </p>
        </div>
    );
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text
            x={x}
            y={y}
            fill="#060401"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={11}
            fontFamily="'DM Mono', monospace"
            fontWeight={600}
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export default function CategoryChart({ data, loading }) {
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
        name: `${d.category} (${d.type})`,
        value: Number(d.total || 0),
    }));

    return (
        <div
            className="rounded-2xl p-6"
            style={{
                background: "linear-gradient(135deg, rgba(15,10,3,0.95) 0%, rgba(20,14,4,0.95) 100%)",
                border: "1px solid rgba(212,175,55,0.1)",
            }}
        >
            <div className="mb-6">
                <p
                    className="text-xs tracking-[0.2em] uppercase mb-1"
                    style={{ color: "#5c4a22", fontFamily: "'DM Mono', monospace" }}
                >
                    Breakdown
                </p>
                <h3
                    style={{
                        color: "#e8d5a3",
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.2rem",
                    }}
                >
                    Category Totals
                </h3>
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
                        No category data available yet
                    </p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={95}
                            paddingAngle={3}
                            dataKey="value"
                            labelLine={false}
                            label={CustomLabel}
                        >
                            {chartData.map((_, i) => (
                                <Cell
                                    key={i}
                                    fill={COLORS[i % COLORS.length]}
                                    stroke="transparent"
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "10px",
                                color: "#5c4a22",
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}