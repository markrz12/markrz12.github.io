import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Sidebar, Topbar } from "../../ui/Common";
import Pagination from "../Pagination";
import { BsSearch } from "react-icons/bs";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5171";

// Modale
function EditModal({ form, setForm, handleSaveEdit, setShowEdit }) {
    return (
        <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background: "rgba(0,0,0,0.35)", zIndex: 1050 }} onClick={() => setShowEdit(false)}>
            <div className="card shadow" style={{ maxWidth: 520, margin: "10vh auto", padding: 0, maxHeight: "80vh", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
                <div className="card-header d-flex justify-content-between align-items-center">
                    <strong>Edytuj klienta</strong>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowEdit(false)}>Zamknij</button>
                </div>
                <div className="card-body" style={{ overflow: "auto" }}>
                    <div className="row g-2">
                        <div className="col-12">
                            <label className="form-label mb-1">Nazwa</label>
                            <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="np. ACME Sp. z o.o." />
                        </div>
                        <div className="col-6">
                            <label className="form-label mb-1">NIP</label>
                            <input className="form-control" value={form.nip} onChange={e => setForm({ ...form, nip: e.target.value })} placeholder="xxx-xxx-xx-xx" />
                        </div>
                        <div className="col-6">
                            <label className="form-label mb-1">KRS</label>
                            <input className="form-control" value={form.krs} onChange={e => setForm({ ...form, krs: e.target.value })} placeholder="XXXXXXXXXX" />
                        </div>
                        <div className="col-12">
                            <label className="form-label mb-1">REGON</label>
                            <input className="form-control" value={form.regon} onChange={e => setForm({ ...form, regon: e.target.value })} placeholder="XXXXXXXXX" />
                        </div>
                    </div>
                </div>
                <div className="card-footer d-flex justify-content-end gap-2">
                    <button className="btn btn-light" onClick={() => setShowEdit(false)}>Anuluj</button>
                    <button className="btn btn-primary" onClick={handleSaveEdit}>Zapisz zmiany</button>
                </div>
            </div>
        </div>
    );
}

function DeleteModal({ deleteClient, handleConfirmDelete, setShowDelete }) {
    return (
        <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background: "rgba(0,0,0,0.35)", zIndex: 1050 }} onClick={() => setShowDelete(false)}>
            <div className="card shadow" style={{ maxWidth: 460, margin: "15vh auto", padding: 0 }} onClick={e => e.stopPropagation()}>
                <div className="card-header d-flex justify-content-between align-items-center">
                    <strong>Usuń klienta</strong>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowDelete(false)}>Zamknij</button>
                </div>
                <div className="card-body">
                    <p className="mb-2">Czy na pewno chcesz usunąć klienta:</p>
                    <p className="mb-0"><strong>{deleteClient.name}</strong>?</p>
                </div>
                <div className="card-footer d-flex justify-content-end gap-2">
                    <button className="btn btn-light" onClick={() => setShowDelete(false)}>Anuluj</button>
                    <button className="btn btn-danger" onClick={handleConfirmDelete}>Usuń</button>
                </div>
            </div>
        </div>
    );
}

