import React, { useState, useRef, useEffect, useMemo } from "react";
import { Sidebar, Topbar, InitialsAvatar } from "../ui/Common_project.js";

function timeAgo(input) {
    const now = new Date();
    const d = input instanceof Date ? input : new Date(input);
    const diffMs = now - d;
    const sec = Math.floor(diffMs / 1000);
    if (isNaN(sec)) return "";
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);
    const wk = Math.floor(day / 7);
    const mo = Math.floor(day / 30);
    const yr = Math.floor(day / 365);
    const plural = (n, s) => (n === 1 ? s[0] : n >= 2 && n <= 4 ? s[1] : s[2]);
    if (sec < 45) return "przed chwilą";
    if (min < 60) return `${min} ${plural(min, ["minutę", "minuty", "minut"])} temu`;
    if (hr < 24) return `${hr} ${plural(hr, ["godzinę", "godziny", "godzin"])} temu`;
    if (day < 7) return `${day} ${plural(day, ["dzień", "dni", "dni"])} temu`;
    if (wk < 5) return `${wk} ${plural(wk, ["tydzień", "tygodnie", "tygodni"])} temu`;
    if (mo < 12) return `${mo} ${plural(mo, ["miesiąc", "miesiące", "miesięcy"])} temu`;
    return `${yr} ${plural(yr, ["rok", "lata", "lat"])} temu`;
}



function ProgressMeter({ percent }) {
    const pct = Math.max(0, Math.min(100, Math.round(percent)));
    const trackStyle = {
        height: 24,
        background: "#f4f7fb",
        border: "1px solid #e2e8f3",
        borderRadius: 999,
        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)",
        width: "100%",
        maxWidth: 720,
        margin: "0 auto",
    };
    const fillStyle = {
        width: `${pct}%`,
        height: "100%",
        borderRadius: 999,
        background: "linear-gradient(90deg, #0a2b4c, #005679, #008491)",
        transition: "width 300ms ease",
        position: "relative",
    };
    const labelStyle = {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "0.8rem",
        color: "#fff",
        fontWeight: 600,
    };
    return (
        <div className="d-flex align-items-center justify-content-center">
            <div
                className="position-relative"
                style={trackStyle}
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
            >
                <div style={fillStyle} />
                <div style={labelStyle}>{pct}%</div>
            </div>
        </div>
    );
}



