import React, { useState} from "react";
import { Sidebar, Topbar, CloseX, InitialsAvatar } from "../../../ui/Common_project.js";
import { timeAgo, ProgressMeter } from "../../Functions";
import FilesTable from "../Tabs/Files";
import RequestsTable from "../Tabs/Request";
import ActivityLog from "../Tabs/Activitylog";
import TabNavigation from "../Tabs/TabNavigation";

function KwestionariuszFull() {
    // --- Dane początkowe ---
    const [rows, setRows] = useState([
        { id: 1, q: "Upewnij się, że w dokumentacji znajduje się aktualna umowa o badanie dostosowana do sytuacji i okoliczności po stronie klienta.\nZadbaj o to, aby wspomniana umowa obejmowała stosowne ramowe założenia sprawozdawczości finansowej, a także zobowiązania –\nzarówno biegłego rewidenta, jak i kierownictwa.\nRozważ ewentualną potrzebę modyfikacji obecnych warunków, a uzgodnione zmiany wprowadź na piśmie.", author: "K M", approver: "M M", date: "2025-08-20", approvedAt: "2025-04-20" },
        { id: 2, q: "Przejrzyj korespondencję firmy z klientem od daty zatwierdzenia\nostatniego sprawozdania finansowego, dokumentując wszelkie\nzagadnienia, które mogą mieć wpływ na tegoroczne badanie.\nUwaga! Uwzględnij odpowiedzi klienta na pismo do kierownictwa za\npoprzedni okres", author: "K K", approver: "M M", date: "2025-08-21", approvedAt: "2025-04-20" },
        { id: 3, q: "Uzyskaj i przejrzyj egzemplarz zeszłorocznego zestawienia spraw do\nrozważenia w kolejnym roku i w razie potrzeby umieść go\nw dokumentacji.", author: "K M", approver: "—", date: "2025-08-22", approvedAt: null },
        { id: 4, q: "Przeanalizuj wyniki wewnętrznego i zewnętrznego monitoringu\njakości czynności rewizji finansowej w firmie audytorskiej (monitoring\njest elementem systemu kontroli jakości w firmie audytorskiej), jakie\nzostały przeprowadzone w ostatnim czasie (np. wizyta monitorująca\ni/lub wyniki kontroli jakości dokonywanej przed podpisaniem\nopinii/po jej wydaniu) i udokumentuj wpływ poczynionych ustaleń na\nto zlecenie.", author: "—", approver: "—", date: null, approvedAt: null },
        { id: 5, q: "Przeprowadź z klientem spotkanie/dyskusję przez rozpoczęciem\nbadania. Datę, dane uczestników oraz szczegółowe informacje na\ntemat omawianych spraw włącz do dokumentacji.", author: "—", approver: "—", date: null, approvedAt: null },
    ]);

    // --- Stany ---
    const [activeTab, setActiveTab] = useState("Kwestionariusz");
    const [files, setFiles] = useState([]);
    const [answers, setAnswers] = useState({});
    const [logs] = useState([
        { date: "2025-09-24 14:32", user: "K M", action: "Dodał komentarz", details: "Komentarz do pytania 3" },
        { date: "2025-09-23 10:15", user: "J K", action: "Zatwierdził odpowiedź", details: "Pytanie 1" },
        { date: "2025-09-22 09:00", user: "A N", action: "Dodał plik", details: "umowa-najmu.pdf" },
    ]);

    const [requests, setRequests] = useState(() => {
        const now = new Date();
        const earlier = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        return [
            {id: 1, type: "Wyciąg bankowy", desc: "Wyciągi za Q2 2025 (miesięczne zestawienia)", due: "2025-09-05",
                status: "Oczekiwanie", createdAt: earlier.toISOString(), lastReminderAt: null, receivedAt: null, urgent: false},
            {id: 2, type: "Umowa najmu", desc: "Aktualna umowa wraz z aneksami", due: "2025-09-10",
                status: "Otrzymano", createdAt: earlier.toISOString(), lastReminderAt: earlier.toISOString(),
                receivedAt: now.toISOString(), receivedFile: { name: "umowa-najmu.pdf", url: "#" }, urgent: true},
        ];
    });

    const tabs = ["Kwestionariusz", "Zapotrzebowanie", "Pliki", "Dziennik"];

    return (
        <div className="d-flex min-vh-100">
            <Sidebar />
            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: "hidden" }}>
                <Topbar
                    breadcrumb={[{ label: "Home", to: "/" }, { label: "Projekty", to: "/projekty" }, { label: "Projekt", to: "/projekt" }, { label: activeTab, active: true }]}
                />

                {/* Content */}
                <div className="d-flex flex-grow-1" style={{ overflow: "hidden" }}>
                    <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
                        <ProjectHeader />
                        <SubHeader />
                        <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

                        {/* Tab content */}
                        <div className="px-3 flex-grow-1 overflow-auto">
                            {activeTab === "Kwestionariusz" && (
                                <div className="p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover table-sm mb-0 align-middle" style={{ fontSize: "0.85rem" }}>                                            <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 5 }}>
                                            <tr>
                                                <th style={{  textAlign: "center", border: "1px solid #dee2e6", width: "1%", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em" }}>Lp.</th>
                                                <th style={{ border: "1px solid #dee2e6", width: "35%", paddingLeft: "1rem",backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em" }}>Opis</th>
                                                <th style = {{width: "5%",border: "1px solid #dee2e6",textAlign: "center",backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em"}}>MSB</th>
                                                <th style = {{width: "7%",border: "1px solid #dee2e6",textAlign: "center",backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em"}}>Załączniki</th>
                                                <th style = {{width: "15%", border: "1px solid #dee2e6",textAlign: "center",backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em"}}>Odpowiedź</th>
                                                <th style = {{ width: "13%", border: "1px solid #dee2e6",textAlign: "center",backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em"}}>Komentarz</th>
                                                <th style = {{width: "10%",border: "1px solid #dee2e6",textAlign: "center",backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em"}}>Sporządził</th>
                                                <th style = {{width: "10%",border: "1px solid #dee2e6",textAlign: "center",backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em"}}>Zatwierdził</th>
                                            </tr>

                                            </thead>
                                            <tbody>
                                            {rows.map((r) => (
                                                <tr key={r.id}>
                                                    <td style = {{border: "1px solid #dee2e6", textAlign: "center"}}>{r.id}</td>
                                                    <td style={{border: "1px solid #dee2e6", fontSize: "0.85rem", padding:"0.6rem" }}>
                                                        <span id={`q-label-${r.id}`}>{r.q}</span>
                                                    </td>
                                                    <td style = {{border: "1px solid #dee2e6"}}></td>
                                                    <td style = {{border: "1px solid #dee2e6"}}></td>
                                                    <td style={{ border: "1px solid #dee2e6", fontSize: "0.85rem", padding:"0.7rem" }}>
                                                        <div
                                                            className="d-flex align-items-center"
                                                            role="radiogroup"
                                                            aria-labelledby={`q-label-${r.id}`}
                                                        >
                                                            {["TAK", "NIE", "ND"].map((opt, i) => (
                                                                <div key={opt} className="form-check form-check-inline mt-2">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name={`ans-${r.id}`}
                                                                        id={`a${i}-${r.id}`}
                                                                        checked={answers[r.id] === opt}
                                                                        onChange={() => {}}
                                                                        onClick={() =>
                                                                            setAnswers((prev) =>
                                                                                prev[r.id] === opt
                                                                                    ? { ...prev, [r.id]: undefined }
                                                                                    : { ...prev, [r.id]: opt }
                                                                            )
                                                                        }
                                                                    />
                                                                    <label className="form-check-label" htmlFor={`a${i}-${r.id}`}>
                                                                        {opt === "TAK" ? "Tak" : opt === "NIE" ? "Nie" : "N/D"}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                            <CloseX
                                                                size={20}
                                                                className="ms-0 mt-0"
                                                                title="Wyczyść odpowiedź"
                                                                ariaLabel={`Wyczyść odpowiedź dla pytania ${r.id}`}
                                                                onClick={() => setAnswers((prev) => ({ ...prev, [r.id]: undefined }))}
                                                            />
                                                        </div>
                                                    </td>
                                                        <td style={{
                                                            border: "1px solid #dee2e6",
                                                            minWidth: 150,
                                                            padding: "0.5rem",
                                                            textAlign: "center"
                                                        }}>
                                                            {answers[r.id]?.comment && !answers[r.id]?.editing ? (
                                                                <div className="d-flex flex-column align-items-center" style={{ gap: "0.5rem" }}>
                                                                    <span className="badge bg-light text-dark text-break"
                                                                          style={{ whiteSpace: 'pre-wrap', fontWeight: 400, fontSize: "0.85rem", padding: "0.4rem 0.6rem" }}>
                                                                        {answers[r.id].comment}
                                                                    </span>

                                                                    <div className="d-flex gap-2 flex-wrap justify-content-center">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-sm btn-outline-secondary"
                                                                            onClick={() =>
                                                                                setAnswers(prev => ({ ...prev, [r.id]: { ...prev[r.id], editing: true } }))}>
                                                                            Edytuj
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-sm btn-outline-danger"
                                                                            onClick={() =>
                                                                                setAnswers(prev => ({ ...prev, [r.id]: { choice: prev[r.id]?.choice || "NIE", comment: "", editing: false } }))}>
                                                                            Usuń
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : answers[r.id]?.editing ? (
                                                                <div className="d-flex flex-column align-items-center" style={{ gap: "0.5rem" }}>
                                                                    <select
                                                                        className="form-select form-select-sm"
                                                                        value={answers[r.id]?.comment || ""}
                                                                        onChange={(e) =>
                                                                            setAnswers(prev => ({ ...prev, [r.id]: { ...prev[r.id], comment: e.target.value } }))}>
                                                                        <option value="">Wybierz komentarz...</option>
                                                                        <option value="Komentarz 1">Komentarz 1</option>
                                                                        <option value="Komentarz 2">Komentarz 2</option>
                                                                        <option value="Komentarz 3">Komentarz 3</option>
                                                                    </select>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control form-control-sm"
                                                                        placeholder="Lub wpisz własny komentarz"
                                                                        value={answers[r.id]?.comment || ""}
                                                                        onChange={(e) =>
                                                                            setAnswers(prev => ({ ...prev, [r.id]: { ...prev[r.id], comment: e.target.value } }))}/>
                                                                    <div className="d-flex gap-2 justify-content-center">
                                                                        <button
                                                                            className="btn btn-sm btn-success"
                                                                            onClick={() =>
                                                                                setAnswers(prev => ({ ...prev, [r.id]: { ...prev[r.id], editing: false } }))}>
                                                                            Zapisz
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-sm btn-outline-danger"
                                                                            onClick={() =>
                                                                                setAnswers(prev => ({ ...prev, [r.id]: { choice: prev[r.id]?.choice || "NIE", comment: "", editing: false } }))}>
                                                                            Anuluj
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    style={{ display: "block", margin: "0 auto" }}
                                                                    onClick={() =>
                                                                        setAnswers(prev => ({ ...prev, [r.id]: { choice: prev[r.id]?.choice || "NIE", editing: true } }))}>
                                                                    Dodaj komentarz
                                                                </button>
                                                            )}
                                                    </td>

                                                    {/* Kolumna Sporządził */}
                                                    <td style={{ border: "1px solid #dee2e6", fontSize: "0.80rem" }}>
                                                        {r.author && r.author !== "—" ? (
                                                            <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
                                                                <InitialsAvatar name={r.author} size={23} />
                                                                <span className="text-muted small">{r.date ? timeAgo(new Date(r.date)) : "-"}</span>
                                                            </div>
                                                        ) : (
                                                            <div style={{ textAlign: "center" }}>
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() =>
                                                                        setRows(prev =>
                                                                            prev.map(row =>
                                                                                row.id === r.id
                                                                                    ? { ...row, author: "Jan Kowalski", date: new Date().toISOString() }
                                                                                    : row
                                                                            )
                                                                        )
                                                                    }
                                                                >
                                                                    Zatwierdź
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Kolumna Zatwierdził */}
                                                    <td style={{ border: "1px solid #dee2e6", fontSize: "0.80rem" }}>
                                                        {r.approver && r.approver !== "—" ? (
                                                            <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
                                                                <InitialsAvatar name={r.approver} size={23} />
                                                                <span className="text-muted small">{r.approvedAt ? timeAgo(new Date(r.approvedAt)) : "-"}</span>
                                                            </div>
                                                        ) : (
                                                            <div style={{ textAlign: "center" }}>
                                                                <button
                                                                    className="btn btn-sm btn-outline-success"
                                                                    onClick={() =>
                                                                        setRows(prev =>
                                                                            prev.map(row =>
                                                                                row.id === r.id
                                                                                    ? { ...row, approver: "Jan Kowalski", approvedAt: new Date().toISOString() }
                                                                                    : row))}> Zatwierdź
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div
                                        className="px-3 py-2 border-top bg-white"
                                        style={{ position: "sticky", bottom: 0, zIndex: 2, boxShadow: "0 -2px 6px rgba(0,0,0,0.06)" }}
                                    >
                                        <div className="d-flex justify-content-end mt-1">
                                            <button className="btn btn-sm btn-success">Zatwierdź wszystko</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "Zapotrzebowanie" && <RequestsTable requests={requests} setRequests={setRequests} />}
                            {activeTab === "Pliki" && <FilesTable files={files} setFiles={setFiles} />}
                            {activeTab === "Dziennik" && (
                                <div className="p-0 flex-grow-1" style={{ overflow: "auto" }}>
                                    <ActivityLog logs={logs} />
                                </div>)}
                        </div>

                        {/* Prev/Next */}
                        <div className="d-flex justify-content-between p-2 border-top mt-2" style={{ backgroundColor:'var(--ndr-bg-topbar)' }}>
                            <button className="btn btn-outline-light">«« Poprzedni kwestionariusz</button>
                            <button className="btn btn-outline-light">Następny kwestionariusz »»</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ProjectHeader = () => (
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
);

const SubHeader = () => (
    <div className="mb-2 mt-2 px-3 d-flex align-items-center justify-content-between">
        <h5 className="fw-semibold fs-5 mb-2 mt-2">II.1.4 Kontynuacja działalności (wstępne rozpoznanie)</h5>
        <div style={{ width: "250px", minWidth: "150px" }}>
            <ProgressMeter percent={70} />
        </div>
    </div>
);

export default KwestionariuszFull;
