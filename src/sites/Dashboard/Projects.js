import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sidebar, Topbar } from "../../ui/Common";

function ProgressBar({ value }) {
    return (
        <div className="flex-grow-1 position-relative"
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{
                height: 12,
                background: "#eaf0f6",
                borderRadius: 999,
                border: "1px solid #d2dbea",
                boxShadow: "inset 0 1px 1px rgba(0,0,0,0.04)",
                minWidth: 80,
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

function Projects() {
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [projects, setProjects] = useState([]);
    const [modal, setModal] = useState({ type: null, target: null });
    const [form, setForm] = useState({
        id: "",
        client: "",
        status: "W toku",
        progress: 50,
        users: "Anna Kowalska; Jan Nowak",
        contactName: "Jan Kowalski",
        contactEmail: "jan.kowalski@firma.pl",
        contactPhone: "22 123 45 67",
    });

    const navigate = useNavigate();

    // przyszłe pobieranie danych z API
    useEffect(() => {
        async function fetchProjects() {
            // const res = await fetch("/api/projects");
            // const data = await res.json();
            const data = [
                {
                    pid: 1,
                    id: "DR/2025/123456",
                    client: "Acme Sp. z o.o. (Demo)",
                    status: "W toku",
                    progress: 70,
                    users: ["Anna Kowalska", "Jan Nowak"],
                    contact: {
                        name: "Jan Kowalski",
                        email: "jan.demo@example.com",
                        phone: "22 123 45 67",
                    },
                },
                {
                    pid: 2,
                    id: "DR/2025/123454",
                    client: "Beta Demo S.A.",
                    status: "W przygotowaniu",
                    progress: 35,
                    users: ["Katarzyna Wiśniewska"],
                    contact: {
                        name: "Maria Wiśniewska",
                        email: "maria.demo@example.com",
                        phone: "12 234 56 78",
                    },
                },
            ];
            setProjects(data);
        }
        fetchProjects();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return projects;
        return projects.filter((p) =>
            [p.id, p.client, p.status, ...(p.users || [])].some((v) =>
                String(v).toLowerCase().includes(q)
            )
        );
    }, [projects, search]);

    const selected = useMemo(
        () => projects.find((p) => p.pid === selectedId) || null,
        [projects, selectedId]
    );

    const openModal = (type, target = null) => {
        setForm(
            target
                ? {
                    id: target.id,
                    client: target.client,
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
        const id = form.id.trim();
        const client = form.client.trim();
        if (!id || !client) return alert("Podaj Id projektu i nazwę klienta");
        const usersArr = form.users.split(";").map((s) => s.trim()).filter(Boolean);
        if (modal.type === "add") {
            const newPid = (projects[projects.length - 1]?.pid || 0) + 1;
            setProjects([
                ...projects,
                {
                    pid: newPid,
                    id,
                    client,
                    status: form.status,
                    progress: Number(form.progress) || 0,
                    users: usersArr,
                    contact: {
                        name: form.contactName.trim(),
                        email: form.contactEmail.trim(),
                        phone: form.contactPhone.trim(),
                    },
                },
            ]);
            setSelectedId(newPid);
        }
        if (modal.type === "edit" && modal.target) {
            setProjects(
                projects.map((p) =>
                    p.pid === modal.target.pid
                        ? {
                            ...p,
                            id,
                            client,
                            status: form.status,
                            progress: Number(form.progress) || 0,
                            users: usersArr,
                            contact: {
                                name: form.contactName.trim(),
                                email: form.contactEmail.trim(),
                                phone: form.contactPhone.trim(),
                            },
                        }
                        : p
                )
            );
        }
        setModal({ type: null, target: null });
    };

    const deleteProject = () => {
        if (!modal.target) return;
        setProjects(projects.filter((p) => p.pid !== modal.target.pid));
        if (selectedId === modal.target.pid) setSelectedId(null);
        setModal({ type: null, target: null });
    };

    return (
        <div className="d-flex min-vh-100">
            <Sidebar search={search} setSearch={setSearch} />
            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: "hidden" }}>
                <Topbar
                    breadcrumb={[
                        { label: "Home", to: "/" },
                        { label: "Workspace", to: "/workspace" },
                        { label: "Projekty", active: true },
                    ]}
                />

                <div className="flex-grow-1 bg-light d-flex pt-2 px-2" style={{ minHeight: 0 }}>
                    {/* Left: table */}
                    <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
                        <div className="card shadow-sm h-100 d-flex flex-column" style={{ overflow: "hidden" }}>
                            <div
                                className="card-header"
                                style={{ backgroundColor: "#0a2b4c", color: "#ffffff" }}
                            >
                                <div className="d-flex align-items-center" style={{ padding: "0.5rem 0.3rem" }}>
                                    <strong className="me-auto" style={{ fontSize: "1.1rem" }}>
                                        Lista projektów
                                    </strong>
                                    <div className="input-group input-group-sm" style={{ maxWidth: 420 }}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Szukaj: ID, klient, status, użytkownik"
                                            aria-label="Szukaj po ID, kliencie, statusie lub użytkowniku"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                        {search && (
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={() => setSearch("")}
                                                title="Wyczyść"
                                            >
                                                ×
                                            </button>
                                        )}
                                        <span className="input-group-text" id="projects-search-icon-top">
                      🔍
                    </span>
                                    </div>
                                </div>
                            </div>

                            <div className="table-responsive flex-grow-1" style={{ overflow: "auto" }}>
                                <table className="table table-hover table-sm mb-0 align-middle" style={{ fontSize: "0.9rem" }}>
                                    <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 1, whiteSpace: "nowrap" }}>
                                    <tr>
                                        <th style={headerStyle}>Projekt</th>
                                        <th style={headerStyle}>Klient</th>
                                        <th style={headerStyle}>Aktualny status</th>
                                        <th style={headerStyle}>Postęp</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filtered.map((p) => (
                                        <tr
                                            key={p.pid}
                                            onClick={() => setSelectedId(p.pid)}
                                            style={{ cursor: "pointer", backgroundColor: p.pid === selectedId ? "#e7f1ff" : undefined }}
                                        >
                                            <td style={tdDescription}>
                                                <Link
                                                    to={`/projekty/${encodeURIComponent(p.id)}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{ textDecoration: "underline" }}
                                                >
                                                    {p.id}
                                                </Link>
                                            </td>
                                            <td style={tdDescription}>{p.client}</td>
                                            <td style={tdDescription}>{p.status}</td>
                                            <td style={tdDescription}>
                                                <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
                                                    <ProgressBar value={p.progress} />
                                                    <span className="small text-muted me-3" style={{ width: 38, textAlign: "right" }}>
                              {p.progress}%
                            </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filtered.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-center text-muted py-4">
                                                Brak wyników
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right: details */}
                    <div className="d-none d-lg-block" style={{ width: 360, paddingLeft: 12 }}>
                        <div className="card shadow-sm h-100 d-flex flex-column" style={{ overflow: "hidden" }}>
                            <div className="text-center mb-2">
                                <button
                                    className="btn btn-success w-100"
                                    onClick={() => openModal("add")}
                                    style={{ whiteSpace: "nowrap", minWidth: 220 }}
                                >
                                    Utwórz projekt
                                </button>
                            </div>
                            <div className="card-header d-flex align-items-center" style={{ padding: "0.6rem 1rem", fontSize: "1rem", backgroundColor: "#0a2b4c", color: "#ffffff" }}>
                                <strong className="me-auto">Szczegóły projektu</strong>
                            </div>
                            <div className="card-body flex-grow-1" style={{ overflowY: "auto" }}>
                                {!selected && <div className="text-muted">Wybierz projekt z listy po lewej, aby wyświetlić szczegóły.</div>}
                                {selected && (
                                    <div className="small" style={{ lineHeight: 1.2 }}>
                                        <div className="mb-2">
                                            <div className="fw-semibold" style={{ fontSize: "1.15rem" }}>{selected.id}</div>
                                            <div className="text-muted" style={{ fontSize: "1.05rem" }}>{selected.client}</div>

                                            <div className="mt-2">
                                                <hr className="my-2" />
                                                <div className="fw-semibold mb-2" style={{ fontSize: "0.95rem" }}>Akcje</div>
                                                <div className="d-flex flex-wrap" style={{ gap: "0.5rem" }}>
                                                    <button className="btn btn-sm btn-outline-primary" onClick={() => openModal("edit", selected)}>Edytuj projekt</button>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => openModal("delete", selected)}>Usuń projekt</button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Użytkownicy i kontakt */}
                                        <hr />
                                        <div className="mb-3">
                                            <div className="fw-semibold mb-1" style={{ fontSize: "0.95rem" }}>Użytkownicy - Projekt</div>
                                            <div className="mb-3">
                                                <div className="fw-semibold">Kierownik Projektu</div>
                                                <div>{selected.users[0]}</div>
                                            </div>
                                            {selected.users.slice(1).map((u, i) => (
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

                {/* Modal */}
                {modal.type && (
                    <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background: "rgba(0,0,0,0.35)", zIndex: 1050 }} onClick={() => setModal({ type: null, target: null })}>
                        <div
                            className="card shadow"
                            style={{ maxWidth: modal.type === "delete" ? 460 : 560, margin: "8vh auto", padding: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {modal.type === "delete" ? (
                                <>
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <strong>Usuń projekt</strong>
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setModal({ type: null, target: null })}>Zamknij</button>
                                    </div>
                                    <div className="card-body">
                                        <p className="mb-2">Czy na pewno chcesz usunąć projekt:</p>
                                        <p className="mb-0"><strong>{modal.target?.id}</strong>?</p>
                                    </div>
                                    <div className="card-footer d-flex justify-content-end gap-2">
                                        <button className="btn btn-light" onClick={() => setModal({ type: null, target: null })}>Anuluj</button>
                                        <button className="btn btn-danger" onClick={deleteProject}>Usuń</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <strong>{modal.type === "add" ? "Utwórz projekt" : "Edytuj projekt"}</strong>
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setModal({ type: null, target: null })}>Zamknij</button>
                                    </div>
                                    <div className="card-body" style={{ maxHeight: "70vh", overflow: "auto" }}>
                                        <div className="row g-2">
                                            <div className="col-12">
                                                <label className="form-label mb-1">Id projektu</label>
                                                <input className="form-control" value={form.id} onChange={(e) => setForm(prev => ({ ...prev, id: e.target.value }))} />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label mb-1">Klient</label>
                                                <input className="form-control" value={form.client} onChange={(e) => setForm(prev => ({ ...prev, client: e.target.value }))} />
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label mb-1">Status</label>
                                                <select className="form-select" value={form.status} onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}>
                                                    <option>W toku</option>
                                                    <option>W przygotowaniu</option>
                                                    <option>Zakończony</option>
                                                    <option>Wstrzymany</option>
                                                </select>
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label mb-1">Postęp (%)</label>
                                                <input type="number" min={0} max={100} className="form-control" value={form.progress} onChange={(e) => setForm(prev => ({ ...prev, progress: Math.max(0, Math.min(100, Number(e.target.value) || 0)) }))} />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label mb-1">Użytkownicy (oddziel średnikiem)</label>
                                                <input className="form-control" value={form.users} onChange={(e) => setForm(prev => ({ ...prev, users: e.target.value }))} />
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label mb-1">Kontakt: Imię i nazwisko</label>
                                                <input className="form-control" value={form.contactName} onChange={(e) => setForm(prev => ({ ...prev, contactName: e.target.value }))} />
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label mb-1">Kontakt: telefon</label>
                                                <input className="form-control" value={form.contactPhone} onChange={(e) => setForm(prev => ({ ...prev, contactPhone: e.target.value }))} />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label mb-1">Kontakt: email</label>
                                                <input className="form-control" value={form.contactEmail} onChange={(e) => setForm(prev => ({ ...prev, contactEmail: e.target.value }))} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer d-flex justify-content-end gap-2">
                                        <button className="btn btn-light" onClick={() => setModal({ type: null, target: null })}>Anuluj</button>
                                        <button className="btn btn-primary" onClick={saveProject}>{modal.type === "add" ? "Utwórz" : "Zapisz"}</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const headerStyle = { border: "1px solid #dee2e6", paddingLeft: "1rem", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem" };
const tdDescription = { border: "1px solid #dee2e6", fontSize: "0.9rem", paddingLeft: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem" };

export default Projects;
