import React, { useState } from "react";
import { Sidebar, Topbar} from "../../../ui/Common_project.js";
import { BsTrash } from "react-icons/bs";
import { timeAgo, ProgressMeter } from "../../Functions";
import TabNavigation from "../Tabs/TabNavigation";
import RequestsTable from "../Tabs/Request";
import FilesTable from "../Tabs/Files";
import ActivityLog from "../Tabs/Activitylog";
import { useDropdown, InitialsAvatar, Notifications, CloseX} from "../../../ui/common_function";


// Główny komponent KwestionariuszFull

function KwestionariuszFull() {
    const [activeTab, setActiveTab] = useState("Kwestionariusz");

    const [logs] = useState([
        { date: "2025-09-24 14:32", user: "K M", action: "Dodał komentarz", details: "Komentarz do pytania 3" },
        { date: "2025-09-23 10:15", user: "J K", action: "Zatwierdził odpowiedź", details: "Pytanie 1" },
        { date: "2025-09-22 09:00", user: "A N", action: "Dodał plik", details: "umowa-najmu.pdf" },
    ]);

    const [requests, setRequests] = useState(() => {
        const now = new Date();
        const earlier = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        return [
            {
                id: 1, type: "Wyciąg bankowy", desc: "Wyciągi za Q2 2025 (miesięczne zestawienia)", due: "2025-09-05",
                status: "Oczekiwanie", createdAt: earlier.toISOString(), lastReminderAt: null, receivedAt: null, urgent: false
            },
            {
                id: 2, type: "Umowa najmu", desc: "Aktualna umowa wraz z aneksami", due: "2025-09-10",
                status: "Otrzymano", createdAt: earlier.toISOString(), lastReminderAt: earlier.toISOString(),
                receivedAt: now.toISOString(), receivedFile: { name: "umowa-najmu.pdf", url: "#" }, urgent: true
            },
        ];
    });

    const [files, setFiles] = useState([]);

    // --- wiersze edytowalne ---
    const [rows, setRows] = useState([
        {
            id: 1,
            zagrozenie: "Przykładowe zagrożenie",
            srodek: "Przykładowy środek",
            author: "K M",
            date: "2025-08-20",
            approver: "_",
            approvedAt: null,
        },
    ]);

    // --- Funkcje obsługi wierszy ---
    const handleChange = (id, field, value) => {
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
    };

    const handleAddRow = () => {
        const newId = rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
        setRows([
            ...rows,
            { id: newId, zagrozenie: "", srodek: "", author: "_", date: null, approver: "_", approvedAt: null },
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
                {/* Topbar */}
                <Topbar breadcrumb={[{ label: "Home", to: "/" }, { label: "Projekt", active: true }]} />

                {/* Nagłówek projektu */}
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

                {/* Sekcja + Progress */}
                <div className="mb-2 mt-2 px-3 d-flex align-items-center justify-content-between">
                    <h5 className="fw-semibold fs-5 mb-2 mt-2">I.4 Rozpoznanie zagrożenia</h5>
                    <div style={{ width: "250px", minWidth: "150px" }}>
                        <ProgressMeter percent={70} />
                    </div>
                </div>

                {/* Tabs */}
                <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Content */}
                <div className="px-3 flex-grow-1 overflow-auto">
                    {activeTab === "Kwestionariusz" && (
                        <div className="p-0">
                            <div className="table-responsive">
                                <table className="table table-hover table-sm mb-0 align-middle" style={{ fontSize: "0.85rem" }}>
                                    <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 15 }}>
                                    <tr>
                                        <th style={{ textAlign: "center", width: "5%", border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem" }}>Lp.</th>
                                        <th style={{ width: "30%", border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem" }}>Rozpoznane zagrożenie</th>
                                        <th style={{ width: "30%", border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem" }}>Wdrożony środek zaradczy</th>
                                        <th style={{ textAlign: "center", border: "1px solid #dee2e6", width: "10%", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem" }}>Sporządził</th>
                                        <th style={{ textAlign: "center", border: "1px solid #dee2e6", width: "10%", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem" }}>Zatwierdził</th>
                                        <th style={{ textAlign: "center", border: "1px solid #dee2e6", width: "10%", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem" }}>Akcje</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {rows.map((r, idx) => (
                                        <tr key={r.id}>
                                            <td style={{ textAlign: "center" }}>{idx + 1}</td>
                                            <td>
                          <textarea
                              className="form-control form-control-sm mt-1 mb-1"
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

                                            {/* Kolumna Sporządził */}
                                            <td style={{ fontSize: "0.8rem", textAlign: "center" }}>
                                                {r.author !== "_" ? (
                                                    <div className="d-flex align-items-center gap-2 justify-content-center">
                                                        <InitialsAvatar name={r.author} size={23} />
                                                        <span className="text-muted small">{r.date ? timeAgo(new Date(r.date)) : "-"}</span>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() =>
                                                            setRows((prev) =>
                                                                prev.map((row) =>
                                                                    row.id === r.id
                                                                        ? { ...row, author: "Jan Kowalski", date: new Date().toISOString() }
                                                                        : row
                                                                )
                                                            )
                                                        }
                                                    >
                                                        Zatwierdź
                                                    </button>
                                                )}
                                            </td>

                                            {/* Kolumna Zatwierdził */}
                                            <td style={{ fontSize: "0.8rem", textAlign: "center" }}>
                                                {r.approver !== "_" ? (
                                                    <div className="d-flex align-items-center gap-2 justify-content-center">
                                                        <InitialsAvatar name={r.approver} size={23} />
                                                        <span className="text-muted small">{r.approvedAt ? timeAgo(new Date(r.approvedAt)) : "-"}</span>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="btn btn-sm btn-outline-success"
                                                        onClick={() =>
                                                            setRows((prev) =>
                                                                prev.map((row) =>
                                                                    row.id === r.id ? { ...row, approver: "Jan Kowalski", approvedAt: new Date().toISOString() } : row
                                                                )
                                                            )
                                                        }
                                                    >
                                                        Zatwierdź
                                                    </button>
                                                )}
                                            </td>

                                            {/* Akcje */}
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
                    {activeTab === "Zapotrzebowanie" && <RequestsTable requests={requests} setRequests={setRequests} />}
                    {activeTab === "Pliki" && <FilesTable files={files} setFiles={setFiles} />}
                    {activeTab === "Dziennik" && (
                        <div className="p-0 flex-grow-1" style={{ overflow: "auto" }}>
                            <ActivityLog logs={logs} />
                        </div>
                    )}

                </div>

                {/* Nawigacja dolna */}
                <div className="d-flex justify-content-between p-2 border-top mt-2" style={{ backgroundColor: "var(--ndr-bg-topbar)" }}>
                    <button className="btn btn-outline-light">«« Poprzedni kwestionariusz</button>
                    <button className="btn btn-outline-light">Następny kwestionariusz »»</button>
                </div>
            </div>
        </div>
    );
}

export default KwestionariuszFull;
