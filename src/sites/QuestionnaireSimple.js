import React, { useState, useRef, useEffect } from "react";
import { Sidebar, Topbar, InitialsAvatar } from "../ui/Common_project.js";
import { timeAgo, ProgressMeter } from "./Functions";
import FilesTable from "./Files";
import RequestsTable from "./Request";
import ActivityLog from "./Activitylog";
import TabNavigation from "./TabNavigation";
import Application from "./Application";

function KwestionariuszFull() {
    const [activeTab, setActiveTab] = useState("Kwestionariusz");
    const [showAccount, setShowAccount] = useState(false);
    const [files, setFiles] = useState([]);
    const [answers, setAnswers] = useState({});
    const [logs] = useState([
        { date: "2025-09-24 14:32", user: "Kamil Miłosz", action: "Dodał komentarz", details: "Komentarz do pytania 3" },
        { date: "2025-09-23 10:15", user: "Janina Kowalska", action: "Zatwierdził odpowiedź", details: "Pytanie 1" },
        { date: "2025-09-22 09:00", user: "Anna Nowak", action: "Dodał plik", details: "umowa-najmu.pdf" },
    ]);

    const [requests, setRequests] = useState(() => {
        const now = new Date();
        const earlier = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        return [
            {
                id: 1, type: "Wyciąg bankowy", desc: "Wyciągi za Q2 2025 (miesięczne zestawienia)", due: "2025-09-05",
                status: "Oczekiwanie", createdAt: earlier.toISOString(), lastReminderAt: null, receivedAt: null, urgent: false
            },
            {
                id: 2, type: "Umowa najmu", desc: "Aktualna umowa wraz z aneksami", due: "2025-09-10",
                status: "Otrzymano", createdAt: earlier.toISOString(), lastReminderAt: earlier.toISOString(),
                receivedAt: now.toISOString(), receivedFile: { name: "umowa-najmu.pdf", url: "#" }, urgent: true
            },
        ];
    });

    const accountBtnRef = useRef(null);
    const accountMenuRef = useRef(null);

    const tabs = ["Kwestionariusz", "Zapotrzebowanie", "Pliki", "Dziennik", "Wniosek"];

    // Kwestionariusz rows - w przyszłości z serwera
    const [rows, setRows] = useState([
            { id: 1, q: "Czy posiadasz (lub czerpiesz istotne i bezpośrednie korzyści finansowe)\n" +
                    "instrumenty finansowe, w tym udziały w kapitale własnym, papiery wartościowe\n" +
                    "w rozumieniu art. 3 pkt. 1 ustawy z dnia 29 lipca 2005 r. o obrocie instrumentami\n" +
                    "finansowymi, kredyty, pożyczki lub inne instrumenty dłużne, w tym prawa i obowiązki\n" +
                    "do nabycia tych instrumentów finansowych oraz instrumentów pochodnych\n" +
                    "bezpośrednio powiązanych z tymi instrumentami finansowymi, wyemitowane przez\n" +
                    "badaną jednostkę?\n" +
                    "Uwaga! Nie dotyczy takich, które posiadane są pośrednio poprzez udział\n" +
                    "w zdywersyfikowanych programach zbiorowego inwestowania, w szczególności\n" +
                    "funduszach emerytalnych, funduszach inwestycyjnych oraz ubezpieczeniowych\n" +
                    "funduszach kapitałowych oferowanych przez zakłady ubezpieczeń, o ile\n" +
                    "programy te nie są kontrolowane przez Ciebie lub osoby blisko z Tobą związane,\n" +
                    "lub w stosunku do tych programów nie są podejmowane decyzje inwestycyjne,\n" +
                    "na które wpływ masz Ty lub osoby blisko z Tobą związane.\n" +
                    "Nie dotyczy również kredytów lub pożyczek udzielonych na warunkach\n" +
                    "rynkowych w ramach zwykłej działalności przez badane jednostki, uprawnione\n" +
                    "do udzielania kredytów na podstawie odrębnych przepisów.", author: "K M", approver: "_", date: "2025-08-20", approvedAt: null  },
            { id: 2, q: "Czy osoby blisko z Tobą związane posiadają (lub czerpią istotne i bezpośrednie\n" +
                    "korzyści finansowe) instrumenty finansowe, w tym udziały w kapitale własnym,\n" +
                    "papiery wartościowe w rozumieniu art. 3 pkt. 1 ustawy z dnia 29 lipca 2005 r.\n" +
                    "o obrocie instrumentami finansowymi, kredyty, pożyczki lub inne instrumenty dłużne,\n" +
                    "w tym prawa i obowiązki do nabycia tych instrumentów finansowych oraz\n" +
                    "instrumentów pochodnych bezpośrednio powiązanych z tymi instrumentami\n" +
                    "finansowymi, wyemitowane przez badaną jednostkę?\n" +
                    "Uwaga! Nie dotyczy takich, które posiadane są pośrednio poprzez udział\n" +
                    "w zdywersyfikowanych programach zbiorowego inwestowania, w szczególności\n" +
                    "funduszach emerytalnych, funduszach inwestycyjnych oraz ubezpieczeniowych\n" +
                    "funduszach kapitałowych oferowanych przez zakłady ubezpieczeń, o ile\n" +
                    "programy te nie są kontrolowane przez Ciebie lub osoby blisko z Tobą związane,\n" +
                    "lub w stosunku do tych programów nie są podejmowane decyzje inwestycyjne,\n" +
                    "na które wpływ masz Ty lub osoby blisko z Tobą związane.\n" +
                    "Nie dotyczy również kredytów lub pożyczek udzielonych na warunkach\n" +
                    "rynkowych w ramach zwykłej działalności przez badane jednostki, uprawnione\n" +
                    "do udzielania kredytów na podstawie odrębnych przepisów.?",  author: "_", approver: "_", date: null, approvedAt: null },
            { id: 3, q: "Czy posiadasz (lub czerpiesz istotne i bezpośrednie korzyści finansowe)\n" +
                    "instrumenty finansowe, w tym udziały w kapitale własnym, papiery wartościowe\n" +
                    "w rozumieniu art. 3 pkt. 1 ustawy z dnia 29 lipca 2005 r. o obrocie instrumentami\n" +
                    "finansowymi, kredyty, pożyczki lub inne instrumenty dłużne, w tym prawa i obowiązki\n" +
                    "do nabycia tych instrumentów finansowych oraz instrumentów pochodnych\n" +
                    "bezpośrednio powiązanych z tymi instrumentami finansowymi, wyemitowane przez\n" +
                    "jednostkę powiązaną z jednostką badaną?\n" +
                    "Uwaga! Nie dotyczy takich, które posiadane są pośrednio poprzez udział\n" +
                    "w zdywersyfikowanych programach zbiorowego inwestowania, w szczególności\n" +
                    "funduszach emerytalnych, funduszach inwestycyjnych oraz ubezpieczeniowych\n" +
                    "funduszach kapitałowych oferowanych przez zakłady ubezpieczeń, o ile\n" +
                    "programy te nie są kontrolowane przez Ciebie lub osoby blisko z Tobą związane,\n" +
                    "lub w stosunku do tych programów nie są podejmowane decyzje inwestycyjne,\n" +
                    "na które wpływ masz Ty lub osoby blisko z Tobą związane.\n" +
                    "Nie dotyczy również kredytów lub pożyczek udzielonych na warunkach\n" +
                    "rynkowych w ramach zwykłej działalności przez badane jednostki, uprawnione\n" +
                    "do udzielania kredytów na podstawie odrębnych przepisów.?",  author: "_", approver: "_", date: null, approvedAt: null },
            { id: 4, q: "Czy osoby blisko z Tobą związane posiadają (lub czerpią istotne i bezpośrednie\n" +
                    "korzyści finansowe) instrumenty finansowe, w tym udziały w kapitale własnym,\n" +
                    "papiery wartościowe w rozumieniu art. 3 pkt. 1 ustawy z dnia 29 lipca 2005 r.\n" +
                    "o obrocie instrumentami finansowymi, kredyty, pożyczki lub inne instrumenty dłużne,\n" +
                    "w tym prawa i obowiązki do nabycia tych instrumentów finansowych oraz\n" +
                    "instrumentów pochodnych bezpośrednio powiązanych z tymi instrumentami\n" +
                    "finansowymi, wyemitowane przez jednostkę powiązaną z badaną jednostką?\n" +
                    "Uwaga! Nie dotyczy takich, które posiadane są pośrednio poprzez udział\n" +
                    "w zdywersyfikowanych programach zbiorowego inwestowania, w szczególności\n" +
                    "funduszach emerytalnych, funduszach inwestycyjnych oraz ubezpieczeniowych\n" +
                    "funduszach kapitałowych oferowanych przez zakłady ubezpieczeń, o ile\n" +
                    "programy te nie są kontrolowane przez Ciebie lub osoby blisko z Tobą związane,\n" +
                    "lub w stosunku do tych programów nie są podejmowane decyzje inwestycyjne,\n" +
                    "na które wpływ masz Ty lub osoby blisko z Tobą związane.\n" +
                    "Nie dotyczy również kredytów lub pożyczek udzielonych na warunkach\n" +
                    "rynkowych w ramach zwykłej działalności przez badane jednostki, uprawnione\n" +
                    "do udzielania kredytów na podstawie odrębnych przepisów.",  author: "_", approver: "_", date: null, approvedAt: null},
            { id: 5, q: "Czy uczestniczysz/-yłeś w transakcjach, których przedmiotem są instrumenty\n" +
                    "finansowe określone w pkt. 1-4?\n",  author: "_", approver: "_", date: null, approvedAt: null },
        ], []
    );

    useEffect(() => {
        const handleClick = (e) => {
            if (!showAccount) return;
            if (
                accountMenuRef.current && !accountMenuRef.current.contains(e.target) &&
                accountBtnRef.current && !accountBtnRef.current.contains(e.target)
            ) setShowAccount(false);
        };
        const handleKey = (e) => e.key === "Escape" && setShowAccount(false);
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, [showAccount]);


    return (
        <div className="d-flex min-vh-100">
            <Sidebar />
            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: "hidden" }}>
                <Topbar
                    breadcrumb={[
                        { label: "Home", to: "/" },
                        { label: "Projekty", to: "/projekty" },
                        { label: "Projekt", to: "/projekt" },
                        { label: activeTab, active: true },
                    ]}
                    accountBtnRef={accountBtnRef}
                    accountMenuRef={accountMenuRef}
                    showAccount={showAccount}
                    setShowAccount={setShowAccount}
                />
                <div className="d-flex flex-grow-1" style={{ overflow: "hidden" }}>
                    <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
                        <ProjectHeader />
                        <SubHeader />
                        <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
                        <div className="px-3 flex-grow-1 overflow-auto">
                            {activeTab === "Kwestionariusz" && (
                                <QuestionnaireTab rows={rows} answers={answers} setAnswers={setAnswers} setRows={setRows} />
                            )}
                            {activeTab === "Zapotrzebowanie" && <RequestsTable requests={requests} setRequests={setRequests} />}
                            {activeTab === "Pliki" && <FilesTable files={files} setFiles={setFiles} />}
                            {activeTab === "Dziennik" && (
                                <div className="p-0 flex-grow-1" style={{ overflow: "auto" }}>
                                    <ActivityLog logs={logs} />
                                </div>
                            )}
                            {activeTab === "Wniosek" && <Application />}

                        </div>
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

// ------------------- Components -------------------

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
        <h5 className="fw-semibold fs-5 mb-2 mt-2">I.1 Test niezależności kluczowego biegłego rewidenta</h5>
        <div style={{ width: "250px", minWidth: "150px" }}>
            <ProgressMeter percent={70} />
        </div>
    </div>
);

