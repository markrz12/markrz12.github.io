import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../sites/Login";

// Dashboard pages
import Workspace from "../sites/Dashboard/Workspace";
import Clients from "../sites/Dashboard/Clients";
import Users from "../sites/Dashboard/Users";
import Templates from "../sites/Dashboard/Templates";
import Projects from "../sites/Dashboard/Projects";
import ProjectClient from "../sites/Dashboard/ProjectClient";
import ProjectDashboard from "../sites/Project/ProjectDashboard";

// Project pages
import Project from "../sites/Project/Project";
import ProjectSettings from "../sites/Project/ProjectSettings";
import Questionnaire from "../sites/Project/Questionnaires/Questionnaire";
import InformationMSB from "../sites/Project/Questionnaires/InformationMSB";

function App() {
    // Derive basename for GitHub Pages or subfolder deployment
    let baseName = new URL(document.baseURI).pathname;
    baseName = baseName === "/" ? "" : baseName.replace(/\/$/, "");

    return (
        <Router basename={baseName}>
            <Routes>
                {/* Public / main routes */}
                <Route path="/" element={<Login />} />
                <Route path="/workspace" element={<Workspace />} />
                <Route path="/klienci" element={<Clients />} />
                <Route path="/uzytkownicy" element={<Users />} />
                <Route path="/szablony" element={<Templates />} />
                <Route path="/projekty" element={<Projects />} />
                <Route path="/projekt-klient" element={<ProjectClient />} />

                {/* Project dynamic layout */}
                <Route path="/projekty/:projectName" element={<Project />}>
                    <Route index element={<ProjectDashboard />} />
                    <Route path="uzytkownicy" element={<ProjectSettings />} />
                    <Route path="informacjeMSB" element={<InformationMSB />} />
                    <Route path="kwestionariusz/:screenTitle" element={<Questionnaire/>} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<div>Page not found</div>} />
            </Routes>
        </Router>
    );
}

export default App;
