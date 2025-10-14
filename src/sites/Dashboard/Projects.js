import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sidebar, Topbar } from "../../ui/Common";
import axios from "axios";
import Pagination from "../../sites/Pagination";
import { BsSearch, BsFilter } from "react-icons/bs";

function generateProjectName() {
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    return `DR/${year}/${random}`;
}

const statusLabel = {
    active: { text: "W trakcie"},
    completed: { text: "Ukończone"},
    delayed: { text: "Opóźnione"},
};

function ProgressBar({ value }){
    return (
        <div className="flex-grow-1 position-relative" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}
             style={{ height: 14, background: '#eaf0f6', borderRadius: 999, border: '1px solid #d2dbea', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.04)', minWidth:40, maxWidth:90}}>
            <div style={{ width: `${value}%`, height: '100%', borderRadius: 999, background: 'var(--ndr-bg-topbar)', transition: 'width 300ms ease', position:'relative' }}>
                <span style={{ position:'absolute', right: -2, top: -2, bottom: -2, width: 4, background:'#ffffff55', borderRadius: 2 }} />
            </div>
        </div>
    );
}

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5171";

function Projects() {
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [statusFilter, setStatusFilter] = useState(""); // filtr statusu
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);


    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [warning, setWarning] = useState("");

    const [modal, setModal] = useState({ type: null, target: null });
    const [form, setForm] = useState({
        name: "",
        klient: "",
        status: "active",
        users: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
    });

    const openModal = (type, target = null) => {
        setForm(
            target
                ? {
                    name: target.name,
                    klient: target.klient,
                    status: target.status,
                    progress: target.progress,
                    users: target.users.join("; "),
                    contactName: target.contact.name,
                    contactEmail: target.contact.email,
                    contactPhone: target.contact.phone,
                }
                : form
        );
        setModal({ type, target });
    };

    const saveProject = () => {
        const usersArr = form.users.split(";").map(u => u.trim()).filter(Boolean);

        // 🔎 Check if client exists in DB
        const clientExists = clients.some(
            c => c.name?.toLowerCase() === form.klient?.trim().toLowerCase()
        );

        if (!clientExists) {
            // 🟡 Show a simple popup alert
            window.alert("Klienta nie ma w bazie. Proszę przejdź do strony klienta i go dodaj.");
            return; // stop saving
        }

        const newProject = {
            id: projects[projects.length - 1]?.id + 1 || 1,
            name: generateProjectName(), // auto name
            klient: form.klient,
            status: "active", // w trakcie
            progress: 0, // start at 0%
            users: usersArr,
            contact: {
                name: form.contactName,
                email: form.contactEmail,
                phone: form.contactPhone,
            },
        };

        // Save to state
        setProjects([...projects, newProject]);

        // Optionally persist locally
        localStorage.setItem("projects", JSON.stringify([...projects, newProject]));

        setModal({ type: null, target: null });
    };

    const deleteProject = () => {
        if (!modal.target) return;
        setProjects(projects.filter(p => p.id !== modal.target.id));
        if (selectedId === modal.target.id) setSelectedId(null);
        setModal({ type: null, target: null });
    };

    useEffect(() => {
        let alive = true;
        setLoading(true);

        axios.get(`${API_BASE}/Projects`)
            .then(res => {
                if (!alive) return;
                const apiData = res.data || [];

                // Wczytaj projekty zapisane lokalnie (utworzone w ProjectClient)
                const localProjects = JSON.parse(localStorage.getItem("projects") || "[]");

                // Połącz i usuń duplikaty po id
                const merged = [...apiData, ...localProjects.filter(lp => !apiData.some(ap => ap.id === lp.id))];
                setProjects(merged);
            })
            .catch(err => {
                if (!alive) return;
                console.error(err);
                setError("Nie udało się pobrać listy projektów. Upewnij się, że mock serwer działa.");
            })
            .finally(() => alive && setLoading(false));

        return () => { alive = false; };
    }, []);

    useEffect(() => {
        let alive = true;
        setLoading(true);

        Promise.all([
            axios.get(`${API_BASE}/Projects`),
            axios.get(`${API_BASE}/Clients`).catch(() => ({ data: [] }))
        ])
            .then(([projRes, clientRes]) => {
                if (!alive) return;
                const apiData = projRes.data || [];
                const localProjects = JSON.parse(localStorage.getItem("projects") || "[]");
                const merged = [...apiData, ...localProjects.filter(lp => !apiData.some(ap => ap.id === lp.id))];
                setProjects(merged);
                setClients(clientRes.data || []);
            })
            .catch(err => {
                if (!alive) return;
                console.error(err);
                setError("Nie udało się pobrać listy projektów lub klientów. Upewnij się, że mock serwer działa.");
            })
            .finally(() => alive && setLoading(false));

        return () => { alive = false; };
    }, []);

    useEffect(() => {
        let alive = true;
        setLoading(true);
        axios
            .get(`${API_BASE}/Projects`)
            .then((res) => {
                if (!alive) return;
                setProjects(res.data || []);
            })
            .catch((err) => {
                if (!alive) return;
                console.error(err);
                setError("Nie udało się pobrać listy projektów. Upewnij się, że mock serwer działa.");
            })
            .finally(() => alive && setLoading(false));
        return () => { alive = false; };
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return projects.filter((p) => {
            const matchesSearch = !q || [p.name, p.klient, ...(p.users || [])]
                .some((v) => String(v).toLowerCase().includes(q));
            const matchesStatus = !statusFilter || p.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [projects, search, statusFilter]);


    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedProjects = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filtered.slice(start, end);
    }, [filtered, currentPage]);

    const selected = useMemo(() => projects.find(p => p.id === selectedId) || null, [projects, selectedId]);

    return (
        <div className="d-flex min-vh-100">
            <Sidebar search={search} setSearch={setSearch} />
            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: "hidden" }}>
                <Topbar breadcrumb={[
                    { label: "Home", to: "/" },
                    { label: "Workspace", to: "/workspace" },
                    { label: "Projekty", active: true },
                ]} />

                <div className="flex-grow-1 bg-light d-flex pt-2 px-2" style={{ minHeight: 0 }}>
                    {/* Left: table */}
                    <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
                        <div className="card shadow-sm h-100 d-flex flex-column" style={{ overflow: "hidden" }}>
                            <div className="card-header" style={{ backgroundColor: "#0a2b4c", color: "#ffffff" }}>
                                <div className="d-flex align-items-center" style={{ padding: "0.5rem 0.3rem" }}>
                                    <strong className="me-auto" style={{ fontSize: "1.1rem" }}>Lista projektów</strong>
                                    <div className="input-group input-group-sm" style={{ maxWidth: 420 }}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Szukaj: nazwa, klient, status, użytkownik"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                        {search && (
                                            <button className="btn btn-outline-secondary" type="button" onClick={() => setSearch("")}>×</button>
                                        )}
                                        <span className="input-group-text"><BsSearch /></span>
                                    </div>
                                </div>
                            </div>

                            <div className="table-responsive flex-grow-1" style={{ overflow: "auto" }}>
                                <table className="table table-hover table-sm mb-0 align-middle" style={{ fontSize: "0.9rem" }}>
                                    <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                    <tr>
                                        <th style={headerStyle}>Projekt</th>
                                        <th style={headerStyle}>Klient</th>
                                        <th style={headerStyle} className="position-relative">
                                            Status
                                            <BsFilter
                                                style={{ cursor: "pointer", marginLeft: 6 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowStatusDropdown((prev) => !prev);
                                                }}
                                            />
                                            {showStatusDropdown && (
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
                                                    {["active", "completed", "delayed"].map((s) => (
                                                        <div
                                                            key={s}
                                                            className="px-3 py-2"
                                                            style={{
                                                                cursor: "pointer",
                                                                fontSize: "0.85rem",
                                                                fontWeight: 400,
                                                                color: "#000000",
                                                                backgroundColor: statusFilter === s ? "#cce5ff" : "transparent",
                                                                borderBottom: "1px solid #eee",
                                                            }}
                                                            onClick={() => {
                                                                setStatusFilter(s);
                                                                setShowStatusDropdown(false);
                                                                setCurrentPage(1);
                                                            }}
                                                        >
                                                            {statusLabel[s].text}
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
                                                            setStatusFilter("");
                                                            setShowStatusDropdown(false);
                                                        }}
                                                    >
                                                        Wyczyść filtr
                                                    </div>
                                                </div>
                                            )}
                                        </th>
                                        <th style={headerStyle}>Postęp</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {paginatedProjects.map(p => (
                                        <tr
                                            key={p.id}
                                            onClick={() => setSelectedId(p.id)}
                                            style={{ cursor: "pointer", backgroundColor: selectedId === p.id ? "#e7f1ff" : undefined }}
                                        >
                                            <td style={tdDescription}>
                                                <Link
                                                    to={`/projekty/${encodeURIComponent(p.name)}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{ textDecoration: "underline" }}
                                                >
                                                    {p.name}
                                                </Link>
                                            </td>
                                            <td style={tdDescription}>{p.klient}</td>
                                            <td style={{ border: "1px solid #dee2e6", padding: "0.5rem 1rem" }}>
            <span
                className={`badge fw-normal ${
                    p.status === "completed"
                        ? "bg-success-subtle text-dark"
                        : p.status === "active"
                            ? "bg-primary-subtle text-dark"
                            : "bg-danger-subtle text-dark"
                }`}
                style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
            >
              {statusLabel[p.status].icon}
                {statusLabel[p.status].text}
            </span>
                                            </td>
                                            <td className="w-40" style={{ border: "1px solid #dee2e6", padding: "0.5rem 1rem" }}>
                                                <div className="d-flex align-items-center" style={{ gap:'0.2rem' }}>
                                                    <ProgressBar value={p.progress} />
                                                    <span className="small text-muted me-3" style={{ width:38, textAlign:'right' }}>{p.progress}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filtered.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-center text-muted py-4">Brak wyników</td>
                                        </tr>
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

                    {/* Right panel: keep layout */}
                    <div className="d-none d-lg-block" style={{ width: 360, paddingLeft: 12 }}>
                        <div className="card shadow-sm h-100 d-flex flex-column" style={{ overflow: "hidden" }}>
                            <div className="text-center mb-2">
                                <button
                                    className="btn btn-success w-100"
                                    onClick={() => {
                                        // Reset form to defaults for a new project
                                        setForm({
                                            name: generateProjectName(),
                                            klient: "",
                                            status: "active",
                                            progress: 0,
                                            users: "",
                                            contactName: "",
                                            contactEmail: "",
                                            contactPhone: "",
                                        });
                                        setModal({ type: "add", target: null });
                                    }}
                                >
                                    Utwórz projekt
                                </button>
                            </div>

                            <div className="card-header d-flex align-items-center"
                                 style={{ padding: "0.6rem 1rem", fontSize: "1rem", backgroundColor: "#0a2b4c", color: "#ffffff" }}
                            >
                                <strong className="me-auto">Szczegóły projektu</strong>
                            </div>
                            <div className="card-body flex-grow-1" style={{ overflowY: "auto" }}>
                                {!selected && <div className="text-muted">Wybierz projekt z listy po lewej, aby wyświetlić szczegóły.</div>}
                                {selected && (
                                    <div className="small" style={{ lineHeight: 1.2 }}>
                                        <div className="mb-2">
                                            <div className="fw-semibold" style={{ fontSize: "1.15rem" }}>{selected.name}</div>
                                            <div className="text-muted" style={{ fontSize: "1.05rem" }}>{selected.klient}</div>

                                            <div className="mt-2">
                                                <hr className="my-2" />
                                                <div className="fw-semibold mb-2" style={{ fontSize: "0.95rem" }}>Akcje</div>
                                                <div className="d-flex flex-wrap" style={{ gap: "0.5rem" }}>
                                                    <button className="btn btn-sm btn-outline-primary" onClick={() => openModal("edit", selected)}>Edytuj projekt</button>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => openModal("delete", selected)}>Usuń projekt</button>
                                                </div>
                                            </div>
                                        </div>

                                        <hr />
                                        <div className="mb-3">
                                            <div className="fw-semibold mb-1" style={{ fontSize: "0.95rem" }}>Użytkownicy - Projekt</div>
                                            <div className="mb-3">
                                                <div className="fw-semibold">Kierownik Projektu</div>
                                                <div>{selected.users[0]}</div>
                                            </div>
                                            {selected.users?.slice(1).map((u, i) => (
                                                <div key={i} className="mb-3">
                                                    <div className="fw-semibold">Asystent projektu</div>
                                                    <div>{u}</div>
                                                </div>
                                            ))}
                                            <button className="btn btn-sm btn-outline-primary" onClick={() => navigate("/projekt-konfiguracja")}>Konfiguruj użytkowników</button>
                                        </div>

                                        <hr />
                                        <div className="mb-1 fw-semibold" style={{ fontSize: "0.95rem" }}>Osoby kontaktowe</div>
                                        <div className="mb-3">{selected.contact.name} — <span className="text-muted">Kontakt</span></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {modal.type && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-start justify-content-center"
                    style={{ background: "rgba(0,0,0,0.35)", zIndex: 1050, paddingTop: "10vh" }}
                    onClick={() => setModal({ type: null, target: null })}
                >
                    <div
                        className="card shadow"
                        style={{ maxWidth: 650, width: "100%", borderRadius: "0.5rem" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-header" style={{backgroundColor: '#0a2b4c', color: '#ffffff' }}>
                            <strong>
                                {modal.type === "add" && "Dodaj projekt"}
                                {modal.type === "edit" && "Edytuj projekt"}
                                {modal.type === "delete" && "Usuń projekt"}
                            </strong>
                        </div>

                        <div className="card-body">
                            {modal.type === "delete" ? (
                                <>
                                    <p>Czy na pewno chcesz usunąć projekt <strong>{modal.target?.name}</strong>?</p>
                                    <div className="d-flex justify-content-end" style={{ gap: "0.5rem" }}>
                                        <button className="btn btn-danger" onClick={deleteProject}>Usuń</button>
                                        <button className="btn btn-secondary" onClick={() => setModal({ type: null, target: null })}>Anuluj</button>
                                    </div>
                                </>
                            ) : (
                                <div className="d-flex flex-wrap" style={{ gap: "1rem" }}>
                                    {/* Left column: Project info */}
                                    <div className="flex-fill" style={{ minWidth: 280 }}>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Nazwa projektu</label>
                                            <input
                                                className="form-control"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Klient</label>
                                            <input
                                                className="form-control"
                                                value={form.klient}
                                                onChange={(e) => setForm({ ...form, klient: e.target.value })}
                                            />
                                        </div>
                                    </div>


                                    {warning && (
                                        <div
                                            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                                            style={{ background: "rgba(0,0,0,0.4)", zIndex: 1200 }}
                                            onClick={() => setWarning("")}
                                        >
                                            <div
                                                className="card shadow"
                                                onClick={e => e.stopPropagation()}
                                                style={{ maxWidth: 420 }}
                                            >
                                                <div className="card-header bg-warning text-dark fw-semibold">
                                                    Uwaga
                                                </div>
                                                <div className="card-body">
                                                    <p>{warning}</p>
                                                    <div className="text-end">
                                                        <button className="btn btn-primary" onClick={() => setWarning("")}>OK</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}


                                    {/* Buttons at bottom */}
                                    <div className="w-100 d-flex justify-content-end" style={{ gap: "0.5rem" }}>
                                        <button className="btn btn-success" onClick={saveProject}>Zapisz</button>
                                        <button className="btn btn-secondary" onClick={() => setModal({ type: null, target: null })}>Anuluj</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>


    );
}

const headerStyle = { border: "1px solid #dee2e6", paddingLeft: "1rem", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem" };
const tdDescription = { border: "1px solid #dee2e6", fontSize: "0.9rem", paddingLeft: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem" };

export default Projects;
