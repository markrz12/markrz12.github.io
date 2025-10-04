import React, { useMemo, useState } from "react";
import { Sidebar, Topbar, InitialsAvatar } from "../../ui/Common";

function Users(){
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

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

  const setRole = (id, role) => setUsers(prev=>prev.map(u=>u.id===id? { ...u, role }: u));

  return (
    <React.Fragment>
      <div className="d-flex min-vh-100" style={{ minHeight: '100vh' }}>
      <Sidebar search={search} setSearch={setSearch} />

      {/* Główna kolumna */}
      <div className="flex-grow-1 d-flex flex-column" style={{ overflow:'hidden' }}>
        <Topbar
          breadcrumb={[{label:'Home', to:'/'},{label:'Workspace', to:'/workspace'},{label:'Użytkownicy', active:true}]}
        />

        {/* Zawartość: lewa tabela + prawa sekcja info */}
        <div className="flex-grow-1 bg-light d-flex pt-2 px-2" style={{ minHeight:0 }}>
          {/* Lewa część: tabela */}
          <div className="flex-grow-1 d-flex flex-column" style={{ minWidth:0 }}>
            <div className="card shadow-sm h-100 d-flex flex-column" style={{ overflow:'hidden' }}>
              <div className="card-header" style ={{ backgroundColor: "#0a2b4c", color: "#ffffff",}}>
                <div className="d-flex align-items-center" style={{padding: '0.5rem 0.3rem' }}>
                  <strong className="me-auto" style ={{fontSize: "1.1rem"}}>Moduł użytkowników</strong>
                  <div className="input-group input-group-sm" style={{ maxWidth: 420 }}>
                    <input type="text" className="form-control" placeholder="Szukaj: mail, imię i nazwisko" aria-label="Szukaj użytkowników" value={search} onChange={(e)=>setSearch(e.target.value)} />
                    {search && (<button className="btn btn-outline-secondary" type="button" onClick={()=>setSearch("")} title="Wyczyść" aria-label="Wyczyść">×</button>)}
                    <span className="input-group-text" id="users-search-icon-top">🔍</span>
                  </div>
                </div>
              </div>
              <div className="table-responsive flex-grow-1" style={{ overflow:'auto' }}>
                <table className="table table-hover table-sm mb-0 align-middle" style={{ fontSize:'0.9rem' }}>
                  <thead className="table-light" style={{ position:'sticky', top:0, zIndex:1, whiteSpace:'nowrap' }}>
                    <tr>
                      <th style={headerStyle}>Imię i nazwisko</th>
                      <th style={headerStyle}>Email</th>
                      <th style={headerStyle}>Status</th>
                      <th style={headerStyle}>Rola</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((u, idx)=> (
                      <tr key={u.id} onClick={()=>setSelectedId(u.id)} style={{ cursor:'pointer', backgroundColor: u.id===selectedId? '#e7f1ff': undefined }}>
                        <td style = {tdDescription}>
                          <div className="d-flex align-items-center" style={{ gap:'0.5rem' }}>
                            <InitialsAvatar name={u.name} size={24} />
                            <span>{u.name}</span>
                          </div>
                        </td>
                        <td style = {tdDescription}>{u.email}</td>
                        <td style = {tdDescription}><span className={`badge fw-normal ${u.active ? 'bg-success-subtle text-dark' : 'bg-secondary-subtle text-dark'}`}>{u.active ? 'Aktywny' : 'Nieaktywny'}</span></td>
                        <td style = {tdDescription}>{u.role}</td>
                      </tr>
                    ))}
                    {filtered.length===0 && (
                      <tr><td colSpan={4} className="text-center text-muted py-4">Brak wyników</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Prawa część: przypisane projekty i daty */}
          <div className="d-none d-lg-block" style={{ width:360, paddingLeft:12 }}>
            <div className="card shadow-sm h-100 d-flex flex-column" style={{ overflow:'hidden' }}>
                <div className="text-center mb-2">
                    <button className="btn btn-success w-100" onClick={()=>alert('Dodawanie użytkownika (demo)')} style={{ whiteSpace:'nowrap', minWidth: 220 }}>Dodaj użytkownika</button>
                </div>
              <div className="card-header" style ={{ padding: '0.6rem 1rem', fontSize: "1rem", backgroundColor: "#0a2b4c", color: "#ffffff",}}>

                <div className="d-flex align-items-center"><strong className="me-auto">Szczegóły użytkownika</strong></div>
              </div>
              <div className="card-body flex-grow-1" style={{ overflowY:'auto' }}>

                {!selectedUser && (
                  <div className="text-muted">Wybierz użytkownika z listy po lewej, aby wyświetlić szczegóły.</div>
                )}
                {selectedUser && (
                  <div>
                      <h6 className="d-flex align-items-center" style={{ gap:'0.5rem' }}>
                          <InitialsAvatar name={selectedUser.name} size={30} />
                          <span>{selectedUser.name}</span>
                      </h6>
                    <div className="mb- small" style={{ wordBreak:'break-word' }}><strong>Email:</strong> {selectedUser.email}</div>
                      <div className="mb-3 small" style={{ wordBreak:'break-word' }}><strong>Rola:</strong> {selectedUser.role}</div>
                    <hr />
                    <div className="mb-2">
                      <div className="fw-semibold mb-2" style={{ fontSize:'0.95rem' }}>Akcje</div>
                      <div className="d-flex flex-wrap" style={{ gap:'0.5rem' }}>
                        <button className="btn btn-sm btn-outline-primary" disabled={selectedUser.active} onClick={()=>toggleActive(selectedUser.id,true)}>Aktywuj</button>
                        <button className="btn btn-sm btn-outline-danger" disabled={!selectedUser.active} onClick={()=>toggleActive(selectedUser.id,false)}>Dezaktywuj</button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={()=>alert('Anonimizacja demo')}>Anonimizuj</button>
                      </div>
                      <div className="mt-2">
                        <div className="fw-semibold mb-1 small">Rola</div>
                        <button className="btn btn-sm btn-outline-secondary" onClick={()=>setShowRoleModal(true)}>
                          Zmień role
                        </button>
                      </div>
                    </div>
                    <hr />
                    <div className="fw-semibold mb-2">Przypisane projekty</div>
                    <ul className="list-unstyled small">
                      {selectedUser.projects.map((pid, i)=> (
                        <li key={i}><button type="button" className="btn btn-link p-0 align-baseline">{pid}</button></li>
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


      </div>
    </div>
    {/* Change Role Modal */}
    {showRoleModal && selectedUser && (
      <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background:"rgba(0,0,0,0.35)", zIndex:1050 }} onClick={()=>setShowRoleModal(false)}>
        <div className="card shadow" style={{ maxWidth:400, margin:"20vh auto", padding:0 }} onClick={(e)=>e.stopPropagation()}>
          <div className="card-header d-flex justify-content-between align-items-center">
            <strong>Zmień rolę dla {selectedUser.name}</strong>
            <button className="btn btn-sm btn-outline-secondary" onClick={()=>setShowRoleModal(false)}>Zamknij</button>
          </div>
          <div className="card-body">
            <label className="form-label mb-1">Wybierz nową rolę</label>
            <select className="form-select" value={selectedUser.role} onChange={(e)=>setRole(selectedUser.id, e.target.value)}>
              <option>Administrator</option>
              <option>Kierownik</option>
              <option>Asystent</option>
              <option>Klient</option>
              <option>Właściciel</option>
            </select>
          </div>
          <div className="card-footer d-flex justify-content-end gap-2">
            <button className="btn btn-light" onClick={()=>setShowRoleModal(false)}>Anuluj</button>
            <button className="btn btn-primary" onClick={()=>setShowRoleModal(false)}>Zapisz</button>
          </div>
        </div>
      </div>
    )}
    </React.Fragment>
  );
}

const headerStyle = { border: "1px solid #dee2e6", paddingLeft: "1rem", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem" };
const tdDescription = { border: "1px solid #dee2e6", fontSize: "0.9rem", paddingLeft: "1rem", paddingTop:"0.5rem", paddingBottom:"0.5rem" };


export default Users;
