import React, { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const allUsersList = [
    "Jan Kowalski",
    "Anna Kowalska",
    "Piotr Nowak",
    "Ewa Jabłońska",
    "Katarzyna Malinowska",
    "Robert Kamiński",
    "Janina Zielińska",
    "Tomasz Nowak",
];

export default function ProjektKonfiguracja() {
    const { projectName } = useParams();
    const decodedProjectName = decodeURIComponent(projectName);

    const [project, setProject] = useState(null);
    const [manager, setManager] = useState("");
    const [assistants, setAssistants] = useState([]);
    const [showAssistantPicker, setShowAssistantPicker] = useState(false);
    const [assistantChoice, setAssistantChoice] = useState("");
    const [questionnaires, setQuestionnaires] = useState([
        { id: 1, name: "Test niezależności kluczowego biegłego rewidenta", assigned: [] },
        { id: 2, name: "Test niezależności członka zespołu", assigned: [] },
        { id: 3, name: "Wyznaczenie zespołu badającego", assigned: [] },
    ]);

    // Fetch project info (optional)
    useEffect(() => {
        // Normally fetch project from API if needed
        setProject({ name: decodedProjectName, klient: "Klient ABC" });
    }, [decodedProjectName]);

    const availableAssistantCandidates = useMemo(
        () => allUsersList.filter((u) => u !== manager && !assistants.includes(u)),
        [manager, assistants]
    );

    const saveManager = () => {
        if (!manager) return alert("Wybierz kierownika!");
        setQuestionnaires((prev) =>
            prev.map((q) => {
                if (q.name === "Test niezależności kluczowego biegłego rewidenta") {
                    return { ...q, assigned: [manager] };
                }
                if (q.name === "Wyznaczenie zespołu badającego") {
                    return { ...q, assigned: [manager, ...assistants] };
                }
                return q;
            })
        );
        alert(`Zapisano kierownika: ${manager}`);
    };

    const saveAssistants = () => {
        setQuestionnaires((prev) =>
            prev.map((q) => {
                if (q.name === "Test niezależności członka zespołu") return { ...q, assigned: [...assistants] };
                if (q.name === "Wyznaczenie zespołu badającego") return { ...q, assigned: [manager, ...assistants] };
                return q;
            })
        );
        alert("Zapisano asystentów");
    };

    const addAssistant = () => setShowAssistantPicker(true);

    return (
        <div className="p-4">
            <h5 className="mb-4 mt-1">Konfiguracja użytkowników projektu: {decodedProjectName}</h5>

            {/* Kierownik */}
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
                    {allUsersList.map((u, i) => (
                        <option key={i} value={u}>
                            {u}
                        </option>
                    ))}
                </select>

                <button
                    className="btn btn-success fw-semibold"
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

            <div className="row g-4">
                <div className="col-12 col-lg-6 d-flex flex-column">
                    <div className="card shadow-sm h-100 d-flex flex-column" style={{maxWidth: 550}}>
                        {/* Nagłówek */}
                        <div className="card-header text-white" style={{ backgroundColor: "#0a2b4c", borderRadius: '0.25rem', padding: '0.75rem 1rem'}}>
                            <strong>Asystenci</strong>
                        </div>

                        {/* Tabela */}
                        <div className="card-body p-0 flex-grow-1">
                            <div className="table-responsive">
                                <table className="table table-sm table-hover mb-0 align-middle w-100" style={{ fontSize: "0.9rem" }}>
                                    <thead style={{position: "sticky", top: 0, zIndex: 1}}>
                                    <tr>
                                        <th style={{ padding: "0.5rem 1rem" }}>Osoba</th>
                                        <th style={{ width: 120, padding: "0.5rem 1rem" }}>Akcja</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {assistants.map((a, idx) => (
                                        <tr key={idx}>
                                            <td style={{ padding: "0.5rem 1rem" }}>{a}</td>
                                            <td style={{ padding: "0.5rem 1rem" }}>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => setAssistants(prev => prev.filter(x => x !== a))}>
                                                    Usuń
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {assistants.length === 0 && (
                                        <tr>
                                            <td colSpan={2} className="text-muted text-center small py-3">Brak asystentów</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Footer z przyciskiem Dodaj */}
                        <div className="card-footer d-flex justify-content-end gap-2">
                            <button className="btn btn-dark fw-semibold" onClick={addAssistant}>
                                + Dodaj asystenta
                            </button>
                            <button className="btn btn-success fw-semibold" onClick={saveAssistants} disabled={assistants.length===0}>
                                Zatwierdź asystentów
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-6">
                    <div className="card shadow-sm h-100 d-flex flex-column">
                        <div className="card-header text-white" style={{ backgroundColor: "#0a2b4c", borderRadius: '0.25rem', padding: '0.75rem 1rem' }}>
                            <strong> Przypisane kwestionariusze</strong>
                        </div>

                        <div className="card-body p-0">
                            <table className="table table-sm table-hover mb-0 align-middle w-100" style={{ fontSize: "0.9rem" }}>
                                <thead>
                                <tr>
                                    <th style={{ padding: "0.5rem 1rem", border: "1px solid #dee2e6",  }}>Nazwa</th>
                                    <th style={{ padding: "0.5rem 1rem", border: "1px solid #dee2e6",  }}>Przypisani użytkownicy</th>
                                </tr>
                                </thead>
                                <tbody>
                                {questionnaires.map(q => (
                                    <tr key={q.id}>
                                        <td style={{ padding: "0.2rem 0.8rem", border: "1px solid #dee2e6",  }}>
                                            <Link to="/kwestionariusz" className="btn btn-sm" style={{textDecoration: "underline", textAlign: "left"}}>
                                                {q.name}
                                            </Link>
                                        </td>
                                        <td style={{ padding: "0.5rem 1rem", border: "1px solid #dee2e6",  }}>{q.assigned.join(", ") || <span className="text-muted">Brak</span>}</td>
                                    </tr>
                                ))}
                                {questionnaires.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="text-center text-muted small py-3">Brak kwestionariuszy</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Picker modal */}
            {showAssistantPicker && (
                <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background: "rgba(0,0,0,0.35)", zIndex: 1050 }} onClick={() => setShowAssistantPicker(false)}>
                    <div className="card shadow" style={{ maxWidth: 520, margin: "12vh auto", padding: 0 }} onClick={(e) => e.stopPropagation()}>
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <strong>Dodaj asystenta</strong>
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowAssistantPicker(false)}>
                                Zamknij
                            </button>
                        </div>
                        <div className="card-body">
                            {availableAssistantCandidates.length === 0 ? (
                                <div className="text-muted small">Brak dostępnych osób do dodania.</div>
                            ) : (
                                <select className="form-select" value={assistantChoice} onChange={(e) => setAssistantChoice(e.target.value)}>
                                    <option value="">— wybierz —</option>
                                    {availableAssistantCandidates.map((u) => (
                                        <option key={u} value={u}>
                                            {u}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div className="card-footer d-flex justify-content-end gap-2">
                            <button className="btn btn-light" onClick={() => setShowAssistantPicker(false)}>
                                Anuluj
                            </button>
                            <button
                                className="btn btn-primary"
                                disabled={!assistantChoice || availableAssistantCandidates.length === 0}
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
    );
}
