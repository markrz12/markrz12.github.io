import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sidebar, Topbar } from "../ui/Common";

function ProgressBar({ value }){
  return (
    <div className="flex-grow-1 position-relative" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}
      style={{ height: 12, background: '#eaf0f6', borderRadius: 999, border: '1px solid #d2dbea', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.04)', minWidth:80 }}>
      <div style={{ width: `${value}%`, height: '100%', borderRadius: 999, background: 'var(--ndr-bg-topbar)', transition: 'width 300ms ease', position:'relative' }}>
        <span style={{ position:'absolute', right: -2, top: -2, bottom: -2, width: 4, background:'#ffffff55', borderRadius: 2 }} />
      </div>
    </div>
  );
}

function Projects(){
  const [search, setSearch] = useState("");
  const [showAccount, setShowAccount] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ id:"", client:"", status:"W toku", progress:50, users:"Anna Kowalska; Jan Nowak", contactName:"Jan Kowalski", contactEmail:"jan.kowalski@firma.pl", contactPhone:"22 123 45 67" });
  const accountMenuRef = useRef(null); const accountBtnRef = useRef(null);
  const navigate = useNavigate();

  useEffect(()=>{ function onDoc(e){ if(!showAccount) return; const m=accountMenuRef.current,b=accountBtnRef.current; if(m&&!m.contains(e.target)&&b&&!b.contains(e.target)) setShowAccount(false);} function onKey(e){ if(e.key==='Escape') setShowAccount(false);} document.addEventListener('mousedown',onDoc); document.addEventListener('keydown',onKey); return ()=>{ document.removeEventListener('mousedown',onDoc); document.removeEventListener('keydown',onKey); }; },[showAccount]);

  const initial = useMemo(()=>[
    { pid: 1, id:'DR/2025/123456', client:'Acme Sp. z o.o. (Demo)', status:'W toku', progress:70, users:['Anna Kowalska','Jan Nowak'], contact:{ name:'Jan Kowalski', email:'jan.demo@example.com', phone:'22 123 45 67' } },
    { pid: 2, id:'DR/2025/123454', client:'Beta Demo S.A.', status:'W przygotowaniu', progress:35, users:['Katarzyna Wiśniewska'], contact:{ name:'Maria Wiśniewska', email:'maria.demo@example.com', phone:'12 234 56 78' } },
    { pid: 3, id:'MBP/2025/000111', client:'Gamma Demo Logistics', status:'Zakończony', progress:100, users:['Piotr Zieliński','Tomasz Kamiński'], contact:{ name:'Tomasz Nowak', email:'tomasz.demo@example.com', phone:'58 345 67 89' } },
  ],[]);
  const [rows, setRows] = useState(initial);

  const filtered = useMemo(()=>{
    const q = search.trim().toLowerCase();
    if(!q) return rows;
    return rows.filter(r => [r.id, r.client, r.status, ...(r.users||[])].some(v => String(v).toLowerCase().includes(q)));
  },[rows, search]);

  const selected = useMemo(()=> rows.find(r=>r.pid===selectedId) || null, [rows, selectedId]);

  const handleLogout = () => { navigate('/'); setShowAccount(false); };

  const openAdd = () => { setForm({ id:"DR/2025/", client:"", status:"W toku", progress:10, users:"", contactName:"", contactEmail:"", contactPhone:"" }); setShowAdd(true); };
  const openEdit = (r) => { setEditTarget(r); setForm({ id:r.id, client:r.client, status:r.status, progress:r.progress, users:r.users.join('; '), contactName:r.contact.name, contactEmail:r.contact.email, contactPhone:r.contact.phone }); setShowEdit(true); };
  const confirmDelete = (r) => { setDeleteTarget(r); setShowDelete(true); };

  return (
    <div className="d-flex min-vh-100" style={{ minHeight: '100vh' }}>
      <Sidebar search={search} setSearch={setSearch} />

      {/* Main column */}
      <div className="flex-grow-1 d-flex flex-column" style={{ overflow:'hidden' }}>
        <Topbar
          breadcrumb={[{label:'Home', to:'/'},{label:'Workspace', to:'/workspace'},{label:'Projekty', active:true}]}
          accountBtnRef={accountBtnRef}
          accountMenuRef={accountMenuRef}
          showAccount={showAccount}
          setShowAccount={setShowAccount}
          onLogout={handleLogout}
        />

        {/* Content: table + details */}
        <div className="flex-grow-1 bg-light d-flex pt-2 px-2" style={{ minHeight:0 }}>
          {/* Left: table */}
          <div className="flex-grow-1 d-flex flex-column" style={{ minWidth:0 }}>
            <div className="card shadow-sm h-100 d-flex flex-column" style={{ overflow:'hidden' }}>
              <div className="card-header d-flex align-items-center" style={{ gap:'0.5rem' }}>
                <strong>Lista projektów</strong>
                <div className="d-flex align-items-center flex-grow-1" style={{ gap:'0.75rem' }}>
                  <button className="btn btn-success ms-auto ms-1" onClick={()=>navigate('/projekt-klient')} style={{ whiteSpace:'nowrap', minWidth: 160, flexShrink: 0 }} >
                    Utwórz projekt
                  </button>
                </div>
              </div>
              <div className="table-responsive flex-grow-1 pt-2 ps-2 pb-5" style={{ overflow:'auto' }}>
                <table className="table table-hover table-sm mb-0 align-middle" style={{ fontSize:'0.9rem' }}>
                  <thead className="table-light" style={{ position:'sticky', top:0, zIndex:1, whiteSpace:'nowrap' }}>
                    <tr>
                      <th style={{ width:40 }}>#</th>
                      <th>Projekt</th>
                      <th>Klient</th>
                      <th>Aktualny status</th>
                      <th>Postęp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, idx)=> (
                      <tr key={r.pid} onClick={()=>setSelectedId(r.pid)} style={{ cursor:'pointer', backgroundColor: r.pid===selectedId? '#e7f1ff': undefined }}>
                        <td>{idx+1}</td>
                        <td style={{ whiteSpace:'nowrap' }}>
                          <Link to={`/projekty/${encodeURIComponent(r.id)}`} onClick={(e)=>e.stopPropagation()} style={{ textDecoration:'underline' }}>
                              {r.id}
                            </Link>
                        </td>
                        <td>{r.client}</td>
                        <td style={{ whiteSpace:'nowrap' }}>{r.status}</td>
                        <td>
                          <div className="d-flex align-items-center" style={{ gap:'0.5rem' }}>
                            <ProgressBar value={r.progress} />
                            <span className="small text-muted me-3" style={{ width:38, textAlign:'right' }}>{r.progress}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length===0 && (
                      <tr><td colSpan={5} className="text-center text-muted py-4">Brak wyników</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: details */}
          <div className="d-none d-lg-block" style={{ width:360, paddingLeft:12 }}>
            <div className="card shadow-sm h-100 d-flex flex-column" style={{ overflow:'hidden' }}>
              <div className="card-header">
                <div className="d-flex align-items-center" style={{ gap:'0.5rem' }}>
                  <strong className="me-auto">Szczegóły projektu</strong>
                </div>
                <div className="mt-2">
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Szukaj: ID, klient, status, użytkownik"
                      aria-label="Szukaj po ID, kliencie, statusie lub użytkowniku"
                      value={search}
                      onChange={(e)=>setSearch(e.target.value)}
                    />
                    <span className="input-group-text" id="projects-search-icon-right">🔍</span>
                  </div>
                </div>
              </div>
              <div className="card-body flex-grow-1" style={{ overflowY:'auto' }}>
                {!selected && (
                  <div className="text-muted">Wybierz projekt z listy po lewej, aby wyświetlić szczegóły.</div>
                )}
                {selected && (
                  <div className="small" style={{ lineHeight: 1.2 }}>
                    <div className="mb-2">
                      <div className="fw-semibold" style={{ fontSize: '1.15rem' }}>{selected.id}</div>
                      <div className="text-muted" style={{ fontSize: '1.05rem' }}>{selected.client}</div>
                      {/* Sekcja Akcje pod nazwą projektu i firmy */}
                      <div className="mt-2">
                        <hr className="my-2" />
                        <div className="fw-semibold mb-2" style={{ fontSize:'0.95rem' }}>Akcje</div>
                        <div className="d-flex flex-wrap" style={{ gap:'0.5rem' }}>
                          <button className="btn btn-sm btn-outline-primary" onClick={()=> openEdit(selected)}>Edytuj projekt</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={()=> confirmDelete(selected)}>Usuń projekt</button>
                          {/* Usunięto górny przycisk konfiguracji użytkowników, aby uniknąć duplikacji */}
                        </div>
                      </div>
                    </div>

                    <hr />
                    <div className="mb-3">
                      <div className="fw-semibold mb-1" style={{ fontSize:'0.95rem' }}>Użytkownicy - Projekt</div>
                      <div className="mb-3">
                        <div className="fw-semibold">Kierownik Projektu</div>
                        <div>Jan Kowalski</div>
                        <div className="text-muted">jan.demo@example.com</div>
                      </div>
                      <div className="mb-3">
                        <div className="fw-semibold">Asystenci projektu</div>
                        <div>Tomasz Nowak</div>
                        <div className="text-muted">tomasz.demo@example.com</div>
                      </div>
                        <button className="btn btn-sm btn-outline-primary" onClick={()=>navigate('/projekt-konfiguracja')}>
                            Konfiguruj użytkowników
                        </button>
                    </div>

                    <hr />
                    <div className="mb-1 fw-semibold" style={{ fontSize:'0.95rem' }}>Osoby kontaktowe</div>
                    <div className="mb-3">
                      <div>Jan Kowalski — <span className="text-muted">Prezes (CEO)</span></div>
                      <div>Tel: 22 123 45 67</div>
                      <div>Email: <a href="mailto:jan.demo@example.com">jan.demo@example.com</a></div>
                    </div>
                    <div className="mb-3">
                      <div>Maria Wiśniewska — <span className="text-muted">Dyrektor Finansowy</span></div>
                      <div>Tel: 22 123 45 68</div>
                      <div>Email: <a href="mailto:maria.demo@example.com">maria.demo@example.com</a></div>
                    </div>
                    <div className="mb-1">
                      <div>Tomasz Nowak — <span className="text-muted">Kierownik IT</span></div>
                      <div>Tel: 22 123 45 69</div>
                      <div>Email: <a href="mailto:tomasz.demo@example.com">tomasz.demo@example.com</a></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add modal */}
        {showAdd && (
          <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background:"rgba(0,0,0,0.35)", zIndex:1050 }} onClick={()=>setShowAdd(false)}>
            <div className="card shadow" style={{ maxWidth:560, margin:"8vh auto", padding:0 }} onClick={(e)=>e.stopPropagation()}>
              <div className="card-header d-flex justify-content-between align-items-center"><strong>Utwórz projekt</strong><button className="btn btn-sm btn-outline-secondary" onClick={()=>setShowAdd(false)}>Zamknij</button></div>
              <div className="card-body" style={{ maxHeight:'70vh', overflow:'auto' }}>
                <div className="row g-2">
                  <div className="col-12">
                    <label className="form-label mb-1">Id projektu</label>
                    <input className="form-control" value={form.id} onChange={(e)=>setForm(prev=>({...prev, id:e.target.value}))} placeholder="np. DR/2025/123456" />
                  </div>
                  <div className="col-12">
                    <label className="form-label mb-1">Klient</label>
                    <input className="form-control" value={form.client} onChange={(e)=>setForm(prev=>({...prev, client:e.target.value}))} placeholder="np. ACME Sp. z o.o." />
                  </div>
                  <div className="col-6">
                    <label className="form-label mb-1">Status</label>
                    <select className="form-select" value={form.status} onChange={(e)=>setForm(prev=>({...prev, status:e.target.value}))}>
                      <option>W toku</option>
                      <option>W przygotowaniu</option>
                      <option>Zakończony</option>
                      <option>Wstrzymany</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label mb-1">Postęp (%)</label>
                    <input type="number" min={0} max={100} className="form-control" value={form.progress} onChange={(e)=>setForm(prev=>({...prev, progress: Math.max(0, Math.min(100, Number(e.target.value)||0))}))} />
                  </div>
                  <div className="col-12">
                    <label className="form-label mb-1">Użytkownicy (oddziel średnikiem)</label>
                    <input className="form-control" value={form.users} onChange={(e)=>setForm(prev=>({...prev, users:e.target.value}))} placeholder="np. Anna Kowalska; Jan Nowak" />
                  </div>
                  <div className="col-6">
                    <label className="form-label mb-1">Kontakt: Imię i nazwisko</label>
                    <input className="form-control" value={form.contactName} onChange={(e)=>setForm(prev=>({...prev, contactName:e.target.value}))} />
                  </div>
                  <div className="col-6">
                    <label className="form-label mb-1">Kontakt: telefon</label>
                    <input className="form-control" value={form.contactPhone} onChange={(e)=>setForm(prev=>({...prev, contactPhone:e.target.value}))} />
                  </div>
                  <div className="col-12">
                    <label className="form-label mb-1">Kontakt: email</label>
                    <input className="form-control" value={form.contactEmail} onChange={(e)=>setForm(prev=>({...prev, contactEmail:e.target.value}))} />
                  </div>
                </div>
              </div>
              <div className="card-footer d-flex justify-content-end gap-2">
                <button className="btn btn-light" onClick={()=>setShowAdd(false)}>Anuluj</button>
                <button className="btn btn-primary" onClick={()=>{
                  const id=form.id.trim(); const client=form.client.trim(); if(!id){ alert('Podaj Id projektu'); return;} if(!client){ alert('Podaj nazwę klienta'); return;}
                  const newPid = (rows[rows.length-1]?.pid || 0) + 1;
                  const usersArr = form.users.split(';').map(s=>s.trim()).filter(Boolean);
                  const newRow = { pid:newPid, id, client, status:form.status, progress: Number(form.progress)||0, users: usersArr, contact:{ name: form.contactName.trim(), email: form.contactEmail.trim(), phone: form.contactPhone.trim() } };
                  setRows(prev=>[...prev, newRow]); setSelectedId(newPid); setShowAdd(false);
                }}>Utwórz</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit modal */}
        {showEdit && (
          <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background:"rgba(0,0,0,0.35)", zIndex:1050 }} onClick={()=>setShowEdit(false)}>
            <div className="card shadow" style={{ maxWidth:560, margin:"8vh auto", padding:0 }} onClick={(e)=>e.stopPropagation()}>
              <div className="card-header d-flex justify-content-between align-items-center"><strong>Edytuj projekt</strong><button className="btn btn-sm btn-outline-secondary" onClick={()=>setShowEdit(false)}>Zamknij</button></div>
              <div className="card-body" style={{ maxHeight:'70vh', overflow:'auto' }}>
                <div className="row g-2">
                  <div className="col-12">
                    <label className="form-label mb-1">Id projektu</label>
                    <input className="form-control" value={form.id} onChange={(e)=>setForm(prev=>({...prev, id:e.target.value}))} />
                  </div>
                  <div className="col-12">
                    <label className="form-label mb-1">Klient</label>
                    <input className="form-control" value={form.client} onChange={(e)=>setForm(prev=>({...prev, client:e.target.value}))} />
                  </div>
                  <div className="col-6">
                    <label className="form-label mb-1">Status</label>
                    <select className="form-select" value={form.status} onChange={(e)=>setForm(prev=>({...prev, status:e.target.value}))}>
                      <option>W toku</option>
                      <option>W przygotowaniu</option>
                      <option>Zakończony</option>
                      <option>Wstrzymany</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label mb-1">Postęp (%)</label>
                    <input type="number" min={0} max={100} className="form-control" value={form.progress} onChange={(e)=>setForm(prev=>({...prev, progress: Math.max(0, Math.min(100, Number(e.target.value)||0))}))} />
                  </div>
                  <div className="col-12">
                    <label className="form-label mb-1">Użytkownicy (oddziel średnikiem)</label>
                    <input className="form-control" value={form.users} onChange={(e)=>setForm(prev=>({...prev, users:e.target.value}))} />
                  </div>
                  <div className="col-6">
                    <label className="form-label mb-1">Kontakt: Imię i nazwisko</label>
                    <input className="form-control" value={form.contactName} onChange={(e)=>setForm(prev=>({...prev, contactName:e.target.value}))} />
                  </div>
                  <div className="col-6">
                    <label className="form-label mb-1">Kontakt: telefon</label>
                    <input className="form-control" value={form.contactPhone} onChange={(e)=>setForm(prev=>({...prev, contactPhone:e.target.value}))} />
                  </div>
                  <div className="col-12">
                    <label className="form-label mb-1">Kontakt: email</label>
                    <input className="form-control" value={form.contactEmail} onChange={(e)=>setForm(prev=>({...prev, contactEmail:e.target.value}))} />
                  </div>
                </div>
              </div>
              <div className="card-footer d-flex justify-content-end gap-2">
                <button className="btn btn-light" onClick={()=>setShowEdit(false)}>Anuluj</button>
                <button className="btn btn-primary" onClick={()=>{
                  if(!editTarget) return;
                  const id=form.id.trim(); const client=form.client.trim(); if(!id){ alert('Podaj Id projektu'); return;} if(!client){ alert('Podaj nazwę klienta'); return;}
                  const usersArr = form.users.split(';').map(s=>s.trim()).filter(Boolean);
                  setRows(prev=> prev.map(r=> r.pid===editTarget.pid? { ...r, id, client, status:form.status, progress: Number(form.progress)||0, users: usersArr, contact:{ name: form.contactName.trim(), email: form.contactEmail.trim(), phone: form.contactPhone.trim() } }: r));
                  setShowEdit(false); setEditTarget(null);
                }}>Zapisz</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete modal */}
        {showDelete && (
          <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background:"rgba(0,0,0,0.35)", zIndex:1050 }} onClick={()=>setShowDelete(false)}>
            <div className="card shadow" style={{ maxWidth:460, margin:"15vh auto", padding:0 }} onClick={(e)=>e.stopPropagation()}>
              <div className="card-header d-flex justify-content-between align-items-center"><strong>Usuń projekt</strong><button className="btn btn-sm btn-outline-secondary" onClick={()=>setShowDelete(false)}>Zamknij</button></div>
              <div className="card-body">
                <p className="mb-2">Czy na pewno chcesz usunąć projekt:</p>
                <p className="mb-0"><strong>{deleteTarget?.id}</strong>?</p>
              </div>
              <div className="card-footer d-flex justify-content-end gap-2">
                <button className="btn btn-light" onClick={()=>setShowDelete(false)}>Anuluj</button>
                <button className="btn btn-danger" onClick={()=>{ if(deleteTarget){ setRows(prev=> prev.filter(r=> r.pid!==deleteTarget.pid)); if(selectedId===deleteTarget.pid) setSelectedId(null);} setShowDelete(false); }}>Usuń</button>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}

export default Projects;
