import React, { useState, useEffect, useMemo } from "react";
import { useOutletContext, Link } from "react-router-dom";
import axios from "axios";

function ProgressMini({ value }) {
    const v = Math.max(0, Math.min(100, Math.round(value)));
    return (
        <div className="d-flex align-items-center" style={{ minWidth: 110 }}>
            <div
                className="flex-grow-1 position-relative"
                style={{
                    height: 16,
                    background: "#eaf0f6",
                    borderRadius: 999,
                    border: "1px solid #d2dbea",
                    boxShadow: "inset 0 1px 1px rgba(0,0,0,0.04)",
                }}
            >
                <div
                    style={{
                        width: `${v}%`,
                        height: "100%",
                        background: "var(--ndr-bg-topbar)",
                        borderRadius: 999,
                        transition: "width 300ms ease",
                    }}
                />
            </div>
            <div className="small text-muted" style={{ width: 35, textAlign: "right" }}>
                {v}%
            </div>
        </div>
    );
}

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5171";

export default function ProjektKonfiguracja() {
    const { project, setProject } = useOutletContext();

    const [allUsers, setAllUsers] = useState([]);
    const [manager, setManager] = useState("");
    const [assistants, setAssistants] = useState([]);
    const [questionnaires, setQuestionnaires] = useState([]);
    const [editId, setEditId] = useState(null);
    const [tempAssigned, setTempAssigned] = useState([]);

    // 🔹 Fetch all users
    useEffect(() => {
        axios
            .get(`${API_BASE}/Users`)
            .then((res) => setAllUsers(res.data))
    }, []);

    // 🔹 Extract questionnaires from phases recursively (with label)
    const extractQuestionnaires = (phases) => {
        const items = [];
        const walk = (node, currentLabel = "") => {
            const label = node.label || currentLabel;
            if (node.screens)
                node.screens.forEach((s) =>
                    items.push({ title: s.title, percent: s.percent || 0, label })
                );
            if (node.sections) node.sections.forEach((child) => walk(child, label));
        };
        phases.forEach((p) => walk(p));
        return items;
    };

    // 🔹 Initialize project and questionnaires
    useEffect(() => {
        if (!project) return;

        const kierownik = project.users?.kierownik || "";
        const asystenci = project.users?.asystenci || [];

        setManager(kierownik);
        setAssistants(asystenci);

        const qList = extractQuestionnaires(project.phases || []).map((q) => {
            let assigned = [];
            let automatic = false;

            if (q.title.includes("I.1 Test niezależności kluczowego biegłego rewidenta")) {
                automatic = true;
                assigned = kierownik ? [kierownik] : [];
            } else if (q.title.includes("I.5 Wyznaczenie zespołu badającego")) {
                automatic = true;
                assigned = kierownik ? [kierownik, ...asystenci] : [...asystenci];
            }

            return {
                id: q.title,
                title: q.title,
                percent: q.percent || 0,
                label: q.label,
                assigned,
                automatic,
            };
        });

        setQuestionnaires(qList);
    }, [project]);

    // 🔹 Update project users in backend
    const updateProjectUsers = async (newManager, newAssistants) => {
        if (!project?.id) return;

        const updated = {
            ...project,
            users: { kierownik: newManager, asystenci: newAssistants },
        };

        try {
            const res = await axios.put(`${API_BASE}/Projects/${project.id}`, updated);
            setProject(res.data);
            alert("Zapisano zmiany!");
        } catch (err) {
            console.error("Error updating project:", err);
        }
    };

    // 🔹 Candidates
    const managerCandidates = useMemo(
        () => allUsers.filter((u) => u.role === "Kierownik").map((u) => u.name),
        [allUsers]
    );
    const assistantCandidates = useMemo(
        () =>
            allUsers
                .filter(
                    (u) =>
                        u.role === "Asystent" &&
                        u.name !== manager &&
                        !assistants.includes(u.name)
                )
                .map((u) => u.name),
        [allUsers, manager, assistants]
    );

    // 🔹 Users allowed for assignment (assistants + kierownik)
    const projectUsersForAssignment = useMemo(() => {
        const users = [];
        if (manager) users.push(manager);
        return [...users, ...assistants];
    }, [manager, assistants]);

    // 🔹 Editing questionnaire assignment
    const startEdit = (id, current) => {
        setEditId(id);
        setTempAssigned(current || []);
    };

    const toggleTempUser = (name) => {
        setTempAssigned((prev) =>
            prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
        );
    };

    const saveAssignment = (id) => {
        setQuestionnaires((prev) =>
            prev.map((q) => (q.id === id ? { ...q, assigned: tempAssigned } : q))
        );
        setEditId(null);
        setTempAssigned([]);
    };

    const projectBase = project ? `/projekty/${encodeURIComponent(project.name)}` : "";
    const getScreenUrl = (screenTitle) =>
        `${projectBase}/kwestionariusz/${encodeURIComponent(screenTitle)}`;

    if (!project) return <div className="p-4 text-muted">Ładowanie projektu...</div>;

    // 🔹 Group questionnaires by label
    const grouped = questionnaires.reduce((acc, q) => {
        const label = q.label || "Inne";
        if (!acc[label]) acc[label] = [];
        acc[label].push(q);
        return acc;
    }, {});

    return (
        <div className="p-4">
            <h5 className="mb-4 mt-1">
                Konfiguracja użytkowników projektu:{" "}
                <strong>{project.name}</strong>{" "}
                <span className="text-muted" style={{ fontWeight: 400}}>({project.klient})</span>
            </h5>

            <div className="row g-4">
                {/* Przypisane kwestionariusze */}
                <div className="col-12 col-lg-8">
                    <div className="card shadow-sm h-100">
                        <label
                            className="form-label mb-0 text-white fw-bold d-flex"
                            style={{
                                backgroundColor: "#0a2b4c",
                                padding: "0.6rem 1rem",
                                borderTopLeftRadius: "0.25rem",
                                borderBottomLeftRadius: "0.25rem",
                            }}
                        >
                            Przypisane kwestionariusze
                        </label>
                        <div className="card-body p-0">
                            <table className="table table-sm table-hover mb-0 align-middle">
                                <thead>
                                <tr>
                                    <th style={headerStyle}>Nazwa</th>
                                    <th style={headerStyle}>Użytkownicy</th>
                                    <th style={headerStyle}>Akcja</th>
                                    <th style={headerStyle}>Postęp</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Object.entries(grouped).map(([label, items]) => (
                                    <React.Fragment key={label}>
                                        <tr>
                                            <td colSpan="4" style={{
                                                backgroundColor: "#005679",
                                                color: "white",
                                                fontWeight: "bold",
                                                padding: "0.6rem 1rem",
                                                fontSize: "0.9rem",
                                            }}>
                                                {label}
                                            </td>
                                        </tr>

                                        {items.map((q) => (
                                            <tr key={q.id}>
                                                <td style={tdDescription}>
                                                    <Link
                                                        to={getScreenUrl(q.title)}
                                                        style={{
                                                            textDecoration: "underline",
                                                            color: "#0a2b4c",
                                                        }}
                                                    >
                                                        {q.title}
                                                    </Link>
                                                </td>
                                                <td style={{ ...tdDescription, width: "30%" }}>
                                                    {editId === q.id ? (
                                                        <div className="d-flex flex-wrap gap-2">
                                                            {projectUsersForAssignment.length ? (
                                                                projectUsersForAssignment.map((name) => (
                                                                    <label
                                                                        key={name}
                                                                        className="form-check-label small"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-check-input me-1"
                                                                            checked={tempAssigned.includes(name)}
                                                                            onChange={() => toggleTempUser(name)}
                                                                        />
                                                                        {name}
                                                                    </label>
                                                                ))
                                                            ) : (
                                                                <span className="text-muted small">
                                                                        Brak użytkowników w projekcie
                                                                    </span>
                                                            )}
                                                        </div>
                                                    ) : q.assigned.length ? (
                                                        q.assigned.join(", ")
                                                    ) : (
                                                        ""
                                                    )}
                                                </td>
                                                <td style={tdCenter}>
                                                    {editId === q.id ? (
                                                        <div className="d-flex gap-2 justify-content-center">
                                                            <button
                                                                className="btn btn-sm btn-primary"
                                                                onClick={() => saveAssignment(q.id)}
                                                            >
                                                                Zapisz
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-secondary"
                                                                onClick={() => setEditId(null)}
                                                            >
                                                                Anuluj
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="d-flex justify-content-center">
                                                            <button
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() =>
                                                                    startEdit(q.id, q.assigned)
                                                                }
                                                                disabled={!projectUsersForAssignment.length}
                                                            >
                                                                {q.assigned.length
                                                                    ? "Edytuj"
                                                                    : "Przypisz"}
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={tdDescription}>
                                                    <ProgressMini value={q.percent || 0} />
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Kierownik + Asystenci */}
                <div className="col-12 col-lg-4 d-flex flex-column gap-3">
                    {/* Kierownik */}
                    <div className="d-flex align-items-stretch">
                        <label
                            className="form-label mb-0 text-white fw-bold d-flex align-items-center justify-content-center"
                            style={{
                                backgroundColor: "#0a2b4c",
                                padding: "0.5rem 1rem",
                                borderTopLeftRadius: "0.25rem",
                                borderBottomLeftRadius: "0.25rem",
                                minWidth: "110px",
                                textAlign: "center",
                            }}
                        >
                            Kierownik
                        </label>
                        <select
                            className="form-select"
                            value={manager}
                            onChange={(e) => setManager(e.target.value)}
                            style={{
                                borderRadius: 0,
                                padding: "0.5rem 1rem",
                                width: "340px",
                            }}
                        >
                            <option value="">Wybierz kierownika</option>
                            {managerCandidates.map((name) => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                        <button
                            className="btn btn-success"
                            style={{
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                                borderTopRightRadius: "0.25rem",
                                borderBottomRightRadius: "0.25rem",
                                padding: "0.5rem 1rem",
                            }}
                            disabled={!manager}
                            onClick={() => updateProjectUsers(manager, assistants)}
                        >
                            Zapisz
                        </button>
                    </div>

                    {/* Asystenci */}
                    <div className="card shadow-sm">
                        <label
                            className="form-label mb-0 text-white fw-bold d-flex"
                            style={{
                                backgroundColor: "#0a2b4c",
                                padding: "0.6rem 1rem",
                                borderTopLeftRadius: "0.25rem",
                                borderBottomLeftRadius: "0.25rem",
                            }}
                        >
                            Asystenci
                        </label>
                        <div className="card-body d-flex flex-column gap-2">
                            {assistants.length ? (
                                <ul className="list-group list-group-flush mt-0">
                                    {assistants.map((a) => (
                                        <li
                                            key={a}
                                            className="list-group-item d-flex justify-content-between align-items-center p-1 mt-0"
                                        >
                                            <span style={{ fontSize: "0.9rem" }}>{a}</span>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() =>
                                                    setAssistants((prev) =>
                                                        prev.filter((x) => x !== a)
                                                    )
                                                }
                                            >
                                                Usuń
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted small mb-0">
                                    Brak asystentów
                                </p>
                            )}
                            <div className="d-flex gap-2">
                                <select
                                    className="form-select form-select-sm"
                                    value={""}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val)
                                            setAssistants((prev) => [...prev, val]);
                                    }}
                                    style={{ flex: 1.5 }}
                                >
                                    <option value="">— wybierz —</option>
                                    {assistantCandidates.map((name) => (
                                        <option key={name} value={name}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={() =>
                                        updateProjectUsers(manager, assistants)
                                    }
                                >
                                    Zatwierdź
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const tdDescription = {
    border: "1px solid #dee2e6",
    fontSize: "0.85rem",
    paddingLeft: "0.8rem",
    paddingRight: "0.8rem",
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    maxWidth: "45rem",
};
const tdCenter = { border: "1px solid #dee2e6", padding: "0.8rem" };
const headerStyle = {
    border: "1px solid #dee2e6",
    backgroundColor: "#0a2b4c",
    color: "#ffffff",
    padding: "0.7rem",
    fontSize: "0.9rem",
};
