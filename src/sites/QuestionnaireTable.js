import React, { useState } from "react";
import { Sidebar, Topbar,InitialsAvatar } from "../ui/Common_project.js";
import { timeAgo, ProgressMeter } from "./Functions";
import TabNavigation from "./TabNavigation";

function KwestionariuszRyzyka() {
    const [activeTab, setActiveTab] = useState("Salda kont");

    const tabs = [
        "Salda kont",
        "Prezentacja i ujawnienia",
        "Program badania",
        "Wniosek",
    ];

    return (
        <div className="d-flex min-vh-100">
            <Sidebar />
            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: "hidden" }}>
                <Topbar
                    breadcrumb={[{ label: "Home", to: "/" }, { label: "Kwestionariusz ryzyka", active: true }]}
                />

                <div className=" px-3 py-2 mt-2 mb-1 border-bottom d-flex justify-content-between align-items-center flex-wrap">
                    {/* Left side: project number + company */}
                    <div className="d-flex align-items-baseline gap-2 flex-wrap">
                        <h4 className="fw-semibold mb-0">DR/2025/123456</h4>
                        <span className="fs-5 text-secondary">Alphatech Sp. z o.o.</span>
                    </div>

                    <div className="text-muted gap-4 " style={{ fontSize: "0.9rem" }}>
                        <div>Kierownik: Jan Kowalski</div>
                        <div>Okres: 01.01.2025 – 31.12.2025</div>
                    </div>
                </div>

                <div className="mb-2 mt-2 px-3 d-flex align-items-center justify-content-between">
                    <h5 className="fw-semibold fs-5 mb-2 mt-2">
                        III.2 Wartości niematerialne i prawne
                    </h5>
                    <div style={{ width: "250px", minWidth: "150px" }}>
                        <ProgressMeter percent={70} />
                    </div>
                </div>

                {/* Tabs */}
                <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Content */}
                <div className="px-3 py-3 flex-grow-1 overflow-auto">
                    {/* 1. Salda kont */}
                    {activeTab === "Salda kont" && (
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm align-middle">
                                <thead className="table-light">
                                <tr>
                                    <th style={{  textAlign: "center", border: "1px solid #dee2e6", width: "1%", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em" }}>Stwierdzenie</th>
                                    <th style={{  textAlign: "center", border: "1px solid #dee2e6", width: "1%", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em" }}>I</th>
                                    <th style={{  textAlign: "center", border: "1px solid #dee2e6", width: "1%", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em" }}>PiO</th>
                                    <th style={{  textAlign: "center", border: "1px solid #dee2e6", width: "1%", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em" }}>Ko</th>
                                    <th style={{  textAlign: "center", border: "1px solid #dee2e6", width: "1%", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em" }}>WiP</th>
                                    <th style={{  textAlign: "center", border: "1px solid #dee2e6", width: "1%", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em" }}>Załącznik</th>
                                    <th style={{  textAlign: "center", border: "1px solid #dee2e6", width: "1%", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em" }}>Komentarz</th>
                                    <th style={{  textAlign: "center", border: "1px solid #dee2e6", width: "1%", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em" }}>Sporządził</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>Przykładowe saldo konta</td>
                                    <td><select className="form-select form-select-sm"><option>Wysokie</option><option>Średnie</option><option>Niskie</option></select></td>
                                    <td><select className="form-select form-select-sm"><option>Wysokie</option><option>Średnie</option><option>Niskie</option></select></td>
                                    <td><select className="form-select form-select-sm"><option>Wysokie</option><option>Średnie</option><option>Niskie</option></select></td>
                                    <td><select className="form-select form-select-sm"><option>Wysokie</option><option>Średnie</option><option>Niskie</option></select></td>
                                    <td><input type="file" className="form-control form-control-sm" /></td>
                                    <td><input type="text" className="form-control form-control-sm" placeholder="Komentarz" /></td>
                                    <td style={{ border: "1px solid #dee2e6", fontSize: "0.80rem" }}>
                                        <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
                                            {/* przykład z danymi */}
                                            <InitialsAvatar name={"Jan Kowalski"} size={23} />
                                            <span className="text-muted small">{timeAgo(new Date("2025-09-20"))}</span>
                                        </div>
                                    </td>                                </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* 2. Prezentacja i ujawnienia */}
                    {activeTab === "Prezentacja i ujawnienia" && (
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm align-middle">
                                <thead className="table-light">
                                <tr>
                                    <th style={{  textAlign: "center", border: "1px solid #dee2e6", width: "1%", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em" }}>Stwierdzenie</th>
                                    <th style={{  textAlign: "center", border: "1px solid #dee2e6", width: "1%", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em" }}>WoPiO</th>
                                    <th style={{  textAlign: "center", border: "1px solid #dee2e6", width: "1%", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em" }}>Ko</th>
                                    <th style={{  textAlign: "center", border: "1px solid #dee2e6", width: "1%", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em" }}>KiZ</th>
                                    <th style={{  textAlign: "center", border: "1px solid #dee2e6", width: "1%", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em" }}>DiW</th>
                                    <th style={{  textAlign: "center", border: "1px solid #dee2e6", width: "1%", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em" }}>Załącznik</th>
                                    <th style={{  textAlign: "center", border: "1px solid #dee2e6", width: "1%", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em" }}>Komentarz</th>
                                    <th style={{  textAlign: "center", border: "1px solid #dee2e6", width: "1%", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em" }}>Inicjały</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>Przykładowa prezentacja</td>
                                    <td><select className="form-select form-select-sm"><option>Wysokie</option><option>Średnie</option><option>Niskie</option></select></td>
                                    <td><select className="form-select form-select-sm"><option>Wysokie</option><option>Średnie</option><option>Niskie</option></select></td>
                                    <td><select className="form-select form-select-sm"><option>Wysokie</option><option>Średnie</option><option>Niskie</option></select></td>
                                    <td><select className="form-select form-select-sm"><option>Wysokie</option><option>Średnie</option><option>Niskie</option></select></td>
                                    <td><input type="file" className="form-control form-control-sm" /></td>
                                    <td><input type="text" className="form-control form-control-sm" placeholder="Komentarz" /></td>
                                    <td style={{ border: "1px solid #dee2e6", fontSize: "0.80rem" }}>
                                        <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
                                            {/* przykład z danymi */}
                                            <InitialsAvatar name={"Jan Kowalski"} size={23} />
                                            <span className="text-muted small">{timeAgo(new Date("2025-09-20"))}</span>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* 3. Program badania */}
                    {activeTab === "Program badania" && (
                        <div>
                            <table className="table table-bordered table-sm align-middle">
                                <thead className="table-light">
                                <tr>
                                    <th style={{  verticalAlign: "middle", textAlign: "center", border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em" }}>Program badania</th>
                                    <th style={{  textAlign: "center", border: "1px solid #dee2e6",  backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em" }}>  Osiągnięte cele/<br />Badane stwierdzenie</th>
                                    <th style={{   verticalAlign: "middle", textAlign: "center", border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em" }}>MSB numer</th>
                                    <th style={{   verticalAlign: "middle", textAlign: "center", border: "1px solid #dee2e6",  backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em" }}>Załączniki</th>
                                    <th style={{   verticalAlign: "middle", textAlign: "center", border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem 1em" }}>Inicjały</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>Przykładowe badanie</td>
                                    <td style = {{textAlign: "center"}}>1</td>
                                    <td style = {{textAlign: "center"}}>330(6)
                                        240(30- 33)
                                        330(21)</td>
                                    <td><input type="file" className="form-control form-control-sm" /></td>
                                    <td style={{ border: "1px solid #dee2e6", fontSize: "0.80rem" }}>
                                        <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
                                            {/* przykład z danymi */}
                                            <InitialsAvatar name={"Jan Kowalski"} size={23} />
                                            <span className="text-muted small">{timeAgo(new Date("2025-09-20"))}</span>
                                        </div>
                                    </td>                                </tr>
                                </tbody>
                            </table>
                            <div className="mt-3">
                                <label className="form-label fw-semibold">
                                    Czy wstępnie oszacowany przez ciebie poziom ryzyka uległ zmianie?
                                </label>
                                <textarea
                                    className="form-control"
                                    rows={4}
                                    placeholder="Jeżeli tak, wyjaśnij tę sytuację i podejmij decyzję..."
                                />
                            </div>
                        </div>
                    )}

                    {/* 4. Wniosek */}
                    {activeTab === "Wniosek" && (
                        <div>
                            <h5 className="fw-bold mb-3">Wniosek</h5>
                            <div className="border rounded p-3 bg-light">
                                <p className="mb-3">
                                    Z zastrzeżeniem spraw przekazanych osobie dokonującej przeglądu, w mojej opinii uzyskano
                                    wystarczającą pewność, aby stwierdzić, iż w sprawozdaniu finansowym nie ma istotnych
                                    zniekształceń w zakresie tej pozycji (obszaru sprawozdania finansowego). MSB 330(28).
                                </p>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Sporządził</label>
                                        <input type="text" className="form-control" placeholder="Imię i nazwisko" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Data</label>
                                        <input type="date" className="form-control" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default KwestionariuszRyzyka;
