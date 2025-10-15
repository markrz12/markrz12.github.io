import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import * as Icons from "react-icons/bs";

export function Sidebar({ project }) {
    const location = useLocation();
    const [openPhase, setOpenPhase] = useState(null);
    const [openSection, setOpenSection] = useState({});

    const isActive = (to) => location.pathname === to;
    const linkClass = (to) => "nav-link text-white" + (isActive(to) ? " active" : "");

    const projectBase = project ? `/projekty/${encodeURIComponent(project.name)}` : "";

    const getIcon = (iconName) => Icons[iconName] || Icons.BsFolder;

    const topLinks = [
        { label: "Lista Projektów", to: "/projekty", icon: "BsCollection" },
        { label: project?.name, to: projectBase, icon: "BsPlayCircle" },
        { label: "Użytkownicy", to: `${projectBase}/uzytkownicy`, icon: "BsPersonGear" },
        { label: "Informacje", to: `${projectBase}/informacjeMSB`, icon: "BsInfoCircle" },
    ];

    const renderItem = (label, to, level = 0) => (
        <Link
            key={to}
            className={linkClass(to)}
            to={to}
            style={{
                display: "block",
                paddingLeft: `${10 + level * 20}px`,
                fontSize: level === 2 ? "0.8rem" : "0.9rem"
            }}
        >
            {label}
        </Link>
    );

    const getScreenUrl = (screenTitle) =>
        `${projectBase}/kwestionariusz/${encodeURIComponent(screenTitle)}`;

    return (
        <div className="d-flex flex-column text-white"
             style={{ width: 240, flex: "0 0 240px", backgroundColor: "var(--ndr-bg-sidebar)", padding: "1.1rem", fontSize: "0.95rem" }}>
            <h5 className="mt-1 mb-0">NDR</h5>
            <hr style={{ borderColor: "#fff" }} />

            <ul className="nav flex-column mb-3">
                {topLinks.map((link) => (
                    <li key={link.label} className="nav-item">
                        <Link
                            className={linkClass(link.to)}
                            to={link.to}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                paddingLeft: "16px",
                                ...(isActive(link.to)
                                    ? { background: "rgba(255,255,255,0.12)", borderRadius: 4 }
                                    : {}),
                            }}
                        >
                            {getIcon(link.icon)()}
                            {link.label}
                        </Link>
                    </li>
                ))}

                {/* 🔹 Phases */}
                {project?.phases?.map((phase) => {
                    const PhaseIcon = getIcon(phase.icon);
                    return (
                        <li key={phase.label}>
                            <button
                                className="nav-link text-white w-100 text-start d-flex align-items-center"
                                onClick={() => setOpenPhase(openPhase === phase.label ? null : phase.label)}
                                style={{ gap: "0.5rem", paddingLeft: "16px" }}
                            >
                                <PhaseIcon />
                                {phase.label}
                                <Icons.BsChevronRight
                                    className="ms-auto"
                                    style={{
                                        transform: openPhase === phase.label ? "rotate(90deg)" : "none",
                                        transition: "transform 0.2s ease",
                                    }}
                                />
                            </button>

                            {openPhase === phase.label && (
                                <ul className="nav flex-column">
                                    {phase.screens?.map((screen) =>
                                        renderItem(screen.title, getScreenUrl(screen.title), 1)
                                    )}
                                    {phase.sections?.map((section) => (
                                        <li key={section.name}>
                                            <button
                                                className="nav-link text-white w-100 text-start"
                                                onClick={() =>
                                                    setOpenSection((prev) => ({
                                                        ...prev,
                                                        [section.name]: !prev[section.name],
                                                    }))
                                                }
                                                style={{
                                                    paddingLeft: "30px",
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    fontSize: "0.85rem"
                                                }}
                                            >
                                                {section.name}
                                                <Icons.BsChevronRight
                                                    className="ms-auto"
                                                    style={{
                                                        transform: openSection[section.name] ? "rotate(90deg)" : "none",
                                                        transition: "transform 0.2s ease",
                                                        fontSize: "0.8rem",
                                                        flexShrink: 0,
                                                    }}
                                                />
                                            </button>
                                            {openSection[section.name] &&
                                                section.screens?.map((s) =>
                                                    renderItem(s.title, getScreenUrl(s.title), 2)
                                                )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ul>

            <div className="mt-auto">
                <button type="button" className="nav-link btn btn-link text-white p-0 text-start">
                    <Icons.BsGear className="me-2" /> Admin
                </button>
            </div>
        </div>
    );
}
