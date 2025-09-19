import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../sites/Login";
import Workspace from "../sites/Workspace";
import Clients from "../sites/Clients";
import Users from "../sites/Users";
import Templates from "../sites/Templates";
import Projects from "../sites/Projects";
import ProjectSettings from "../sites/ProjectSettings";
import ProjectClient from "../sites/ProjectClient";
import Questionnaire from "../sites/Questionnaire";
import QuestionnaireSimple from "../sites/QuestionnaireSimple.js";
import QuestionnaireDynamic from "../sites/QuestionnaireDynamic.js";
import Project from "../sites/Project";
import InformationMSB from "../sites/InformationMSB";

function App() {
    // Derive basename from the document base URI so it works at root or under a repo path (GitHub Project Pages)
    let baseName = new URL(document.baseURI).pathname;
    baseName = baseName === "/" ? "" : baseName.replace(/\/$/, "");

    return (
        <Router basename={baseName}>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/workspace" element={<Workspace />} />
                <Route path="/klienci" element={<Clients />} />
                <Route path="/uzytkownicy" element={<Users />} />
                <Route path="/szablony" element={<Templates />} />
                <Route path="/projekty" element={<Projects />} />
                <Route path="/projekty/:id" element={<Project />} />
                <Route path="/projekt-konfiguracja" element={<ProjectSettings />} />
                <Route path="/projekt-klient" element={<ProjectClient />} />
                <Route path="/kwestionariusz" element={<Questionnaire />} />
                <Route path="/kwestionariusz-prosty" element={<QuestionnaireSimple />} />
                <Route path="/kwestionariusz-dynamiczny" element={<QuestionnaireDynamic />} />
                <Route path="/informacjeMSB" element={<InformationMSB />} />
            </Routes>
        </Router>
    );
}

export default App;