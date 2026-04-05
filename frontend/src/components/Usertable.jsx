import { useState } from "react";

const roleColors = {
    admin: { bg: "rgba(232,213,163,0.1)", color: "#e8d5a3", border: "rgba(232,213,163,0.2)" },
    analyst: { bg: "rgba(212,175,55,0.1)", color: "#d4af37", border: "rgba(212,175,55,0.2)" },
    viewer: { bg: "rgba(74,144,217,0.1)", color: "#4a90d9", border: "rgba(74,144,217,0.2)" },
};

const statusColors = {
    active: { bg: "rgba(34,197,94,0.1)", color: "#22c55e", border: "rgba(34,197,94,0.2)" },
    inactive: { bg: "rgba(239,68,68,0.08)", color: "#ef4444", border: "rgba(239,68,68,0.15)" },
};

export default function UserTable({ users, loading, onUpdate, onDelete, currentUserId }) {
    const [editing, setEditing] = useState(null);
    const [editForm, setEditForm] = useState({});

    const startEdit = (user) => {
        setEditing(user.id);
        setEditForm({ role: user.role, status: user.status });
    };

    const cancelEdit = () => {
        setEditing(null);
        setEditForm({});
    };

    const saveEdit = async (userId) => {
        await onUpdate?.(userId, editForm);
        setEditing(null);
        setEditForm({});
    };

    const selectStyle = {
        background: "rgba(212,175,55,0.06)",
        border: "1px solid rgba(212,175,55,0.2)",
        color: "#d4af37",
        padding: "4px 8px",
        borderRadius: "8px",
        fontFamily: "'DM Mono', monospace",
        fontSize: "11px",
        outline: "none",
    };

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
                className="px-6 py-5 border-b"
                style={{ borderColor: "rgba(212,175,55,0.08)" }}
            >
                <p
                    className="text-xs tracking-[0.2em] uppercase mb-1"
                    style={{ color: "#5c4a22", fontFamily: "'DM Mono', monospace" }}
                >
                    Admin Panel
                </p>
                <h3
                    style={{
                        color: "#e8d5a3",
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.1rem",
                    }}
                >
                    User Management{" "}
                    <span style={{ color: "#5c4a22", fontSize: "0.9rem" }}>
                        ({users?.length || 0})
                    </span>
                </h3>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="p-8 space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-12 rounded-xl animate-pulse"
                                style={{ background: "rgba(212,175,55,0.04)" }}
                            />
                        ))}
                    </div>
                ) : users?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <span style={{ color: "#3a2e14", fontSize: "2rem" }}>⬡</span>
                        <p style={{ color: "#3a2e14", fontFamily: "'DM Mono', monospace", fontSize: "13px" }}>
                            No users found
                        </p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.06)" }}>
                                {["User", "Email", "Role", "Status", "Joined", "Actions"].map((h) => (
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
                            {users?.map((user) => {
                                const rc = roleColors[user.role] || roleColors.viewer;
                                const sc = statusColors[user.status] || statusColors.inactive;
                                const isMe = user.id === currentUserId;
                                const isEditing = editing === user.id;

                                return (
                                    <tr
                                        key={user.id}
                                        className="transition-colors hover:bg-amber-900/5"
                                        style={{ borderBottom: "1px solid rgba(212,175,55,0.04)" }}
                                    >
                                        {/* Name */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                                    style={{
                                                        background: `${rc.color}18`,
                                                        color: rc.color,
                                                        fontFamily: "'Playfair Display', serif",
                                                    }}
                                                >
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p
                                                        style={{
                                                            color: "#8a7340",
                                                            fontFamily: "'DM Sans', sans-serif",
                                                            fontSize: "13px",
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        {user.name}
                                                        {isMe && (
                                                            <span
                                                                className="ml-2 text-xs px-1.5 py-0.5 rounded"
                                                                style={{
                                                                    background: "rgba(212,175,55,0.1)",
                                                                    color: "#d4af37",
                                                                    fontFamily: "'DM Mono', monospace",
                                                                    fontSize: "9px",
                                                                }}
                                                            >
                                                                YOU
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-6 py-4">
                                            <span
                                                style={{
                                                    color: "#3a2e14",
                                                    fontFamily: "'DM Mono', monospace",
                                                    fontSize: "11px",
                                                }}
                                            >
                                                {user.email}
                                            </span>
                                        </td>

                                        {/* Role */}
                                        <td className="px-6 py-4">
                                            {isEditing ? (
                                                <select
                                                    value={editForm.role}
                                                    onChange={(e) =>
                                                        setEditForm((p) => ({ ...p, role: e.target.value }))
                                                    }
                                                    style={selectStyle}
                                                >
                                                    <option value="viewer">Viewer</option>
                                                    <option value="analyst">Analyst</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            ) : (
                                                <span
                                                    className="px-2.5 py-1 rounded-full text-xs"
                                                    style={{
                                                        background: rc.bg,
                                                        color: rc.color,
                                                        border: `1px solid ${rc.border}`,
                                                        fontFamily: "'DM Mono', monospace",
                                                        fontSize: "10px",
                                                    }}
                                                >
                                                    {user.role}
                                                </span>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            {isEditing ? (
                                                <select
                                                    value={editForm.status}
                                                    onChange={(e) =>
                                                        setEditForm((p) => ({ ...p, status: e.target.value }))
                                                    }
                                                    style={selectStyle}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            ) : (
                                                <span
                                                    className="px-2.5 py-1 rounded-full text-xs"
                                                    style={{
                                                        background: sc.bg,
                                                        color: sc.color,
                                                        border: `1px solid ${sc.border}`,
                                                        fontFamily: "'DM Mono', monospace",
                                                        fontSize: "10px",
                                                    }}
                                                >
                                                    {user.status}
                                                </span>
                                            )}
                                        </td>

                                        {/* Joined */}
                                        <td className="px-6 py-4">
                                            <span
                                                style={{
                                                    color: "#3a2e14",
                                                    fontFamily: "'DM Mono', monospace",
                                                    fontSize: "11px",
                                                }}
                                            >
                                                {new Date(user.created_at).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            {isEditing ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => saveEdit(user.id)}
                                                        className="px-3 py-1 rounded-lg text-xs transition-all hover:opacity-80"
                                                        style={{
                                                            background: "rgba(34,197,94,0.1)",
                                                            color: "#22c55e",
                                                            border: "1px solid rgba(34,197,94,0.2)",
                                                            fontFamily: "'DM Mono', monospace",
                                                        }}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="px-3 py-1 rounded-lg text-xs transition-all hover:opacity-80"
                                                        style={{
                                                            background: "rgba(212,175,55,0.06)",
                                                            color: "#5c4a22",
                                                            border: "1px solid rgba(212,175,55,0.12)",
                                                            fontFamily: "'DM Mono', monospace",
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => startEdit(user)}
                                                        disabled={isMe}
                                                        className="px-3 py-1 rounded-lg text-xs transition-all hover:opacity-80 disabled:opacity-20 disabled:cursor-not-allowed"
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
                                                        onClick={() => onDelete?.(user.id)}
                                                        disabled={isMe}
                                                        className="px-3 py-1 rounded-lg text-xs transition-all hover:opacity-80 disabled:opacity-20 disabled:cursor-not-allowed"
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
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}