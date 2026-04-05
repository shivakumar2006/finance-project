import { useState, useEffect } from "react";

const inputStyle = {
    background: "rgba(212,175,55,0.04)",
    border: "1px solid rgba(212,175,55,0.15)",
    color: "#e8d5a3",
    padding: "12px 14px",
    borderRadius: "10px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    outline: "none",
    width: "100%",
    transition: "border-color 0.2s",
};

const labelStyle = {
    color: "#5c4a22",
    fontFamily: "'DM Mono', monospace",
    fontSize: "10px",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "6px",
};

export default function TransactionForm({ open, onClose, onSubmit, initial }) {
    const isEdit = !!initial;
    const [form, setForm] = useState({
        amount: "",
        type: "income",
        category: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (initial) {
            setForm({
                amount: initial.amount ?? "",
                type: initial.type ?? "income",
                category: initial.category ?? "",
                date: initial.date
                    ? new Date(initial.date).toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0],
                notes: initial.notes ?? "",
            });
        } else {
            setForm({
                amount: "",
                type: "income",
                category: "",
                date: new Date().toISOString().split("T")[0],
                notes: "",
            });
        }
        setError("");
    }, [initial, open]);

    const handleChange = (e) => {
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
        setError("");
    };

    const handleSubmit = async () => {
        if (!form.amount || !form.category || !form.date) {
            setError("Amount, category and date are required.");
            return;
        }
        if (Number(form.amount) <= 0) {
            setError("Amount must be greater than zero.");
            return;
        }

        setLoading(true);
        try {
            await onSubmit({ ...form, amount: Number(form.amount) });
            onClose();
        } catch (e) {
            setError(e.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(6,4,1,0.85)", backdropFilter: "blur(8px)" }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="w-full max-w-md rounded-2xl overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, #0e0a02 0%, #130e03 100%)",
                    border: "1px solid rgba(212,175,55,0.15)",
                    animation: "fadeUp 0.3s ease forwards",
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-5 border-b"
                    style={{ borderColor: "rgba(212,175,55,0.08)" }}
                >
                    <div>
                        <p style={labelStyle}>
                            {isEdit ? "Update Record" : "New Record"}
                        </p>
                        <h2
                            style={{
                                color: "#e8d5a3",
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "1.2rem",
                            }}
                        >
                            {isEdit ? "Edit Transaction" : "Create Transaction"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-amber-900/20"
                        style={{ color: "#5c4a22" }}
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <div className="px-6 py-5 space-y-4">
                    {error && (
                        <div
                            className="px-4 py-3 rounded-xl text-sm border"
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

                    {/* Type toggle */}
                    <div>
                        <label style={labelStyle}>Type</label>
                        <div
                            className="flex rounded-xl overflow-hidden border"
                            style={{ borderColor: "rgba(212,175,55,0.12)" }}
                        >
                            {["income", "expense"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setForm((p) => ({ ...p, type: t }))}
                                    className="flex-1 py-2.5 text-xs font-medium capitalize transition-all"
                                    style={{
                                        background:
                                            form.type === t
                                                ? t === "income"
                                                    ? "rgba(34,197,94,0.15)"
                                                    : "rgba(239,68,68,0.15)"
                                                : "transparent",
                                        color:
                                            form.type === t
                                                ? t === "income"
                                                    ? "#22c55e"
                                                    : "#ef4444"
                                                : "#3a2e14",
                                        fontFamily: "'DM Mono', monospace",
                                        letterSpacing: "0.05em",
                                        borderRight: t === "income" ? "1px solid rgba(212,175,55,0.12)" : "none",
                                    }}
                                >
                                    {t === "income" ? "↑ Income" : "↓ Expense"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Amount */}
                    <div>
                        <label style={labelStyle}>Amount (₹)</label>
                        <input
                            type="number"
                            name="amount"
                            placeholder="0.00"
                            value={form.amount}
                            onChange={handleChange}
                            style={inputStyle}
                            min="0"
                            step="0.01"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label style={labelStyle}>Category</label>
                        <input
                            type="text"
                            name="category"
                            placeholder="e.g. Salary, Rent, Food"
                            value={form.category}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label style={labelStyle}>Date</label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label style={labelStyle}>Notes (optional)</label>
                        <textarea
                            name="notes"
                            placeholder="Add a note..."
                            value={form.notes}
                            onChange={handleChange}
                            rows={2}
                            style={{ ...inputStyle, resize: "none" }}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div
                    className="flex items-center gap-3 px-6 py-4 border-t"
                    style={{ borderColor: "rgba(212,175,55,0.08)" }}
                >
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl text-sm border transition-all hover:border-amber-600/40"
                        style={{
                            background: "transparent",
                            borderColor: "rgba(212,175,55,0.15)",
                            color: "#5c4a22",
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "11px",
                            letterSpacing: "0.08em",
                        }}
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                        style={{
                            background: "linear-gradient(135deg, #d4af37, #b8963e)",
                            color: "#060401",
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        {loading ? "Saving..." : isEdit ? "Update →" : "Create →"}
                    </button>
                </div>
            </div>
        </div>
    );
}