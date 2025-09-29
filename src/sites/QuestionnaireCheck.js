import React, { useState } from "react";
import { Sidebar, Topbar, InitialsAvatar } from "../ui/Common_project.js";
import { BsChevronRight, BsChevronDown, BsPaperclip, BsX } from "react-icons/bs";
import { timeAgo, ProgressMeter } from "./Functions";
import TabNavigation from "./TabNavigation";
import RequestsTable from "./Request";
import FilesTable from "./Files";
import ActivityLog from "./Activitylog";

// Hierarchia dokumentów (Checklist)

const checklistData = [ { id: "1", label: "1. Dokumenty założycielskie", children: [ { id: "1a", label: "a) Akt założycielski" }, { id: "1b", label: "b) Inne, np.", children: [ { id: "1b-i", label: "i. Umowa/statut spółki kapitałowej" }, { id: "1b-ii", label: "ii. Umowa spółki osobowej" }, ], }, ], }, { id: "2", label: "2. Informacje ustawowe", children: [ { id: "2a", label: "a) Kopia ostatniego dostępnego rocznego zeznania podatkowego" }, { id: "2b", label: "b) Zarząd" }, { id: "2c", label: "c) Właściciele" }, { id: "2d", label: "d) Protokoły z posiedzeń organów jednostki" }, { id: "2e", label: "e) Książka kontroli (protokoły kontroli zewnętrznych)" }, ], }, { id: "3", label: "3. Kopie umów", children: [ { id: "3a", label: "a) Akty własności" }, { id: "3b", label: "b) Umowy z podmiotami powiązanymi" }, { id: "3c", label: "c) Pożyczki, kredyty hipoteczne i skrypty dłużne" }, { id: "3d", label: "d) Leasing (finansowy i operacyjny)" }, { id: "3e", label: "e) Ubezpieczenia" }, ], }, { id: "4", label: "4. Dane dotyczące organizacji", children: [ { id: "4a", label: "a) Dokumenty rejestracyjne (NIP, REGON, CEDiG, KRS etc.)" }, { id: "4b", label: "b) Główna działalność, lokalizacje - charakterystyka" }, { id: "4c", label: "c) Przepisy prawne i regulacyjne mające szczególne zastosowanie w przypadku danego klienta" }, { id: "4d", label: "d) Schemat organizacyjny, regulamin organizacyjny" }, { id: "4e", label: "e) Instrukcja obiegu dokumentów" }, { id: "4f", label: "f) Struktura grupy kapitałowej do której należy badana jednostka" }, ], }, { id: "5", label: "5. Systemy księgowe", children: [ { id: "5a", label: "a) Polityka rachunkowości (również aneksy, zmiany)" }, { id: "5b", label: "b) Opis stosowanych systemów księgowości (w tym zakładowego planu kont) wraz z ich oceną" }, { id: "5c", label: "c) Schematy księgowe, rodzaje dowodów księgowych" }, { id: "5d", label: "d) Procedury i mechanizmy kontroli wewnętrznej" }, { id: "5e", label: "e) Opis środowiska informatycznego" }, { id: "5f", label: "f) Przykładowe dokumenty" }, { id: "5g", label: "g) Uprawnienia/procedury jednostki dot. operacji kasowych i bankowych" }, ], }, { id: "6", label: "6. Inne ważne informacje", children: [ { id: "6a", label: "a) Oferta, umowa" }, { id: "6b", label: "b) Formularz oceny nowego klienta" }, { id: "6c", label: "c) Oświadczenie kierownictwa klienta" }, { id: "6d", label: "d) Uchwała o wyborze audytora" }, { id: "6e", label: "e) Zatwierdzenie sprawozdania finansowego za rok ubiegły oraz podział wyniku – odpowiednia uchwała" }, { id: "6f", label: "f) Opinia i raport biegłego rewidenta z lat ubiegłych" }, { id: "6g", label: "g) Informacje z dok. „Poznanie jednostki i jej otoczenia”" }, { id: "6h", label: "h) Kopia pisma z zapytaniami dot. kwestii zawodowych do poprzedniego audytora" }, { id: "6i", label: "i) Pismo do osób sprawujących nadzór wraz z odpowiedziami" }, { id: "6j", label: "j) Ważna korespondencja" }, { id: "6k", label: "k) Notatki ze spotkań" }, { id: "6l", label: "l) Dane dotyczące partnera/kluczowego biegłego rewidenta i zespołu badania oraz weryfikatora/osoby dokonującej przeglądu jakości zlecenia" }, { id: "6m", label: "m) Lista kontrolna dot. usług innych niż badanie sprawozdania finansowego świadczonych dla klienta (jednostki)" }, { id: "6n", label: "n) Pozostałe (np. list od prawników)" }, ], }, { id: "7", label: "7. Informacje ze sprawozdania i przeglądu analitycznego", children: [ { id: "7a", label: "a) Zestawienie obrotów i sald" }, { id: "7b", label: "b) Wstępna wersja sprawozdania finansowego" }, { id: "7c", label: "c) Wskaźniki" }, { id: "7d", label: "d) Informacje z przeglądu analitycznego" }, { id: "7e", label: "e) Informacje branżowe" }, ], }, ];