const QuestionnaireTab = ({ rows, answers, setAnswers, setRows }) => (
    <div className="p-0">
        <div className="table-responsive">
            <table className="table table-hover table-sm mb-0 align-middle" style={{ fontSize: "0.9rem" }}>
                <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 15 }}>
                <tr>
                    <th style={headerStyleCenter}>Lp.</th>
                    <th style={headerStyle}>Opis</th>
                    <th style={headerStyleCenter}>Odpowiedź</th>
                    <th style={headerStyleCenter}>Komentarz</th>
                    <th style={headerStyleCenter}>Sporządził</th>
                </tr>
                </thead>
                <tbody>
                {rows.map((r, idx) => (
                    <tr key={r.id}>
                        <td style={tdCenter}>{idx + 1}</td>
                        <td style={tdDescription}>{r.q}</td>
                        <AnswerCell row={r} answers={answers} setAnswers={setAnswers} />
                        <CommentCell row={r} answers={answers} setAnswers={setAnswers} />
                        <AuthorCell row={r} setRows={setRows} />
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        <div className="px-3 py-2 border-top bg-white" style={{ position: "sticky", bottom: 0, zIndex: 2, boxShadow: "0 -2px 6px rgba(0,0,0,0.06)" }}>
            <div className="d-flex justify-content-end mt-1">
                <button className="btn btn-sm btn-success">Zatwierdź wszystko</button>
            </div>
        </div>
    </div>
);

// ------------------- Cell Components -------------------

const AnswerCell = ({ row, answers, setAnswers }) => (
    <td style={{ alignItems: "center", border: "1px solid #dee2e6", fontSize: "0.85rem" }}>
        <div className="d-flex align-items-center">
            {["TAK", "NIE"].map((opt, i) => {
                const value = answers[row.id]?.choice ?? "NIE";
                return (
                    <div key={i} className="form-check form-check-inline mt-2">
                        <input
                            className="form-check-input"
                            type="radio"
                            name={`ans-${row.id}`}
                            id={`a${i}-${row.id}`}
                            checked={value === opt}
                            onChange={() => setAnswers(prev => ({ ...prev, [row.id]: { ...prev[row.id], choice: opt } }))}
                        />
                        <label className="form-check-label" htmlFor={`a${i}-${row.id}`}>{opt === "TAK" ? "Tak" : "Nie"}</label>
                    </div>
                );
            })}
        </div>
    </td>
);

const CommentCell = ({ row, answers, setAnswers }) => {
    const ans = answers[row.id] || {};
    return (
        <td style={{ border: "1px solid #dee2e6", minWidth: 150, padding: "0.5rem", textAlign: "center" }}>
            {ans.comment && !ans.editing ? (
                <div className="d-flex flex-column align-items-center" style={{ gap: "0.5rem" }}>
                    <span className="badge bg-light text-dark text-break" style={{ whiteSpace: 'pre-wrap', fontWeight: 400, fontSize: "0.85rem", padding: "0.4rem 0.6rem" }}>
                        {ans.comment}
                    </span>
                    <div className="d-flex gap-2 flex-wrap justify-content-center">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setAnswers(prev => ({ ...prev, [row.id]: { ...prev[row.id], editing: true } }))}>Edytuj</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => setAnswers(prev => ({ ...prev, [row.id]: { choice: prev[row.id]?.choice || "NIE", comment: "", editing: false } }))}>Usuń</button>
                    </div>
                </div>
            ) : ans.editing ? (
                <div className="d-flex flex-column align-items-center" style={{ gap: "0.5rem" }}>
                    <select className="form-select form-select-sm" value={ans.comment || ""} onChange={(e) => setAnswers(prev => ({ ...prev, [row.id]: { ...prev[row.id], comment: e.target.value } }))}>
                        <option value="">Wybierz komentarz...</option>
                        <option value="Komentarz 1">Komentarz 1</option>
                        <option value="Komentarz 2">Komentarz 2</option>
                        <option value="Komentarz 3">Komentarz 3</option>
                    </select>
                    <input type="text" className="form-control form-control-sm" placeholder="Lub wpisz własny komentarz" value={ans.comment || ""} onChange={(e) => setAnswers(prev => ({ ...prev, [row.id]: { ...prev[row.id], comment: e.target.value } }))} />
                    <div className="d-flex gap-2 justify-content-center">
                        <button className="btn btn-sm btn-success" onClick={() => setAnswers(prev => ({ ...prev, [row.id]: { ...prev[row.id], editing: false } }))}>Zapisz</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => setAnswers(prev => ({ ...prev, [row.id]: { choice: prev[row.id]?.choice || "NIE", comment: "", editing: false } }))}>Anuluj</button>
                    </div>
                </div>
            ) : (
                <button className="btn btn-sm btn-outline-primary" style={{ display: "block", margin: "0 auto" }} onClick={() => setAnswers(prev => ({ ...prev, [row.id]: { choice: prev[row.id]?.choice || "NIE", editing: true } }))}>Dodaj komentarz</button>
            )}
        </td>
    );
};

