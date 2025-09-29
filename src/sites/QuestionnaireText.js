import React, { useState, useRef, useEffect } from "react";
import { Sidebar, Topbar, InitialsAvatar } from "../ui/Common_project.js";
import { timeAgo } from "./Functions";
import { ProgressMeter } from "./Functions";
import TabNavigation from "./TabNavigation";
import RequestsTable from "./Request";
import FilesTable from "./Files";
import ActivityLog from "./Activitylog";


const initialAuditQuestions = [
    { id: 1, label: "Wstępny poziom istotności:", placeholder: "Podaj poziom istotności", author: "_" , date: null},
    { id: 2, label: "Wstępny poziom istotności wykonawczej:", placeholder: "Podaj poziom wykonawczej istotności", author: "_" , date: null},
    { id: 3, label: "Wstępny poziom kwoty, poniżej której zniekształcenia mogą być uznane za oczywiście nieznaczące:", placeholder: "Podaj kwotę progu nieistotności", author: "_" , date: null },
    { id: 4, label: "Wstępny poziom istotności dla konkretnej grupy transakcji, sald kont lub ujawnień (jeśli dotyczy):", placeholder: "Podaj poziom istotności dla grupy", author: "_" , date: null },
    { id: 5, label: "Wstępny poziom istotności wykonawczej dla konkretnej grupy transakcji, sald kont lub ujawnień (jeśli dotyczy):", placeholder: "Podaj poziom wykonawczej istotności dla grupy", author: "_" , date: null },
];

function KwestionariuszFull() {
    const [activeTab, setActiveTab] = useState("Kwestionariusz");
    const [showAccount, setShowAccount] = useState(false);
    const [answers, setAnswers] = useState({});
    const [auditQuestions, setAuditQuestions] = useState(initialAuditQuestions);

    const accountBtnRef = useRef(null);
    const accountMenuRef = useRef(null);

    const tabs = ["Kwestionariusz", "Zapotrzebowanie", "Pliki", "Dziennik"];

    const [logs, setLogs] = useState([
        { date: "2025-09-24 14:32", user: "K M", action: "Dodał komentarz", details: "Komentarz do pytania 3" },
        { date: "2025-09-23 10:15", user: "J K", action: "Zatwierdził odpowiedź", details: "Pytanie 1" },
        { date: "2025-09-22 09:00", user: "A N", action: "Dodał plik", details: "umowa-najmu.pdf" },
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

    const [files, setFiles] = useState([]);

    const handleAnswerChange = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }));

    // Close account dropdown on click outside / ESC
    useEffect(() => {
        const handleClick = (e) => {
            if (!showAccount) return;
            if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)
                && accountBtnRef.current && !accountBtnRef.current.contains(e.target)) setShowAccount(false);
        };
        const handleKey = (e) => e.key === "Escape" && setShowAccount(false);
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, [showAccount]);

    const approveAuthor = (id) => {
        setAuditQuestions(prev =>
            prev.map(q =>
                q.id === id
                    ? { ...q, author: "K M", date: new Date().toISOString() }
                    : q
            )
        );
    };

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
                        {/* Project Header */}
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

                        {/* Subheader + Progress */}
                        <div className="mb-2 mt-2 px-3 d-flex align-items-center justify-content-between">
                            <h5 className="fw-semibold fs-5 mb-2 mt-2">II.1.4 Kontynuacja działalności (wstępne rozpoznanie)</h5>
                            <div style={{ width: "250px", minWidth: "150px" }}>
                                <ProgressMeter percent={70} />
                            </div>
                        </div>

                        {/* Tabs */}
                        <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

                        {/* Tab content */}
                        <div className="px-3 flex-grow-1 overflow-auto">
                            {activeTab === "Kwestionariusz" && (
                                <div className="card shadow-sm p-4">
                                    {auditQuestions.map(q => (
                                        <div
                                            key={q.id}
                                            className="d-flex flex-column flex-md-row align-items-start mb-3 p-3 rounded border bg-white shadow-sm"
                                            style={{ gap: "1rem" }}
                                        >
                                            {/* Label */}
                                            <label
                                                htmlFor={`q-${q.id}`}
                                                className="fw-semibold"
                                                style={{
                                                    flex: "40%",
                                                    minWidth: 180,
                                                    fontSize: "0.95rem",
                                                    color: "#0a2b4c",
                                                    padding: "0.35rem",
                                                }}
                                            >
                                                {q.label}
                                            </label>

                                            {/* Textarea */}
                                            <div style={{ flex: "60%", minWidth: 200 }}>
                                                <textarea
                                                    id={`q-${q.id}`}
                                                    className="form-control shadow-sm"
                                                    placeholder={q.placeholder}
                                                    value={answers[q.id] || ""}
                                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                    style={{
                                                        width: "100%",
                                                        minHeight: "90px",
                                                        resize: "vertical",
                                                        borderRadius: "0.5rem",
                                                        border: "1px solid #dee2e6",
                                                        padding: "0.75rem",
                                                        backgroundColor: "#f9fafb",
                                                        fontSize: "0.95rem",
                                                    }}
                                                />
                                            </div>

                                            {/* Autor */}
                                            <div className="d-flex align-items-center justify-content-center" style={{ flex: "15%",gap: "0.5rem", paddingTop:"0.75rem" }}>
                                                {q.author !== "_" ? (
                                                    <>
                                                        <InitialsAvatar name={q.author} size={23} />
                                                        <span className="text-muted small">{q.date ? timeAgo(new Date(q.date)) : ""}</span>
                                                    </>
                                                ) : (
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        style={{ margin: "0 auto" }}
                                                        onClick={() => approveAuthor(q.id)}
                                                    >
                                                        Zatwierdź
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    <div className="text-end mt-2">
                                        <button className="btn btn-primary">Zapisz wniosek</button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "Zapotrzebowanie" && <RequestsTable requests={requests} setRequests={setRequests} />}
                            {activeTab === "Pliki" && <FilesTable files={files} setFiles={setFiles} />}
                            {activeTab === "Dziennik" && (
                                <div className="p-0 flex-grow-1" style={{ overflow: "auto" }}>
                                    <ActivityLog logs={logs} />
                                </div>
                            )}

                        </div>

                        {/* Prev/Next */}
                        <div className="d-flex justify-content-between p-2 border-top mt-2" style={{ backgroundColor: 'var(--ndr-bg-topbar)' }}>
                            <button className="btn btn-outline-light">«« Poprzedni kwestionariusz</button>
                            <button className="btn btn-outline-light">Następny kwestionariusz »»</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default KwestionariuszFull;
