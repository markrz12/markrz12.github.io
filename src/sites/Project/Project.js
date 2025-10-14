import React, { useState, useEffect } from "react";
import { useParams} from "react-router-dom";
import axios from "axios";
import { Sidebar } from "../../ui/Common_project.js";
import { Topbar } from "../../ui/Common.js";
import { Outlet } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5171";

export default function Project() {
    const { projectName } = useParams();
    const decodedProjectName = decodeURIComponent(projectName);
    const [project, setProject] = useState(null);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        let alive = true;

        axios.get(`${API_BASE}/Projects`)
            .then(res => {
                if (!alive) return;
                const p = res.data.find(proj => proj.name === decodedProjectName);
                if (p) setProject(p);
                else setError("Project not found");
            })
            .catch(err => {
                console.error(err);
                if (!alive) return;
                setError("Project not found");
            });

        return () => { alive = false; };
    }, [decodedProjectName]);

    if (error) return <div className="text-danger text-center mt-5">{error}</div>;
    if (!project) return <div className="text-center mt-5">Loading project...</div>;

    const breadcrumb = [
        { label: "Home", to: "/" },
        { label: "Projects", to: "/projekty" },
        { label: project.name, active: true },
    ];

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
