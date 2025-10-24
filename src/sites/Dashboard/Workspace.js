import React, { useState } from "react";
import { Sidebar, Topbar} from "../../ui/Common";
import { Link } from "react-router-dom";
import { Hourglass, CheckCircle, AlertCircle } from "lucide-react";
import { BsSearch } from "react-icons/bs";
import { InitialsAvatar } from "../../ui/common_function";

function Workspace() {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    function ProgressBar({ value }) {
        return (
            <div
                className="flex-grow-1 position-relative"
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={100}
                style={{
                    height: 14,
                    background: "#eaf0f6",
                    borderRadius: 999,
                    border: "1px solid #d2dbea",
                    boxShadow: "inset 0 1px 1px rgba(0,0,0,0.04)",
                    minWidth: 65,
                }}
            >
                <div
                    style={{
                        width: `${value}%`,
                        height: "100%",
                        borderRadius: 999,
                        background: "var(--ndr-bg-topbar)",
                        transition: "width 300ms ease",
                        position: "relative",
                    }}
                >
          <span
              style={{
                  position: "absolute",
                  right: -2,
                  top: -2,
                  bottom: -2,
                  width: 4,
                  background: "#ffffff55",
                  borderRadius: 2,
              }}
          />
                </div>
            </div>
        );
    }

    const projects = [
        {
            id: 1,
            name: "DR/2025/123456",
            status: "active",
            progress: 60,
            deadline: "2025-09-30",
            klient: "Alphatech Sp. z o.o.",
            users: ["Anna Kowalska", "Jan Nowak"],
        },
        {
            id: 2,
            name: "DR/2025/123454",
            status: "completed",
            progress: 100,
            deadline: "2025-06-15",
            klient: "Gamma Demo Logistics",
            users: ["Paweł Wiśniewski"],
        },
        {
            id: 3,
            name: "MBP/2025/000111",
            status: "active",
            progress: 45,
            deadline: "2024-12-20",
            klient: "BetaConsulting S.A.",
            users: ["Maria Zielińska", "Adam Malinowski", "Ewa Dąbrowska"],
        },
        {
            id: 4,
            name: "DR/2025/123444",
            status: "delayed",
            progress: 20,
            deadline: "2025-03-15",
            klient: "Upsilon Design",
            users: ["Krzysztof Piotrowski"],
        },
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
        { id: 1, title: "Uzupełnij wniosek w sekcji I.6", status: "urgent", deadline: "2025-09-20", completed: false, project: "DR/2025/123456" },
        { id: 2, title: "Podpisz wniosek w sekcji II.1.4", status: "pending", deadline: "2025-09-25", completed: false, project: "DR/2025/123444" },
        { id: 3, title: "Dodaj załącznik do sekcji III.5 Zapasy", status: "in-progress", deadline: "2025-09-30", completed: false, project: "DR/2025/123654" },
        { id: 4, title: "Zweryfikuj test niezależności zespołu", status: "pending", deadline: "2025-10-02", completed: false, project: "DR/2025/122222" },
    ];

    return (
        <div className="d-flex min-vh-100">
            <Sidebar search={search} setSearch={setSearch} />

            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: "hidden" }}>
                <Topbar
                    breadcrumb={[
                        { label: "Workspace", to: "/workspace" },
                    ]}
                />

                <div className="flex-grow-1 p-4 bg-light">
                    <div className="container-fluid">
                        <div className="d-flex gap-4" style={{ background: "#005679" }}>
                            {/* Lewa część - projekty */}
                            <div className="bg-white rounded-2xl shadow p-4 flex-grow-1">
                                {/* Tytuł */}
                                <h5 className="text-lg fw-semibold mb-2" style={{fontSize: "1.5rem", padding:"10px"}}>Projekty</h5>

                                {/* Tabs + Search */}
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    {/* Tabs */}
                                    <div className="d-flex gap-1">
                                        {[
                                            { key: "all", label: `Wszystkie (${projects.length})` },
                                            { key: "active", label: `Aktywne (${counts.active})` },
                                            { key: "delayed", label: `Opóźnione (${counts.delayed})` },
                                            { key: "completed", label: `Zakończone (${counts.completed})` },
                                        ].map(tab => {
                                            const isActive = activeTab === tab.key;
                                            return (
                                                <button
                                                    key={tab.key}
                                                    onClick={() => setActiveTab(tab.key)}
                                                    style={{
                                                        fontSize:'0.95rem',
                                                        padding: "0.5rem 1rem",
                                                        borderRadius: "6px", // kwadratowe
                                                        border: `1px solid ${isActive ? "#0a2b4c" : "#dee2e6"}`,
                                                        backgroundColor: isActive ? "#0a2b4c" : "#f8f9fa",
                                                        color: isActive ? "#fff" : "#495057",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {tab.label}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Search */}
                                    <div className="input-group input-group-sm" style={{ maxWidth: 270, height:"38px" }}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Szukaj"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                        {search && (
                                            <button className="btn btn-outline-secondary" type="button" onClick={() => setSearch("")}>
                                                ×
                                            </button>
                                        )}
                                        <span className="input-group-text"><BsSearch /></span>
                                    </div>
                                </div>

                                {/* Table */}
                                <table className="table table-hover table-sm mb-0 align-middle" style={{ fontSize:'0.9rem' }}>
                                    <thead className="table-light" style={{ position:'sticky', top:0, zIndex:1, whiteSpace:'nowrap' }}>
                                    <tr className="text-gray-600 text-sm border-b">
                                        <th style={{border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem"}}> Projekt</th>
                                        <th style={{border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem"}}> Klient</th>
                                        <th style={{border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem"}}> Użytkownicy</th>
                                        <th style={{border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem"}}> Status </th>
                                        <th style={{border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem"}}> Postęp </th>
                                        <th style={{border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem"}}> Deadline </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filtered.map((p) => (
                                        <tr key={p.id} className="border-b last:border-0">
                                            <td style={{ border: "1px solid #dee2e6", padding: "0.5rem 1rem" }}>
                                                <Link
                                                    to={`/projekty/${encodeURIComponent(p.name)}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{ textDecoration: "underline" }}
                                                >
                                                    {p.name}
                                                </Link>

                                            </td>
                                            <td style={{ border: "1px solid #dee2e6", padding: "0.5rem 1rem" }}>{p.klient}</td>
                                            <td style={{ border: "1px solid #dee2e6", padding: "0.5rem 1rem" }}>
                                                <div className="d-flex" style={{ gap: "0.25rem" }}>
                                                    {p.users.map((u, idx) => (
                                                        <InitialsAvatar key={idx} name={u} size={24} />
                                                    ))}
                                                </div>
                                            </td>
                                            <td style={{ border: "1px solid #dee2e6", padding: "0.5rem 1rem", alignItems:"center" }}>
          <span
              className={`badge fw-normal ${
                  p.status === "completed"
                      ? "bg-success-subtle text-dark"
                      : p.status === "active"
                          ? "bg-primary-subtle text-dark"
                          : "bg-danger-subtle text-dark"
              }`}
          >
            {statusLabel[p.status].text}
          </span>
                                            </td>
                                            <td style={{ border: "1px solid #dee2e6", padding: "0.5rem 1rem" }}>
                                                <div className="d-flex align-items-center" style={{ gap:'0.1rem' }}>
                                                    <ProgressBar value={p.progress} />
                                                    <span className="small text-muted " style={{ width:35, textAlign:'right' }}>{p.progress}%</span>
                                                </div>
                                            </td>
                                            <td style={{ border: "1px solid #dee2e6", padding: "0.5rem 1rem" }}>{p.deadline}</td>
                                        </tr>
                                    ))}
                                    {filtered.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4 text-gray-500">Brak wyników</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Prawy sidebar - Moje zadania */}
                            <div className="rounded-2xl shadow-sm p-3" style={{ width: "320px", flexShrink: 0, background: "#0a2b4c" }}>
                                <h5 className="text-lg fw-semibold mb-2" style={{color: "#ffff", padding:"10px"}}>Moje zadania</h5>
                                <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                                    {tasks.map((task) => {
                                        const statusMap = {
                                            urgent: { label: "Pilne", style: { background: "#fde2e1", color: "#b91c1c" } },
                                            pending: { label: "Oczekujące", style: { background: "#fff7e0", color: "#a16207" } },
                                            "in-progress": { label: "W trakcie", style: { background: "#e1f6ed", color: "#166534" } },
                                        };
                                        const statusInfo = statusMap[task.status] || { label: "—", style: { background: "#f1f3f5", color: "#495057" } };
                                        return (
                                            <li key={task.id} className="p-3 rounded-4 border" style={{ transition: "all 0.2s ease", backgroundColor: "#fff" }}>
                                                <div className="fw-medium mb-1" style={{ fontSize: "0.95rem", lineHeight: "1.4" }}>{task.title}</div>
                                                <div className="mb-2 small" style={{ fontSize: "0.85rem", color: "#0d6efd" }}>
                                                    <Link to={`/projekty/${encodeURIComponent(task.project)}`} onClick={(e) => e.stopPropagation()} style={{ textDecoration: "underline", color: "#0d6efd", whiteSpace: "nowrap" }}>
                                                        {task.project}
                                                    </Link>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center small">
                          <span className="px-2 py-1 rounded-pill fw-medium" style={{ fontSize: "0.75rem", ...statusInfo.style }}>
                            {statusInfo.label}
                          </span>
                                                    <span className="text-muted">{new Date(task.deadline).toLocaleDateString("pl-PL")}</span>
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
