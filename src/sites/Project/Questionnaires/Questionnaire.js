import React, { useState, useEffect } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import { InitialsAvatar } from "../../../ui/common_function";
import { timeAgo, ProgressMeter } from "../../Functions";
import TabNavigation from "../Tabs/TabNavigation";
import FilesTable from "../Tabs/Files";
import RequestsTable from "../Tabs/Request";
import ActivityLog from "../Tabs/Activitylog";

function KwestionariuszFull() {
    const { project } = useOutletContext();
    const location = useLocation();

    const screenTitle = decodeURIComponent(location.pathname.split("/kwestionariusz/")[1] || "");
    const [screenData, setScreenData] = useState(null);
    const [activeTab, setActiveTab] = useState("");
    const [answers, setAnswers] = useState({});

    // Find screen in project phases
    useEffect(() => {
        if (!project?.phases) return;

        for (const phase of project.phases) {
            const found = phase.screens?.find((s) => s.title === screenTitle);
            if (found) {
                setScreenData(found);
                return;
            }
            for (const section of phase.sections || []) {
                const foundSection = section.screens?.find((s) => s.title === screenTitle);
                if (foundSection) {
                    setScreenData(foundSection);
                    return;
                }
            }
        }
    }, [project, screenTitle]);

    // Set initial active tab
    useEffect(() => {
        if (screenData?.tabs?.length) {
            const firstTab = screenData.tabs[0].title || screenData.tabs[0]["title:"];
            setActiveTab(firstTab?.replace(":", ""));
        }
    }, [screenData]);

    if (!screenData) return <div>Loading...</div>;

    const tabs = screenData.tabs?.map((t) => (t.title || t["title:"])?.replace(":", "")) || [];

    // Helper: get text for description columns
    const getText = (row) =>
        row.q || row.pytanie || row.opis || row.MSB || row.nazwa || row.cele || row.stwierdzenie || row.obszary || row.test || row.question || "";

    // Unique key for rows per questionnaire
    const getRowKey = (row) => `${screenData.id}-${row.id || getText(row)}`;

    // Handle dynamic / checkbox / select changes
    const handleDynamicChange = (rowKey, key, value) => {
        setAnswers((prev) => ({
            ...prev,
            [rowKey]: {
                ...prev[rowKey],
                dynamic: { ...(prev[rowKey]?.dynamic || {}), [key]: value },
            },
        }));
    };

    const renderCell = (col, row) => {
        const rowKey = getRowKey(row);
        const tdCenter = { textAlign: "center", border: "1px solid #dee2e6",padding: "0.40rem", };
        const tdDescription = { border: "1px solid #dee2e6", fontSize: "0.85rem", paddingLeft: "1rem", paddingTop:"0.5rem", paddingBottom:"0.5rem", maxWidth: "45rem" };


        switch (col.type) {
            case "no":
                return <td key={col.label} style={tdCenter}>{row.id || row.lp || ""}</td>;
            case "description":
            case "text":
                return <td key={col.label} style={tdDescription}>{getText(row)}</td>;
            case "yes_no": {
                const value = answers[rowKey]?.choice ?? row.answer?.value ?? "NIE";
                return (
                    <td key={col.label} style={tdCenter}>
                        {["Tak", "Nie"].map((opt) => (
                            <div className="form-check form-check-inline" key={opt}>
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name={`ans-${rowKey}`}
                                    checked={value === opt}
                                    onChange={() =>
                                        setAnswers((prev) => ({
                                            ...prev,
                                            [rowKey]: { ...prev[rowKey], choice: opt },
                                        }))
                                    }
                                />
                                <label className="form-check-label">{opt}</label>
                            </div>
                        ))}
                    </td>
                );
            }
            case "enum": {
                const values = col.wartosci || [];
                const value = (answers[rowKey]?.choice ?? row.answer?.value ?? values[0]) || "";
                return (
                    <td key={col.label} style={tdCenter}>
                        <select
                            className="form-select form-select-sm"
                            value={value}
                            onChange={(e) =>
                                setAnswers((prev) => ({ ...prev, [rowKey]: { ...prev[rowKey], choice: e.target.value } }))
                            }
                        >
                            {values.map((v) => (
                                <option key={v} value={v}>
                                    {v}
                                </option>
                            ))}
                        </select>
                    </td>
                );
            }
            case "comment": {
                const value = answers[rowKey]?.comment ?? row.comment ?? "";
                return (
                    <td key={col.label} style={tdCenter}>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Komentarz"
                            value={value}
                            onChange={(e) =>
                                setAnswers((prev) => ({ ...prev, [rowKey]: { ...prev[rowKey], comment: e.target.value } }))
                            }
                        />
                    </td>
                );
            }
            case "author": {
                const author = answers[rowKey]?.author ?? row.author;
                const date = answers[rowKey]?.date ?? row.date;
                return (
                    <td key={col.label} style={tdCenter}>
                        {author ? (
                            <div className="d-flex align-items-center justify-content-center gap-2">
                                <InitialsAvatar name={author} size={23} />
                                <span className="text-muted small">{date ? timeAgo(new Date(date)) : ""}</span>
                            </div>
                        ) : (
                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() =>
                                    setAnswers((prev) => ({
                                        ...prev,
                                        [rowKey]: { ...prev[rowKey], author: "Jan Kowalski", date: new Date().toISOString() },
                                    }))
                                }
                            >
                                Zatwierdź
                            </button>
                        )}
                    </td>
                );
            }
            case "dynamic": {
                const cell = row[col.key] || {};
                if (cell.type === "checkbox") {
                    const value = answers[rowKey]?.dynamic?.[col.key] ?? cell.value;
                    return (
                        <td key={col.label} style={tdCenter}>
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => handleDynamicChange(rowKey, col.key, e.target.checked)}
                            />
                        </td>
                    );
                }
                if (cell.type === "select") {
                    const value = answers[rowKey]?.dynamic?.[col.key] ?? cell.value ?? "";
                    return (
                        <td key={col.label} style={tdCenter}>
                            <select
                                className="form-select form-select-sm"
                                value={value}
                                onChange={(e) => handleDynamicChange(rowKey, col.key, e.target.value)}
                            >
                                {(cell.options || []).map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </td>
                    );
                }
                return <td key={col.label}>{cell.value ?? ""}</td>;
            }
            case "file": {
                const file = answers[rowKey]?.file ?? row.file;
                return (
                    <td key={col.label} style={tdCenter}>
                        {!file ? (
                            <label className="btn btn-sm btn-outline-secondary mb-0">
                                Dodaj plik
                                <input
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={(e) =>
                                        setAnswers((prev) => ({ ...prev, [rowKey]: { ...prev[rowKey], file: e.target.files[0] } }))
                                    }
                                />
                            </label>
                        ) : (
                            <div className="d-flex align-items-center gap-2">
                                <span className="small">{file.name}</span>
                                <button
                                    className="btn btn-sm btn-light border"
                                    onClick={() => setAnswers((prev) => ({ ...prev, [rowKey]: { ...prev[rowKey], file: null } }))}
                                >
                                    Usuń
                                </button>
                            </div>
                        )}
                    </td>
                );
            }
            default:
                return <td key={col.label} style={tdCenter}></td>;
        }
    };

    const renderTable = (tab) => {
        let rows = [];

        // Support tab.rows, screenData.rows, or nested sections
        const rawRows = tab.rows || screenData.rows || [];

        rawRows.forEach((row) => {
            if (row.sections) {
                row.sections.forEach((section) => {
                    rows.push({ isSection: true, name: section.name });
                    section.questions?.forEach((q) => rows.push(q));
                });
            } else if (row.questions) {
                rows.push({ isSection: true, name: row.name });
                row.questions.forEach((q) => rows.push(q));
            } else {
                rows.push(row);
            }
        });

        if (!rows.length) return <div className="p-2">Brak danych do wyświetlenia</div>;

        return (
            <div className="table-responsive">
                <table className="table table-hover table-sm mb-0 align-middle" style={{ fontSize: "0.85rem" }}>
                    <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 5 }}>
                    <tr>
                        {tab.columns.map((col) => (
                            <th key={col.label} style={headerStyle}>
                                {col.label}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((row, i) =>
                        row.isSection ? (
                            <tr key={`section-${i}`}>
                                <td
                                    style={{
                                        backgroundColor: "#005679",
                                        color: "#fff",
                                        padding: "0.75rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                    }}
                                    colSpan={tab.columns.length}
                                >
                                    {row.name}
                                </td>
                            </tr>
                        ) : (
                            <tr key={i}>
                                {tab.columns.map((col) => renderCell(col, row))}
                            </tr>
                        )
                    )}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="d-flex min-vh-100">
            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: "hidden" }}>
                <ProjectHeader project={project} />
                <SubHeader title={screenData.title} percent={screenData.percent} />
                <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="px-1 flex-grow-1 overflow-auto">
                    {screenData.tabs.map((tab, i) => {
                        const tabTitle = (tab.title || tab["title:"])?.replace(":", "");
                        if (tabTitle !== activeTab) return null;

                        switch (tab.type) {
                            case "CUSTOM":
                                return <div key={i}>{renderTable(tab)}</div>;
                            case "REQUEST":
                                return <RequestsTable key={i} requests={[]} setRequests={() => {}} />;
                            case "FILES":
                                return <FilesTable key={i} files={[]} setFiles={() => {}} />;
                            case "ACTIVITY_LOG":
                                return <ActivityLog key={i} logs={[]} />;
                            default:
                                return <div key={i}>Tab "{tabTitle}" not implemented</div>;
                        }
                    })}
                </div>
            </div>
        </div>
    );
}

const ProjectHeader = ({ project }) => (
    <div className="border-bottom d-flex justify-content-between align-items-center flex-wrap">
        <h4 style={{ padding: "1rem" }}>
            <span style={{ fontWeight: 600 }}>{project.name}</span>
            <span style={{ fontWeight: 400, marginLeft: "1rem", color: "#555" }}>{project.klient}</span>
        </h4>
        <div className="text-muted" style={{ fontSize: "0.9rem" }}>
            <div>Kierownik: {project.users.kierownik}</div>
            <div>Okres: 01.01.2025 – 31.12.2025</div>
        </div>
    </div>
);

const SubHeader = ({ title, percent }) => (
    <div className="mb-1 mt-2 d-flex align-items-center justify-content-between">
        <h5 style={{ padding: "0.5rem 1rem 0.4rem 0.5rem" }}>{title}</h5>
        <div style={{ width: "240px", minWidth: "150px" }}>
            <ProgressMeter percent={percent} />
        </div>
    </div>
);

export default KwestionariuszFull;

const headerStyle = {border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem",};