// Główny komponent
function Clients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ name: "", nip: "", krs: "", regon: "", city: "" });
    const [editClient, setEditClient] = useState(null);
    const [deleteClient, setDeleteClient] = useState(null);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);
    const navigate = useNavigate();


    useEffect(() => {
        let alive = true;
        setLoading(true);
        setError("");
        axios.get(`${API_BASE}/Clients`)
            .then(res => { if (!alive) return; setClients(res.data || []); })
            .catch(err => { if (!alive) return; console.error(err); setError("Nie udało się pobrać listy klientów."); })
            .finally(() => alive && setLoading(false));
        return () => { alive = false };
    }, []);

    async function handleSaveEdit() {
        if (!editClient) return;
        const updated = { ...editClient, ...form };
        try {
            const res = await axios.put(`${API_BASE}/Clients/${editClient.id}`, updated);
            setClients(prev => prev.map(c => c.id === editClient.id ? res.data : c));
            setShowEdit(false);
            setEditClient(null);
            setForm({ name: "", nip: "", krs: "", regon: "", city: "" });
        } catch (err) { console.error(err); alert("Nie udało się zapisać zmian."); }
    }

    async function handleConfirmDelete() {
        if (!deleteClient) return;
        try {
            await axios.delete(`${API_BASE}/Clients/${deleteClient.id}`);
            setClients(prev => prev.filter(c => c.id !== deleteClient.id));
            setShowDelete(false);
            setDeleteClient(null);
        } catch (err) { console.error(err); alert("Nie udało się usunąć klienta."); }
    }

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        const list = Array.isArray(clients) ? clients : [];
        if (!q) return list;
        return list.filter(c => [c.name, c.nip, c.krs, c.regon, c.city].some(v => String(v).toLowerCase().includes(q)));
    }, [clients, search]);

    const paginatedClients = Array.isArray(filtered) ? filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const selectedClient = clients.find(c => c.id === selectedId) || null;

    return (
        <div className="d-flex min-vh-100">
            <Sidebar search={search} setSearch={setSearch} />
            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: 'hidden' }}>
                <Topbar breadcrumb={[{ label: 'Workspace', to: '/workspace' }, { label: 'Klienci', active: true }]} />

                <div className="flex-grow-1 d-flex flex-column pt-2 px-2" style={{ minHeight: 0 }}>
                    <div className="flex-grow-1 d-flex h-100" style={{ minHeight: 0 }}>
                        {/* Lewa kolumna */}
                        <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: 0, minWidth: 0 }}>
                            <div className="card shadow-sm h-100 d-flex flex-column" style={{ overflow: 'hidden', minHeight: 0 }}>
                                <div className="card-header" style={{ backgroundColor: "#0a2b4c", color: "#fff" }}>
                                    <div className="row g-2 align-items-center">
                                        <div className="d-flex align-items-center" style={{ padding: '0.5rem 0.3rem' }}>
                                            <strong className="me-auto" style={{ fontSize: "1.1rem" }}>Lista klientów</strong>
                                            <div className="input-group input-group-sm" style={{ maxWidth: 420 }}>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Szukaj: nazwa firmy, KRS, NIP lub REGON"
                                                    aria-label="Szukaj klientów"
                                                    value={search}
                                                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} // Reset to page 1 on search
                                                />
                                                {search && (
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        type="button"
                                                        onClick={() => { setSearch(""); setCurrentPage(1); }}
                                                        title="Wyczyść"
                                                        aria-label="Wyczyść"
                                                    >×</button>
                                                )}
                                                <span className="input-group-text"><BsSearch /></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabela */}
                                <div className="table-responsive flex-grow-1" style={{ overflow: 'auto' }}>
                                    <table className="table table-hover table-sm mb-0 align-middle" style={{ fontSize: '0.9rem' }}>
                                        <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th style={headerStyle}>Nazwa</th>
                                            <th style={headerStyle}>NIP</th>
                                            <th style={headerStyle}>KRS</th>
                                            <th style={headerStyle}>REGON</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={4} className="text-center py-4">Ładowanie klientów...</td>
                                            </tr>
                                        ) : error ? (
                                            <tr>
                                                <td colSpan={4} className="text-center text-danger py-4">{error}</td>
                                            </tr>
                                        ) : filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="text-center text-muted py-4">Brak wyników</td>
                                            </tr>
                                        ) : (
                                            paginatedClients.map(c => (
                                                <tr
                                                    key={c.id}
                                                    onClick={() => setSelectedId(c.id)}
                                                    style={{
                                                        ...tdDescription,
                                                        cursor: "pointer",
                                                        backgroundColor: c.id === selectedId ? "#e7f1ff" : undefined,
                                                    }}
                                                >
                                                    <td style={tdDescription}>{c.name}</td>
                                                    <td style={tdDescription}>{c.nip}</td>
                                                    <td style={tdDescription}>{c.krs}</td>
                                                    <td style={tdDescription}>{c.regon}</td>
                                                </tr>
                                            ))
                                        )}
                                        </tbody>
                                    </table>
                                    <div style={{ marginTop: 5}}>
                                        {loading ? (
                                            <div className="text-center my-1">Ładowanie użytkowników...</div>
                                        ) : error ? (
                                            <div className="text-center text-danger my-1">{error}</div>
                                        ) : (
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                setCurrentPage={setCurrentPage}
                                                maxPageButtons={5}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Prawa kolumna */}
                        <div className="d-none d-lg-block" style={{ width: 360, paddingLeft: 12 }}>
                            <div className="card shadow-sm h-100 d-flex flex-column">
                                <div className="text-center mb-2">
                                    <button className="btn btn-success w-100" onClick={() => navigate("/projekt-klient", { state: { mode: "add" } })}>
                                        Dodaj klienta
                                    </button>
                                </div>
                                <div className="card-header" style={{ padding: '0.6rem 1rem', fontSize: "1rem", backgroundColor: "#0a2b4c", color: "#ffffff" }}>
                                    <strong>Szczegóły klienta</strong>
                                </div>
                                <div className="card-body flex-grow-1" style={{ overflowY: "auto", overflowX: "hidden" }}>
                                    {!selectedClient && (
                                        <div className="text-muted">Wybierz klienta z listy po lewej, aby wyświetlić szczegóły.</div>
                                    )}
                                    {selectedClient && (
                                        <div>
                                            <h5 className="mb-2">{selectedClient.name}</h5>

                                            {/* Identyfikatory i podstawowe informacje */}
                                            <div className="mb-3 small">
                                                <div><strong>Rejestr:</strong> {selectedClient.reg}</div>
                                                <div><strong>Forma prawna:</strong> {selectedClient.form}</div>
                                                <div><strong>NIP:</strong> {selectedClient.nip}</div>
                                                <div><strong>KRS:</strong> {selectedClient.krs}</div>
                                                <div><strong>REGON:</strong> {selectedClient.regon}</div>
                                            </div>

                                            <hr />
                                            <div className="d-flex flex-wrap gap-2">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => navigate("/projekt-klient", { state: { mode: "edit", clientData: selectedClient } })}
                                                >
                                                    Edytuj klienta
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => { setDeleteClient(selectedClient); setShowDelete(true); }}
                                                >
                                                    Usuń klienta
                                                </button>
                                            </div>
                                            <hr />

                                            <div className="mb-3 small">
                                                <div className="fw-semibold mb-1">Projekty:</div>
                                                <ul className="list-unstyled mb-0">
                                                    {selectedClient.projects?.map((p, i) => (
                                                        <li key={i}>
                                                            <Link
                                                                to={`/projekty/${encodeURIComponent(p)}`}
                                                                onClick={(e) => e.stopPropagation()}
                                                                style={{ textDecoration: "underline" }}
                                                            >
                                                                {p}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <hr />


                                            {/* Adres */}
                                            <div className="mb-3 small">
                                                <div className="fw-semibold mb-1">Adres:</div>
                                                <div>{selectedClient.addr.ulica} {selectedClient.addr.nrDomu}, {selectedClient.addr.kod} {selectedClient.addr.miejscowosc}</div>
                                                <div>{selectedClient.addr.woj}, {selectedClient.addr.kraj}</div>
                                            </div>

                                            <hr />

                                            {/* Dane kontaktowe */}
                                            <div className="mb-3 small">
                                                <div className="fw-semibold mb-1">Dane kontaktowe:</div>
                                                <div>Email: <a href={`mailto:${selectedClient.contact.email}`}>{selectedClient.contact.email}</a></div>
                                                <div>Telefon: {selectedClient.contact.phone}</div>
                                                <div>WWW: <a href={`https://${selectedClient.contact.www}`} target="_blank" rel="noreferrer">{selectedClient.contact.www}</a></div>
                                            </div>

                                            <hr />

                                            {/* Przedstawiciele */}
                                            {selectedClient.repr.length > 0 && (
                                                <div className="mb-3 small">
                                                    <div className="fw-semibold mb-1">Przedstawiciele:</div>
                                                    <ul className="list-unstyled mb-0">
                                                        {selectedClient.repr.map((r, i) => (
                                                            <li key={i} className="mb-2">
                                                                <div>{r.name} <span className="text-muted">— {r.role}</span></div>
                                                                <div className="text-muted">Sposób reprezentacji: {r.sposob}</div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {showEdit && editClient && <EditModal form={form} setForm={setForm} handleSaveEdit={handleSaveEdit} setShowEdit={setShowEdit} />}
                        {showDelete && deleteClient && <DeleteModal deleteClient={deleteClient} handleConfirmDelete={handleConfirmDelete} setShowDelete={setShowDelete} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
const headerStyle = { border: "1px solid #dee2e6", paddingLeft: "1rem", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem" };
const tdDescription = { border: "1px solid #dee2e6", fontSize: "0.9rem", paddingLeft: "1rem", paddingTop:"0.5rem", paddingBottom:"0.5rem" };


export default Clients;
