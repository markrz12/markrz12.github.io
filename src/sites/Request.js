import { useState } from "react";

export default function RequestsTable({ requests, setRequests }) {
    const [showReqModal, setShowReqModal] = useState(false);
    const [reqForm, setReqForm] = useState({ type: "Wyciąg bankowy", desc: "", due: "", urgent: false });

    const handleAddRequest = () => {
        setRequests([
            ...requests,
            {
                ...reqForm,
                id: requests.length + 1,
                status: "Oczekiwanie",
                createdAt: new Date().toISOString(),
                lastReminderAt: null,
                receivedAt: null,
            },
        ]);
        setReqForm({ type: "Wyciąg bankowy", desc: "", due: "", urgent: false });
        setShowReqModal(false);
    };

    return (
        <div className="p-0">
            {/* Tabela zapotrzebowań */}
            <div className="table-responsive shadow-sm mb-3">
                <table className="table table-hover table-sm mb-0 align-middle" style={{ fontSize: "0.9rem" }}>
                    <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 15 }}>
                    <tr>
                        <th style={{ border: "1px solid #dee2e6", width: "15%", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem" }}>Typ</th>
                        <th style={{ border: "1px solid #dee2e6", width: "35%", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem" }}>Opis</th>
                        <th style={{ border: "1px solid #dee2e6", width: "20%", textAlign: "center", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem" }}>Termin / Pilne</th>
                        <th style={{ border: "1px solid #dee2e6", width: "20%", textAlign: "center", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem" }}>Status</th>
                        <th style={{ border: "1px solid #dee2e6", width: "10%", textAlign: "center", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem" }}>Akcje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {requests.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center text-muted">Brak zapotrzebowań</td>
                        </tr>
                    ) : (
                        requests.map(req => (
                            <tr key={req.id}>
                                <td style={{ border: "1px solid #dee2e6", padding: "0.5rem 1rem" }}>{req.type}</td>
                                <td style={{ border: "1px solid #dee2e6", padding: "0.5rem 1rem" }}>{req.desc}</td>
                                <td style={{ border: "1px solid #dee2e6", padding: "0.5rem 1rem" }}>
                                    {req.due} {req.urgent && <span className="badge bg-danger text-white" style={{ fontSize: "0.75rem", padding: "0.3rem 0.5rem" }}>Pilne</span>}
                                </td>
                                <td style={{ border: "1px solid #dee2e6", padding: "0.5rem 1rem" }}>
                    <span className={`badge ${
                        req.status === "Oczekiwanie" ? "bg-primary-subtle text-dark" :
                            req.status === "Otrzymano" ? "bg-success-subtle text-dark" : ""
                    }`} style={{ fontSize: "0.75rem", padding: "0.3rem 0.5rem" }}>
                      {req.status}
                    </span>
                                    <div className="small text-muted">Wysłano: {new Date(req.createdAt).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' })}</div>
                                    {req.status === "Oczekiwanie" && req.lastReminderAt && (
                                        <div className="small text-muted">Przypomnienie: {new Date(req.lastReminderAt).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' })}</div>
                                    )}
                                    {req.status === "Otrzymano" && req.receivedAt && (
                                        <div className="small text-muted">Otrzymano: {new Date(req.receivedAt).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' })}</div>
                                    )}
                                </td>
                                <td style={{ border: "1px solid #dee2e6", padding: "0.5rem 1rem", textAlign: "center" }}>
                                    <div className="btn-group">
                                        {req.status === "Oczekiwanie" && (
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => setRequests(prev => prev.map(r => r.id === req.id ? { ...r, lastReminderAt: new Date().toISOString() } : r))}
                                            >Przypomnij</button>
                                        )}
                                        {req.status === "Otrzymano" && req.receivedFile && (
                                            <a href={req.receivedFile.url} className="btn btn-sm btn-outline-success">Pobierz</a>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Przycisk dodaj zapotrzebowanie */}
            <div className="d-flex justify-content-end mt-2">
                <button className="btn btn-primary" onClick={() => setShowReqModal(true)}>+ Zgłoś zapotrzebowanie</button>
            </div>

            {/* Modal zgłaszania */}
            {showReqModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ background: "rgba(0,0,0,0.3)", zIndex: 3000 }} onClick={() => setShowReqModal(false)}>
                    <div className="card p-3 shadow" style={{ width: 400 }} onClick={e => e.stopPropagation()}>
                        <h6 className="mb-3">Zgłoś zapotrzebowanie</h6>
                        <select className="form-select mb-2" value={reqForm.type} onChange={e => setReqForm({ ...reqForm, type: e.target.value })}>
                            <option>Wyciąg bankowy</option>
                            <option>Umowa najmu</option>
                            <option>Polityka rachunkowości</option>
                            <option>Inne</option>
                        </select>
                        <textarea className="form-control mb-2" placeholder="Opis" value={reqForm.desc} onChange={e => setReqForm({ ...reqForm, desc: e.target.value })} />
                        <input type="date" className="form-control mb-2" value={reqForm.due} onChange={e => setReqForm({ ...reqForm, due: e.target.value })} />
                        <div className="form-check mb-2">
                            <input type="checkbox" className="form-check-input" checked={reqForm.urgent} onChange={e => setReqForm({ ...reqForm, urgent: e.target.checked })} />
                            <label className="form-check-label">Pilne</label>
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <button className="btn btn-light" onClick={() => setShowReqModal(false)}>Anuluj</button>
                            <button className="btn btn-primary" onClick={handleAddRequest}>Zgłoś</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
