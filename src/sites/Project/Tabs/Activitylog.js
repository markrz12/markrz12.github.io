import React, { useState } from "react";
import { useDropdown, InitialsAvatar, Notifications, CloseX} from "../../../ui/common_function";


export default function ActivityLog({ logs }) {
    const [filterUser, setFilterUser] = useState("");
    const [filterAction, setFilterAction] = useState("");

    const users = Array.from(new Set(logs.map(log => log.user)));
    const actions = Array.from(new Set(logs.map(log => log.action)));

    const [filterDateFrom, setFilterDateFrom] = useState("");
    const [filterDateTo, setFilterDateTo] = useState("");


    // Filtrujemy logi
    const filteredLogs = logs.filter((log) => {
        const logDate = new Date(log.date);
        const fromDate = filterDateFrom ? new Date(filterDateFrom) : null;
        const toDate = filterDateTo ? new Date(filterDateTo) : null;

        const matchesUser = filterUser ? log.user === filterUser : true;
        const matchesAction = filterAction ? log.action === filterAction : true;
        const matchesFrom = fromDate ? logDate >= fromDate : true;
        const matchesTo = toDate ? logDate <= toDate : true;

        return matchesUser && matchesAction && matchesFrom && matchesTo;
    });


    return (
        <div className = "card shadow-sm mb-3">
            {/* Pole filtrowania */}
            <div className="d-flex flex-wrap gap-3 mb-1 align-items-center p-3 rounded" style={{ backgroundColor: "#0a2b4c" }}>
                <div className="d-flex align-items-center gap-2">
                    <label className="fw-semibold mb-0" style={{ fontSize: "0.95rem",color: "#fff" }}>Użytkownik:</label>
                    <select
                        className="form-select form-select-sm"
                        value={filterUser}
                        onChange={(e) => setFilterUser(e.target.value)}
                        style={{ maxHeight: "30px" , minWidth: "150px", borderRadius: "0.5rem" }}
                    >
                        <option value="">Wszyscy</option>
                        {users.map((user, idx) => (
                            <option key={idx} value={user}>{user}</option>
                        ))}
                    </select>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <label className="fw-semibold mb-0" style={{ fontSize: "0.95rem", color: "#fff" }}>Akcja:</label>
                    <select
                        className="form-select form-select-sm"
                        value={filterAction}
                        onChange={(e) => setFilterAction(e.target.value)}
                        style={{ maxHeight: "30px", minWidth: "180px", borderRadius: "0.5rem" }}
                    >
                        <option value="">Wszystkie</option>
                        {actions.map((action, idx) => (
                            <option key={idx} value={action}>{action}</option>
                        ))}
                    </select>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <label className="fw-semibold mb-0" style={{ fontSize: "0.95rem", color: "#fff" }}>Od:</label>
                    <input
                        type="date"
                        className="form-control form-control-sm"
                        value={filterDateFrom}
                        onChange={(e) => setFilterDateFrom(e.target.value)}
                        style={{ maxHeight: "30px", minWidth: "150px", borderRadius: "0.5rem" }}
                    />
                </div>

                {/* Data do */}
                <div className="d-flex align-items-center gap-2">
                    <label className="fw-semibold mb-0" style={{ fontSize: "0.95rem", color: "#fff" }}>Do:</label>
                    <input
                        type="date"
                        className="form-control form-control-sm"
                        value={filterDateTo}
                        onChange={(e) => setFilterDateTo(e.target.value)}
                        style={{ maxHeight: "30px", minWidth: "150px", borderRadius: "0.5rem" }}
                    />
                </div>

                <button
                    className="btn btn-outline-light btn-sm ms-auto"
                    onClick={() => { setFilterUser(""); setFilterAction(""); }}
                >
                    Wyczyść filtry
                </button>
            </div>

            <div className="table-responsive p-0">
                <table className="table table-hover table-sm mb-0 align-middle" style={{ fontSize: "0.9rem" }}>
                    <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 15 }}>
                    <tr>
                        <th style={{ border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem 1rem" }}>Data</th>
                        <th style={{ border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem" }}>Użytkownik</th>
                        <th style={{ border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem" }}>Akcja</th>
                        <th style={{ border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem" }}>Szczegóły</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredLogs.length > 0 ? (
                        filteredLogs.map((log, idx) => (
                            <tr key={idx}>
                                <td style={{ padding: "0.5rem 1rem", border: "1px solid #dee2e6" }}>{log.date}</td>
                                <td className="d-flex" style={{ padding: "0.5rem 1rem", gap: "0.5rem" }}>
                                    <InitialsAvatar name={log.user} size={23} />
                                    <span>{log.user}</span>
                                </td>
                                <td style={{ padding: "0.5rem 1rem", border: "1px solid #dee2e6" }}>{log.action}</td>
                                <td style={{ whiteSpace: "pre-wrap", padding: "0.5rem 1rem", border: "1px solid #dee2e6" }}>{log.details}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center text-muted py-3">Brak wyników</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
