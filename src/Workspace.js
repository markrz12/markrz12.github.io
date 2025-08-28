import React, { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Notifications } from "./ui/Common";
import { BsHouse, BsPeople, BsFileText, BsFolder, BsPerson, BsGear } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function Workspace() {
    const [search, setSearch] = useState("");
    const [showAccount, setShowAccount] = useState(false);
    const menuRef = useRef(null);
    const btnRef = useRef(null);
    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    // Close on outside click
    useEffect(() => {
        function onDocClick(e) {
            if (!showAccount) return;
            const m = menuRef.current;
            const b = btnRef.current;
            if (m && !m.contains(e.target) && b && !b.contains(e.target)) {
                setShowAccount(false);
            }
        }
        function onKey(e) {
            if (e.key === 'Escape') setShowAccount(false);
        }
        document.addEventListener('mousedown', onDocClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDocClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [showAccount]);

    const handleLogout = () => {
        // Here you could clear auth state; for now just navigate to login
        navigate("/");
        setShowAccount(false);
    };

    return (
        <div className="d-flex min-vh-100" style={{ minHeight: '100vh' }}>
            {/* Sidebar */}
            <div
                className="d-flex flex-column text-white"
                style={{ width: "220px", flex: '0 0 220px', backgroundColor: "#0a2b4c", padding: "1rem" }}
            >
                <h5 style={{ marginBottom: 0, marginTop: 3 }}>Menu</h5>
                <hr style={{ borderColor: "#fff", marginTop: "0.8rem", marginBottom: "0.75rem" }} />

                {/* Pole wyszukiwania */}
                <div className="my-2" style={{ marginTop: "1rem" }}>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Wyszukaj..."
                        aria-label="Wyszukaj w menu"
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>

                {/* Linki menu */}
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <a className="nav-link text-white" href="#" aria-current="page" style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}><BsHouse className="me-2" /> Dashboard</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-white" href="/klienci"><BsPeople className="me-2" /> Klienci</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-white" href="/szablony"><BsFileText className="me-2" /> Szablony</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-white" href="/projekty"><BsFolder className="me-2" /> Projekty</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-white" href="/uzytkownicy"><BsPerson className="me-2" /> Użytkownicy</a>
                    </li>
                </ul>

                {/* Admin na dole */}
                <div className="mt-auto">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <a className="nav-link text-white" href="#"><BsGear className="me-2" /> Admin</a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Główna kolumna (Topbar + zawartość) */}
            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: 'hidden' }}>
                {/* Topbar */}
                <div className="shadow-sm"
                     style={{ backgroundColor: "#005679", padding: "0.5rem" }}>   {/* zmiana koloru */}
                    <div className="d-flex align-items-center justify-content-between px-4 py-2">
                    {/* Breadcrumb po lewej */}
                        <nav aria-label="breadcrumb">
                            <ol
                                className="breadcrumb mb-0"
                                style={{
                                    color: '#fff',
                                    ['--bs-breadcrumb-divider']: "'/'",
                                    ['--bs-breadcrumb-divider-color']: '#fff'
                                }}
                            >
                                <li className="breadcrumb-item"><a href="#" style={{ color: '#fff', textDecoration: 'underline' }}>Home</a></li>
                                <li className="breadcrumb-item"><a href="#" style={{ color: '#fff', textDecoration: 'underline' }}>Workspace</a></li>
                                <li className="breadcrumb-item active" aria-current="page" style={{ color: '#fff' }}>Dashboard</li>
                            </ol>
                        </nav>

                        {/* Ikony po prawej */}
                        <div className="d-flex align-items-center position-relative" style={{ gap: '0.25rem' }}>
                            {/* Notifications */}
                            <Notifications />
                            {/* Account */}
                            <button
                              ref={btnRef}
                              className="btn btn-link p-0 border-0"
                              aria-haspopup="menu"
                              aria-expanded={showAccount ? 'true' : 'false'}
                              onClick={() => setShowAccount((v) => !v)}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowAccount((v)=>!v);} }}
                              title="Konto"
                            >
                              <FaUserCircle size={24} color="#ffffff" />
                            </button>

                            {showAccount && (
                              <div
                                ref={menuRef}
                                className="card shadow-sm"
                                style={{ position: 'absolute', right: 0, top: '100%', marginTop: '0.5rem', minWidth: 220, zIndex: 2000 }}
                                role="menu"
                              >
                                <div className="card-body py-2">
                                  <div className="d-flex align-items-center mb-2">
                                    <FaUserCircle size={28} className="me-2" />
                                    <div>
                                      <div className="fw-semibold">Jan Użytkownik</div>
                                      <div className="text-muted small">jan@example.com</div>
                                    </div>
                                  </div>
                                  <hr className="my-2" />
                                  <button className="dropdown-item btn btn-link text-start w-100 px-0" onClick={() => setShowAccount(false)}>Profil</button>
                                  <button className="dropdown-item btn btn-link text-start w-100 px-0" onClick={() => setShowAccount(false)}>Ustawienia</button>
                                  <hr className="my-2" />
                                  <button className="dropdown-item btn btn-link text-start w-100 px-0 text-danger" onClick={handleLogout}>Wyloguj</button>
                                </div>
                              </div>
                            )}
                        </div>
                    </div>
                </div>


                {/* Główna zawartość */}
                <div className="flex-grow-1 p-4 bg-light">
                    <div className="container-fluid">
                        <h2 className="text-center mb-4" style={{ color: '#0a1a6a' }}>Witamy w systemie!</h2>

                        {/* Ostatnio odwiedzone miejsca */}
                        <h5 className="mb-2">Ostatnio odwiedzone miejsca</h5>
                        <div className="row g-3 mb-4">
                            {[{
                                name: 'ABC Sp. z o.o.', krs: '0000123456', nip: '1234567890', regon: '012345678'
                            }, { name: 'Nowa Firma S.A.', krs: '0000987654', nip: '9876543210', regon: '987654321' }, { name: 'Tech Solutions Sp. z o.o.', krs: '0000456123', nip: '5647382910', regon: '456123789' }].map((c, i) => (
                                <div className="col-12 col-md-6 col-lg-4" key={i}>
                                    <div className="card h-100 shadow-sm" style={{ borderColor: '#0a2b4c', borderWidth: 1, borderStyle: 'solid', borderRadius: 8 }}>
                                        <div className="card-header py-2" style={{ background: '#0a2b4c', color: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                                            <div className="fw-semibold">{c.name}</div>
                                        </div>
                                        <div className="card-body" style={{ background: '#f8fbff' }}>
                                            <div className="small text-muted">KRS: {c.krs}</div>
                                            <div className="small text-muted">NIP: {c.nip}</div>
                                            <div className="small text-muted">REGON: {c.regon}</div>
                                        </div>
                                        <div className="card-footer d-flex justify-content-end py-2" style={{ background: '#f8fbff', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                                            <button className="btn btn-sm btn-outline-primary">Otwórz</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Projekty */}
                        <h5 className="mb-2">Projekty</h5>
                        <div className="row g-3">
                          {[
                            { id: 'DR/2025/123456', progress: 70 },
                            { id: 'DR/2025/123454', progress: 90 },
                            { id: 'DR/2025/123453', progress: 30 },
                            { id: 'DR/2025/123457', progress: 55 },
                            { id: 'DR/2025/123458', progress: 15 },
                            { id: 'DR/2025/123459', progress: 82 },
                            { id: 'DR/2025/123460', progress: 44 },
                            { id: 'DR/2025/123461', progress: 63 },
                            { id: 'DR/2025/123462', progress: 5 }
                          ].map((p, i) => (
                            <div className="col-12 col-md-6 col-xl-4" key={i}>
                              <div className="card h-100 shadow-sm" style={{ borderColor: '#0a2b4c', borderWidth: 1, borderStyle: 'solid', borderRadius: 10 }}>
                                <div className="card-body d-flex align-items-center" style={{ gap: '0.75rem' }}>
                                  <a href="#" className="text-decoration-underline" aria-label={`Projekt ${p.id}`}>{p.id}</a>
                                  <div
                                    className="flex-grow-1 position-relative"
                                    role="progressbar"
                                    aria-valuenow={p.progress}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    style={{
                                      height: 14,
                                      background: '#eaf0f6',
                                      borderRadius: 999,
                                      border: '1px solid #d2dbea',
                                      boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.04)'
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: `${p.progress}%`,
                                        height: '100%',
                                        borderRadius: 999,
                                        background: '#005679',
                                        transition: 'width 300ms ease',
                                        position: 'relative'
                                      }}
                                    >
                                      <span style={{ position:'absolute', right: -2, top: -2, bottom: -2, width: 4, background:'#ffffff55', borderRadius: 2 }} />
                                    </div>
                                  </div>
                                  <div className="small text-muted" style={{ width: 42, textAlign: 'right' }}>{p.progress}%</div>
                                  <button className="btn btn-sm btn-outline-secondary" title=">" aria-label={`> projekt ${p.id}`}>▾</button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Workspace;