// Komponent rekursywny ChecklistRow

function ChecklistRow({ item, checked, setChecked, expanded, setExpanded, level = 0 }) {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expanded[item.id];

    // Toggle checkbox (dla liści)
    const toggleCheck = (value) => {
        setChecked((prev) => ({
            ...prev,
            [item.id]: {
                ...prev[item.id],
                checked: value,
                approver: value ? "Jan Kowalski" : null,
                approvedAt: value ? new Date().toISOString() : null,
            },
        }));
    };

    // Toggle rozwinięcie drzewa (dla elementów z dziećmi)
    const toggleExpand = () => {
        setExpanded((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
    };

    const file = checked[item.id]?.file;
    const approver = checked[item.id]?.approver;
    const approvedAt = checked[item.id]?.approvedAt;

    return (
        <>
            <tr style={{ border: "1px solid #dee2e6" }}>
                {/* Nazwa dokumentu */}
                <td style={{ paddingLeft: `${10 + level * 40}px`, border: "1px solid #dee2e6" }}>
                    <div className="d-flex align-items-center gap-2">
                        {/* Ikona rozwijania */}
                        {hasChildren && (
                            <span onClick={toggleExpand} style={{ cursor: "pointer" }}>
                                {isExpanded ? <BsChevronDown /> : <BsChevronRight />}
                            </span>
                        )}
                        <span
                            style={{
                                fontWeight: level === 0 ? 600 : 400,
                                fontSize: level === 0 ? "0.9rem" : "0.85rem",
                                padding: level === 0 ? "6px 4px" : "3px 0",
                                display: "inline-block",
                            }}
                        >
                            {item.label}
                        </span>
                    </div>
                </td>

                {/* Checkbox */}
                <td style={{ textAlign: "center", width: "10%", border: "1px solid #dee2e6" }}>
                    {!hasChildren && (
                        <input
                            type="checkbox"
                            checked={checked[item.id]?.checked || false}
                            onChange={(e) => toggleCheck(e.target.checked)}
                        />
                    )}
                </td>

                {/* Dodawanie pliku */}
                <td style={{ textAlign: "center", width: "20%", border: "1px solid #dee2e6" }}>
                    {!hasChildren && (
                        <div className="d-flex justify-content-center align-items-center">
                            {!file ? (
                                <label className="btn btn-sm btn-outline-secondary mb-0">
                                    <BsPaperclip className="me-1" /> Dodaj plik
                                    <input
                                        type="file"
                                        style={{ display: "none" }}
                                        onChange={(e) =>
                                            setChecked((prev) => ({
                                                ...prev,
                                                [item.id]: { ...prev[item.id], file: e.target.files[0] },
                                            }))
                                        }
                                    />
                                </label>
                            ) : (
                                <div className="d-flex align-items-center gap-2">
                                    <BsPaperclip />
                                    <span className="small">{file.name}</span>
                                    <button
                                        className="btn btn-sm btn-light border"
                                        onClick={() =>
                                            setChecked((prev) => ({ ...prev, [item.id]: { ...prev[item.id], file: null } }))
                                        }
                                    >
                                        <BsX />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </td>

                {/* Zatwierdził */}
                <td style={{ textAlign: "center", width: "25%" }}>
                    {approver ? (
                        <div className="d-flex align-items-center justify-content-center gap-2">
                            <InitialsAvatar name={approver} size={23} />
                            <span className="text-muted small">{timeAgo(new Date(approvedAt))}</span>
                        </div>
                    ) : (
                        !hasChildren && <span className="text-muted small">—</span>
                    )}
                </td>
            </tr>

            {/* Rekurencyjne dzieci */}
            {hasChildren && isExpanded &&
                item.children.map((child) => (
                    <ChecklistRow
                        key={child.id}
                        item={child}
                        checked={checked}
                        setChecked={setChecked}
                        expanded={expanded}
                        setExpanded={setExpanded}
                        level={level + 1}
                    />
                ))
            }
        </>
    );
}

// Główny komponent KwestionariuszFull

function KwestionariuszFull() {
    const [activeTab, setActiveTab] = useState("Kwestionariusz");
    const [checked, setChecked] = useState({});

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


    // Domyślnie wszystkie elementy rozwinięte
    const [expanded, setExpanded] = useState(() => {
        const map = {};
        const traverse = (items) => {
            items.forEach((item) => {
                map[item.id] = true;
                if (item.children) traverse(item.children);
            });
        };
        traverse(checklistData);
        return map;
    });

    const tabs = ["Kwestionariusz", "Zapotrzebowanie", "Pliki", "Dziennik"];

    // Obliczanie postępu (procent checked liści)

    const countLeafNodes = (items) =>
        items.reduce((acc, item) => acc + (item.children ? countLeafNodes(item.children) : 1), 0);

    const countCheckedLeafs = (items) =>
        items.reduce(
            (acc, item) => acc + (item.children ? countCheckedLeafs(item.children) : (checked[item.id]?.checked ? 1 : 0)),
            0
        );

    const totalLeafs = countLeafNodes(checklistData);
    const checkedLeafs = countCheckedLeafs(checklistData);
    const progressPercent = totalLeafs ? Math.round((checkedLeafs / totalLeafs) * 100) : 0;

    return (
        <div className="d-flex min-vh-100">
            <Sidebar />
            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: "hidden" }}>
                {/* Topbar */}
                <Topbar breadcrumb={[{ label: "Home", to: "/" }, { label: "Projekt", active: true }]} />

                {/* Nagłówek projektu */}
                <div className="px-3 py-2 mt-2 mb-1 border-bottom d-flex justify-content-between align-items-center flex-wrap">
                    <div className="d-flex align-items-baseline gap-2 flex-wrap">
                        <h4 className="fw-semibold mb-0">DR/2025/123456</h4>
                        <span className="fs-5 text-muted">Alphatech Sp. z o.o.</span>
                    </div>
                    <div className="text-muted gap-4" style={{ fontSize: "0.9rem" }}>
                        <div>Kierownik: Jan Kowalski</div>
                        <div>Okres: 01.01.2025 – 31.12.2025</div>
                    </div>
                </div>

                {/* Sekcja + Progress */}
                <div className="mb-2 mt-2 px-3 d-flex align-items-center justify-content-between">
                    <h5 className="fw-semibold fs-5 mb-2 mt-2">I.4 Rozpoznanie zagrożenia</h5>
                    <div style={{ width: "250px", minWidth: "150px" }}>
                        <ProgressMeter percent={progressPercent} />
                    </div>
                </div>

                {/* Tabs */}
                <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Treść zakładki */}
                <div className="px-3 flex-grow-1 overflow-auto">
                    {activeTab === "Kwestionariusz" && (
                        <div className="p-0">
                            <div className="table-responsive">
                                <table
                                    className="table table-hover table-sm mb-0 align-middle"
                                    style={{ fontSize: "0.85rem", borderCollapse: "collapse", width: "100%" }}
                                >
                                    <thead className="table-light" style={{ fontSize: "0.9rem" }}>
                                    <tr>
                                        <th style={{ width: "45%", border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem 1em" }}>Dokument</th>
                                        <th style={{ width: "10%", textAlign: "center", border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#fff" }}>Check</th>
                                        <th style={{ width: "20%", textAlign: "center", border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#fff" }}>Załącznik</th>
                                        <th style={{ width: "25%", textAlign: "center", border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#fff" }}>Zatwierdził</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {checklistData.map((item) => (
                                        <ChecklistRow
                                            key={item.id}
                                            item={item}
                                            checked={checked}
                                            setChecked={setChecked}
                                            expanded={expanded}
                                            setExpanded={setExpanded}
                                        />
                                    ))}
                                    </tbody>
                                </table>
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

                {/* Nawigacja dół */}
                <div className="d-flex justify-content-between p-2 border-top mt-2" style={{ backgroundColor: "var(--ndr-bg-topbar)" }}>
                    <button className="btn btn-outline-light">«« Poprzedni kwestionariusz</button>
                    <button className="btn btn-outline-light">Następny kwestionariusz »»</button>
                </div>
            </div>
        </div>
    );
}

export default KwestionariuszFull;
