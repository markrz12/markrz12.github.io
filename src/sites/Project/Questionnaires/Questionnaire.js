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
        row.zagadnienie || row.wskaz || row.q || row.pytanie || row.opis || row.nazwa || row.cele || row.stwierdzenie || row.obszary || row.test || row.question || "";

    // Unique key for rows per questionnaire
    const getRowKey = (row) => `${screenData.id}-${row.id || getText(row)}`;
    const getCommentKey = (row, col) => `${screenData.id}-${row.id || getText(row)}-comment-${col.label}`;

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
                return <td key={col.label} style={tdCenter}>{row.id || row.lp || row.nr || ""}</td>;
            case "description":
            case "text":
                if (col.label === "MSB") {
                    return <td key={col.label} style={tdDescription}>{row.msb || ""}</td>;
                }
                if (col.label === "Powiązane obszary") {
                    return (
                        <td key={col.label} style={tdDescription}>
                            {Array.isArray(row.obszary) ? row.obszary.join(", ") : row.obszary || ""}
                        </td>
                    );
                }

                if (col.label === "Osiągnięte cele") {
                    return (
                        <td key={col.label} style={tdDescription}>
                            {Array.isArray(row.cele) ? row.cele.join(", ") : row.cele|| ""}
                        </td>
                    );
                }

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

            case "check": {
                const value = answers[rowKey]?.check ?? row.check ?? false;
                return (
                    <td key={col.label} style={tdCenter}>
                        <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) =>
                                setAnswers((prev) => ({
                                    ...prev,
                                    [rowKey]: { ...prev[rowKey], check: e.target.checked },
                                }))
                            }
                        />
                    </td>
                );
            }

            case "date": {
                const value = answers[rowKey]?.date ?? row.date ?? "";
                return (
                    <td key={col.label} style={tdCenter}>
                        <input
                            type="date"
                            className="form-control form-control-sm"
                            value={value}
                            onChange={(e) =>
                                setAnswers((prev) => ({
                                    ...prev,
                                    [rowKey]: { ...prev[rowKey], date: e.target.value },
                                }))
                            }
                        />
                    </td>
                );
            }

            case "comment": {
                const commentKey = getCommentKey(row, col);
                const value = answers[commentKey]?.comment ?? row.komentarz ?? "";

                return (
                    <td key={col.label} style={tdCenter}>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder={col.label}
                            value={value}
                            onChange={(e) =>
                                setAnswers(prev => ({
                                    ...prev,
                                    [commentKey]: { ...prev[commentKey], comment: e.target.value }
                                }))
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

            case "select": {
                // Get the currently selected value from answers or fallback to row value
                const value = answers[rowKey]?.[col.label] ?? row[col.label]?.value ?? "";

                // Get options from column definition
                const options = col.options || [];

                return (
                    <td key={col.label} style={tdCenter}>
                        <select
                            className="form-select form-select-sm"
                            value={value}
                            onChange={(e) =>
                                setAnswers((prev) => ({
                                    ...prev,
                                    [rowKey]: {
                                        ...prev[rowKey],
                                        [col.label]: e.target.value,
                                    },
                                }))
                            }
                        >
                            {options.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </td>
                );
            }

            case "dynamic": {
                const cell = row[col.key] || {};

                if (cell.type === "checkbox") {
                    const value = answers[rowKey]?.dynamic?.[col.key] ?? cell.value ?? false;
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
                    const options = Array.isArray(col.options) ? col.options : []; // use column options
                    const value = answers[rowKey]?.dynamic?.[col.key] ?? cell.value ?? (options[0] || "");

                    return (
                        <td key={col.label} style={tdCenter}>
                            <select
                                className="form-select form-select-sm"
                                value={value}
                                onChange={(e) => handleDynamicChange(rowKey, col.key, e.target.value)}
                            >
                                {options.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </td>
                    );
                }

                return <td key={col.label} style={tdCenter}>{cell.value ?? ""}</td>;
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

    function DynamicTable({ tab, answers, setAnswers }) {
        const rows = tab.rows || [];

        const flattenRows = (rows) => {
            let result = [];
            rows.forEach((row) => {
                if (row.sections) {
                    row.sections.forEach((section) => {
                        result.push({ isSection: true, name: section.name });
                        result.push(...flattenRows(section.questions || []));
                    });
                } else if (row.subquestions) {
                    result.push(row);
                    result.push(...flattenRows(row.subquestions));
                } else {
                    result.push(row);
                }
            });
            return result;
        };

        const addRow = () => {
            const newRow = { id: Date.now(), zagadnienie: "", komentarz: "", author: null, date: null };
            tab.rows = [...tab.rows, newRow];
            setAnswers((prev) => ({ ...prev })); // trigger re-render
        };

        const removeRow = (rowId) => {
            tab.rows = tab.rows.filter(r => r.id !== rowId);
            setAnswers((prev) => ({ ...prev })); // trigger re-render
        };

        const flattened = flattenRows(tab.rows);

        return (
            <div>
                <div className="table-responsive">
                    <table className="table table-hover table-sm mb-0 align-middle" style={{ fontSize: "0.85rem" }}>
                        <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 5 }}>
                        <tr>
                            {tab.columns.map((col) => (
                                <th key={col.label} style={headerStyle}>{col.label}</th>
                            ))}
                            <th style={headerStyle}>Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {flattened.map((row, i) =>
                            row.isSection ? (
                                <tr key={`section-${i}`}>
                                    <td colSpan={tab.columns.length + 1} style={{ backgroundColor: "#005679", color: "#fff", textAlign: "center", fontWeight: "bold", padding: "0.75rem" }}>
                                        {row.name}
                                    </td>
                                </tr>
                            ) : (
                                <tr key={row.id || i}>
                                    {tab.columns.map((col, colIndex) => {
                                        if (col.type === "no") {
                                            const lp = flattened.slice(0, i).filter(r => !r.isSection).length + 1;
                                            return <td key={col.label} style={{ textAlign: "center", border: "1px solid #dee2e6", padding: "0.4rem" }}>{lp}</td>;
                                        }
                                        return renderCell(col, row);
                                    })}
                                    <td style={{ textAlign: "center" }}>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeRow(row.id)}>Usuń</button>
                                    </td>
                                </tr>
                            )
                        )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-2">
                    <button className="btn btn-sm btn-outline-success" onClick={addRow}>+ Dodaj wiersz</button>
                </div>
            </div>
        );
    }



    const renderTable = (tab) => {
        // Recursive function to flatten rows, sections, and subquestions
        const flattenRows = (rows) => {
            let result = [];

            rows.forEach((row) => {
                if (row.sections) {
                    row.sections.forEach((section) => {
                        result.push({ isSection: true, name: section.name });
                        result.push(...flattenRows(section.questions || []));
                    });
                } else if (row.subquestions) {
                    result.push(row); // include parent question
                    result.push(...flattenRows(row.subquestions));
                } else {
                    result.push(row);
                }
            });

            return result;
        };

        const rawRows = tab.rows || screenData.rows || [];
        const rows = flattenRows(rawRows);

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
                            case "DYNAMIC":
                                return <DynamicTable key={i} tab={tab} answers={answers} setAnswers={setAnswers} />;
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
