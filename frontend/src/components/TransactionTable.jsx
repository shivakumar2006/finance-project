import { useState } from "react";

const typeColors = {
    income: { bg: "rgba(34,197,94,0.1)", color: "#22c55e", border: "rgba(34,197,94,0.2)" },
    expense: { bg: "rgba(239,68,68,0.1)", color: "#ef4444", border: "rgba(239,68,68,0.2)" },
};

export default function TransactionTable({
    data,
    loading,
    total,
    page,
    limit,
    onPageChange,
    onFilterChange,
    filters,
    role,
    onEdit,
    onDelete,
    onCreate,
}) {
    const [localFilters, setLocalFilters] = useState(filters || {});

    const handleFilterChange = (key, val) => {
        const updated = { ...localFilters, [key]: val };
        setLocalFilters(updated);
        onFilterChange?.(updated);
    };

    const totalPages = Math.ceil(total / limit) || 1;

    return (
        <div
            className="rounded-2xl overflow-hidden"
            style={{
                background: "linear-gradient(135deg, rgba(15,10,3,0.95) 0%, rgba(20,14,4,0.95) 100%)",
                border: "1px solid rgba(212,175,55,0.1)",
            }}
        >
            {/* Header */}
            <div
                className="flex flex-wrap items-center justify-between gap-4 p-6 border-b"
                style={{ borderColor: "rgba(212,175,55,0.08)" }}
            >
                <div>
                    <p
                        className="text-xs tracking-[0.2em] uppercase mb-1"
                        style={{ color: "#5c4a22", fontFamily: "'DM Mono', monospace" }}
                    >
                        Records
                    </p>
                    <h3
                        style={{
                            color: "#e8d5a3",
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "1.1rem",
                        }}
                    >
                        Transactions{" "}
                        <span
                            style={{
                                color: "#5c4a22",
                                fontSize: "0.9rem",
                                fontStyle: "normal",
                            }}
                        >
                            ({total || 0})
                        </span>
                    </h3>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Type filter */}
                    <select
                        value={localFilters.type || ""}
                        onChange={(e) => handleFilterChange("type", e.target.value)}
                        style={{
                            background: "rgba(212,175,55,0.05)",
                            border: "1px solid rgba(212,175,55,0.15)",
                            color: "#8a7340",
                            padding: "8px 12px",
                            borderRadius: "10px",
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "11px",
                            outline: "none",
                        }}
                    >
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>

                    {/* Category filter */}
                    <input
                        type="text"
                        placeholder="Category..."
                        value={localFilters.category || ""}
                        onChange={(e) => handleFilterChange("category", e.target.value)}
                        style={{
                            background: "rgba(212,175,55,0.05)",
                            border: "1px solid rgba(212,175,55,0.15)",
                            color: "#8a7340",
                            padding: "8px 12px",
                            borderRadius: "10px",
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "11px",
                            outline: "none",
                            width: "120px",
                        }}
                    />

                    {/* Date range */}
                    <input
                        type="date"
                        value={localFilters.start_date || ""}
                        onChange={(e) => handleFilterChange("start_date", e.target.value)}
                        style={{
                            background: "rgba(212,175,55,0.05)",
                            border: "1px solid rgba(212,175,55,0.15)",
                            color: "#5c4a22",
                            padding: "8px 12px",
                            borderRadius: "10px",
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "11px",
                            outline: "none",
                        }}
                    />

                    {/* Admin create btn */}
                    {role === "admin" && (
                        <button
                            onClick={onCreate}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
                            style={{
                                background: "linear-gradient(135deg, #d4af37, #b8963e)",
                                color: "#060401",
                                fontFamily: "'DM Mono', monospace",
                                letterSpacing: "0.05em",
                            }}
                        >
                            + New
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="p-8 space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="h-10 rounded-xl animate-pulse"
                                style={{ background: "rgba(212,175,55,0.04)" }}
                            />
                        ))}
                    </div>
                ) : data?.length === 0 ? (
                    <div
                        className="flex flex-col items-center justify-center py-16 gap-3"
                    >
                        <span style={{ color: "#3a2e14", fontSize: "2rem" }}>◎</span>
                        <p
                            style={{
                                color: "#3a2e14",
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "13px",
                            }}
                        >
                            No transactions found
                        </p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr
                                style={{ borderBottom: "1px solid rgba(212,175,55,0.06)" }}
                            >
                                {["Date", "Category", "Type", "Amount", "Notes", role === "admin" ? "Actions" : null]
                                    .filter(Boolean)
                                    .map((h) => (
                                        <th
                                            key={h}
                                            className="text-left px-6 py-3"
                                            style={{
                                                color: "#3a2e14",
                                                fontFamily: "'DM Mono', monospace",
                                                fontSize: "10px",
                                                letterSpacing: "0.15em",
                                                textTransform: "uppercase",
                                                fontWeight: 500,
                                            }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((tx, i) => {
                                const tc = typeColors[tx.type] || typeColors.income;
                                return (
                                    <tr
                                        key={tx.id}
                                        className="transition-colors hover:bg-amber-900/5"
                                        style={{
                                            borderBottom: "1px solid rgba(212,175,55,0.04)",
                                            animationDelay: `${i * 40}ms`,
                                        }}
                                    >
                                        <td className="px-6 py-4">
                                            <span
                                                style={{
                                                    color: "#5c4a22",
                                                    fontFamily: "'DM Mono', monospace",
                                                    fontSize: "12px",
                                                }}
                                            >
                                                {new Date(tx.date).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                style={{
                                                    color: "#8a7340",
                                                    fontFamily: "'DM Sans', sans-serif",
                                                    fontSize: "13px",
                                                }}
                                            >
                                                {tx.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className="px-2.5 py-1 rounded-full text-xs"
                                                style={{
                                                    background: tc.bg,
                                                    color: tc.color,
                                                    border: `1px solid ${tc.border}`,
                                                    fontFamily: "'DM Mono', monospace",
                                                    fontSize: "10px",
                                                    letterSpacing: "0.05em",
                                                }}
                                            >
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                style={{
                                                    color: tx.type === "income" ? "#22c55e" : "#ef4444",
                                                    fontFamily: "'Playfair Display', serif",
                                                    fontSize: "1rem",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {tx.type === "income" ? "+" : "-"}₹
                                                {Number(tx.amount).toLocaleString("en-IN", {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                style={{
                                                    color: "#3a2e14",
                                                    fontFamily: "'DM Sans', sans-serif",
                                                    fontSize: "12px",
                                                }}
                                            >
                                                {tx.notes || "—"}
                                            </span>
                                        </td>
                                        {role === "admin" && (
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => onEdit?.(tx)}
                                                        className="px-3 py-1 rounded-lg text-xs transition-all hover:opacity-80"
                                                        style={{
                                                            background: "rgba(212,175,55,0.08)",
                                                            color: "#8a7340",
                                                            border: "1px solid rgba(212,175,55,0.15)",
                                                            fontFamily: "'DM Mono', monospace",
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => onDelete?.(tx.id)}
                                                        className="px-3 py-1 rounded-lg text-xs transition-all hover:opacity-80"
                                                        style={{
                                                            background: "rgba(239,68,68,0.08)",
                                                            color: "#ef4444",
                                                            border: "1px solid rgba(239,68,68,0.15)",
                                                            fontFamily: "'DM Mono', monospace",
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div
                    className="flex items-center justify-between px-6 py-4 border-t"
                    style={{ borderColor: "rgba(212,175,55,0.08)" }}
                >
                    <span
                        style={{
                            color: "#3a2e14",
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "11px",
                        }}
                    >
                        Page {page} of {totalPages}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange?.(page - 1)}
                            disabled={page <= 1}
                            className="px-3 py-1.5 rounded-lg text-xs transition-all disabled:opacity-30"
                            style={{
                                background: "rgba(212,175,55,0.06)",
                                color: "#8a7340",
                                border: "1px solid rgba(212,175,55,0.12)",
                                fontFamily: "'DM Mono', monospace",
                            }}
                        >
                            ← Prev
                        </button>
                        <button
                            onClick={() => onPageChange?.(page + 1)}
                            disabled={page >= totalPages}
                            className="px-3 py-1.5 rounded-lg text-xs transition-all disabled:opacity-30"
                            style={{
                                background: "rgba(212,175,55,0.06)",
                                color: "#8a7340",
                                border: "1px solid rgba(212,175,55,0.12)",
                                fontFamily: "'DM Mono', monospace",
                            }}
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}