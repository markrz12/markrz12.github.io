import React, { useEffect, useRef, useState } from "react";
import { Sidebar, Topbar } from "../ui/Common";
import { useNavigate, Link } from "react-router-dom";

function Workspace() {
    const [search, setSearch] = useState("");
    const [showAccount, setShowAccount] = useState(false);
    const menuRef = useRef(null);
    const btnRef = useRef(null);
    const navigate = useNavigate();

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
            {/* Sidebar (common) */}
            <Sidebar search={search} setSearch={setSearch} />

            {/* Główna kolumna (Topbar + zawartość) */}
            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: 'hidden' }}>
                {/* Topbar (common) */}
                <Topbar
                  breadcrumb={[
                    { label: 'Home', to: '/' },
                    { label: 'Workspace', to: '/workspace' },
                    { label: 'Dashboard', active: true }
                  ]}
                  accountBtnRef={btnRef}
                  accountMenuRef={menuRef}
                  showAccount={showAccount}
                  setShowAccount={setShowAccount}
                  onLogout={handleLogout}
                />


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
                                    <div className="card h-100 shadow-sm" style={{ borderColor: 'var(--ndr-navy)', borderWidth: 1, borderStyle: 'solid', borderRadius: 8 }}>
                                        <div className="card-header py-2" style={{ background: 'var(--ndr-navy)', color: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
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
                              <div className="card h-100 shadow-sm" style={{ borderColor: 'var(--ndr-navy)', borderWidth: 1, borderStyle: 'solid', borderRadius: 10 }}>
                                <div className="card-body d-flex align-items-center" style={{ gap: '0.75rem' }}>
                                  <Link to={`/projekty/${encodeURIComponent(p.id)}`} className="text-decoration-underline" aria-label={`Projekt ${p.id}`}>{p.id}</Link>
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
                                        background: 'var(--ndr-bg-topbar)',
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

                        {/* Recently Uploaded Entity Documents */}
                        <div className="mt-4">
                          <div className="mb-2">
                            {/* Użyj nagłówka sekcji, aby tytuł i akcja były w jednej linii i nie zawijały się niezgrabnie */}
                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                              <h5 className="mb-0">Ostatnio przesłane dokumenty</h5>
                              <Link to="/projekty" className="small text-decoration-underline" style={{ whiteSpace:'nowrap' }}>Zobacz wszystkie</Link>
                            </div>
                          </div>
                        </div>
                        <div className="card shadow-sm">
                          <ul className="list-group list-group-flush">
                            {[{
                              name:'Employee master.csv', date:'24/09/2024', entity:'Entity Name', type:'Procurement'
                            },{
                              name:'Strategy.pdf', date:'24/09/2024', entity:'Entity Name', type:'HR'
                            },{
                              name:'Financial Statement.pdf', date:'21/09/2024', entity:'Entity Name', type:'Finance'
                            }].map((d, i)=> (
                              <li key={i} className="list-group-item d-flex align-items-center" style={{ gap:'0.75rem' }}>
                                <div className="d-flex align-items-center flex-grow-1" style={{ gap:'0.75rem' }}>
                                  <span className="badge bg-light text-dark border">PDF</span>
                                  <div className="me-auto">
                                    <div className="fw-semibold small">{d.name}</div>
                                    <div className="text-muted small">{d.date}</div>
                                  </div>
                                </div>
                                <button className="btn btn-sm btn-outline-secondary btn-square-sm" title="Pobierz" aria-label={`Pobierz ${d.name}`}>⤓</button>
                              </li>
                            ))}
                          </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Workspace;