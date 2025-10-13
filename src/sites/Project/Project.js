import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { BsChevronRight } from "react-icons/bs";
import { Sidebar} from "../../ui/Common_project.js";
import {Topbar } from "../../ui/Common.js";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5171";

// 🔹 Small progress bar (optional use)
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

// 🔹 Recursive section renderer (with roll-down)
function RenderSection({ section, level = 0 }) {
    const [open, setOpen] = useState(false);
    const indent = { marginLeft: `${level * 20}px` };

    return (
        <div style={{ marginBottom: 4 }}>
            {/* Section header */}
            <div
                onClick={() => setOpen(!open)}
                className="fw-semibold d-flex align-items-center"
                style={{
                    cursor: "pointer",
                    backgroundColor: "#f7f9fa",
                    padding: "12px 15px",
                    borderRadius: 10,
                    marginBottom: "10px",
                    ...indent,
                }}
            >
                <BsChevronRight
                    style={{
                        marginRight: 6,
                        transform: open ? "rotate(90deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                    }}
                />
                {section.name || section.label}
            </div>

            {/* Screens */}
            {open && section.screens?.map((screen) => (
                <div
                    key={screen.id || screen.title}
                    className="d-flex justify-content-between align-items-center mt-1"
                    style={{
                        marginLeft: `${level * 20 + 20}px`, // maintain indentation
                        padding: "5px 12px",
                        backgroundColor: "#ffffff",
                        borderRadius: 4,
                        fontWeight: 400
                    }}
                >
                    <div>{screen.title}</div>

                    <div className="d-flex align-items-center gap-2">
                        <ProgressMini value={screen.percent || 0} />
                        <Link
                            to="/kwestionariusz"
                            className="btn btn-sm"
                            style={{ backgroundColor: "#005679", color: "#fff", borderRadius: 4 }}
                        >
                            Otwórz
                        </Link>
                    </div>
                </div>
            ))}


            {/* Nested sections */}
            {open &&
                section.sections?.map((sub) => (
                    <RenderSection key={sub.name || sub.label} section={sub} level={level + 1} />
                ))}
        </div>
    );
}

export default function Project() {
    const { id } = useParams(); // Encoded project name in URL
    const [project, setProject] = useState(null);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("");

    useEffect(() => {
        let alive = true;
        const projectName = decodeURIComponent(id);

        axios
            .get(`${API_BASE}/Projects`)
            .then((res) => {
                if (!alive) return;
                const p = res.data.find((proj) => proj.name === projectName);
                if (p) {
                    setProject(p);
                    setActiveTab(p.phases?.[0]?.label || "");
                } else {
                    setError("Project not found.");
                }
            })
            .catch((err) => {
                console.error(err);
                if (!alive) return;
                setError("Project not found.");
            });

        return () => {
            alive = false;
        };
    }, [id]);

    if (error) return <div className="text-danger text-center mt-5">{error}</div>;
    if (!project) return <div className="text-center mt-5">Loading project...</div>;

    const breadcrumb = [
        { label: "Home", to: "/" },
        { label: "Projects", to: "/projekty" },
        { label: project.name, active: true },
    ];

    return (
        <div className="d-flex min-vh-100">
            <Sidebar search={search} setSearch={setSearch} />
            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: "hidden" }}>
                <Topbar breadcrumb={breadcrumb} />

                {/* Content */}
                <div className="flex-grow-1 bg-light p-4" style={{ overflow: "auto" }}>
                    <div className="container-fluid" style={{ maxWidth: 1100 }}>
                        <h4 className="mb-4">
                            <span style={{ fontWeight: 600 }}>{project.name}</span>
                            <span style={{ fontWeight: 400, marginLeft: '1rem', color: '#555' }}>{project.klient}</span>
                        </h4>


                        {/* 🔹 Phase Tabs */}
                        <div className="card shadow-sm">
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
                                            transition: "all 0.2s ease",
                                            padding: "12px 10px",
                                        }}
                                        onFocus={(e) => e.target.blur()} // prevents focus border when clicked
                                    >
                                        {phase.label}
                                    </button>
                                ))}
                            </div>

                            {/* 🔹 Tab Content */}
                            <div className="card-body">
                                {project.phases
                                    ?.filter((p) => p.label === activeTab)
                                    .map((phase) => (
                                        <div key={phase.label}>
                                            {/* Direct screens */}
                                            {phase.screens?.map((screen) => (
                                                <div
                                                    key={screen.id || screen.title}
                                                    className="d-flex justify-content-between align-items-center mb-2"
                                                    style={{
                                                        padding: "10px 20px",
                                                        backgroundColor: "#f7f9fa",
                                                        borderRadius: 4,
                                                        fontWeight: 400
                                                    }}
                                                >
                                                    <div>{screen.title}</div>

                                                    <div className="d-flex align-items-center gap-2">
                                                        {/* Progress bar */}
                                                        <ProgressMini value={screen.percent || 0} />

                                                        {/* Open button */}
                                                        <Link
                                                            to="/kwestionariusz"
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


                                            {/* Sections with roll-down */}
                                            {phase.sections?.map((section) => (
                                                <RenderSection key={section.name || section.label} section={section} />
                                            ))}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
