import React, { useState} from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar, Topbar } from "../../ui/Common";
import { BsFileText, BsPeople, BsGeoAlt, BsEnvelope } from "react-icons/bs";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5171";

function ProjectClient() {
    const navigate = useNavigate();
    const location = useLocation();
    const { mode = "add", clientData = null } = location.state || {};

    const [selected, setSelected] = useState(clientData || null);
    const [krsQuery, setKrsQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [open, setOpen] = useState({ rps: true, addr: false, contact: false, repr: false });
    const [search, setSearch] = useState("");

    const toggle = (key) => setOpen(prev => ({ ...prev, [key]: !prev[key] }));

    // Fetch data from KRS (only used in "add" mode)
    const fetchFromKRS = async () => {
        if (!krsQuery) return alert("Podaj numer KRS lub nazwę firmy");
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(`${API_BASE}/Clients/${krsQuery}`);
            setSelected(res.data);
        } catch (err) {
            console.error(err);
            setError("Nie udało się pobrać danych klienta z KRS.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!selected) return alert("Brak danych klienta!");
        try {
            if (mode === "add") {
                await axios.post(`${API_BASE}/Clients`, selected);
            } else {
                await axios.put(`${API_BASE}/Clients/${selected.id}`, selected);
            }
            navigate("/klienci");
        } catch (err) {
            console.error(err);
            alert(mode === "add" ? "Nie udało się dodać klienta." : "Nie udało się zaktualizować klienta.");
        }
    };

    return (
        <div className="d-flex min-vh-100">
            <Sidebar search={search} setSearch={setSearch} />

            <div className="flex-grow-1 d-flex flex-column">
                <Topbar
                    breadcrumb={[
                        { label: "Workspace", to: "/workspace" },
                        { label: "Klienci", to: "/klienci" },
                        { label: mode === "add" ? "Dodaj klienta" : "Edytuj klienta", active: true },
                    ]}
                />

                <div className="flex-grow-1 bg-light d-flex pt-3 px-3">
                    <div className="container-fluid" style={{ maxWidth: 980 }}>
                        <div className="card shadow-sm">
                            <div className="card-body">

                                {/* KRS input only for adding new client */}
                                {mode === "add" && (
                                    <div className="d-flex flex-column flex-sm-row align-items-start gap-3 mb-3">
                                        <div className="flex-grow-1">
                                            <input
                                                className="form-control"
                                                placeholder="Podaj numer KRS lub nazwę firmy"
                                                value={krsQuery}
                                                onChange={e => setKrsQuery(e.target.value)}
                                            />
                                        </div>
                                        <button className="btn btn-outline-secondary" onClick={fetchFromKRS} disabled={loading}>
                                            {loading ? "Ładowanie..." : "Pobierz dane z KRS"}
                                        </button>
                                    </div>
                                )}

                                {error && <div className="text-danger mb-2">{error}</div>}

                                {/* Display client data if selected */}
                                {selected && (
                                    <>
                                        <Section key="rps" open={open.rps} title={<><BsFileText className="me-2"/> Dane podmiotu</>} toggle={() => toggle('rps')}>
                                            <Row label="Nazwa" value={selected.name} />
                                            <Row label="Rejestr" value={selected.reg} />
                                            <Row label="KRS" value={selected.krs} label2="NIP" value2={selected.nip} />
                                            <Row label="REGON" value={selected.regon} label2="Forma prawna" value2={selected.form} />
                                        </Section>

                                        <Section key="addr" open={open.addr} title={<><BsGeoAlt className="me-2"/> Adres</>} toggle={() => toggle('addr')}>
                                            {Object.entries(selected.addr).map(([k,v]) => <Row key={k} label={k} value={v} />)}
                                        </Section>

                                        <Section key="contact" open={open.contact} title={<><BsEnvelope className="me-2"/> Kontakt</>} toggle={() => toggle('contact')}>
                                            <Row label="Email" value={selected.contact.email} />
                                            <Row label="Telefon" value={selected.contact.phone} />
                                            <Row label="WWW" value={selected.contact.www} />
                                        </Section>

                                        <Section key="repr" open={open.repr} title={<><BsPeople className="me-2"/> Reprezentacja</>} toggle={() => toggle('repr')}>
                                            <div className="table-responsive p-0">
                                                <table className="table table-hover mb-0 align-middle" style={{ borderCollapse: "separate", borderSpacing: "0 0.5rem" }}>
                                                    <thead className="bg-dark text-white text-center rounded-top">
                                                    <tr>
                                                        <th className="rounded-start">Imię i nazwisko</th>
                                                        <th>Funkcja</th>
                                                        <th className="rounded-end">Sposób reprezentacji</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {selected.repr.map((p, i) => (
                                                        <tr key={i} className="bg-light text-center" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "0.5rem", borderRadius: "0.25rem" }}>
                                                            <td className="fw-semibold">{p.name}</td>
                                                            <td>{p.role}</td>
                                                            <td>{p.sposob}</td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                        </Section>
                                    </>
                                )}

                                {/* Action Button */}
                                <div className="text-center mt-3">
                                    <button className={`btn ${mode === "add" ? "btn-primary" : "btn-outline-primary"} px-4`} onClick={handleSave}>
                                        {mode === "add" ? "Dodaj klienta" : "Zaktualizuj dane klienta"}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Section = ({ title, open, toggle, children }) => (
    <div className="mb-3">
        <button
            className="btn w-100 text-start d-flex align-items-center justify-content-between"
            onClick={toggle}
            style={{ backgroundColor: "#0a2b4c", color: "#fff", border: "none", padding: "0.5rem 1rem" }}
        >
            <span>{title}</span>
            <span aria-hidden>{open ? "▴" : "▾"}</span>
        </button>
        {open && <div className="border border-top-0 p-3 bg-white small">{children}</div>}
    </div>
);

const Row = ({ label, value, label2, value2 }) => (
    <div className="row g-0 border-bottom mb-1">
        <div className="col-12 col-md-3 bg-light border-end p-2 fw-bold">{label}</div>
        <div className="col-12 col-md-3 p-2">{value}</div>
        {label2 && <>
            <div className="col-12 col-md-3 bg-light border-end p-2 fw-bold">{label2}</div>
            <div className="col-12 col-md-3 p-2">{value2}</div>
        </>}
    </div>
);

export default ProjectClient;
