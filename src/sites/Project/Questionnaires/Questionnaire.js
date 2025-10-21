import React, { useState, useEffect } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import { InitialsAvatar } from "../../../ui/common_function";
import { timeAgo, ProgressMeter } from "../../Functions";
import TabNavigation from "../Tabs/TabNavigation";
import FilesTable from "../Tabs/Files";
import RequestsTable from "../Tabs/Request";
import ActivityLog from "../Tabs/Activitylog";
import Application from "../Tabs/Application";

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
    const hashString = (str) => {
        let hash = 0;
        if (!str) return "0";
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return hash.toString(36);
    };

// Universal row key generator
    const getRowKey = (row, tab) => {
        const rowId = (row.id ?? row.lp ?? hashString(JSON.stringify(row))).toString();
        const tabId = (tab?.title || tab?.["title:"] || "unknown").replace(/\s+/g, "_");
        const screenId = screenData?.title ? hashString(screenData.title) : "screen"; // hash of screen title
        return `${screenId}-${tabId}-${rowId}`;
    };



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

    const getAllTabs = (screen) => {
        let tabs = screen.tabs || [];
        if (screen.sections) {
            for (const section of screen.sections) {
                if (section.screens) {
                    for (const s of section.screens) {
                        tabs = tabs.concat(getAllTabs(s));
                    }
                }
            }
        }
        return tabs;
    };

    const renderCell = (col, row, tab) => {
        const rowKey = getRowKey(row);
        const tdCenter = { textAlign: "center", border: "1px solid #dee2e6", padding: "0.40rem", };
        const tdDescription = { border: "1px solid #dee2e6", fontSize: "0.85rem", paddingLeft: "0.8rem", paddingRight: "0.8rem", paddingTop:"0.5rem", paddingBottom:"0.5rem", maxWidth: "45rem" };

        switch (col.type) {
            case "no":
                return <td key={col.label} style={tdCenter}>{row.id || row.lp || row.nr || ""}</td>;
            case "description":
            case "text":
                if (col.label === "MSB") {
                    return <td key={col.label} style={{...tdDescription, maxWidth: "140px"}}>{row.msb || ""}</td>;
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
                const value = answers[rowKey]?.choice ?? row.answer?.value ?? "";

                return (
                    <td key={col.label} style={{ border: "1px solid #dee2e6", padding: "0.8rem" }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                gap: "0.7rem",
                            }}
                        >
                            {values.map((v) => (
                                <div className="form-check" key={v}>
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name={`enum-${rowKey}-${col.label}`}
                                        checked={value === v}
                                        onChange={() =>
                                            setAnswers((prev) => ({
                                                ...prev,
                                                [rowKey]: { ...prev[rowKey], choice: v },
                                            }))
                                        }
                                    />
                                    <label className="form-check-label">{v}</label>
                                </div>
                            ))}
                        </div>
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
                const commentKey = getCommentKey(row, col); // unique per row/col
                const ans = answers[commentKey] || {};
                const predefinedComments = Array.isArray(col.predefinedComments) ? col.predefinedComments : [];

                const addCommentToDatabase = (newComment) => {
                    console.log("Saving comment to DB:", newComment);
                };

                return (
                    <td style={{ border: "1px solid #dee2e6", minWidth: 150, padding: "0.5rem", textAlign: "center" }}>
                        {ans.comment && !ans.editing ? (
                            <div className="d-flex flex-column align-items-center" style={{ gap: "0.5rem" }}>
                    <span
                        className="badge bg-light text-dark text-break"
                        style={{ whiteSpace: 'pre-wrap',wordBreak: "break-word",
                             fontWeight: 400, fontSize: "0.85rem", padding: "0.4rem 0.6rem" }}
                    >
                        {ans.comment}
                    </span>
                                <div className="d-flex gap-2 flex-wrap justify-content-center">
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() =>
                                            setAnswers(prev => ({
                                                ...prev,
                                                [commentKey]: { ...prev[commentKey], editing: true }
                                            }))
                                        }
                                    >
                                        Edytuj
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() =>
                                            setAnswers(prev => ({
                                                ...prev,
                                                [commentKey]: { choice: prev[commentKey]?.choice || "NIE", comment: "", editing: false }
                                            }))
                                        }
                                    >
                                        Usuń
                                    </button>
                                </div>
                            </div>
                        ) : ans.editing ? (
                            <div className="d-flex flex-column align-items-center" style={{ gap: "0.5rem" }}>
                                {predefinedComments.length > 0 && (
                                    <select
                                        className="form-select form-select-sm"
                                        value={ans.comment || ""}
                                        onChange={(e) =>
                                            setAnswers(prev => ({
                                                ...prev,
                                                [commentKey]: { ...prev[commentKey], comment: e.target.value }
                                            }))
                                        }
                                    >
                                        <option value="">Wybierz komentarz...</option>
                                        {predefinedComments.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                )}
                                <textarea
                                    className="form-control form-control-sm"
                                    placeholder="Wpisz komentarz"
                                    value={ans.comment || ""}
                                    onChange={(e) =>
                                        setAnswers(prev => ({
                                            ...prev,
                                            [commentKey]: { ...prev[commentKey], comment: e.target.value }
                                        }))
                                    }
                                />
                                {ans.comment && !predefinedComments.includes(ans.comment) && (
                                    <button
                                        className="btn btn-sm btn-outline-success"
                                        onClick={() => addCommentToDatabase(ans.comment)}
                                    >
                                        Dodaj do bazy
                                    </button>
                                )}
                                <div className="d-flex gap-2 justify-content-center">
                                    <button
                                        className="btn btn-sm btn-success"
                                        onClick={() =>
                                            setAnswers(prev => ({
                                                ...prev,
                                                [commentKey]: { ...prev[commentKey], editing: false }
                                            }))
                                        }
                                    >
                                        Zapisz
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() =>
                                            setAnswers(prev => ({
                                                ...prev,
                                                [commentKey]: { choice: prev[commentKey]?.choice || "NIE", comment: "", editing: false }
                                            }))
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
                                    setAnswers(prev => ({
                                        ...prev,
                                        [commentKey]: { choice: prev[commentKey]?.choice || "NIE", editing: true }
                                    }))
                                }
                            >
                                Dodaj komentarz
                            </button>
                        )}
                    </td>
                );
            }

            case "author": {
                const rowKey = getRowKey(row, tab);
                const isApprover = col.label === "Zatwierdził";

                const person = isApprover
                    ? answers[rowKey]?.approver ?? row.approver
                    : answers[rowKey]?.author ?? row.author;

                const timestamp = isApprover
                    ? answers[rowKey]?.approvedAt ?? row.approvedAt
                    : answers[rowKey]?.date ?? row.date;

                const buttonColor = isApprover ? "success" : "primary";
                const avatarColor = isApprover ? "#198754" : "#0d6efd";
                const buttonLabel = isApprover ? "Zatwierdź" : "Sporządź";

                const handleClick = () => {
                    setAnswers((prev) => ({
                        ...prev,
                        [rowKey]: {
                            ...prev[rowKey],
                            ...(isApprover
                                ? {
                                    approver: "Anna Nowak",
                                    approvedAt: new Date().toISOString(),
                                }
                                : {
                                    author: "Jan Kowalski",
                                    date: new Date().toISOString(),
                                }),
                        },
                    }));
                };

                return (
                    <td key={col.label} style={tdCenter}>
                        {person ? (
                            <div className="d-flex align-items-center justify-content-center gap-2">
                                <InitialsAvatar
                                    name={person}
                                    size={23}
                                    style={{
                                        backgroundColor: avatarColor,
                                        color: "#fff",
                                        fontWeight: 600,
                                    }}
                                />
                                <span className="text-muted small">
                        {timestamp ? timeAgo(new Date(timestamp)) : ""}
                    </span>
                            </div>
                        ) : (
                            <button
                                className={`btn btn-sm btn-outline-${buttonColor}`}
                                onClick={handleClick}
                            >
                                {buttonLabel}
                            </button>
                        )}
                    </td>
                );
            }

            case "select": {
                const value = answers[rowKey]?.[col.label] ?? row[col.label]?.value ?? "";

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
                    <td key={col.label} style={{...tdCenter, minWidth: "6rem"}}>
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

    const RenderTableDynamic = ({ tab, answers, setAnswers }) => {
        const [rows, setRows] = React.useState(
            (tab.rows || []).map((r, index) => ({ id: index + 1, ...r }))
        );

        const addRow = () => {
            setRows(prev => [
                ...prev,
                {
                    id: prev.length + 1,
                    zagrozenie: "",
                    srodek: "",
                    author: "",
                    approver: "",
                    date: null,
                    approvedAt: null
                }
            ]);
        };

        const removeRow = (id) => {
            setRows(prev => prev.filter(r => r.id !== id));
        };

        const updateCell = (rowId, field, value) => {
            setRows(prev =>
                prev.map(r => (r.id === rowId ? { ...r, [field]: value } : r))
            );
        };

        if (!rows.length) return <div className="p-2">Brak danych do wyświetlenia</div>;

        return (
            <div>
                <div className="table-responsive">
                    <table className="table table-hover table-sm mb-0 align-middle" style={{ fontSize: "0.85rem" }}>
                        <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 5 }}>
                        <tr>
                            {tab.columns.map(col => <th style ={headerStyle} key={col.label}>{col.label}</th>)}
                            <th style ={headerStyle}>Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map(row => (
                            <tr key={row.id}>
                                {tab.columns.map(col => {
                                    if (col.type === "no") {
                                        return <td key={col.label} style={{ textAlign: "center" }}>{row.id}</td>;
                                    }

                                    if (col.type === "comment") {
                                        return (
                                            <td key={col.label}>
                                                <textarea
                                                    className="form-control form-control-sm"
                                                    value={row[col.label.toLowerCase()] || ""}
                                                    onChange={e =>
                                                        updateCell(row.id, col.label.toLowerCase(), e.target.value)
                                                    }
                                                />
                                            </td>
                                        );
                                    }

                                    if (col.type === "author") {
                                        const isApprover = col.label === "Zatwierdził";
                                        const fieldName = isApprover ? "approver" : "author";
                                        const dateName = isApprover ? "approvedAt" : "date";
                                        const buttonColor = isApprover ? "success" : "primary";
                                        const buttonLabel = isApprover ? "Zatwierdź" : "Sporządź";

                                        return (
                                            <td key={col.label} style={{ textAlign: "center" }}>
                                                {row[fieldName] ? (
                                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                                        <InitialsAvatar
                                                            name={row[fieldName]}
                                                            size={23}
                                                            style={{
                                                                backgroundColor: isApprover ? "#198754" : "#0d6efd",
                                                                color: "#fff",
                                                                fontWeight: 600,
                                                            }}
                                                        />
                                                        <div>
                                                            {row[dateName] && (
                                                                <small className="text-muted">{timeAgo(new Date(row[dateName]))}</small>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className={`btn btn-sm btn-outline-${buttonColor}`}
                                                        onClick={() => {
                                                            const now = new Date().toISOString();
                                                            updateCell(row.id, fieldName, isApprover ? "Anna Nowak" : "Jan Kowalski");
                                                            updateCell(row.id, dateName, now); // <--- set timestamp here
                                                        }}
                                                    >
                                                        {buttonLabel}
                                                    </button>
                                                )}
                                            </td>
                                        );
                                    }


                                    return <td key={col.label}>{row[col.label.toLowerCase()] || ""}</td>;
                                })}
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => removeRow(row.id)}
                                    >
                                        Usuń
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <button className="btn btn-sm btn-outline-success mt-2" onClick={addRow}>
                    + Dodaj wiersz
                </button>
            </div>
        );
    };



    const renderTable = (tab) => {
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
                                {tab.columns.map((col) => renderCell(col, row, tab))}
                            </tr>
                        )
                    )}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderTeamTable = (tab, answers = {}, setAnswers) => {
        // Flatten rows including subquestions
        const flattenRows = (rows) => {
            let result = [];
            rows.forEach((row) => {
                result.push(row);
                if (row.subquestions) {
                    result.push(...flattenRows(row.subquestions));
                }
            });
            return result;
        };

        if (!tab.members || tab.members.length === 0)
            return <div className="p-2">Brak danych</div>;

        return tab.members.map((member, mIndex) => {
            const rows = flattenRows(member.questions || []);

            // Columns visible for this member
            const visibleColumns = tab.columns.filter((col) => {
                if (["Rola", "Imię i nazwisko"].includes(col.title)) return false;
                if (col.title === "Numer identyfikacyjny") return member.role === "Kierownik";
                return true;
            });

            // Unique key for member
            const memberKey = member.imieNazwisko || `${member.role}-${mIndex}`;
            const memberAnswers = answers[memberKey] || {};

            // Scoped function to update answers for this member
            const handleAnswerChange = (rowLp, colKey, value) => {
                setAnswers((prev) => ({
                    ...prev,
                    [memberKey]: {
                        ...(prev[memberKey] || {}),
                        [rowLp]: {
                            ...((prev[memberKey] || {})[rowLp] || {}),
                            [colKey]: value,
                        },
                    },
                }));
            };

            return (
                <div key={memberKey} className="mb-4">
                    {/* Member header */}
                    <div className="mb-0 p-2" style={headerStyle}>
                        <div>
                            <strong>Imię i nazwisko:</strong> {member.imieNazwisko || "-"}
                        </div>
                        {member.role === "Kluczowy biegły rewident" && (
                            <div>
                                <strong>Numer identyfikacyjny:</strong> {member.idNumber || "-"}
                            </div>
                        )}
                    </div>

                    {/* Questions table */}
                    <div className="table-responsive">
                        <table
                            className="table table-hover table-sm mb-0 align-middle"
                            style={{ fontSize: "0.85rem" }}
                        >
                            <thead className="table-light">
                            <tr>
                                {visibleColumns.map((col) => (
                                    <th key={col.title} style={headerStyle}>
                                        {col.title}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {rows.map((row) => {
                                const rowKey = `${memberKey}-${row.lp}`; // <-- member-scoped rowKey
                                return (
                                    <tr key={rowKey}>
                                        {visibleColumns.map((col) =>
                                            renderCell(
                                                col,
                                                row,
                                                tab,
                                                memberAnswers,
                                                handleAnswerChange,
                                                member,
                                                rowKey // <-- pass the unique rowKey to renderCell
                                            )
                                        )}
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        });
    };


    return (
        <div className="d-flex min-vh-100">
            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: "hidden" }}>
                <ProjectHeader project={project} />
                <SubHeader title={screenData.title} percent={screenData.percent} />
                <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="px-1 flex-grow-1 overflow-auto">
                    {getAllTabs(screenData).map((tab, i) => {
                        const tabTitle = (tab.title || "").trim().replace(/:$/, "");
                        const normalizedActiveTab = (activeTab || "").trim().replace(/:$/, "");
                        if (tabTitle !== normalizedActiveTab) return null;

                        switch (tab.type) {
                            case "CUSTOM":
                                return <div key={i}>{renderTable(tab)}</div>;
                            case "Team":
                                return <div key={i}>{renderTeamTable(tab)}</div>;
                            case "DYNAMIC":
                                return <RenderTableDynamic key={i} tab={tab} answers={answers} setAnswers={setAnswers} />;
                            case "REQUEST":
                                return <RequestsTable key={i} requests={[]} setRequests={() => {}} />;
                            case "FILES":
                                return <FilesTable key={i} files={[]} setFiles={() => {}} />;
                            case "ACTIVITY_LOG":
                                return <ActivityLog key={i} logs={[]} />;
                            case "APPLICATION":
                                return <Application key={i} initialSubmission={tab} />;
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
