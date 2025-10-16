import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {BsSearch} from "react-icons/bs";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5171";

function InformacjeMSB() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    // Filtrowanie lokalne
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((r) =>
            [r.standard, r.cele]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(q)));
    }, [rows, search]);

    // Pobieranie danych z API
    useEffect(() => {
            let alive = true;
            const fetchData = async () => {
                setLoading(true);
                setError("");

                try {
                    const res = await axios.get(`${API_BASE}/InformationMSB`);
                    if (!alive) return;

                    // Walidacja danych
                    if (Array.isArray(res.data)) {
                        setRows(res.data);
                    } else if (res.data && Array.isArray(res.data.rows)) {
                        setRows(res.data.rows);
                    } else {
                        throw new Error("Nieprawidłowy format danych z API");
                    }
                } catch (err) {
                    console.error("❌ Błąd API:", err);
                    if (alive)
                        setError(
                            "Nie udało się pobrać danych z API. Upewnij się, że serwer działa (np. json-server lub backend)."
                        );
                } finally {
                    if (alive) setLoading(false);
                }
            };

            fetchData();
            return () => {
                alive = false;
            };
        },
        []);

    return (
        <div className="d-flex min-vh-100">
            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: "hidden" }}>
                <div className="p-3 overflow-auto">
                    <div className="d-flex justify-content-between align-items-center mb-1 mt-1">
                        <h5 className="fw-semibold" style={{paddingLeft: "0.2rem", fontSize: "1.3rem"}}>
                            Wykaz MSB zastosowanych w badaniu
                        </h5>

                        {/* Pole wyszukiwania */}
                        <div className="input-group" style={{ maxWidth: "350px", marginBottom:"15px" }}>
                            <input
                                type="text"
                                placeholder="Szukaj standardu..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="form-control"
                            />
                            <span className="input-group-text"><BsSearch /></span>
                        </div>
                    </div>

                    {/* Stan ładowania */}
                    {loading && (
                        <div className="text-center text-secondary py-4">
                            <div className="spinner-border text-primary" role="status"></div>
                            <div className="mt-2">Ładowanie danych...</div>
                        </div>
                    )}

                    {/* Błąd */}
                    {error && (
                        <div className="alert alert-danger text-center" role="alert">
                            {error}
                        </div>
                    )}

                    {/* Tabela wyników */}
                    {!loading && !error && (
                        <div className="table-responsive">
                            <table
                                className="table table-bordered table-sm align-middle"
                                style={{ fontSize: "0.9rem", whiteSpace: "pre-wrap" }}
                            >
                                <thead>
                                <tr>
                                    <th style={{...headerStyle, width: "5%"}}>
                                        Lp.
                                    </th>
                                    <th style={{...headerStyle, width: "20%"}}>
                                        Numer i tytuł standardu
                                    </th>
                                    <th style={{...headerStyle, width: "15%"}}>
                                        Kiedy standard ma zastosowanie?
                                    </th>
                                    <th style={{...headerStyle, width: "45%"}}>
                                        Cel ogólny i cele cząstkowe biegłego rewidenta wg standardu
                                    </th>
                                    <th style={{...headerStyle,width: "15%"}}>
                                        Czy standard ma zastosowanie w badaniu?
                                    </th>
                                </tr>
                                </thead>

                                <tbody>
                                {filtered.map((r, index) => {
                                    if (r.type === "section") {
                                        return (
                                            <tr key={`section-${index}`}>
                                                <td
                                                    colSpan={5}
                                                    style={{
                                                        backgroundColor: "#005679",
                                                        color: "#fff",
                                                        padding: "0.75rem",
                                                    }}
                                                    className="fw-bold text-center"
                                                >
                                                    {r.title}
                                                </td>
                                            </tr>
                                        );
                                    }
                                    return (
                                        <tr key={r.lp || index}>
                                            <td className="text-center">{r.lp}</td>
                                            <td style={{ padding: "12px" }}>
                                                {r.link ? (
                                                    <a
                                                        href={r.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            textDecoration: "underline",
                                                            color: "#005679",
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        {r.standard}
                                                    </a>
                                                ) : (
                                                    r.standard
                                                )}
                                            </td>
                                            <td style={{ padding: "12px" }}>{r.zastosowanie}</td>
                                            <td style={{ padding: "12px" }}>{r.cele}</td>
                                            <td className="text-center fw-bold">{r.czy}</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InformacjeMSB;

const headerStyle = {textAlign: "center", verticalAlign: "middle", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem" };
