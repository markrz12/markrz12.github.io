import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, Topbar } from "../../ui/Common";
import { BsSearch, BsFileText, BsDashSquare, BsPeople, BsGeoAlt, BsEnvelope, BsXLg } from "react-icons/bs";

function ProjectClient() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    return (
        <div className="d-flex min-vh-100">
            <Sidebar search={search} setSearch={setSearch} />

            <div className="flex-grow-1 d-flex flex-column">
                <Topbar
                    breadcrumb={[
                        { label: "Home", to: "/" },
                        { label: "Workspace", to: "/workspace" },
                        { label: "Projekty", to: "/projekty" },
                        { label: "Projekt: Klient", active: true },
                    ]}
                />

                <div className="flex-grow-1 bg-light d-flex pt-3 px-3">
                    <ProjectClientForm onCreate={() => navigate("/projekty")} />
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

    const toggle = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

    // Mock danych KRS
    const DATA = useMemo(
        () => [
            {
                name: "Acme Retail Sp. z o.o. (DEMO)",
                reg: "Rejestr Przedsiębiorców",
                krs: "0000000001",
                nip: "0000000000",
                regon: "00000000000000",
                form: "SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ",
                rps: { wpis: "01.01.2020", wykreslenie: "-", ostatniaZmiana: "01.06.2025" },
                zaw: { od: "-", do: "-" },
                addr: {
                    kraj: "POLSKA",
                    woj: "lubelskie",
                    powiat: "Nowy Powiat",
                    gmina: "Nowa Gmina",
                    miejscowosc: "Nowe Miasto",
                    ulica: "ul. Przykładowa",
                    nrDomu: "1",
                    kod: "00-000",
                },
                contact: {
                    email: "kontakt@example.com",
                    phone: "+48 11 111 11 11",
                    www: "www.example.com",
                },
                repr: [{ name: "Jan Demo", role: "Prezes Zarządu", sposob: "samodzielnie" }],
            },
            {
                name: "Tech Solutions Demo Sp. z o.o.",
                reg: "Rejestr Przedsiębiorców",
                krs: "0000000002",
                nip: "0000000001",
                regon: "00000000000001",
                form: "SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ",
                rps: { wpis: "12.03.2020", wykreslenie: "-", ostatniaZmiana: "10.01.2025" },
                zaw: { od: "01.02.2020", do: "31.05.2020" },
                addr: {
                    kraj: "POLSKA",
                    woj: "mazowieckie",
                    powiat: "m.st. Warszawa",
                    gmina: "Warszawa",
                    miejscowosc: "Warszawa",
                    ulica: "ul. Prosta",
                    nrDomu: "51",
                    kod: "00-838",
                },
                contact: {
                    email: "biuro@example.com",
                    phone: "+48 22 123 45 67",
                    www: "www.example.com",
                },
                repr: [
                    { name: "Anna Przykład", role: "Prezes Zarządu", sposob: "samodzielnie" },
                    { name: "Marek Wzór", role: "Członek Zarządu", sposob: "łącznie z Prezesem" },
                ],
            },
            {
                name: "Alfa Energia Demo S.A.",
                reg: "Rejestr Przedsiębiorców",
                krs: "0000000003",
                nip: "0000000002",
                regon: "000000002",
                form: "SPÓŁKA AKCYJNA",
                rps: { wpis: "21.11.2021", wykreslenie: "-", ostatniaZmiana: "03.06.2025" },
                zaw: { od: "-", do: "-" },
                addr: {
                    kraj: "POLSKA",
                    woj: "śląskie",
                    powiat: "Katowice",
                    gmina: "Katowice",
                    miejscowosc: "Katowice",
                    ulica: "al. Korfantego",
                    nrDomu: "2",
                    kod: "40-004",
                },
                contact: {
                    email: "kontakt@example.com",
                    phone: "+48 32 222 11 00",
                    www: "www.example.com",
                },
                repr: [
                    { name: "Tomasz Próbny", role: "Prezes", sposob: "samodzielnie" },
                    { name: "Ewa Testowa", role: "Wiceprezes", sposob: "łącznie z Prezesem" },
                ],
            },
        ],
        []
    );

    useEffect(() => {
        if (!selected) setSelected(DATA[0]);
    }, [selected, DATA]);

    useEffect(() => {
        const q = krsQuery.trim().toLowerCase();
        if (!q) return setSuggestions([]);
        const res = DATA.filter((e) =>
            [e.name, e.nip, e.krs, e.regon].some((v) =>
                String(v).toLowerCase().includes(q)
            )
        ).slice(0, 5);
        setSuggestions(res);
    }, [krsQuery, DATA]);

    const fetchFromKRS = () => {
        if (suggestions.length > 0) return setSelected(suggestions[0]);
        const idx = selected ? (DATA.findIndex((d) => d === selected) + 1) % DATA.length : 0;
        setSelected(DATA[idx]);
    };

    const entity = selected || DATA[0];

    const createProject = () => {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 900000 + 100000);
        const projectCode = `DR/${year}/${random}`;
        alert(`Projekt utworzony: ${projectCode}`);
        onCreate(projectCode);
    };

    return (
        <div className="container-fluid" style={{ maxWidth: 980 }}>
            <div className="card shadow-sm">
                <div className="card-body">
                    {/* Wyszukiwanie klienta */}
                    <div className="mt-2">
                        <h5 className="fw-semibold mb-2" style={{paddingLeft: "0.2rem"}}>
                            Moduł dodawania klienta
                        </h5>
                        <div className="d-flex flex-column flex-sm-row align-items-start gap-3 mt-3">
                            <div className="position-relative w-100 " style={{ maxWidth: 520 }}>
                                <div className="input-group">
                                    <span className="input-group-text"><BsSearch /></span>
                                    <input
                                        aria-label="Podaj nazwę firmy, NIP, KRS lub REGON"
                                        className="form-control"
                                        placeholder="Podaj nazwę firmy, NIP lub KRS lub REGON"
                                        value={krsQuery}
                                        onChange={(e) => setKrsQuery(e.target.value)}
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
                            <button className="btn btn-outline-secondary" onClick={fetchFromKRS}>
                                Pobierz dane z KRS
                            </button>
                        </div>
                    </div>

                    <hr />

                    {/* Sekcje danych */}
                    {[
                        { key: "rps", title: <><BsFileText className="me-2"/> Dane podmiotu</>, content: (
                                <>
                                    <Row label="Nazwa" value={entity.name} />
                                    <Row label="Rejestr" value={entity.reg} />
                                    <Row label="Numer KRS" value={entity.krs} label2="NIP" value2={entity.nip} />
                                    <Row label="REGON" value={entity.regon} label2="Forma prawna" value2={entity.form} />
                                </>
                            ) },
                        { key: "wyk", title: <><BsXLg className="me-2"/> "Wykreślenie z KRS"</>,
                            content: <Row label="Data wykreślenia" value={entity.rps.wykreslenie || "-"} /> },
                        { key: "zaw", title: <><BsDashSquare className="me-2"/> "Zawieszenie / wznowienie działalności"</>, content: <Row label="Zawieszenie od" value={entity.zaw.od || "-"} label2="Wznowienie od" value2={entity.zaw.do || "-"} /> },
                        { key: "addr", title: <><BsGeoAlt className="me-2"/> Siedziba i adres</>, content: Object.entries(entity.addr).map(([k,v]) => <Row key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} value={v} />) },
                        { key: "contact", title: <><BsEnvelope className="me-2"/> Dane kontaktowe</>, content: (
                                <>
                                    <Row label="Email" value={<a href={`mailto:${entity.contact.email}`}>{entity.contact.email}</a>} />
                                    <Row label="Telefon" value={entity.contact.phone} />
                                    <Row label="WWW" value={<a href={`https://${entity.contact.www}`} target="_blank" rel="noreferrer">{entity.contact.www}</a>} />
                                </>
                            ) },
                        { key: "repr", title: <><BsPeople className="me-2"/> Członkowie reprezentacji</>, content: (
                                <table className="table table-hover mt-2">
                                    <thead className="table-dark">
                                    <tr>
                                        <th>Imię i nazwisko</th>
                                        <th>Funkcja</th>
                                        <th>Sposób reprezentacji</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {entity.repr.map((p,i) => (
                                        <tr key={i}>
                                            <td>{p.name}</td>
                                            <td>{p.role}</td>
                                            <td>{p.sposob}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) },
                    ].map(sec => <Section key={sec.key} open={open[sec.key]} title={sec.title} toggle={() => toggle(sec.key)}>{sec.content}</Section>)}

                    <div className="text-center mt-3">
                        <button className="btn btn-primary px-4" onClick={createProject}>
                            Utwórz projekt
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
