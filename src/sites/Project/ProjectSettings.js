import { useState, useEffect, useMemo } from "react";
import { useOutletContext, Link } from "react-router-dom";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5171";

export default function ProjektKonfiguracja() {
    const { project, setProject } = useOutletContext();

    const [allUsers, setAllUsers] = useState([]);
    const [manager, setManager] = useState("");
    const [assistants, setAssistants] = useState([]);
    const [showAssistantPicker, setShowAssistantPicker] = useState(false);
    const [assistantChoice, setAssistantChoice] = useState("");
    const [questionnaires, setQuestionnaires] = useState([]);

    // Fetch all system users from db.json
    useEffect(() => {
        axios
            .get(`${API_BASE}/Users`)
            .then((res) => setAllUsers(res.data))
            .catch((err) => console.error("Błąd pobierania użytkowników:", err));
    }, []);

    // Load current users from database (project context)
    useEffect(() => {
        if (!project) return; // wait for project to load

        const { kierownik = "", asystenci = [] } = project.users || {};

        setManager(kierownik);
        setAssistants(asystenci);

        setQuestionnaires([
            {
                id: 1,
                name: "Test niezależności kluczowego biegłego rewidenta",
                assigned: kierownik ? [kierownik] : [],
            },
            {
                id: 2,
                name: "Test niezależności członka zespołu",
                assigned: [...asystenci],
            },
            {
                id: 3,
                name: "Wyznaczenie zespołu badającego",
                assigned: kierownik ? [kierownik, ...asystenci] : [...asystenci],
            },
        ]);
    }, [project]);



    // Manager candidates
    const managerCandidates = useMemo(
        () => allUsers.filter((u) => u.role === "Kierownik").map((u) => u.name),
        [allUsers]
    );

    // Assistant candidates (excluding current manager and assistants)
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

    // Update project users in database and context
    const updateProjectUsers = async (newManager, newAssistants) => {
        if (!project?.id) return;

        const updatedUsers = { kierownik: newManager, asystenci: newAssistants };

        try {
            const response = await axios.put(`${API_BASE}/Projects/${project.id}`, {
                ...project,
                users: updatedUsers,
            });

            // Update project context with fresh object
            setProject({ ...response.data });

            // Update local questionnaires immediately
            setQuestionnaires([
                {
                    id: 1,
                    name: "Test niezależności kluczowego biegłego rewidenta",
                    assigned: newManager ? [newManager] : [],
                },
                {
                    id: 2,
                    name: "Test niezależności członka zespołu",
                    assigned: [...newAssistants],
                },
                {
                    id: 3,
                    name: "Wyznaczenie zespołu badającego",
                    assigned: newManager ? [newManager, ...newAssistants] : [...newAssistants],
                },
            ]);

            // Optional: show friendly message
            alert("Zapisano zmiany! Aby zobaczyć aktualne dane, odśwież stronę.");
        } catch (err) {
            console.error("Error updating project:", err.response || err);
            alert("Aby zobaczyć aktualne dane, odśwież stronę.");
        }
    };



    const saveManager = async () => {
        if (!manager) return;
        await updateProjectUsers(manager, assistants);
    };

    const saveAssistants = async () => {
        await updateProjectUsers(manager, assistants);
    };

    if (!project) return <div className="p-4 text-muted">Ładowanie projektu...</div>;

    return (
        <div className="p-4">
            <h5 className="mb-4 mt-1">
                Konfiguracja użytkowników projektu: <strong>{project.name}</strong>{" "}
                <span className="text-muted">({project.klient})</span>
            </h5>

            {/* Manager selection */}
            <div className="mb-3 d-flex align-items-stretch" style={{ maxWidth: 550 }}>
                <label
                    className="form-label mb-0 text-white fw-bold d-flex align-items-center justify-content-center"
                    style={{
                        backgroundColor: "#0a2b4c",
                        padding: "0.75rem 1rem",
                        borderTopLeftRadius: "0.25rem",
                        borderBottomLeftRadius: "0.25rem",
                        minWidth: "130px",
                        textAlign: "center",
                        marginRight: "0px",
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
                        padding: "0.75rem 1rem",
                        width: "340px",
                        height: "100%",
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
                        padding: "0.75rem 1rem",
                        height: "100%",
                    }}
                    disabled={!manager}
                    onClick={saveManager}
                >
                    Zapisz
                </button>
            </div>

            {/* Assistants */}
            <div className="row g-4">
                <div className="col-12 col-lg-6 d-flex flex-column">
                    <div className="card shadow-sm" style={{ maxWidth: 550 }}>
                        <div className="card-header text-white" style={{ backgroundColor: "#0a2b4c", borderRadius: '0.25rem', padding: '0.75rem 1rem'}}>
                            <strong>Asystenci</strong>
                        </div>
                        <div className="card-body">
                            {assistants.length ? (
                                <ul className="list-group mb-3">
                                    {assistants.map((a) => (
                                        <li key={a} className="list-group-item d-flex justify-content-between">
                                            {a}
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => setAssistants((prev) => prev.filter((x) => x !== a))}
                                            >
                                                Usuń
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted small">Brak asystentów</p>
                            )}

                            <div className="d-flex justify-content-end gap-2">
                                <button className="btn btn-dark fw-semibold" onClick={() => setShowAssistantPicker(true)}>
                                    + Dodaj asystenta
                                </button>
                                <button
                                    className="btn btn-success fw-semibold"
                                    onClick={saveAssistants}
                                    disabled={assistants.length === 0}
                                >
                                    Zatwierdź asystentów
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Assigned Questionnaires */}
                <div className="col-12 col-lg-6 mt-4">
                    <div className="card shadow-sm h-100 d-flex flex-column">
                        <div className="card-header text-white" style={{ backgroundColor: "#0a2b4c", borderRadius: '0.25rem', padding: '0.75rem 1rem' }}>
                            <strong>Przypisane kwestionariusze</strong>
                        </div>
                        <div className="card-body p-0">
                            <table className="table table-sm table-hover mb-0 align-middle w-100" style={{ fontSize: "0.9rem" }}>
                                <thead>
                                <tr>
                                    <th style={{ padding: "0.5rem 1rem", border: "1px solid #dee2e6" }}>Nazwa</th>
                                    <th style={{ padding: "0.5rem 1rem", border: "1px solid #dee2e6" }}>Przypisani użytkownicy</th>
                                </tr>
                                </thead>
                                <tbody>
                                {questionnaires.map((q) => (
                                    <tr key={q.id}>
                                        <td style={{ padding: "0.2rem 0.8rem", border: "1px solid #dee2e6" }}>
                                            <Link to="/kwestionariusz" className="btn btn-sm" style={{ textDecoration: "underline", textAlign: "left" }}>
                                                {q.name}
                                            </Link>
                                        </td>
                                        <td style={{ padding: "0.5rem 1rem", border: "1px solid #dee2e6" }}>
                                            {q.assigned.join(", ") || <span className="text-muted">Brak</span>}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Assistant Picker Modal */}
                {showAssistantPicker && (
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100"
                        style={{ background: "rgba(0,0,0,0.35)", zIndex: 1050 }}
                        onClick={() => setShowAssistantPicker(false)}
                    >
                        <div
                            className="card shadow"
                            style={{ maxWidth: 520, margin: "12vh auto" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="card-header d-flex justify-content-between">
                                <strong>Dodaj asystenta</strong>
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => setShowAssistantPicker(false)}
                                >
                                    Zamknij
                                </button>
                            </div>
                            <div className="card-body">
                                {assistantCandidates.length === 0 ? (
                                    <div className="text-muted small">Brak dostępnych osób do dodania.</div>
                                ) : (
                                    <select
                                        className="form-select"
                                        value={assistantChoice}
                                        onChange={(e) => setAssistantChoice(e.target.value)}
                                    >
                                        <option value="">— wybierz —</option>
                                        {assistantCandidates.map((name) => (
                                            <option key={name} value={name}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <div className="card-footer d-flex justify-content-end gap-2">
                                <button className="btn btn-light" onClick={() => setShowAssistantPicker(false)}>Anuluj</button>
                                <button
                                    className="btn btn-primary"
                                    disabled={!assistantChoice}
                                    onClick={() => {
                                        setAssistants((prev) => [...prev, assistantChoice]);
                                        setAssistantChoice("");
                                        setShowAssistantPicker(false);
                                    }}
                                >
                                    Dodaj
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
