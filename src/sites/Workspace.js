import React, { useEffect, useRef, useState } from "react";
import { Sidebar, Topbar } from "../ui/Common";
import { Link, useNavigate } from "react-router-dom";
import { Hourglass, CheckCircle, AlertCircle, Filter, Search } from "lucide-react";

function Workspace() {
    const [search, setSearch] = useState("");
    const [showAccount, setShowAccount] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const menuRef = useRef(null);
    const btnRef = useRef(null);
    const navigate = useNavigate();

    function ProgressBar({ value }){
        return (
            <div className="flex-grow-1 position-relative" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}
                 style={{ height: 14, background: '#eaf0f6', borderRadius: 999, border: '1px solid #d2dbea', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.04)', minWidth:40 }}>
                <div style={{ width: `${value}%`, height: '100%', borderRadius: 999, background: 'var(--ndr-bg-topbar)', transition: 'width 300ms ease', position:'relative' }}>
                    <span style={{ position:'absolute', right: -2, top: -2, bottom: -2, width: 4, background:'#ffffff55', borderRadius: 2 }} />
                </div>
            </div>
        );
    }

    // Close on outside click
    useEffect(() => {
        function onDocClick(e) {
            if (!showAccount) return;
            const m = menuRef.current;
            const b = btnRef.current;
            if (m && !m.contains(e.target) && b && !b.contains(e.target)) {
                setShowAccount(false);
            }
        }
        function onKey(e) {
            if (e.key === "Escape") setShowAccount(false);
        }
        document.addEventListener("mousedown", onDocClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDocClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [showAccount]);

    const handleLogout = () => {
        navigate("/");
        setShowAccount(false);
    };

    const projects = [
        { id: 1, name: "DR/2025/123456", status: "active", progress: 60, deadline: "2025-09-30", klient: "Alphatech Sp. z o.o." },
        { id: 2, name: "DR/2025/123454", status: "completed", progress: 100, deadline: "2025-06-15", klient: "Gamma Demo Logistics" },
        { id: 3, name: "MBP/2025/000111", status: "active", progress: 45, deadline: "2024-12-20", klient: "BetaConsulting S.A." },
        { id: 4, name: "DR/2025/123444", status: "delayed", progress: 20, deadline: "2025-03-15", klient: "Upsilon Design" },
    ];

    const filtered = projects
        .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
        .filter((p) => activeTab === "all" || p.status === activeTab);

    const counts = {
        active: projects.filter((p) => p.status === "active").length,
        delayed: projects.filter((p) => p.status === "delayed").length,
        completed: projects.filter((p) => p.status === "completed").length,
    };

    const statusLabel = {
        active: { text: "W trakcie", icon: <Hourglass className="w-4 h-4 text-yellow-500 inline" /> },
        completed: { text: "Ukończone", icon: <CheckCircle className="w-4 h-4 text-green-600 inline" /> },
        delayed: { text: "Opóźnione", icon: <AlertCircle className="w-4 h-4 text-red-600 inline" /> },
    };

    const tasks = [
        {id: 1, title: "Uzupełnij wniosek w sekcji I.6", status: "urgent", deadline: "2025-09-20",completed: false, project: "DR/2025/123456",},
        {id: 2, title: "Podpisz wniosek w sekcji II.1.4", status: "pending", deadline: "2025-09-25", completed: false,project: "DR/2025/123444"},
        {id: 3, title: "Dodaj załącznik do sekcji III.5 Zapasy", status: "in-progress", deadline: "2025-09-30", completed: false,project: "DR/2025/123654"},
        {id: 4, title: "Zweryfikuj test niezależności zespołu", status: "pending", deadline: "2025-10-02", completed: false,project: "DR/2025/122222"},
    ];


    return (
        <div className="d-flex min-vh-100" style={{ minHeight: "100vh" }}>
            <Sidebar search={search} setSearch={setSearch} />

            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: "hidden" }}>
                <Topbar
                    breadcrumb={[
                        { label: "Home", to: "/" },
                        { label: "Workspace", to: "/workspace" },
                        { label: "Dashboard", active: true },
                    ]}
                    accountBtnRef={btnRef}
                    accountMenuRef={menuRef}
                    showAccount={showAccount}
                    setShowAccount={setShowAccount}
                    onLogout={handleLogout}
                />

                <div className="flex-grow-1 p-4 bg-light">
                    <div className="container-fluid">

                        <div className="d-flex gap-4">
                            {/* Lewa część - projekty */}
                            <div className="bg-white rounded-2xl shadow p-4 flex-grow-1">

                                {/* Header with Projekty title and search */}
                                <div className="card-header">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h5 className="text-lg font-semibold mb-1">Projekty</h5>

                                        <div className="input-group input-group-sm mb-1" style={{ maxWidth: 400 }}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Szukaj"
                                                aria-label="Szukaj użytkowników"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                            {search && (
                                                <button
                                                    className="btn btn-outline-secondary"
                                                    type="button"
                                                    onClick={() => setSearch("")}
                                                    title="Wyczyść"
                                                    aria-label="Wyczyść"
                                                >
                                                    ×
                                                </button>
                                            )}
                                            <span className="input-group-text" id="users-search-icon-top">🔍</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="flex gap-2 mb-3 mt-3">
                                    {[
                                        { key: "all", label: `Wszystkie (${projects.length})` },
                                        { key: "active", label: `Aktywne (${counts.active})` },
                                        { key: "delayed", label: `Opóźnione (${counts.delayed})` },
                                        { key: "completed", label: `Zakończone (${counts.completed})` },
                                    ].map((tab) => {
                                        const isActive = activeTab === tab.key;
                                        return (
                                            <button
                                                key={tab.key}
                                                onClick={() => setActiveTab(tab.key)}
                                                style={{
                                                    cursor: "pointer",
                                                    padding: "0.5rem 1.25rem",
                                                    borderRadius: "50px",
                                                    border: `1px solid ${isActive ? "#005679" : "#dee2e6"}`,
                                                    backgroundColor: isActive ? "#005679" : "#f8f9fa",
                                                    color: isActive ? "#fff" : "#495057",
                                                    fontWeight: 500,
                                                    transition: "all 0.2s ease-in-out",
                                                    marginRight: "0.5rem",
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!isActive) e.currentTarget.style.backgroundColor = "#e2e6ea";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = isActive ? "#005679" : "#f8f9fa";
                                                }}
                                            >
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Table */}
                                <table className="table table-hover table-sm mb-0 align-middle" style={{ fontSize:'0.9rem' }}>
                                    <thead className="table-light" style={{ position:'sticky', top:0, zIndex:1, whiteSpace:'nowrap' }}>
                                    <tr className="text-gray-600 text-sm border-b">
                                        <th className="py-2">Projekt</th>
                                        <th>Klient</th>
                                        <th>Status</th>
                                        <th>Postęp</th>
                                        <th>Deadline</th>
                                        <th>Akcje</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filtered.map((p) => (
                                        <tr key={p.id} className="border-b last:border-0">
                                            <td className="py-3">{p.name}</td>
                                            <td>{p.klient}</td>
                                            <td>
                                                <span
                                                    className={`badge fw-normal ${
                                                        p.status === "completed"
                                                            ? "bg-success-subtle text-dark"
                                                            : p.status === "active"
                                                                ? "bg-primary-subtle text-dark"
                                                                : "bg-danger-subtle text-dark"
                                                    }`}>
                                                    {statusLabel[p.status].text}
                                                </span>
                                            </td>
                                            <td className="w-40">
                                                <div className="d-flex align-items-center" style={{ gap:'0.2rem' }}>
                                                    <ProgressBar value={p.progress} />
                                                    <span className="small text-muted me-3" style={{ width:38, textAlign:'right' }}>{p.progress}%</span>
                                                </div>
                                            </td>
                                            <td>{p.deadline}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-primary me-2">
                                                    Wejdź do projektu
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filtered.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4 text-gray-500">
                                                Brak wyników
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Prawy sidebar - Moje zadania */}
                            <div className="bg-white rounded-2xl shadow-sm p-3" style={{ width: "320px", flexShrink: 0 }}>
                                <h5 className="text-lg font-semibold mb-3">Moje zadania</h5>
                                <ul className="list-unstyled mb-0 d-flex flex-column gap-2">

                                    {tasks.map((task) => {
                                        const statusMap = {
                                            urgent: { label: "🔴 Pilne", class: "text-danger fw-semibold" },
                                            pending: { label: "🟡 Oczekujące", class: "text-warning fw-semibold" },
                                            "in-progress": { label: "🟢 W trakcie", class: "text-success fw-semibold" },
                                        };
                                        const statusInfo = statusMap[task.status] || { label: "—", class: "text-muted" };

                                        return (
                                            <li
                                                key={task.id}
                                                className="p-3 rounded-2xl border"
                                                style={{ transition: "all 0.2s ease", backgroundColor: "#fff" }}
                                            >
                                                {/* Title */}
                                                <div className="fw-medium" style={{ fontSize: "0.9rem", lineHeight: "1.3" }}>
                                                    {task.title}
                                                </div>

                                                {/* Project/Task ID link */}
                                                <div className="mb-2 mt-1" style={{ fontSize: "0.9rem" }}>
                                                    <Link
                                                        to={`/projekty/${encodeURIComponent(task.project)}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{ textDecoration: "underline", color: "#0d6efd", whiteSpace: "nowrap" }}>
                                                        {task.project}
                                                    </Link>
                                                </div>

                                                {/* Status + deadline */}
                                                <div className="d-flex justify-content-between align-items-center small text-muted mt-1">
                                                    <span className={statusInfo.class}>{statusInfo.label}</span>
                                                    <span>{new Date(task.deadline).toLocaleDateString("pl-PL")}</span>
                                                </div>
                                            </li>
                                        );
                                    })}

                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Workspace;
