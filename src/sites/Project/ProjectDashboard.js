import React, { useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { BsChevronRight } from "react-icons/bs";

// Small progress bar
function ProgressMini({ value }) {
    const v = Math.max(0, Math.min(100, Math.round(value)));
    return (
        <div className="d-flex align-items-center" style={{ marginRight: "20px", gap: "0.2rem", minWidth: 140 }}>
            <div
                className="flex-grow-1 position-relative"
                style={{
                    height: 16,
                    background: "#eaf0f6",
                    borderRadius: 999,
                    border: "1px solid #d2dbea",
                    boxShadow: "inset 0 1px 1px rgba(0,0,0,0.04)",
                }}
            >
                <div
                    style={{
                        width: `${v}%`,
                        height: "100%",
                        background: "var(--ndr-bg-topbar)",
                        borderRadius: 999,
                        transition: "width 300ms ease",
                    }}
                />
            </div>
            <div className="small text-muted" style={{ width: 40, textAlign: "right" }}>
                {v}%
            </div>
        </div>
    );
}

// Recursive section renderer
function RenderSection({ section, level = 0 }) {
    const [open, setOpen] = useState(false);
    const indent = { marginLeft: `${level * 20}px` };
    const { project } = useOutletContext();
    const projectBase = project ? `/projekty/${encodeURIComponent(project.name)}` : "";
    const getScreenUrl = (screenTitle) =>
        `${projectBase}/kwestionariusz/${encodeURIComponent(screenTitle)}`;

    return (
        <div style={{ marginBottom: 4 }}>
            <div
                onClick={() => setOpen(!open)}
                className=" d-flex align-items-center"
                style={{
                    cursor: "pointer",
                    backgroundColor: "#f7f9fa",
                    padding: "12px 15px",
                    borderRadius: 10,
                    marginBottom: "10px",
                    ...indent,
                }}
            >
                {section.name || section.label}
                <BsChevronRight
                    style={{
                        marginLeft: 6,
                        transform: open ? "rotate(90deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                    }}
                />
            </div>

            {open &&
                section.screens?.map((screen) => (
                    <div
                        key={screen.id || screen.title}
                        className="d-flex justify-content-between align-items-center mt-1"
                        style={{
                            marginLeft: `${level * 20 + 20}px`,
                            padding: "5px 12px",
                            backgroundColor: "#ffffff",
                            borderRadius: 4,
                            fontWeight: 400,
                        }}
                    >
                        <div>{screen.title}</div>
                        <div className="d-flex align-items-center gap-2">
                            <ProgressMini value={screen.percent || 0} />
                            <Link
                                to={getScreenUrl(screen.title)}
                                className="btn btn-sm"
                                style={{ backgroundColor: "#005679", color: "#fff", borderRadius: 4 }}
                            >
                                Otwórz
                            </Link>
                        </div>
                    </div>
                ))}

            {open &&
                section.sections?.map((sub) => <RenderSection key={sub.name || sub.label} section={sub} level={level + 1} />)}
        </div>
    );
}

export default function ProjectDashboard() {
    const { project } = useOutletContext(); // project passed from parent
    const [activeTab, setActiveTab] = useState(project.phases?.[0]?.label || "");

    const projectBase = project ? `/projekty/${encodeURIComponent(project.name)}` : "";
    const getScreenUrl = (screenTitle) =>
        `${projectBase}/kwestionariusz/${encodeURIComponent(screenTitle)}`;


    return (
        <>
            <h4 style={{ padding: "1.5rem 3rem 1rem 3rem" }}>
                <span style={{ fontWeight: 600 }}>{project.name}</span>
                <span style={{ fontWeight: 400, marginLeft: "1rem", color: "#555" }}>{project.klient}</span>
            </h4>

            <div className="d-flex justify-content-center" style={{ padding: "0 3rem 3rem 3rem" }}>
                <div className="card shadow-sm" style={{ width: "100%" }}>
                {/* Phase Tabs */}
                <div className="card-header d-flex border-0" style={{ background: "#0a2b4c", padding: 0 }}>
                    {project.phases?.map((phase) => (
                        <button
                            key={phase.label}
                            onClick={() => setActiveTab(phase.label)}
                            className="flex-grow-1 text-center fw-semibold"
                            style={{
                                color: activeTab === phase.label ? "#fff" : "#b0bec5",
                                backgroundColor: activeTab === phase.label ? "#005679" : "transparent",
                                border: "none",
                                cursor: "pointer",
                                padding: "12px 10px",
                            }}
                            onFocus={(e) => e.target.blur()}
                        >
                            {phase.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="card-body">
                    {project.phases
                        ?.filter((p) => p.label === activeTab)
                        .map((phase) => (
                            <div key={phase.label}>
                                {phase.screens?.map((screen) => (
                                    <div
                                        key={screen.id || screen.title}
                                        className="d-flex justify-content-between align-items-center mb-2"
                                        style={{
                                            padding: "10px 20px",
                                            backgroundColor: "#f7f9fa",
                                            borderRadius: 4,
                                            fontWeight: 400,
                                        }}
                                    >
                                        <div>{screen.title}</div>
                                        <div className="d-flex align-items-center gap-2">
                                            <ProgressMini value={screen.percent || 0} />
                                            <Link
                                                to={getScreenUrl(screen.title)}
                                                className="btn btn-sm"
                                                style={{
                                                    backgroundColor: "#005679",
                                                    color: "#fff",
                                                    borderRadius: 4,
                                                }}
                                            >
                                                Otwórz
                                            </Link>
                                        </div>
                                    </div>
                                ))}

                                {phase.sections?.map((section) => (
                                    <RenderSection key={section.name || section.label} section={section} />
                                ))}
                            </div>
                        ))}
                </div>
            </div>
            </div>
        </>
    );
}
