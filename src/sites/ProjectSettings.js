import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Notifications, InitialsAvatar } from "../ui/Common";
import { BsHouse, BsPeople, BsFileText, BsFolder, BsPerson, BsGear } from "react-icons/bs";

function ProjektKonfiguracja(){
  const [search, setSearch] = useState("");
  const [showAccount, setShowAccount] = useState(false);
  const accountMenuRef = useRef(null); const accountBtnRef = useRef(null);
  const navigate = useNavigate();
  useEffect(()=>{ function onDoc(e){ if(!showAccount) return; const m=accountMenuRef.current,b=accountBtnRef.current; if(m&&!m.contains(e.target)&&b&&!b.contains(e.target)) setShowAccount(false);} function onKey(e){ if(e.key==='Escape') setShowAccount(false);} document.addEventListener('mousedown',onDoc); document.addEventListener('keydown',onKey); return ()=>{ document.removeEventListener('mousedown',onDoc); document.removeEventListener('keydown',onKey); }; },[showAccount]);

  const allUsers = useMemo(()=>[
    'Jan Kowalski','Anna Kowalska','Piotr Nowak','Ewa Jabłońska','Katarzyna Malinowska','Robert Kamiński','Janina Zielińska','Tomasz Nowak'
  ],[]);

  const [manager, setManager] = useState("");
  const [assistants, setAssistants] = useState(['Piotr Nowak','Katarzyna Malinowska','Ewa Jabłońska']);
  const [clients, setClients] = useState(['Janina Zielińska','Robert Kamiński']);
  const [showAssistantPicker, setShowAssistantPicker] = useState(false);
  const [assistantChoice, setAssistantChoice] = useState("");
  const availableAssistantCandidates = useMemo(() => allUsers.filter(u => u !== manager && !assistants.includes(u)), [allUsers, manager, assistants]);

  const addAssistant = () => {
    setAssistantChoice("");
    setShowAssistantPicker(true);
  };
  const addClient = () => {
    const candidate = allUsers.find(u => !clients.includes(u));
    if(candidate) setClients(prev=>[...prev, candidate]);
  };

  return (
    <div className="d-flex min-vh-100" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="d-flex flex-column text-white" style={{ width:220, flex:'0 0 220px', backgroundColor:'var(--ndr-bg-sidebar)', padding:'1rem' }}>
        <h5 style={{ marginBottom:0, marginTop:3 }}>Menu</h5>
        <hr style={{ borderColor:'#fff', marginTop:'0.8rem', marginBottom:'0.75rem' }} />
        <div className="my-2" style={{ marginTop:'1rem' }}>
          <input type="text" className="form-control form-control-sm" placeholder="Wyszukaj..." aria-label="Wyszukaj w menu" value={search} onChange={(e)=>setSearch(e.target.value)} />
        </div>
        <ul className="nav flex-column">
          <li className="nav-item"><Link className="nav-link text-white" to="/workspace"><BsHouse className="me-2"/> Dashboard</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/klienci"><BsPeople className="me-2"/> Klienci</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/szablony"><BsFileText className="me-2"/> Szablony</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/projekty"><BsFolder className="me-2"/> Projekty</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/uzytkownicy"><BsPerson className="me-2"/> Użytkownicy</Link></li>
        </ul>
        <div className="mt-auto">
          <ul className="nav flex-column">
            <li className="nav-item"><button type="button" className="nav-link btn btn-link text-white p-0 text-start"><BsGear className="me-2"/> Admin</button></li>
          </ul>
        </div>
      </div>

      {/* Main column */}
      <div className="flex-grow-1 d-flex flex-column" style={{ overflow:'hidden' }}>
        {/* Topbar */}
        <div className="shadow-sm" style={{ backgroundColor:'var(--ndr-bg-topbar)', padding:'0.5rem' }}>
          <div className="d-flex align-items-center justify-content-between px-4 py-2">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0" style={{ color:'#fff', "--bs-breadcrumb-divider":"'/'", "--bs-breadcrumb-divider-color":'#fff' }}>
                <li className="breadcrumb-item"><Link to="/" style={{ color:'#fff', textDecoration:'underline' }}>Home</Link></li>
                <li className="breadcrumb-item"><Link to="/workspace" style={{ color:'#fff', textDecoration:'underline' }}>Workspace</Link></li>
                <li className="breadcrumb-item"><Link to="/projekty" style={{ color:'#fff', textDecoration:'underline' }}>Projekty</Link></li>
                <li className="breadcrumb-item active" aria-current="page" style={{ color:'#fff' }}>Projekt: Konfiguracja</li>
              </ol>
            </nav>
            <div className="d-flex align-items-center position-relative" style={{ gap:'0.25rem' }}>
              <Notifications />
              <button ref={accountBtnRef} className="btn btn-link p-0 border-0" aria-haspopup="menu" aria-expanded={showAccount? 'true':'false'} onClick={()=>setShowAccount(v=>!v)} onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); setShowAccount(v=>!v);} }} title="Konto">
                <InitialsAvatar name="Jan Użytkownik" size={24} />
              </button>
              {showAccount && (
                <div ref={accountMenuRef} className="card shadow-sm" style={{ position:'absolute', right:0, top:'100%', marginTop:'0.5rem', minWidth:220, zIndex:2000 }} role="menu">
                  <div className="card-body py-2">
                    <div className="d-flex align-items-center mb-2"><InitialsAvatar name="Jan Użytkownik" size={28} /><div><div className="fw-semibold">Jan Użytkownik</div><div className="text-muted small">jan@example.com</div></div></div>
                    <hr className="my-2" />
                    <button className="dropdown-item btn btn-link text-start w-100 px-0" onClick={()=>setShowAccount(false)}>Profil</button>
                    <button className="dropdown-item btn btn-link text-start w-100 px-0" onClick={()=>setShowAccount(false)}>Ustawienia</button>
                    <hr className="my-2" />
                    <button className="dropdown-item btn btn-link text-start w-100 px-0 text-danger" onClick={()=>{ navigate('/'); setShowAccount(false); }}>Wyloguj</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow-1 bg-light d-flex pt-3 px-3" style={{ minHeight:0 }}>
          <div className="container-fluid">
            <h5 className="mb-3">Konfiguracja użytkowników projektu</h5>

            <div className="mb-3" style={{ maxWidth:520 }}>
              <label className="form-label mb-1">Kierownik</label>
              <select className="form-select" value={manager} onChange={e=>setManager(e.target.value)}>
                <option value="">Wybierz kierownika</option>
                {allUsers.map((u,i)=> (<option key={i} value={u}>{u}</option>))}
              </select>
            </div>

            <div className="row g-4">
              <div className="col-12 col-lg-6">
                <div className="card shadow-sm h-100 d-flex flex-column">
                  <div className="card-header"><strong>Asystenci</strong></div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-sm table-hover mb-0 align-middle" style={{ fontSize:'0.9rem' }}>
                        <thead className="table-light" style={{ position:'sticky', top:0, zIndex:1 }}>
                          <tr><th>Osoba</th><th style={{ width:120 }}>Akcja</th></tr>
                        </thead>
                        <tbody>
                          {assistants.map((a,idx)=> (
                            <tr key={idx}>
                              <td>{a}</td>
                              <td>
                                <button className="btn btn-sm btn-outline-danger" onClick={()=>setAssistants(prev=>prev.filter(x=>x!==a))}>Usuń</button>
                              </td>
                            </tr>
                          ))}
                          {assistants.length===0 && (
                            <tr><td colSpan={2} className="text-muted text-center small py-3">Brak asystentów</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button className="btn btn-secondary" onClick={addAssistant}>Dodaj asystenta</button>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-6">
                <div className="card shadow-sm h-100 d-flex flex-column">
                  <div className="card-header"><strong>Klienci</strong></div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-sm table-hover mb-0 align-middle" style={{ fontSize:'0.9rem' }}>
                        <thead className="table-light" style={{ position:'sticky', top:0, zIndex:1 }}>
                          <tr><th>Osoba</th><th style={{ width:120 }}>Akcja</th></tr>
                        </thead>
                        <tbody>
                          {clients.map((c,idx)=> (
                            <tr key={idx}>
                              <td>{c}</td>
                              <td>
                                <button className="btn btn-sm btn-outline-danger" onClick={()=>setClients(prev=>prev.filter(x=>x!==c))}>Usuń</button>
                              </td>
                            </tr>
                          ))}
                          {clients.length===0 && (
                            <tr><td colSpan={2} className="text-muted text-center small py-3">Brak klientów</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button className="btn btn-secondary" onClick={addClient}>Dodaj klienta</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {showAssistantPicker && (
          <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background:"rgba(0,0,0,0.35)", zIndex:1050 }} onClick={()=>setShowAssistantPicker(false)}>
            <div className="card shadow" style={{ maxWidth:520, margin:"12vh auto", padding:0 }} onClick={(e)=>e.stopPropagation()}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <strong>Dodaj asystenta</strong>
                <button className="btn btn-sm btn-outline-secondary" onClick={()=>setShowAssistantPicker(false)}>Zamknij</button>
              </div>
              <div className="card-body">
                {availableAssistantCandidates.length === 0 ? (
                  <div className="text-muted small">Brak dostępnych osób do dodania.</div>
                ) : (
                  <div>
                    <label className="form-label mb-1">Wybierz asystenta</label>
                    <select className="form-select" value={assistantChoice} onChange={(e)=>setAssistantChoice(e.target.value)}>
                      <option value="">— wybierz —</option>
                      {availableAssistantCandidates.map((u,i)=> (<option key={i} value={u}>{u}</option>))}
                    </select>
                  </div>
                )}
              </div>
              <div className="card-footer d-flex justify-content-end gap-2">
                <button className="btn btn-light" onClick={()=>setShowAssistantPicker(false)}>Anuluj</button>
                <button className="btn btn-primary" disabled={availableAssistantCandidates.length===0 || !assistantChoice} onClick={()=>{ if(!assistantChoice) return; setAssistants(prev=>[...prev, assistantChoice]); setAssistantChoice(""); setShowAssistantPicker(false); }}>Dodaj</button>
              </div>
            </div>
          </div>
        )}

        <div className="px-3 py-2 text-end small text-muted">Zapis jest automatyczny (demo)</div>
      </div>
    </div>
  );
}

export default ProjektKonfiguracja;
