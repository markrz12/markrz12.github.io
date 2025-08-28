import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { Sidebar, Topbar } from "./ui/Common";
import { BsHouse, BsPeople, BsFileText, BsFolder, BsPerson, BsGear } from "react-icons/bs";

function Klienci() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", nip: "", krs: "", regon: "" });
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", nip: "", krs: "", regon: "" });
  const [editTargetId, setEditTargetId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteTargetName, setDeleteTargetName] = useState("");

  // account menu state
  const [showAccount, setShowAccount] = useState(false);
  const accountMenuRef = useRef(null);
  const accountBtnRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onDocClick(e){
      if (!showAccount) return;
      const m = accountMenuRef.current;
      const b = accountBtnRef.current;
      if (m && !m.contains(e.target) && b && !b.contains(e.target)) {
        setShowAccount(false);
      }
    }
    function onKey(e){ if (e.key === 'Escape') setShowAccount(false); }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [showAccount]);

  const handleLogout = () => { navigate('/'); setShowAccount(false); };

  const initialClients = useMemo(
    () => [
      { id: 1, name: "Alphatech Sp. z o.o.", nip: "521-123-45-67", krs: "0000123456", regon: "012345678", city: "Warszawa" },
      { id: 2, name: "BetaConsulting S.A.", nip: "676-234-56-78", krs: "0000234567", regon: "023456789", city: "Kraków" },
      { id: 3, name: "Gamma Logistics", nip: "851-345-67-89", krs: "0000345678", regon: "034567890", city: "Gdańsk" },
      { id: 4, name: "Delta Finance", nip: "897-456-78-90", krs: "0000456789", regon: "045678901", city: "Wrocław" },
      { id: 5, name: "Epsilon Media", nip: "778-567-89-01", krs: "0000567890", regon: "056789012", city: "Poznań" },
      { id: 6, name: "Zeta Health", nip: "725-678-90-12", krs: "0000678901", regon: "067890123", city: "Łódź" },
      { id: 7, name: "Eta Foods", nip: "954-789-01-23", krs: "0000789012", regon: "078901234", city: "Katowice" },
      { id: 8, name: "Theta Energy", nip: "813-890-12-34", krs: "0000890123", regon: "089012345", city: "Rzeszów" },
      { id: 9, name: "Iota Systems", nip: "851-901-23-45", krs: "0000901234", regon: "090123456", city: "Szczecin" },
      { id: 10, name: "Kappa Motors", nip: "967-012-34-56", krs: "0001012345", regon: "101234567", city: "Bydgoszcz" },
      { id: 11, name: "Lambda Retail", nip: "713-123-45-67", krs: "0001123456", regon: "112345678", city: "Lublin" },
      { id: 12, name: "Mu Build", nip: "586-234-56-78", krs: "0001234567", regon: "123456789", city: "Gdynia" },
      { id: 13, name: "Nu Pharma", nip: "525-345-67-89", krs: "0001345678", regon: "134567890", city: "Białystok" },
      { id: 14, name: "Xi Travel", nip: "675-456-78-90", krs: "0001456789", regon: "145678901", city: "Sopot" },
      { id: 15, name: "Omicron Labs", nip: "821-567-89-01", krs: "0001567890", regon: "156789012", city: "Toruń" },
      { id: 16, name: "Pi Security", nip: "973-678-90-12", krs: "0001678901", regon: "167890123", city: "Opole" },
      { id: 17, name: "Rho Telecom", nip: "959-789-01-23", krs: "0001789012", regon: "178901234", city: "Kielce" },
      { id: 18, name: "Sigma Agro", nip: "739-890-12-34", krs: "0001890123", regon: "189012345", city: "Olsztyn" },
      { id: 19, name: "Tau Steel", nip: "631-901-23-45", krs: "0001901234", regon: "190123456", city: "Gliwice" },
      { id: 20, name: "Upsilon Design", nip: "524-012-34-56", krs: "0002012345", regon: "201234567", city: "Zabrze" },
    ],
    []
  );
  const [clients, setClients] = useState(initialClients);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) =>
      [c.name, c.nip, c.krs, c.regon, c.city].some((v) => String(v).toLowerCase().includes(q))
    );
  }, [clients, search]);

  const selectedClient = useMemo(
    () => clients.find((c) => c.id === selectedId) || null,
    [clients, selectedId]
  );

  // Helper to generate fake details for the right panel
  const deriveDetails = (c) => {
    if (!c) return null;
    const slug = String(c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
    const city = c.city && c.city !== '—' ? c.city : 'Warszawa';
    return {
      addressLines: [
        `ul. Nowa 12, 00-123 ${city}`,
        `22 123 45 6${c.id % 10}`,
        `kontakt@example.com`,
        `www.example.com`,
      ],
      contacts: [
        { name: 'Jan Demo', role: 'Prezes (CEO)', phone: '22 123 45 67', email: 'jan.demo@example.com' },
        { name: 'Maria Demo', role: 'Dyrektor Finansowy', phone: '22 123 45 68', email: 'maria.demo@example.com' },
        { name: 'Tomasz Demo', role: 'Kierownik IT', phone: '22 123 45 69', email: 'tomasz.demo@example.com' },
      ],
      projects: [
        { id: `DR/2025/${123000 + c.id}`, href: `#proj-${c.id}-1` },
        { id: `DR/2025/${123300 + c.id}`, href: `#proj-${c.id}-2` },
      ],
    };
  };

  return (
    <div className="d-flex min-vh-100" style={{ minHeight: '100vh' }}>
      <Sidebar search={search} setSearch={setSearch} />

      {/* Główna kolumna (Topbar + zawartość) */}
      <div className="flex-grow-1 d-flex flex-column" style={{ overflow: 'hidden' }}>
        <Topbar
          breadcrumb={[{label:'Home', to:'/'},{label:'Workspace', to:'/workspace'},{label:'Klienci', active:true}]}
          accountBtnRef={accountBtnRef}
          accountMenuRef={accountMenuRef}
          showAccount={showAccount}
          setShowAccount={setShowAccount}
          onLogout={handleLogout}
        />

        {/* Główna zawartość: lewy panel (tabela) + prawy panel (szczegóły) */}
        <div className="flex-grow-1 bg-light d-flex flex-column" style={{ minHeight: 0, padding: '0.75rem 1rem' }}>
          <div className="flex-grow-1 d-flex h-100" style={{ minHeight: 0 }}>
            {/* Lewa kolumna: tabela */}
            <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: 0, minWidth: 0 }}>
              <div className="card shadow-sm h-100 d-flex flex-column" style={{ overflow: 'hidden', minHeight: 0 }}>
                <div className="card-header d-flex align-items-center justify-content-between" style={{ gap: '0.5rem' }}>
                  <div className="d-flex align-items-center gap-2">
                    <strong>Lista klientów</strong>
                  </div>
                  <div className="d-flex align-items-center ms-auto" style={{ gap: '0.5rem' }}>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Podaj nazwę firmy, NIP, KRS lub REGON"
                      aria-label="Filtruj listę klientów po nazwie, NIP, KRS lub REGON"
                      style={{ width: '100%', minWidth:270 }}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                      className="btn btn-success"
                      style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                      onClick={() => setShowAdd(true)}
                    >
                      Dodaj klienta
                    </button>
                  </div>
                </div>

                {/* Modal dodawania klienta */}
                {showAdd && (
                  <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background: "rgba(0,0,0,0.35)", zIndex: 1050 }} onClick={() => setShowAdd(false)}>
                    <div className="card shadow" style={{ maxWidth: 520, margin: "10vh auto", padding: 0, maxHeight: "80vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <strong>Dodaj klienta</strong>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowAdd(false)}>Zamknij</button>
                      </div>
                      <div className="card-body" style={{ overflow: "auto" }}>
                        <div className="row g-2">
                          <div className="col-12">
                            <label className="form-label mb-1">Nazwa</label>
                            <input className="form-control" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} placeholder="np. ACME Sp. z o.o." />
                          </div>
                          <div className="col-6">
                            <label className="form-label mb-1">NIP</label>
                            <input className="form-control" value={form.nip} onChange={(e)=>setForm({...form, nip: e.target.value})} placeholder="xxx-xxx-xx-xx" />
                          </div>
                          <div className="col-6">
                            <label className="form-label mb-1">KRS</label>
                            <input className="form-control" value={form.krs} onChange={(e)=>setForm({...form, krs: e.target.value})} placeholder="XXXXXXXXXX" />
                          </div>
                          <div className="col-12">
                            <label className="form-label mb-1">REGON</label>
                            <input className="form-control" value={form.regon} onChange={(e)=>setForm({...form, regon: e.target.value})} placeholder="XXXXXXXXX" />
                          </div>
                        </div>
                      </div>
                      <div className="card-footer d-flex justify-content-end gap-2">
                        <button className="btn btn-light" onClick={() => setShowAdd(false)}>Anuluj</button>
                        <button className="btn btn-primary" onClick={() => {
                          const name = form.name.trim();
                          if (!name) { alert('Wpisz nazwę firmy'); return; }
                          // simple duplicate NIP check if provided
                          if (form.nip && clients.some(c => c.nip === form.nip)) { alert('Taki NIP już istnieje'); return; }
                          const newId = (clients[clients.length-1]?.id || 0) + 1;
                          const newClient = { id: newId, name, nip: form.nip.trim(), krs: form.krs.trim(), regon: form.regon.trim(), city: '—' };
                          setClients([...clients, newClient]);
                          setSelectedId(newId);
                          setForm({ name: "", nip: "", krs: "", regon: "" });
                          setShowAdd(false);
                        }}>Zapisz</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal edycji klienta */}
                {showEdit && (
                  <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background: "rgba(0,0,0,0.35)", zIndex: 1050 }} onClick={() => setShowEdit(false)}>
                    <div className="card shadow" style={{ maxWidth: 520, margin: "10vh auto", padding: 0, maxHeight: "80vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <strong>Edytuj klienta</strong>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowEdit(false)}>Zamknij</button>
                      </div>
                      <div className="card-body" style={{ overflow: "auto" }}>
                        <div className="row g-2">
                          <div className="col-12">
                            <label className="form-label mb-1">Nazwa</label>
                            <input className="form-control" value={editForm.name} onChange={(e)=>setEditForm({...editForm, name: e.target.value})} placeholder="np. ACME Sp. z o.o." />
                          </div>
                          <div className="col-6">
                            <label className="form-label mb-1">NIP</label>
                            <input className="form-control" value={editForm.nip} onChange={(e)=>setEditForm({...editForm, nip: e.target.value})} placeholder="xxx-xxx-xx-xx" />
                          </div>
                          <div className="col-6">
                            <label className="form-label mb-1">KRS</label>
                            <input className="form-control" value={editForm.krs} onChange={(e)=>setEditForm({...editForm, krs: e.target.value})} placeholder="XXXXXXXXXX" />
                          </div>
                          <div className="col-12">
                            <label className="form-label mb-1">REGON</label>
                            <input className="form-control" value={editForm.regon} onChange={(e)=>setEditForm({...editForm, regon: e.target.value})} placeholder="XXXXXXXXX" />
                          </div>
                        </div>
                      </div>
                      <div className="card-footer d-flex justify-content-end gap-2">
                        <button className="btn btn-light" onClick={() => setShowEdit(false)}>Anuluj</button>
                        <button className="btn btn-primary" onClick={() => {
                          const name = editForm.name.trim();
                          if (!name) { alert('Wpisz nazwę firmy'); return; }
                          if (editForm.nip && clients.some(c => c.id !== editTargetId && c.nip === editForm.nip)) { alert('Taki NIP już istnieje'); return; }
                          setClients(prev => prev.map(c => c.id === editTargetId ? { ...c, name, nip: editForm.nip.trim(), krs: editForm.krs.trim(), regon: editForm.regon.trim() } : c));
                          // keep selection same; if none, select edited
                          if (!selectedId) setSelectedId(editTargetId);
                          setShowEdit(false);
                        }}>Zapisz zmiany</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal usuwania klienta */}
                {showDelete && (
                  <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background: "rgba(0,0,0,0.35)", zIndex: 1050 }} onClick={() => setShowDelete(false)}>
                    <div className="card shadow" style={{ maxWidth: 460, margin: "15vh auto", padding: 0 }} onClick={(e) => e.stopPropagation()}>
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <strong>Usuń klienta</strong>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowDelete(false)}>Zamknij</button>
                      </div>
                      <div className="card-body">
                        <p className="mb-2">Czy na pewno chcesz usunąć klienta:</p>
                        <p className="mb-0"><strong>{deleteTargetName}</strong>?</p>
                      </div>
                      <div className="card-footer d-flex justify-content-end gap-2">
                        <button className="btn btn-light" onClick={() => setShowDelete(false)}>Anuluj</button>
                        <button className="btn btn-danger" onClick={() => {
                          setClients(prev => prev.filter(c => c.id !== deleteTargetId));
                          if (selectedId === deleteTargetId) setSelectedId(null);
                          setShowDelete(false);
                        }}>Usuń</button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="table-responsive flex-grow-1" style={{ overflow: 'auto', minHeight: 0, flexBasis: 0 }} >
                  <table className="table table-hover table-sm mb-0 align-middle" style={{ fontSize:'0.9rem' }}>
                    <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 1, whiteSpace:'nowrap' }}>
                      <tr>
                        <th style={{ width: 40 }}>#</th>
                        <th>Nazwa</th>
                        <th>NIP</th>
                        <th>KRS</th>
                        <th>REGON</th>
                        <th>Akcje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((c, idx) => (
                        <tr
                          key={c.id}
                          onClick={() => setSelectedId(c.id)}
                          style={{ cursor: "pointer", backgroundColor: c.id === selectedId ? "#e7f1ff" : undefined }}
                        >
                          <td>{idx + 1}</td>
                          <td>{c.name}</td>
                          <td>{c.nip}</td>
                          <td>{c.krs}</td>
                          <td>{c.regon}</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-2" onClick={(e) => { e.stopPropagation(); setEditTargetId(c.id); setEditForm({ name: c.name, nip: c.nip, krs: c.krs, regon: c.regon }); setShowEdit(true); }}>Edytuj</button>
                            <button className="btn btn-sm btn-outline-danger" onClick={(e) => { e.stopPropagation(); setDeleteTargetId(c.id); setDeleteTargetName(c.name); setShowDelete(true); }}>Usuń</button>
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center text-muted py-4">Brak wyników</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Prawa kolumna: szczegóły */}
            <div className="d-none d-lg-block" style={{ width: 320, paddingLeft: 12 }}>
              <div className="card shadow-sm h-100 d-flex flex-column" style={{ overflow: 'hidden', minHeight: 0 }}>
                <div className="card-header"><strong>Szczegóły klienta</strong></div>
                <div className="card-body flex-grow-1" style={{ overflowY: "auto", overflowX: "hidden" }}>
                  {!selectedClient && (
                    <div className="text-muted">Wybierz klienta z listy po lewej, aby wyświetlić szczegóły.</div>
                  )}
                  {selectedClient && (
                    <div>
                      <h5 className="mb-2">{selectedClient.name}</h5>
                      {/* Identyfikatory bez tytułu (pod nazwą) */}
                      <div className="mb-3">
                        <div className="d-flex flex-column small">
                          <span><strong>NIP:</strong> {selectedClient.nip}</span>
                          <span><strong>KRS:</strong> {selectedClient.krs}</span>
                          <span><strong>REGON:</strong> {selectedClient.regon}</span>
                        </div>
                      </div>

                      {/* Dane kontaktowe */}
                      <hr />
                      <div className="mb-3">
                        <div className="fw-semibold mb-1">Dane kontaktowe</div>
                        {(() => { const d = deriveDetails(selectedClient); return (
                          <ul className="list-unstyled mb-0 small">
                            <li><strong>Adres:</strong> {d.addressLines[0]}</li>
                            <li><strong>Telefon:</strong> {d.addressLines[1]}</li>
                            <li style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}><strong>Email:</strong> <a href={`mailto:${d.addressLines[2]}`} style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}>{d.addressLines[2]}</a></li>
                            <li style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}><strong>WWW:</strong> <a href={`https://${d.addressLines[3]}`} target="_blank" rel="noreferrer" style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}>{d.addressLines[3]}</a></li>
                          </ul>
                        ); })()}
                      </div>

                      <hr />

                      {/* Osoby kontaktowe */}
                      {(() => { const d = deriveDetails(selectedClient); return (
                        <div className="mb-3">
                          <div className="fw-semibold mb-1">Osoby kontaktowe</div>
                          <ul className="list-unstyled mb-0">
                            {d.contacts.map((p, i) => (
                              <li key={i} className="mb-2">
                                <div className="small">{p.name} <span className="text-muted">— {p.role}</span></div>
                                <div className="small">Tel: {p.phone}</div>
                                <div className="small" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>Email: <a href={`mailto:${p.email}`} style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}>{p.email}</a></div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ); })()}

                      <hr />

                      {/* Projekty */}
                      {(() => { const d = deriveDetails(selectedClient); return (
                        <div>
                          <div className="fw-semibold mb-1">Projekty</div>
                          <ul className="list-unstyled mb-0 small">
                            {d.projects.map((pr, i) => (
                              <li key={i}><a href={pr.href}>{pr.id}</a></li>
                            ))}
                          </ul>
                        </div>
                      ); })()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Klienci;