function KwestionariuszFull() {
    const [activeTab, setActiveTab] = useState("Kwestionariusz");
    const [showAccount, setShowAccount] = useState(false);


    const [answers, setAnswers] = useState({});


    const [reqForm, setReqForm] = useState({ type:'Wyciąg bankowy', desc:'', due:'' });
    const [showReqModal, setShowReqModal] = useState(false);
    const [requests, setRequests] = useState(()=>{
        const now = new Date();
        const earlier = new Date(now.getTime() - 24*60*60*1000);
        return [
            {
                id: 1,
                type: 'Wyciąg bankowy',
                desc: 'Wyciągi za Q2 2025 (miesięczne zestawienia)',
                due: '2025-09-05',
                status: 'Oczekiwanie',
                createdAt: earlier.toISOString(),
                lastReminderAt: null,
                receivedAt: null
            },
            {
                id: 2,
                type: 'Umowa najmu',
                desc: 'Aktualna umowa wraz z aneksami',
                due: '2025-09-10',
                status: 'Otrzymano',
                createdAt: earlier.toISOString(),
                lastReminderAt: earlier.toISOString(),
                receivedAt: now.toISOString(),
                receivedFile: { name: 'umowa-najmu.pdf', url: '#' }
            }
        ];
    });



    const accountBtnRef = useRef(null);
    const accountMenuRef = useRef(null);

    const tabs = ["Kwestionariusz", "Zapotrzebowanie", "Pliki", "Dziennik"];

    const rows = useMemo(
        () => [
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
                    "do udzielania kredytów na podstawie odrębnych przepisów.", author: "K M", approver: "M M", date: "2025-08-20" },
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
                    "do udzielania kredytów na podstawie odrębnych przepisów.?", author: "K K", approver: "M M", date: "2025-08-21" },
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
                    "do udzielania kredytów na podstawie odrębnych przepisów.?", author: "K M", approver: "—", date: "2025-08-22" },
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
                    "do udzielania kredytów na podstawie odrębnych przepisów.", author: "K M", approver: "—", date: "2025-08-23" },
            { id: 5, q: "Czy uczestniczysz/-yłeś w transakcjach, których przedmiotem są instrumenty\n" +
                    "finansowe określone w pkt. 1-4?\n", author: "K M", approver: "—", date: "2025-08-24" },
        ],
        []
    );

    // Close account dropdown
    useEffect(() => {
        const handleClick = (e) => {
            if (!showAccount) return;
            if (
                accountMenuRef.current &&
                !accountMenuRef.current.contains(e.target) &&
                accountBtnRef.current &&
                !accountBtnRef.current.contains(e.target)
            ) {
                setShowAccount(false);
            }
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

                {/* Content + Right panel */}
                <div className="d-flex flex-grow-1" style={{ overflow: "hidden" }}>
                    {/* Left side */}
                    <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>

                        {/* Project header */}
                        <div className=" px-3 py-2 mt-2 mb-1 border-bottom d-flex justify-content-between align-items-center flex-wrap">
                            {/* Left side: project number + company */}
                            <div className="d-flex align-items-baseline gap-2 flex-wrap">
                                <h4 className="fw-semibold mb-0">DR/2025/123456</h4>
                                <span className="fs-5 text-secondary">Alphatech Sp. z o.o.</span>
                            </div>

                            <div className="text-muted gap-4 " style={{ fontSize: "0.9rem" }}>
                                <div>Kierownik: Jan Kowalski</div>
                                <div>Okres: 01.01.2025 – 31.12.2025</div>
                            </div>
                        </div>

                        {/* Kwestionariusz Subheader */}

                        <div className="mb-2 mt-2 px-3 d-flex align-items-center justify-content-between">
                            <h5 className="fw-semibold fs-5 mb-2 mt-2">
                                I.1 Test niezależności kluczowego biegłego rewidenta
                            </h5>
                            <div style={{ width: "350px", minWidth: "150px" }}>
                                <ProgressMeter percent={70} />
                            </div>
                        </div>


                        {/* Tabs */}
                        <div className="mb-2 mt-2 px-3 d-flex align-items-center justify-content-between">
                            <div className="card-header">
                                <ul className="nav nav-tabs card-header-tabs mb-0">
                                    {tabs.map((tab) => (
                                        <li key={tab} className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === tab ? "active fw-semibold" : "fw-medium"}`}
                                                onClick={() => setActiveTab(tab)}
                                                style={{
                                                    cursor: "pointer",
                                                    padding: "0.5rem 1.25rem",
                                                    borderRadius: "50px",
                                                    border: "1px solid",
                                                    borderColor: activeTab === tab ? "#005679" : "#dee2e6",
                                                    backgroundColor: activeTab === tab ? "#005679" : "#f8f9fa",
                                                    color: activeTab === tab ? "#fff" : "#495057",
                                                    fontWeight: 500,
                                                    transition: "all 0.2s ease-in-out",
                                                    marginRight: "0.5rem",
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (activeTab !== tab) e.currentTarget.style.backgroundColor = "#e2e6ea";
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (activeTab !== tab) e.currentTarget.style.backgroundColor = activeTab === tab ? "#007bff" : "#f8f9fa";
                                                }}
                                            >
                                                {tab}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Tab content */}
                        <div className="px-3 flex-grow-1 overflow-auto">
                            {activeTab === "Kwestionariusz" && (
                                <div className="p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover table-sm mb-0 align-middle" style={{ fontSize: "0.85rem" }}>
                                            <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 15 }}>
                                            <tr>
                                                <th style={{  textAlign: "center", border: "1px solid #dee2e6", width: "1%" }}>Lp.</th>
                                                <th style={{  border: "1px solid #dee2e6", width: "65%", paddingLeft: "1rem" }}>Opis</th>
                                                <th style={{  textAlign: "center" , border: "1px solid #dee2e6", width: "10%" }}>Odpowiedź</th>
                                                <th style={{  textAlign: "center", border: "1px solid #dee2e6", width: "14%" }}>Dodatkowy komentarz</th>
                                                <th style={{  textAlign: "center", border: "1px solid #dee2e6", width: "10%" }}>Sporządził</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {rows.map((r, idx) => (
                                                <tr key={r.id}>
                                                    {/* LP */}
                                                    <td style = {{textAlign: "center"}}>{idx + 1}</td>

                                                    {/* Opis pytania */}
                                                    <td style={{   border: "1px solid #dee2e6", fontSize: "0.85rem", paddingLeft: "1rem" }}>
                                                        <span id={`q-label-${r.id}`}>{r.q}</span>
                                                        {r.points && (
                                                            <ol style={{ marginTop: "0.5rem", paddingLeft: "1rem", fontSize: "0.8rem" }}>
                                                                {r.points.map((p, i) => (
                                                                    <li key={i}>{p}</li>
                                                                ))}
                                                            </ol>
                                                        )}
                                                    </td>

                                                    {/* Tak/Nie */}
                                                    <td style={{ alignItems: "center", border: "1px solid #dee2e6", fontSize: "0.85rem" }}>
                                                        <div className="d-flex align-items-center" >
                                                            {["TAK", "NIE"].map((opt, i) => {
                                                                const value = answers[r.id]?.choice ?? "NIE";
                                                                return (
                                                                    <div key={opt} className="form-check form-check-inline mt-2">
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="radio"
                                                                            name={`ans-${r.id}`}
                                                                            id={`a${i}-${r.id}`}
                                                                            checked={value === opt}
                                                                            onChange={() =>
                                                                                setAnswers((prev) => ({ ...prev, [r.id]: { ...prev[r.id], choice: opt } }))
                                                                            }
                                                                        />
                                                                        <label className="form-check-label" htmlFor={`a${i}-${r.id}`}>
                                                                            {opt === "TAK" ? "Tak" : "Nie"}
                                                                        </label>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </td>


                                                    {/* Dodatkowy komentarz */}
                                                    <td style={{
                                                        border: "1px solid #dee2e6",
                                                        minWidth: 150,
                                                        padding: "0.5rem",
                                                        textAlign: "center"
                                                    }}>
                                                        {answers[r.id]?.comment && !answers[r.id]?.editing ? (
                                                            <div className="d-flex flex-column align-items-center" style={{ gap: "0.5rem" }}>
            <span
                className="badge bg-light text-dark text-break"
                style={{ whiteSpace: 'pre-wrap', fontWeight: 400, fontSize: "0.85rem", padding: "0.4rem 0.6rem" }}
            >
                {answers[r.id].comment}
            </span>

                                                                <div className="d-flex gap-2 flex-wrap justify-content-center">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-outline-secondary"
                                                                        onClick={() =>
                                                                            setAnswers(prev => ({ ...prev, [r.id]: { ...prev[r.id], editing: true } }))
                                                                        }
                                                                    >
                                                                        Edytuj
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() =>
                                                                            setAnswers(prev => ({ ...prev, [r.id]: { choice: prev[r.id]?.choice || "NIE", comment: "", editing: false } }))
                                                                        }
                                                                    >
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
                                                                        setAnswers(prev => ({ ...prev, [r.id]: { ...prev[r.id], comment: e.target.value } }))
                                                                    }
                                                                >
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
                                                                        setAnswers(prev => ({ ...prev, [r.id]: { ...prev[r.id], comment: e.target.value } }))
                                                                    }
                                                                />
                                                                <div className="d-flex gap-2 justify-content-center">
                                                                    <button
                                                                        className="btn btn-sm btn-success"
                                                                        onClick={() =>
                                                                            setAnswers(prev => ({ ...prev, [r.id]: { ...prev[r.id], editing: false } }))
                                                                        }
                                                                    >
                                                                        Zapisz
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() =>
                                                                            setAnswers(prev => ({ ...prev, [r.id]: { choice: prev[r.id]?.choice || "NIE", comment: "", editing: false } }))
                                                                        }
                                                                    >
                                                                        Anuluj
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                className="btn btn-sm btn-outline-primary"
                                                                style={{ display: "block", margin: "0 auto" }}
                                                                onClick={() =>
                                                                    setAnswers(prev => ({ ...prev, [r.id]: { choice: prev[r.id]?.choice || "NIE", editing: true } }))
                                                                }
                                                            >
                                                                Dodaj komentarz
                                                            </button>
                                                        )}
                                                    </td>



                                                    {/* Sporządził */}
                                                    <td style={{textAlign: "center",  border: "1px solid #dee2e6", fontSize: "0.80rem" }}>
                                                        <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
                                                            <InitialsAvatar name={r.author} size={23} />
                                                            <span className="text-muted small">{timeAgo(new Date(r.date))}</span>
                                                        </div>
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

                            {activeTab === "Zapotrzebowanie" && (
                                <div className="p-3">
                                    <h5>Zgłoszone zapotrzebowania</h5>

                                    {showReqModal && (
                                        <div
                                            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                                            style={{ background: "rgba(0,0,0,0.3)", zIndex: 3000 }}
                                            onClick={() => setShowReqModal(false)}
                                        >
                                            <div className="card p-3" style={{ width: 400 }} onClick={(e) => e.stopPropagation()}>
                                                <h6>Zgłoś zapotrzebowanie</h6>
                                                <select
                                                    className="form-select mb-2"
                                                    value={reqForm.type}
                                                    onChange={(e) => setReqForm({ ...reqForm, type: e.target.value })}
                                                >
                                                    <option>Wyciąg bankowy</option>
                                                    <option>Umowa najmu</option>
                                                    <option>Polityka rachunkowości</option>
                                                    <option>Inne</option>
                                                </select>
                                                <textarea
                                                    className="form-control mb-2"
                                                    placeholder="Opis"
                                                    value={reqForm.desc}
                                                    onChange={(e) => setReqForm({ ...reqForm, desc: e.target.value })}
                                                />
                                                <input
                                                    type="date"
                                                    className="form-control mb-2"
                                                    value={reqForm.due}
                                                    onChange={(e) => setReqForm({ ...reqForm, due: e.target.value })}
                                                />
                                                <div className="d-flex justify-content-end gap-2">
                                                    <button className="btn btn-light" onClick={() => setShowReqModal(false)}>
                                                        Anuluj
                                                    </button>
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => {
                                                            setRequests([...requests, { ...reqForm, id: requests.length + 1, status: "Oczekiwanie" }]);
                                                            setReqForm({ type: "Wyciąg bankowy", desc: "", due: "" });
                                                            setShowReqModal(false);
                                                        }}
                                                    >
                                                        Zgłoś
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <ul className="list-group">
                                        {requests.map((r) => (
                                            <li key={r.id} className="list-group-item d-flex justify-content-between">
                                                <div>
                                                    <strong>{r.type}</strong>
                                                    <div>{r.desc}</div>
                                                    <small>Termin: {r.due}</small>
                                                </div>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => setRequests(requests.filter((req) => req.id !== r.id))}>
                                                    Anuluj
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {activeTab === "Pliki" && (
                                <div className="p-3">
                                    <h5>Pliki powiązane</h5>
                                    <p>Lista plików PDF, CSV lub innych dokumentów.</p>
                                </div>
                            )}

                            {activeTab === "Dziennik" && (
                                <div className="p-3">
                                    <h5>Dziennik aktywności</h5>
                                    <p>Historia działań użytkowników i statusów.</p>
                                </div>
                            )}
                        </div>

                        {/* Prev/Next */}
                        <div className="d-flex justify-content-between p-3 border-top mt-auto">
                            <button className="btn btn-outline-secondary">«« Poprzedni kwestionariusz</button>
                            <button className="btn btn-outline-secondary">Następny kwestionariusz »»</button>
                        </div>
                    </div>



                </div>
            </div>
        </div>
    );
}

export default KwestionariuszFull;