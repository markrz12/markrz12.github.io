import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { Sidebar, Topbar, Notifications } from "./ui/Common";
import { BsHouse, BsPeople, BsFileText, BsFolder, BsPerson, BsGear } from "react-icons/bs";

function Uzytkownicy(){
  const [search, setSearch] = useState("");
  const [showAccount, setShowAccount] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const accountMenuRef = useRef(null); const accountBtnRef = useRef(null);
  useEffect(()=>{ function onDoc(e){ if(!showAccount) return; const m=accountMenuRef.current,b=accountBtnRef.current; if(m&&!m.contains(e.target)&&b&&!b.contains(e.target)) setShowAccount(false);} function onKey(e){ if(e.key==='Escape') setShowAccount(false);} document.addEventListener('mousedown',onDoc); document.addEventListener('keydown',onKey); return ()=>{ document.removeEventListener('mousedown',onDoc); document.removeEventListener('keydown',onKey); }; },[showAccount]);

  const data = useMemo(()=>[
    { id:1, name:'Anna Kowalska', email:'anna.kowalska@example.com', active:true, role:'Administrator', last:'2025-08-21', actFrom:'2024-11-05', actTo:'2025-03-20', projects:['DR/2025/123456','DR/2025/123356','DR/2025/123357'] },
    { id:2, name:'Jan Nowak', email:'jan.nowak@example.com', active:false, role:'Kierownik', last:'2025-08-17', actFrom:'2024-10-01', actTo:'2025-03-01', projects:['DR/2025/123111'] },
    { id:3, name:'Katarzyna Wiśniewska', email:'katarzyna.wisniewska@example.com', active:true, role:'Asystent', last:'2025-08-23', actFrom:'2024-09-10', actTo:'2025-03-10', projects:['DR/2025/123222'] },
    { id:4, name:'Piotr Zieliński', email:'piotr.zielinski@example.com', active:true, role:'Asystent', last:'2025-08-01', actFrom:'2024-09-10', actTo:'2025-03-15', projects:['DR/2025/123333'] },
    { id:5, name:'Magdalena Lewandowska', email:'magdalena.lewandowska@example.com', active:false, role:'Klient', last:'2025-07-11', actFrom:'2024-09-10', actTo:'2025-02-01', projects:['DR/2025/123444'] },
    { id:6, name:'Tomasz Kamiński', email:'tomasz.kaminski@example.com', active:true, role:'Asystent', last:'2025-08-27', actFrom:'2024-09-10', actTo:'2025-03-30', projects:['DR/2025/123555'] },
    { id:7, name:'Agnieszka Dąbrowska', email:'agnieszka.dabrowska@example.com', active:true, role:'Asystent', last:'2025-08-26', actFrom:'2024-09-10', actTo:'2025-03-30', projects:['DR/2025/123666'] },
    { id:8, name:'Marek Wojciechowski', email:'marek.wojciechowski@example.com', active:false, role:'Asystent', last:'2025-08-15', actFrom:'2024-09-10', actTo:'2025-03-30', projects:['DR/2025/123777'] },
    { id:9, name:'Joanna Kaczmarek', email:'joanna.kaczmarek@example.com', active:true, role:'Administrator', last:'2025-08-25', actFrom:'2024-09-10', actTo:'2025-03-30', projects:['DR/2025/123888'] },
    { id:10, name:'Paweł Grabowski', email:'pawel.grabowski@example.com', active:true, role:'Klient', last:'2025-08-25', actFrom:'2024-09-10', actTo:'2025-03-30', projects:['DR/2025/123999'] },
  ],[]);

  const [users, setUsers] = useState(data);
  const filtered = useMemo(()=>{ const q=search.trim().toLowerCase(); if(!q) return users; return users.filter(u=>[u.name,u.email,u.role].some(v=>String(v).toLowerCase().includes(q))); },[users,search]);

  const selectedUser = useMemo(()=> users.find(u=>u.id===selectedId) || null, [users, selectedId]);

  const toggleActive = (id, val) => setUsers(prev=>prev.map(u=>u.id===id? { ...u, active: typeof val==='boolean'? val: !u.active }: u));

  return (
    <div className="d-flex min-vh-100" style={{ minHeight: '100vh' }}>
      <Sidebar search={search} setSearch={setSearch} />

      {/* Główna kolumna */}
      <div className="flex-grow-1 d-flex flex-column" style={{ overflow:'hidden' }}>
        <Topbar
          breadcrumb={[{label:'Home', to:'/'},{label:'Workspace', to:'/workspace'},{label:'Użytkownicy', active:true}]}
          accountBtnRef={accountBtnRef}
          accountMenuRef={accountMenuRef}
          showAccount={showAccount}
          setShowAccount={setShowAccount}
        />

        {/* Zawartość: lewa tabela + prawa sekcja info */}
        <div className="flex-grow-1 bg-light d-flex pt-2 px-2" style={{ minHeight:0 }}>
          {/* Lewa część: tabela */}
          <div className="flex-grow-1 d-flex flex-column" style={{ minWidth:0 }}>
            <div className="card shadow-sm h-100 d-flex flex-column" style={{ overflow:'hidden' }}>
              <div className="card-header d-flex align-items-center" style={{ gap:'0.5rem' }}>
                <strong>Moduł użytkowników</strong>
                <div className="ms-auto d-flex" style={{ gap:'0.5rem' }}>
                  <input type="text" className="form-control form-control-sm" placeholder="Podaj maila lub imię i nazwisko" aria-label="Filtruj użytkowników po mailu lub imieniu i nazwisku" value={search} onChange={(e)=>setSearch(e.target.value)} style={{ minWidth:280 }} />
                </div>
              </div>
              <div className="table-responsive flex-grow-1 pt-2 ps-2" style={{ overflow:'auto' }}>
                <table className="table table-hover table-sm mb-0 align-middle" style={{ fontSize:'0.9rem' }}>
                  <thead className="table-light" style={{ position:'sticky', top:0, zIndex:1, whiteSpace:'nowrap' }}>
                    <tr>
                      <th style={{ width: 40 }}>#</th>
                      <th style={{ whiteSpace:'nowrap' }}>Imię i nazwisko</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Rola</th>
                      <th>Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((u, idx)=> (
                      <tr key={u.id} onClick={()=>setSelectedId(u.id)} style={{ cursor:'pointer', backgroundColor: u.id===selectedId? '#e7f1ff': undefined }}>
                        <td>{idx+1}</td>
                        <td>{u.name}</td>
                        <td style={{ wordBreak:'break-word' }}>{u.email}</td>
                        <td>{u.active? 'Aktywny':'Nieaktywny'}</td>
                        <td style={{ whiteSpace:'nowrap' }}>{u.role}</td>
                        <td style={{ whiteSpace:'nowrap' }}>
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={(e)=>{ e.stopPropagation(); toggleActive(u.id,true); }}>Aktywuj</button>
                          <button className="btn btn-sm btn-outline-danger me-2" onClick={(e)=>{ e.stopPropagation(); toggleActive(u.id,false); }}>Dezaktywuj</button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={(e)=>{ e.stopPropagation(); alert('Anonimizacja demo'); }}>Anonimizuj</button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length===0 && (
                      <tr><td colSpan={6} className="text-center text-muted py-4">Brak wyników</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Prawa część: przypisane projekty i daty */}
          <div className="d-none d-lg-block" style={{ width:320, paddingLeft:12 }}>
            <div className="card shadow-sm h-100 d-flex flex-column" style={{ overflow:'hidden' }}>
              <div className="card-header"><strong>Szczegóły użytkownika</strong></div>
              <div className="card-body flex-grow-1" style={{ overflowY:'auto' }}>
                {!selectedUser && (
                  <div className="text-muted">Wybierz użytkownika z listy po lewej, aby wyświetlić szczegóły.</div>
                )}
                {selectedUser && (
                  <div>
                    <h6 className="mb-2">{selectedUser.name}</h6>
                    <div className="mb-3 small" style={{ wordBreak:'break-word' }}><strong>Email:</strong> {selectedUser.email}</div>
                    <hr />
                    <div className="fw-semibold mb-2">Przypisane projekty</div>
                    <ul className="list-unstyled small">
                      {selectedUser.projects.map((pid, i)=> (
                        <li key={i}><a href="#">{pid}</a></li>
                      ))}
                    </ul>
                    <hr />
                    <div className="mb-2"><div className="text-muted small">Data aktywacji</div><div className="small">{selectedUser.actFrom}</div></div>
                    <div className="mb-2"><div className="text-muted small">Data dezaktywacji</div><div className="small">{selectedUser.actTo}</div></div>
                    <div className="mb-2"><div className="text-muted small">Ostatnia aktywność</div><div className="small">{selectedUser.last}</div></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 py-2 text-end small text-muted">Strona 1/20</div>
      </div>
    </div>
  );
}

export default Uzytkownicy;
