import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Sidebar, Topbar } from "../../ui/Common";
import Pagination from "../Pagination";
import { BsSearch, BsFilter } from "react-icons/bs";
import { InitialsAvatar } from "../../ui/common_function";


const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5171";

function Users() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 11;

    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const [roleFilter, setRoleFilter] = useState("");


    // Fetch users from API
    useEffect(() => {
        let alive = true;
        setLoading(true);
        setError("");
        axios.get(`${API_BASE}/Users`)
            .then(res => {
                if (!alive) return;
                setUsers(res.data || []);
            })
            .catch(err => {
                if (!alive) return;
                console.error(err);
                setError("Nie udało się pobrać listy użytkowników. Upewnij się, że serwer działa.");
            })
            .finally(() => alive && setLoading(false));
        return () => { alive = false; }
    }, []);

    // Filter users based on search
    const filtered = useMemo(() => {
        let data = users;

        if (search.trim()) {
            const q = search.trim().toLowerCase();
            data = data.filter(u =>
                [u.name, u.email, u.role].some(v => String(v).toLowerCase().includes(q))
            );
        }

        if (roleFilter) {
            data = data.filter(u => u.role === roleFilter);
        }

        return data;
    }, [users, search, roleFilter]);


    // Pagination logic
    const totalPages = useMemo(() => Math.ceil(filtered.length / itemsPerPage), [filtered.length]);
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filtered.slice(startIndex, startIndex + itemsPerPage);
    }, [filtered, currentPage]);

    // Selected user
    const selectedUser = useMemo(() => users.find(u => u.id === selectedId) || null, [users, selectedId]);

    // Toggle user active status
    const toggleActive = (id, val) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, active: typeof val === 'boolean' ? val : !u.active } : u));
    };

    // Change user role
    const setRole = (id, role) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    };

    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        role: "Klient",
        active: true,
    });
    const [adding, setAdding] = useState(false);



    return (
        <div className="d-flex min-vh-100">
            <Sidebar search={search} setSearch={setSearch} />

            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: 'hidden' }}>
                <Topbar
                    breadcrumb={[
                        { label: 'Workspace', to: '/workspace' },
                        { label: 'Użytkownicy', active: true }
                    ]}
                />

                <div className="flex-grow-1 bg-light d-flex pt-2 px-2" style={{ minHeight: 0 }}>
                    {/* Left: Table */}
                    <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: 0, minWidth: 0 }}>
                        <div className="card shadow-sm h-100 d-flex flex-column" style={{ overflow: 'hidden', minHeight: 0 }}>
                            <div className="card-header" style={{ backgroundColor: "#0a2b4c", color: "#ffffff" }}>
                                <div className="d-flex align-items-center" style={{ padding: '0.5rem 0.3rem' }}>
                                    <strong className="me-auto" style={{ fontSize: "1.1rem" }}>Moduł użytkowników</strong>
                                    <div className="input-group input-group-sm" style={{ maxWidth: 420 }}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Szukaj: mail, imię i nazwisko"
                                            aria-label="Szukaj użytkowników"
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

                            <div className="table-responsive flex-grow-1" style={{ overflow: 'auto' }}>
                                {loading ? (
                                    <div className="text-center my-3">Ładowanie użytkowników...</div>
                                ) : error ? (
                                    <div className="text-center text-danger my-3">{error}</div>
                                ) : (
                                    <>
                                        <table className="table table-hover table-sm mb-0 align-middle" style={{ fontSize: '0.9rem' }}>
                                            <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 1, whiteSpace: 'nowrap' }}>
                                            <tr>
                                                <th style={headerStyle}>Imię i nazwisko</th>
                                                <th style={headerStyle}>Email</th>
                                                <th style={headerStyle}>Status</th>
                                                <th style={headerStyle} className="position-relative">
                                                    Rola
                                                    <BsFilter
                                                        style={{ cursor: "pointer", marginLeft: 6 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowRoleDropdown((prev) => !prev);
                                                        }}
                                                    />
                                                    {showRoleDropdown && (
                                                        <div
                                                            className="position-absolute shadow rounded"
                                                            style={{
                                                                top: "100%",
                                                                right: 0,
                                                                zIndex: 20,
                                                                minWidth: 140,
                                                                backgroundColor: "#ffffff",
                                                                color: "#000000",
                                                                border: "1px solid #ccc",
                                                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                                                            }}
                                                        >
                                                            {["Administrator", "Kierownik", "Asystent", "Klient", "Właściciel"].map((r) => (
                                                                <div
                                                                    key={r}
                                                                    className="px-3 py-2"
                                                                    style={{
                                                                        cursor: "pointer",
                                                                        fontSize: "0.85rem",
                                                                        fontWeight: 400,
                                                                        color: "#000000",
                                                                        backgroundColor: roleFilter === r ? "#cce5ff" : "transparent",
                                                                        borderBottom: "1px solid #eee",
                                                                    }}
                                                                    onClick={() => {
                                                                        setRoleFilter(r);
                                                                        setShowRoleDropdown(false);
                                                                        setCurrentPage(1); // reset paginacji
                                                                    }}
                                                                >
                                                                    {r}
                                                                </div>
                                                            ))}
                                                            <div
                                                                className="px-3 py-2"
                                                                style={{
                                                                    cursor: "pointer",
                                                                    color: "#000000",
                                                                    fontWeight: 500,
                                                                    fontSize: "0.85rem",
                                                                    borderTop: "1px solid #eee",
                                                                    backgroundColor: "#f8f9fa",
                                                                }}
                                                                onClick={() => {
                                                                    setRoleFilter("");
                                                                    setShowRoleDropdown(false);
                                                                    setCurrentPage(1);
                                                                }}
                                                            >
                                                                Wyczyść filtr
                                                            </div>
                                                        </div>
                                                    )}
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {paginatedUsers.map(u => (
                                                <tr
                                                    key={u.id}
                                                    onClick={() => setSelectedId(u.id)}
                                                    style={{ cursor: 'pointer', backgroundColor: u.id === selectedId ? '#e7f1ff' : undefined }}
                                                >
                                                    <td style={tdDescription}>
                                                        <div className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
                                                            <InitialsAvatar name={u.name} size={24} />
                                                            <span>{u.name}</span>
                                                        </div>
                                                    </td>
                                                    <td style={tdDescription}>{u.email}</td>
                                                    <td style={tdDescription}>
                              <span className={`badge fw-normal ${u.active ? 'bg-success-subtle text-dark' : 'bg-secondary-subtle text-dark'}`}>
                                {u.active ? 'Aktywny' : 'Nieaktywny'}
                              </span>
                                                    </td>
                                                    <td style={tdDescription}>{u.role}</td>
                                                </tr>
                                            ))}
                                            {paginatedUsers.length === 0 && (
                                                <tr><td colSpan={4} className="text-center text-muted py-4">Brak wyników</td></tr>
                                            )}
                                            </tbody>
                                        </table>

                                        {/* Pagination */}
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

                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Selected user details */}
                    <div className="d-none d-lg-block" style={{ width: 360, paddingLeft: 12 }}>
                        <div className="card shadow-sm h-100 d-flex flex-column" style={{ overflow: 'hidden' }}>
                            <div className="text-center mb-2">
                                <button
                                    className="btn btn-success w-100"
                                    onClick={() => setShowAddUserModal(true)}
                                    style={{ minWidth: 220 }}
                                >
                                    Dodaj użytkownika
                                </button>
                            </div>
                            <div className="card-header" style={{ padding: '0.6rem 1rem', fontSize: "1rem", backgroundColor: "#0a2b4c", color: "#ffffff" }}>
                                <div className="d-flex align-items-center">
                                    <strong className="me-auto">Szczegóły użytkownika</strong>
                                </div>
                            </div>
                            <div className="card-body flex-grow-1" style={{ overflowY: 'auto' }}>
                                {!selectedUser && <div className="text-muted">Wybierz użytkownika z listy po lewej, aby wyświetlić szczegóły.</div>}
                                {selectedUser && (
                                    <div>
                                        <h6 className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
                                            <InitialsAvatar name={selectedUser.name} size={30} />
                                            <span>{selectedUser.name}</span>
                                        </h6>
                                        <div className="mb- small" style={{ wordBreak: 'break-word' }}><strong>Email:</strong> {selectedUser.email}</div>
                                        <div className="mb-3 small" style={{ wordBreak: 'break-word' }}><strong>Rola:</strong> {selectedUser.role}</div>
                                        <hr />
                                        <div className="mb-2">
                                            <div className="fw-semibold mb-2" style={{ fontSize: '0.95rem' }}>Akcje</div>
                                            <div className="d-flex flex-wrap" style={{ gap: '0.5rem' }}>
                                                <button className="btn btn-sm btn-outline-primary" disabled={selectedUser.active} onClick={() => toggleActive(selectedUser.id, true)}>Aktywuj</button>
                                                <button className="btn btn-sm btn-outline-danger" disabled={!selectedUser.active} onClick={() => toggleActive(selectedUser.id, false)}>Dezaktywuj</button>
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => alert('Anonimizacja demo')}>Anonimizuj</button>
                                            </div>
                                            <div className="mt-2">
                                                <div className="fw-semibold mb-1 small">Rola</div>
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowRoleModal(true)}>Zmień role</button>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="fw-semibold mb-2">Przypisane projekty</div>
                                        <ul className="list-unstyled small">
                                            {selectedUser.projects.map((pid, i) => (
                                                <li key={i}><button type="button" className="btn btn-link p-0 align-baseline">{pid}</button></li>
                                            ))}
                                        </ul>
                                        <hr />
                                        <div className="mb-2"><div className="text-muted small">Data aktywacji</div><div className="small">{selectedUser.actFrom}</div></div>
                                        <div className="mb-2"><div className="text-muted small">Data dezaktywacji</div><div className="small">{selectedUser.actTo}</div></div>
                                        <div className="mb-2"><div className="text-muted small">Ostatnia aktywność</div><div className="small">{selectedUser.last}</div></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Role Modal */}
            {showRoleModal && selectedUser && (
                <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background: "rgba(0,0,0,0.35)", zIndex: 1050 }} onClick={() => setShowRoleModal(false)}>
                    <div className="card shadow" style={{ maxWidth: 400, margin: "20vh auto", padding: 0 }} onClick={(e) => e.stopPropagation()}>
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <strong>Zmień rolę dla {selectedUser.name}</strong>
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowRoleModal(false)}>Zamknij</button>
                        </div>
                        <div className="card-body">
                            <label className="form-label mb-1">Wybierz nową rolę</label>
                            <select className="form-select" value={selectedUser.role} onChange={(e) => setRole(selectedUser.id, e.target.value)}>
                                <option>Administrator</option>
                                <option>Kierownik</option>
                                <option>Asystent</option>
                                <option>Klient</option>
                                <option>Właściciel</option>
                            </select>
                        </div>
                        <div className="card-footer d-flex justify-content-end gap-2">
                            <button className="btn btn-light" onClick={() => setShowRoleModal(false)}>Anuluj</button>
                            <button className="btn btn-primary" onClick={() => setShowRoleModal(false)}>Zapisz</button>
                        </div>
                    </div>
                </div>
            )}
            {showAddUserModal && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100"
                    style={{ background: "rgba(0,0,0,0.35)", zIndex: 1050 }}
                    onClick={() => !adding && setShowAddUserModal(false)}
                >
                    <div
                        className="card shadow"
                        style={{ maxWidth: 420, margin: "20vh auto", padding: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <strong>Dodaj nowego użytkownika</strong>
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => !adding && setShowAddUserModal(false)}
                                disabled={adding}
                            >
                                Zamknij
                            </button>
                        </div>

                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Imię i nazwisko</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newUser.name}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, name: e.target.value })
                                    }
                                    disabled={adding}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={newUser.email}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, email: e.target.value })
                                    }
                                    disabled={adding}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Rola</label>
                                <select
                                    className="form-select"
                                    value={newUser.role}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, role: e.target.value })
                                    }
                                    disabled={adding}
                                >
                                    <option>Administrator</option>
                                    <option>Kierownik</option>
                                    <option>Asystent</option>
                                    <option>Klient</option>
                                    <option>Właściciel</option>
                                </select>
                            </div>
                            <div className="form-check mb-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={newUser.active}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, active: e.target.checked })
                                    }
                                    id="newUserActive"
                                    disabled={adding}
                                />
                                <label className="form-check-label" htmlFor="newUserActive">
                                    Aktywny
                                </label>
                            </div>
                        </div>

                        <div className="card-footer d-flex justify-content-end gap-2">
                            <button
                                className="btn btn-light"
                                onClick={() => setShowAddUserModal(false)}
                                disabled={adding}
                            >
                                Anuluj
                            </button>
                            <button
                                className="btn btn-primary"
                                disabled={adding}
                                onClick={async () => {
                                    if (!newUser.name.trim() || !newUser.email.trim()) {
                                        alert("Proszę uzupełnić imię i email.");
                                        return;
                                    }

                                    setAdding(true);
                                    try {
                                        const newEntry = {
                                            id: Date.now().toString(),
                                            name: newUser.name.trim(),
                                            email: newUser.email.trim(),
                                            role: newUser.role,
                                            active: newUser.active,
                                            projects: [], // ✅ no projects initially
                                            actFrom: new Date().toISOString().split("T")[0],
                                            actTo: "",
                                            last: "Brak danych",
                                        };

                                        // ✅ POST to your db.json
                                        await axios.post(`${API_BASE}/Users`, newEntry);

                                        // ✅ Update state instantly
                                        setUsers((prev) => [...prev, newEntry]);

                                        // ✅ Reset form
                                        setNewUser({
                                            name: "",
                                            email: "",
                                            role: "Klient",
                                            active: true,
                                        });

                                        setShowAddUserModal(false);
                                    } catch (err) {
                                        console.error(err);
                                        alert("Błąd podczas zapisywania użytkownika. Sprawdź serwer API.");
                                    } finally {
                                        setAdding(false);
                                    }
                                }}
                            >
                                {adding ? "Zapisywanie..." : "Zapisz"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const headerStyle = { border: "1px solid #dee2e6", paddingLeft: "1rem", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem" };
const tdDescription = { border: "1px solid #dee2e6", fontSize: "0.9rem", paddingLeft: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem" };

export default Users;
