import React, { useState, useRef, useEffect, useMemo } from "react";
import { Sidebar, Topbar, InitialsAvatar } from "../ui/Common_project.js";
import { BsTrash } from "react-icons/bs";

// Funkcja pomocnicza - ile czasu temu
function timeAgo(input) {
    const now = new Date();
    const d = input instanceof Date ? input : new Date(input);
    const diffMs = now - d;
    const sec = Math.floor(diffMs / 1000);
    if (isNaN(sec)) return "";
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);
    if (sec < 45) return "przed chwilą";
    if (min < 60) return `${min} min temu`;
    if (hr < 24) return `${hr} h temu`;
    return `${day} dni temu`;
}

// Pasek postępu
function ProgressMeter({ percent }) {
    const pct = Math.max(0, Math.min(100, Math.round(percent)));
    const trackStyle = {
        height: 24,
        background: "#f4f7fb",
        border: "1px solid #e2e8f3",
        borderRadius: 999,
        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)",
        width: "100%",
        maxWidth: 720,
        margin: "0 auto",
    };
    const fillStyle = {
        width: `${pct}%`,
        height: "100%",
        borderRadius: 999,
        background: "linear-gradient(90deg, #0a2b4c, #005679, #008491)",
        transition: "width 300ms ease",
        position: "relative",
    };
    const labelStyle = {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "0.8rem",
        color: "#fff",
        fontWeight: 600,
    };
    return (
        <div className="d-flex align-items-center justify-content-center">
            <div
                className="position-relative"
                style={trackStyle}
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
            >
                <div style={fillStyle} />
                <div style={labelStyle}>{pct}%</div>
            </div>
        </div>
    );
}


