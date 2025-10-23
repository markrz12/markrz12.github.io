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

const basename = process.env.PUBLIC_URL || "/";

function App() {
    return (
        <Router basename={basename}>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/workspace" element={<Workspace />} />
                <Route path="/klienci" element={<Clients />} />
                <Route path="/uzytkownicy" element={<Users />} />
                <Route path="/szablony" element={<Templates />} />
                <Route path="/projekty" element={<Projects />} />
                <Route path="/projekt-klient" element={<ProjectClient />} />

                <Route path="/projekty/:projectName" element={<Project />}>
                    <Route index element={<ProjectDashboard />} />
                    <Route path="uzytkownicy" element={<ProjectSettings />} />
                    <Route path="informacjeMSB" element={<InformationMSB />} />
                    <Route path="kwestionariusz/:screenTitle" element={<Questionnaire />} />
                </Route>

                <Route path="*" element={<div>Page not found</div>} />
            </Routes>
        </Router>
    );
}

export default App;