const AuthorCell = ({ row, setRows }) => (
    <td style={{ textAlign: "center", border: "1px solid #dee2e6", fontSize: "0.80rem" }}>
        <div className="d-flex align-items-center justify-content-center" style={{ gap: "0.5rem" }}>
            {row.author !== "_" ? (
                <>
                    <InitialsAvatar name={row.author} size={23} />
                    <span className="text-muted small">{row.date ? timeAgo(new Date(row.date)) : ""}</span>
                </>
            ) : (
                <button className="btn btn-sm btn-outline-primary" style={{ margin: "0 auto" }} onClick={() => setRows(prev => prev.map(rw => rw.id === row.id ? { ...rw, author: "K M", date: new Date().toISOString() } : rw))}>Zatwierdź</button>
            )}
        </div>
    </td>
);

// ------------------- Styles -------------------
const headerStyle = { border: "1px solid #dee2e6", width: "65%", paddingLeft: "1rem", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem" };
const headerStyleCenter = { textAlign: "center", border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem" };
const tdCenter = { textAlign: "center", border: "1px solid #dee2e6" };
const tdDescription = { border: "1px solid #dee2e6", fontSize: "0.85rem", paddingLeft: "1rem", paddingTop:"0.5rem", paddingBottom:"0.5rem" };

export default KwestionariuszFull;