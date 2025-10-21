import React, { useState, useEffect } from "react";
import { useParams} from "react-router-dom";
import axios from "axios";
import { Sidebar } from "../../ui/Common_project.js";
import { Topbar } from "../../ui/Common.js";
import { Outlet, useLocation } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5171";


function useBreadcrumb(project) {
    const location = useLocation(); // React Router location
    const pathParts = location.pathname.split("/").filter(Boolean); // split path

    const breadcrumb = [];

    // Add "Home"
    breadcrumb.push({ label: "Workspace", to: "/workspace" },);

    // Add "Projects"
    breadcrumb.push({ label: "Projects", to: "/projekty" });

    // Add project if available
    if (project) {
        breadcrumb.push({
            label: project.name,
            to: `/projekty/${encodeURIComponent(project.name)}`,
        });
    }

    // Add deeper paths dynamically (e.g., / Sekcja 1)
    for (let i = 2; i < pathParts.length; i++) {
        const segment = decodeURIComponent(pathParts[i]);

        if (segment.toLowerCase() === "kwestionariusz") continue;

        const label = segment
            .replace(/-/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .replace(/^([Vv]\.\d+)\s*(.*)$/i, (_, num, rest) => {
                const fixed =
                    rest
                        .toLowerCase()
                        .replace(/^./, (l) => l.toUpperCase()); // capitalize only first letter of text
                return `${num} ${fixed}`;
            })
            .replace(/^./, (l) => l.toUpperCase());


        const path = "/" + pathParts.slice(0, i + 1).join("/");
        breadcrumb.push({ label, to: path });
    }


    // Mark last breadcrumb as active
    if (breadcrumb.length) {
        breadcrumb[breadcrumb.length - 1].active = true;
    }

    return breadcrumb;
}


export default function Project() {
    const { projectName } = useParams();
    const decodedProjectName = decodeURIComponent(projectName);
    const [project, setProject] = useState(null);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const breadcrumb = useBreadcrumb(project);


    useEffect(() => {
        let alive = true;

        axios
            .get(`${API_BASE}/Projects`)
            .then((res) => {
                if (!alive) return;
                const p = res.data.find((proj) => proj.name === decodedProjectName);
                if (p) setProject(p);
                else setError("Project not found");
            })
            .catch((err) => {
                console.error(err);
                if (!alive) return;
                setError("Project not found");
            });

        return () => {
            alive = false;
        };
    }, [decodedProjectName]);

    if (error)
        return <div className="text-danger text-center mt-5">{error}</div>;

    if (!project)
        return <div className="text-center mt-5">Loading project...</div>;

    return (
        <div className="d-flex min-vh-100">
            {/* Sidebar always visible */}
            <Sidebar search={search} setSearch={setSearch} project={project} />

            {/* Main column */}
            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: "hidden" }}>
                <Topbar breadcrumb={breadcrumb} />

                {/* Content rendered via nested routes */}
                <div className="flex-grow-1 bg-light p-3" style={{ overflow: "auto" }}>
                    <div className="container-fluid" >
                        <Outlet context={{ project }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
