import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Workspace from "./Workspace";
import Klienci from "./Klienci";
import Uzytkownicy from "./Uzytkownicy";
import Szablony from "./Szablony";
import Projekty from "./Projekty";
import ProjektKonfiguracja from "./ProjektKonfiguracja";
import ProjektKlient from "./ProjektKlient";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/workspace" element={<Workspace />} />
                <Route path="/klienci" element={<Klienci />} />
                <Route path="/uzytkownicy" element={<Uzytkownicy />} />
                <Route path="/szablony" element={<Szablony />} />
                <Route path="/projekty" element={<Projekty />} />
                <Route path="/projekt-konfiguracja" element={<ProjektKonfiguracja />} />
                <Route path="/projekt-klient" element={<ProjektKlient />} />
            </Routes>
        </Router>
    );
}

export default App;