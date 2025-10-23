import React, { useState, useEffect,  } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Sidebar, Topbar } from "../../ui/Common";
import { BsSearch, BsFileText, BsPeople, BsGeoAlt, BsEnvelope } from "react-icons/bs";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5171";

function ProjectClient() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    return (
        <div className="d-flex min-vh-100">
            <Sidebar search={search} setSearch={setSearch} />

            <div className="flex-grow-1 d-flex flex-column">
                <Topbar
                    breadcrumb={[
                        { label: "Workspace", to: "/workspace" },
                        { label: "Klienci", to: "/klienci" },
                        { label: "Moduł dodawania klienta", active: true },
                    ]}
                />

                <div className="flex-grow-1 bg-light d-flex pt-3 px-3">
                    <ProjectClientForm onCreate={() => navigate("/klienci")} />
                </div>

                <div className="px-3 py-2 text-end small text-muted">
                    Sekcja klienta projektu
                </div>
            </div>
        </div>
    );
}

function ProjectClientForm({ onCreate }) {
    const [krsQuery, setKrsQuery] = useState("");
    const [open, setOpen] = useState({
        rps: true,
        wyk: false,
        zaw: false,
        addr: false,
        contact: false,
        repr: false,
    });
    const [selected, setSelected] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const toggle = (key) => setOpen(prev => ({ ...prev, [key]: !prev[key] }));

    // Pobieranie sugestii z API
    useEffect(() => {
        const fetchSuggestions = async () => {
            const q = krsQuery.trim();
            if (!q) return setSuggestions([]);
            setLoading(true);
            setError("");
            try {
                const res = await axios.get(`${API_BASE}/Clients`, { params: { query: q } });
                setSuggestions(res.data.slice(0, 5));
            } catch (err) {
                console.error(err);
                setError("Nie udało się pobrać danych z API.");
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, [krsQuery]);

    const fetchFromKRS = async () => {
        if (suggestions.length > 0) return setSelected(suggestions[0]);
        if (!krsQuery) return;

        setLoading(true);
        setError("");
        try {
            const res = await axios.get(`${API_BASE}/Clients/${krsQuery}`);
            setSelected(res.data);
        } catch (err) {
            console.error(err);
            setError("Nie udało się pobrać danych klienta.");
        } finally {
            setLoading(false);
        }
    };

    const createProject = () => {
        if (!selected) return alert("Wybierz klienta!");

    };

    return (
        <div className="container-fluid" style={{ maxWidth: 980 }}>
            <div className="card shadow-sm">
                <div className="card-body">
                    {/* Wyszukiwanie klienta */}
                    <div className="mt-2">
                        <h5 className="fw-semibold p-2">Moduł dodawania klienta</h5>
                        <div className="d-flex flex-column flex-sm-row align-items-start gap-3 mt-1">
                            <div className="position-relative w-100" style={{ maxWidth: 520 }}>
                                <div className="input-group">
                                    <span className="input-group-text"><BsSearch /></span>
                                    <input
                                        aria-label="Podaj nazwę firmy, NIP, KRS lub REGON"
                                        className="form-control"
                                        placeholder="Podaj nazwę firmy, NIP lub KRS lub REGON"
                                        value={krsQuery}
                                        onChange={e => setKrsQuery(e.target.value)}
                                    />
                                </div>
                                {suggestions.length > 0 && (
                                    <div className="list-group shadow-sm position-absolute w-100" style={{ zIndex: 10 }}>
                                        {suggestions.map((s, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                className="list-group-item list-group-item-action"
                                                onClick={() => { setSelected(s); setKrsQuery(""); setSuggestions([]); }}
                                            >
                                                <div className="fw-semibold">{s.name}</div>
                                                <div className="small text-muted">KRS: {s.krs} • NIP: {s.nip} • REGON: {s.regon}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <span className="text-muted d-none d-sm-inline mt-1">lub</span>
                            <button className="btn btn-outline-secondary" onClick={fetchFromKRS} disabled={loading}>
                                {loading ? "Ładowanie..." : "Pobierz dane z KRS"}
                            </button>
                        </div>
                        {error && <div className="text-danger mt-2">{error}</div>}
                    </div>

                    <hr />

                    {/* Wyświetlanie danych klienta */}
                    {selected && (
                        <>
                            <Section key="rps" open={open.rps} title={<><BsFileText className="me-2"/> Dane podmiotu</>} toggle={() => toggle('rps')}>
                                <Row label="Nazwa" value={selected.name} />
                                <Row label="Rejestr" value={selected.reg} />
                                <Row label="KRS" value={selected.krs} label2="NIP" value2={selected.nip} />
                                <Row label="REGON" value={selected.regon} label2="Forma prawna" value2={selected.form} />
                            </Section>

                            <Section key="addr" open={open.addr} title={<><BsGeoAlt className="me-2"/> Adres</>} toggle={() => toggle('addr')}>
                                {Object.entries(selected.addr).map(([k,v]) => (
                                    <Row key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} value={v} />
                                ))}
                            </Section>

                            <Section key="contact" open={open.contact} title={<><BsEnvelope className="me-2"/> Kontakt</>} toggle={() => toggle('contact')}>
                                <Row label="Email" value={<a href={`mailto:${selected.contact.email}`}>{selected.contact.email}</a>} />
                                <Row label="Telefon" value={selected.contact.phone} />
                                <Row label="WWW" value={<a href={`https://${selected.contact.www}`} target="_blank" rel="noreferrer">{selected.contact.www}</a>} />
                            </Section>

                            <Section key="repr" open={open.repr} title={<><BsPeople className="me-2"/> Reprezentacja</>} toggle={() => toggle('repr')}>
                                <table className="table table-hover mt-2">
                                    <thead className="table-dark">
                                    <tr>
                                        <th>Imię i nazwisko</th>
                                        <th>Funkcja</th>
                                        <th>Sposób reprezentacji</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {selected.repr.map((p,i) => (
                                        <tr key={i}>
                                            <td>{p.name}</td>
                                            <td>{p.role}</td>
                                            <td>{p.sposob}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </Section>
                        </>
                    )}

                    <div className="text-center mt-3">
                        <button
                            className="btn btn-primary px-4 me-2"
                            onClick={createProject}
                        >
                            Dodaj klienta
                        </button>
                        <button
                            className="btn btn-outline-primary px-4"
                        >
                            Zaktualizuj dane klienta
                        </button>
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
    <div className="row g-0 border-bottom">
        <div className="col-12 col-md-3 bg-light border-end p-2 fw-bold">{label}</div>
        <div className="col-12 col-md-3 p-2">{value}</div>
        {label2 && <>
            <div className="col-12 col-md-3 bg-light border-end p-2 fw-bold">{label2}</div>
            <div className="col-12 col-md-3 p-2">{value2}</div>
        </>}
    </div>
);

export default ProjectClient;