function KwestionariuszFull() {
    const [activeTab, setActiveTab] = useState("Kwestionariusz");

    // --- wiersze edytowalne ---
    const [rows, setRows] = useState([
        {
            id: 1,
            zagrozenie: "Przykładowe zagrożenie",
            srodek: "Przykładowy środek",
            author: "K M",
            approver: "M M",
            date: "2025-08-20",
        },
    ]);

    const handleChange = (id, field, value) => {
        setRows((prev) =>
            prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
        );
    };

    const handleAddRow = () => {
        const newId = rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
        setRows([
            ...rows,
            {
                id: newId,
                zagrozenie: "",
                srodek: "",
                author: "K M",
                approver: "—",
                date: new Date().toISOString(),
            },
        ]);
    };

    const handleDeleteRow = (id) => {
        setRows((prev) => prev.filter((r) => r.id !== id));
    };

    const tabs = ["Kwestionariusz", "Zapotrzebowanie", "Pliki", "Dziennik"];


    return (
        <div className="d-flex min-vh-100">
            <Sidebar />
            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: "hidden" }}>
                <Topbar breadcrumb={[{ label: "Home", to: "/" }, { label: "Projekt", active: true }]} />

                <div className="px-3 py-2 mt-2 mb-1 border-bottom d-flex justify-content-between align-items-center flex-wrap">
                    <div className="d-flex align-items-baseline gap-2 flex-wrap">
                        <h4 className="fw-semibold mb-0">DR/2025/123456</h4>
                        <span className="fs-5 text-secondary">Alphatech Sp. z o.o.</span>
                    </div>
                    <div className="text-muted gap-4" style={{ fontSize: "0.9rem" }}>
                        <div>Kierownik: Jan Kowalski</div>
                        <div>Okres: 01.01.2025 – 31.12.2025</div>
                    </div>
                </div>

                <div className="mb-2 mt-2 px-3 d-flex align-items-center justify-content-between">
                    <h5 className="fw-semibold fs-5 mb-2 mt-2">
                        I.4 Rozpoznanie zagrożenia
                    </h5>
                    <div style={{ width: "350px", minWidth: "150px" }}>
                        <ProgressMeter percent={65} />
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-2 mt-2 px-3 d-flex align-items-center justify-content-between">
                    <div className="card-header">
                        <ul className="nav nav-tabs card-header-tabs mb-0">
                            {tabs.map((tab) => (
                                <li key={tab} className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === tab ? "active fw-semibold" : "fw-medium"}`}
                                        onClick={() => setActiveTab(tab)}
                                        style={{
                                            cursor: "pointer",
                                            padding: "0.5rem 1.25rem",
                                            borderRadius: "50px",
                                            border: "1px solid",
                                            borderColor: activeTab === tab ? "#005679" : "#dee2e6",
                                            backgroundColor: activeTab === tab ? "#005679" : "#f8f9fa",
                                            color: activeTab === tab ? "#fff" : "#495057",
                                            fontWeight: 500,
                                            transition: "all 0.2s ease-in-out",
                                            marginRight: "0.5rem",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (activeTab !== tab) e.currentTarget.style.backgroundColor = "#e2e6ea";
                                        }}
                                        onMouseLeave={(e) => {
                                            if (activeTab !== tab) e.currentTarget.style.backgroundColor = activeTab === tab ? "#007bff" : "#f8f9fa";
                                        }}
                                    >
                                        {tab}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Content */}
                <div className="px-3 flex-grow-1 overflow-auto">
                    {activeTab === "Kwestionariusz" && (
                        <div className="p-0">
                            <div className="table-responsive">
                                <table className="table table-hover table-sm mb-0 align-middle" style={{ fontSize: "0.85rem" }}>
                                    <thead className="table-light">
                                    <tr>
                                        <th style={{ textAlign: "center", width: "5%" }}>Lp.</th>
                                        <th style={{ width: "30%" }}>Rozpoznane zagrożenie</th>
                                        <th style={{ width: "30%" }}>Wdrożony środek zaradczy</th>
                                        <th style={{ textAlign: "center", width: "10%" }}>Sporządził</th>
                                        <th style={{ textAlign: "center", width: "10%" }}>Zatwierdził</th>
                                        <th style={{ textAlign: "center", width: "10%" }}>Akcje</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {rows.map((r, idx) => (
                                        <tr key={r.id}>
                                            <td style={{ textAlign: "center" }}>{idx + 1}</td>
                                            <td>
    <textarea
        className="form-control form-control-sm"
        style={{ whiteSpace: "pre-wrap", resize: "vertical", minHeight: "60px" }}
        value={r.zagrozenie}
        onChange={(e) => handleChange(r.id, "zagrozenie", e.target.value)}
    />
                                            </td>
                                            <td>
    <textarea
        className="form-control form-control-sm"
        style={{ whiteSpace: "pre-wrap", resize: "vertical", minHeight: "60px" }}
        value={r.srodek}
        onChange={(e) => handleChange(r.id, "srodek", e.target.value)}
    />
                                            </td>
                                            <td style={{ textAlign: "center", fontSize: "0.8rem" }}>
                                                <div className="d-flex align-items-center justify-content-center gap-2">
                                                    <InitialsAvatar name={r.author} size={23} />
                                                    <span className="text-muted small">{timeAgo(new Date(r.date))}</span>
                                                </div>
                                            </td>
                                            <td style={{ textAlign: "center", fontSize: "0.8rem" }}>
                                                {r.approver !== "—" && (
                                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                                        <InitialsAvatar name={r.approver} size={23} />
                                                        <span className="text-muted small">{timeAgo(new Date(r.date))}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDeleteRow(r.id)}
                                                    title="Usuń wiersz"
                                                >
                                                    <BsTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Przyciski pod tabelą */}
                            <div className="px-3 py-2 border-top bg-white d-flex justify-content-between">
                                <button className="btn btn-sm btn-outline-primary" onClick={handleAddRow}>
                                    + Dodaj wiersz
                                </button>
                                <button className="btn btn-sm btn-success">Zatwierdź wszystko</button>
                            </div>
                        </div>
                    )}




                </div>
                <div className="d-flex justify-content-between p-3 border-top mt-auto">
                    <button className="btn btn-outline-secondary">«« Poprzedni kwestionariusz</button>
                    <button className="btn btn-outline-secondary">Następny kwestionariusz »»</button>
                </div>

            </div>
        </div>
    );
}

export default KwestionariuszFull;
