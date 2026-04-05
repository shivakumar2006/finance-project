import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StatsCards from "../components/StatsCards";
import TrendsChart from "../components/TrendsChart";
import CategoryChart from "../components/CategoryChart";
import TransactionTable from "../components/TransactionTable";
import TransactionForm from "../components/TransactionForm";
import UserTable from "../components/Usertable";
import { useSelector, useDispatch } from "react-redux";

import {
    useGetSummaryQuery,
    useGetTrendsQuery,
    useGetCategoryTotalsQuery,
    useGetTransactionQuery,
    useGetUsersQuery,
    useCreateTransactionMutation,
    useUpdateTransactionMutation,
    useDeleteTransactionMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} from "../redux/api/api";

import { logout } from "../redux/apiSlice";
import { toast, Bounce } from "react-toastify";

export default function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);

    const role = user?.role;
    const isAdmin = role === "admin";
    const isAnalyst = role === "analyst" || isAdmin;

    // UI states
    const [txPage, setTxPage] = useState(1);
    const [txFilters, setTxFilters] = useState({});
    const [formOpen, setFormOpen] = useState(false);
    const [editingTx, setEditingTx] = useState(null);
    const [activeSection, setActiveSection] = useState("overview");
    const [toasts, setToast] = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Queries
    const { data: summary, isLoading: loadingSummary } = useGetSummaryQuery();

    const { data: trendsData, isLoading: loadingTrends } =
        useGetTrendsQuery(undefined, { skip: !isAnalyst });

    const { data: categoriesData } =
        useGetCategoryTotalsQuery(undefined, { skip: !isAnalyst });

    const trends = trendsData || [];
    const categories = categoriesData?.data || [];

    const { data: txData, isLoading: loadingTx } =
        useGetTransactionQuery({
            page: txPage,
            limit: 10,
            ...txFilters,
        });

    const transactions = txData?.data || [];
    const txTotal = txData?.total || 0;

    const { data: usersData, isLoading: loadingUsers } =
        useGetUsersQuery(undefined, { skip: !isAdmin });

    const users = usersData?.users || [];

    // Mutations
    const [createTx] = useCreateTransactionMutation();
    const [updateTx] = useUpdateTransactionMutation();
    const [deleteTx] = useDeleteTransactionMutation();

    const [updateUser] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();


    // Transaction handlers
    const handleCreateTx = async (form) => {
        const { user_id, ...cleanForm } = form;

        const formattedDate = cleanForm.date
            ? cleanForm.date.split("/").reverse().join("-")
            : "";

        const payload = {
            ...cleanForm,
            amount: Number(cleanForm.amount),
            date: formattedDate,
        };

        console.log("FINAL PAYLOAD:", payload); // 🔥 ADD THIS

        await createTx(payload).unwrap();

        showToast("Transaction created");
    };

    const handleUpdateTx = async (form) => {
        const { user_id, ...cleanForm } = form;

        const formattedDate = cleanForm.date
            ? cleanForm.date.split("/").reverse().join("-")
            : "";

        await updateTx({
            id: editingTx.id,
            data: {
                ...cleanForm,
                amount: Number(cleanForm.amount),
                date: formattedDate,
            }
        }).unwrap();

        showToast("Transaction updated");
    };

    const handleDeleteTx = async (id) => {
        if (!window.confirm("Delete this transaction?")) return;
        await deleteTx(id).unwrap();
        showToast("Transaction deleted");
    };

    // User handlers
    const handleUpdateUser = async (id, form) => {
        await updateUser({ id, data: form }).unwrap();
        showToast("User updated");
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Delete this user?")) return;
        await deleteUser(id).unwrap();
        showToast("User deleted");
    };

    // Logout
    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
        toast.success("Logged out successfully", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        })
    };

    // console.log("SUMMARY RAW:", summary);
    // console.log("TX RAW:", txData);
    // console.log("TRENDS RAW:", trendsData);
    // console.log("user data", usersData);

    return (
        <div
            className="flex min-h-screen"
            style={{ background: "#060401", fontFamily: "'DM Sans', sans-serif" }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

            {/* Sidebar */}
            <Sidebar user={user} onLogout={handleLogout} />

            {/* Main content */}
            <main className="flex-1 overflow-auto">
                {/* Top header */}
                <div
                    className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 border-b"
                    style={{
                        background: "rgba(6,4,1,0.9)",
                        backdropFilter: "blur(20px)",
                        borderColor: "rgba(212,175,55,0.08)",
                    }}
                >
                    <div>
                        <p
                            className="text-xs tracking-[0.15em] uppercase"
                            style={{ color: "#3a2e14", fontFamily: "'DM Mono', monospace" }}
                        >
                            {new Date().toLocaleDateString("en-IN", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                        <h1
                            style={{
                                color: "#e8d5a3",
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "1.3rem",
                            }}
                        >
                            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"},{" "}
                            <span style={{ color: "#d4af37", fontStyle: "italic" }}>
                                {user?.name?.split(" ")[0]}
                            </span>
                        </h1>
                    </div>

                    {/* Section tabs */}
                    <div
                        className="hidden md:flex items-center gap-1 p-1 rounded-xl border"
                        style={{ borderColor: "rgba(212,175,55,0.1)", background: "rgba(212,175,55,0.03)" }}
                    >
                        {[
                            { key: "overview", label: "Overview" },
                            { key: "transactions", label: "Transactions" },
                            ...(isAnalyst ? [{ key: "analytics", label: "Analytics" }] : []),
                            ...(isAdmin ? [{ key: "users", label: "Users" }] : []),
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveSection(tab.key)}
                                className="px-4 py-1.5 rounded-lg text-xs transition-all duration-200"
                                style={{
                                    background:
                                        activeSection === tab.key
                                            ? "rgba(212,175,55,0.12)"
                                            : "transparent",
                                    color:
                                        activeSection === tab.key ? "#d4af37" : "#3a2e14",
                                    fontFamily: "'DM Mono', monospace",
                                    letterSpacing: "0.05em",
                                    borderLeft:
                                        activeSection === tab.key
                                            ? "1px solid rgba(212,175,55,0.3)"
                                            : "1px solid transparent",
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Page content */}
                <div className="p-8 space-y-6">

                    {/* ── OVERVIEW ──────────────────────────────────────── */}
                    {activeSection === "overview" && (
                        <div
                            style={{ animation: "fadeIn 0.4s ease forwards" }}
                            className="space-y-6"
                        >
                            {/* Stats */}
                            <StatsCards summary={summary} loading={loadingSummary} />

                            {/* Charts row — analyst/admin only */}
                            {isAnalyst && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <TrendsChart data={trends} loading={loadingTrends} />
                                    <CategoryChart data={categories} loading={loadingTrends} />
                                </div>
                            )}

                            {/* Recent transactions */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2
                                        style={{
                                            color: "#e8d5a3",
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: "1.1rem",
                                        }}
                                    >
                                        Recent Activity
                                    </h2>
                                    <button
                                        onClick={() => setActiveSection("transactions")}
                                        style={{
                                            color: "#8a7340",
                                            fontFamily: "'DM Mono', monospace",
                                            fontSize: "11px",
                                            letterSpacing: "0.05em",
                                        }}
                                    >
                                        View all →
                                    </button>
                                </div>

                                {/* Recent 5 */}
                                <div className="space-y-2">
                                    {loadingSummary ? (
                                        [1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className="h-14 rounded-xl animate-pulse"
                                                style={{ background: "rgba(212,175,55,0.04)" }}
                                            />
                                        ))
                                    ) : summary?.recent_activity?.length === 0 ? (
                                        <p
                                            style={{
                                                color: "#3a2e14",
                                                fontFamily: "'DM Mono', monospace",
                                                fontSize: "13px",
                                            }}
                                        >
                                            No recent activity
                                        </p>
                                    ) : (
                                        summary?.recent_activity?.map((tx) => (
                                            <div
                                                key={tx.id}
                                                className="flex items-center justify-between px-5 py-3 rounded-xl border transition-all hover:border-amber-900/30"
                                                style={{
                                                    background: "rgba(15,10,3,0.8)",
                                                    borderColor: "rgba(212,175,55,0.07)",
                                                }}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                                                        style={{
                                                            background:
                                                                tx.type === "income"
                                                                    ? "rgba(34,197,94,0.12)"
                                                                    : "rgba(239,68,68,0.12)",
                                                            color: tx.type === "income" ? "#22c55e" : "#ef4444",
                                                        }}
                                                    >
                                                        {tx.type === "income" ? "↑" : "↓"}
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
                                                            {tx.category}
                                                        </p>
                                                        <p
                                                            style={{
                                                                color: "#3a2e14",
                                                                fontFamily: "'DM Mono', monospace",
                                                                fontSize: "11px",
                                                            }}
                                                        >
                                                            {new Date(tx.date).toLocaleDateString("en-IN")}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span
                                                    style={{
                                                        color: tx.type === "income" ? "#22c55e" : "#ef4444",
                                                        fontFamily: "'Playfair Display', serif",
                                                        fontSize: "1rem",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {tx.type === "income" ? "+" : "-"}₹
                                                    {Number(tx.amount).toLocaleString("en-IN")}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── TRANSACTIONS ──────────────────────────────────── */}
                    {activeSection === "transactions" && (
                        <div style={{ animation: "fadeIn 0.4s ease forwards" }}>
                            <TransactionTable
                                data={transactions}
                                loading={loadingTx}
                                total={txTotal}
                                page={txPage}
                                limit={10}
                                filters={txFilters}
                                role={role}
                                onPageChange={(p) => {
                                    setTxPage(p);
                                }}
                                onFilterChange={(f) => {
                                    setTxFilters(f);
                                    setTxPage(1);
                                }}
                                onEdit={(tx) => {
                                    setEditingTx(tx);
                                    setFormOpen(true);
                                }}
                                onDelete={handleDeleteTx}
                                onCreate={() => {
                                    setEditingTx(null);
                                    setFormOpen(true);
                                }}
                            />
                        </div>
                    )}

                    {/* ── ANALYTICS (analyst + admin) ───────────────────── */}
                    {activeSection === "analytics" && isAnalyst && (
                        <div
                            style={{ animation: "fadeIn 0.4s ease forwards" }}
                            className="space-y-6"
                        >
                            <TrendsChart data={trends} loading={loadingTrends} />
                            <CategoryChart data={categories} loading={loadingTrends} />
                        </div>
                    )}

                    {/* ── USERS (admin only) ────────────────────────────── */}
                    {activeSection === "users" && isAdmin && (
                        <div style={{ animation: "fadeIn 0.4s ease forwards" }}>
                            <UserTable
                                users={users}
                                loading={loadingUsers}
                                onUpdate={handleUpdateUser}
                                onDelete={handleDeleteUser}
                                currentUserId={user.id}
                            />
                        </div>
                    )}
                </div>
            </main>

            {/* Transaction form modal */}
            <TransactionForm
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                    setEditingTx(null);
                }}
                onSubmit={editingTx ? handleUpdateTx : handleCreateTx}
                initial={editingTx}
            />

            {/* Toast */}
            {toasts && (
                <div
                    className="fixed bottom-6 right-6 px-5 py-3 rounded-xl border text-sm z-50"
                    style={{
                        background: toasts.type === "error" ? "rgba(15,5,5,0.95)" : "rgba(5,12,7,0.95)",
                        borderColor:
                            toasts.type === "error"
                                ? "rgba(239,68,68,0.3)"
                                : "rgba(34,197,94,0.3)",
                        color: toasts.type === "error" ? "#ef4444" : "#22c55e",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "12px",
                        animation: "slideDown 0.3s ease forwards",
                        boxShadow: `0 0 20px ${toasts.type === "error" ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)"}`,
                    }}
                >
                    {toasts.type === "error" ? "✗ " : "✓ "}
                    {toasts.msg}
                </div>
            )}
        </div>
    );
}