import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Sidebar, Topbar } from "../../ui/Common";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const API_BASE = process.env.REACT_APP_API_BASE || "http://kkrzeminski-nuc:8080/api"

// Create Axios instance with auth interceptor
const api = axios.create({
    baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
    const token = Cookies.get("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

function Templates() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [showEdit, setShowEdit] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({ name: "", url: "" });
    const [showDelete, setShowDelete] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ✅ Fetch templates safely
    useEffect(() => {
        let alive = true;
        setLoading(true);
        setError("");

        api
            .get("/templates")
            .then((res) => {
                if (!alive) return;
                const data = res.data;

                // ✅ Extract the array correctly
                const arr = Array.isArray(data)
                    ? data
                    : Array.isArray(data.content)
                        ? data.content
                        : [];

                setRows(arr);
            })
            .catch((err) => {
                if (!alive) return;
                console.error("API error:", err);
                if (err.response?.status === 401) {
                    Cookies.remove("authToken");
                    navigate("/login");
                } else {
                    setError("Nie udało się pobrać listy szablonów. Sprawdź połączenie z API.");
                }
            })
            .finally(() => alive && setLoading(false));

        return () => {
            alive = false;
        };
    }, [navigate]);

    // ✅ Search filter
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((r) =>
            [r.code, r.url].some((v) => String(v || "").toLowerCase().includes(q))
        );
    }, [rows, search]);


    async function handleAdd() {
        const code = (form?.code || "").trim();
        const url = (form?.url || "").trim();

        if (!code) return alert("Podaj nazwę (code)");
        if (!url) return alert("Podaj URL");

        const newTemplate = { code, url };

        try {
            const res = await api.post("/templates", newTemplate);
            const created = res.data || newTemplate;
            setRows((prev) => [...prev, created]);
            setShowAdd(false);
            setForm({ code: "", url: "" });
        } catch (err) {
            console.error(err);
            alert("Nie udało się dodać szablonu.");
        }
    }

    // ✅ Edit template
    async function handleSaveEdit() {
        if (!editItem) return;
        const code = form.code.trim();
        const url = form.url.trim();
        if (!code || !url) return alert("Wypełnij wszystkie pola");

        const updated = { ...editItem, code, url };
        try {
            const res = await api.put(`/templates/${editItem.id}`, updated);
            const saved = res.data || updated;
            setRows((prev) =>
                prev.map((r) => (r.id === editItem.id ? saved : r))
            );
            setShowEdit(false);
            setEditItem(null);
        } catch (err) {
            console.error(err);
            alert("Nie udało się zapisać zmian.");
        }
    }

    // ✅ Delete template
    async function handleConfirmDelete() {
        if (!deleteItem) return;
        try {
            await api.delete(`/templates/${deleteItem.id}`);
            setRows((prev) => prev.filter((r) => r.id !== deleteItem.id));
            setShowDelete(false);
            setDeleteItem(null);
        } catch (err) {
            console.error(err);
            alert("Nie udało się usunąć szablonu.");
        }
    }

    return (
        <div className="d-flex min-vh-100" style={{ minHeight: "100vh" }}>
            <Sidebar search={search} setSearch={setSearch} />

            {/* Main column */}
            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: "hidden" }}>
                <Topbar
                    breadcrumb={[
                        { label: "Workspace", to: "/workspace" },
                        { label: "Szablony", active: true },
                    ]}
                />

                {/* Content */}
                <div
                    className="flex-grow-1 bg-light d-flex pt-2 px-2"
                    style={{ minHeight: 0, padding: "0.75rem 1rem" }}
                >
                    <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
                        <div
                            className="card shadow-sm h-100 d-flex flex-column"
                            style={{ overflow: "hidden" }}
                        >
                            <div
                                className="card-header"
                                style={{ backgroundColor: "#0a2b4c", color: "#ffffff" }}
                            >
                                <div
                                    className="d-flex align-items-center justify-content-between"
                                    style={{ padding: "0.5rem 0.3rem" }}
                                >
                                    <strong style={{ fontSize: "1.1rem" }}>Lista szablonów</strong>
                                </div>
                            </div>

                            <div className="table-responsive flex-grow-1" style={{ overflow: "auto" }}>
                                <table
                                    className="table table-hover table-sm mb-0 align-middle"
                                    style={{ fontSize: "0.9rem" }}
                                >
                                    <thead
                                        className="table-light"
                                        style={{
                                            position: "sticky",
                                            top: 0,
                                            zIndex: 1,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                    <tr>
                                        <th style={headerStyle}>Nazwa</th>
                                        <th style={headerStyle}>Źródło</th>
                                        <th style={headerStyle}>Akcje</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {loading && (
                                        <tr>
                                            <td colSpan={3} className="text-center text-muted py-4">
                                                Ładowanie...
                                            </td>
                                        </tr>
                                    )}
                                    {error && !loading && (
                                        <tr>
                                            <td colSpan={3} className="text-center text-danger py-4">
                                                {error}
                                            </td>
                                        </tr>
                                    )}
                                    {!loading && !error && Array.isArray(filtered) && filtered.length > 0 ? (
                                        filtered.map((r) => (
                                            <tr key={r.id}>
                                                <td style={tdDescription}>{r.code}</td>
                                                <td style={tdDescription}>
                                                    <a href={r.url}>
                                                        {r.url}
                                                    </a>
                                                </td>
                                                <td style={tdDescription}>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                        onClick={() => {
                                                            setEditItem(r);
                                                            setForm({ code: r.code, url: r.url });
                                                            setShowEdit(true);
                                                        }}
                                                    >
                                                        Edytuj
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => {
                                                            setDeleteItem(r);
                                                            setShowDelete(true);
                                                        }}
                                                    >
                                                        Usuń
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        !loading && !error && (
                                            <tr>
                                                <td colSpan={3} className="text-center text-muted py-4">
                                                    Brak wyników
                                                </td>
                                            </tr>
                                        )
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right panel */}
                    <div className="d-none d-lg-block" style={{ width: 360, paddingLeft: 12 }}>
                        <div
                            className="card shadow-sm h-100 d-flex flex-column"
                            style={{ overflow: "hidden" }}
                        >
                            <div className="text-center mb-2">
                                <button
                                    className="btn btn-success w-100"
                                    onClick={() => setShowAdd(true)}
                                    style={{ whiteSpace: "nowrap", minWidth: 220 }}
                                >
                                    Dodaj szablon
                                </button>
                            </div>
                            <div
                                className="card-header"
                                style={{
                                    padding: "0.6rem 1rem",
                                    fontSize: "1rem",
                                    backgroundColor: "#0a2b4c",
                                    color: "#ffffff",
                                }}
                            >
                                <strong>Informacje</strong>
                            </div>
                            <div className="card-body small" style={{ overflowY: "auto" }}>
                                <p className="mb-2">
                                    Szablony dokumentów używane w projektach. Kliknij link Źródło,
                                    aby otworzyć wzór w zewnętrznym serwisie.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modals */}
                {/* Edit modal */}
                {showEdit && (
                    <Modal
                        title="Edytuj szablon"
                        onClose={() => setShowEdit(false)}
                        onConfirm={handleSaveEdit}
                        confirmText="Zapisz"
                    >
                        <div className="mb-2">
                            <label className="form-label mb-1">Nazwa (code)</label>
                            <input
                                className="form-control"
                                value={form.code || ""}
                                onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="form-label mb-1">Adres Źródła (URL)</label>
                            <input
                                className="form-control"
                                value={form.url || ""}
                                onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                            />
                        </div>
                    </Modal>
                )}

                {/* Delete modal */}
                {showDelete && (
                    <Modal
                        title="Usuń szablon"
                        onClose={() => setShowDelete(false)}
                        onConfirm={handleConfirmDelete}
                        confirmText="Usuń"
                        confirmClass="btn-danger"
                    >
                        <p>Czy na pewno chcesz usunąć szablon:</p>
                        <p>
                            <strong>{deleteItem?.code}</strong>?
                        </p>
                    </Modal>
                )}

                {/* Add modal */}
                {showAdd && (
                    <Modal
                        title="Dodaj szablon"
                        onClose={() => setShowAdd(false)}
                        onConfirm={handleAdd}
                        confirmText="Dodaj"
                    >
                        <div className="mb-2">
                            <label className="form-label mb-1">Nazwa</label>
                            <input
                                className="form-control"
                                value={form.code || ""}
                                onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="form-label mb-1">Adres Źródła (URL)</label>
                            <input
                                className="form-control"
                                value={form.url || ""}
                                onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                            />
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    );
}

function Modal({ title, onClose, onConfirm, children, confirmText, confirmClass }) {
    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ background: "rgba(0,0,0,0.35)", zIndex: 1050 }}
            onClick={onClose}
        >
            <div
                className="card shadow"
                style={{ maxWidth: 520, margin: "10vh auto" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="card-header d-flex justify-content-between align-items-center">
                    <strong>{title}</strong>
                    <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
                        Zamknij
                    </button>
                </div>
                <div className="card-body">{children}</div>
                <div className="card-footer d-flex justify-content-end gap-2">
                    <button className="btn btn-light" onClick={onClose}>
                        Anuluj
                    </button>
                    <button className={`btn ${confirmClass || "btn-primary"}`} onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

const headerStyle = {
    border: "1px solid #dee2e6",
    paddingLeft: "1rem",
    backgroundColor: "#0a2b4c",
    color: "#ffffff",
    padding: "0.75rem",
};
const tdDescription = {
    border: "1px solid #dee2e6",
    fontSize: "0.9rem",
    paddingLeft: "1rem",
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
};

export default Templates;
