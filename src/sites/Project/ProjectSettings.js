import React, { useMemo, useState } from "react";
import { Sidebar, Topbar } from '../../ui/Common_project.js';

function ProjektKonfiguracja(){
  //const [search, setSearch] = useState("");

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

    const breadcrumb = [
        { label: 'Home', to: '/' },
        { label: 'Projekty', to: '/projekty' },
        { label: `Projekt`, active: true },
    ];

    const [search, setSearch] = useState('');


    return (
    <div className="d-flex min-vh-100" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
        <Sidebar search={search} setSearch={setSearch} />
        {/* Main column */}
      <div className="flex-grow-1 d-flex flex-column" style={{ overflow:'hidden' }}>
        {/* Topbar */}
          <Topbar breadcrumb={breadcrumb}/>

        {/* Content */}
        <div className="flex-grow-1 bg-light d-flex pt-3 px-3" style={{ minHeight:0 }}>
          <div className="container-fluid">
            <h5 className="mb-3">Konfiguracja użytkowników projektu</h5>

              <div className="mb-3 d-flex" style={{ maxWidth: 520 }}>
                  <label
                      className="form-label mb-0 text-white fw-bold d-flex align-items-center justify-content-center"
                      style={{
                          backgroundColor: "#0a2b4c",
                          padding: '0.75rem 1rem',
                          borderTopLeftRadius: '0.25rem',
                          borderBottomLeftRadius: '0.25rem',
                          minWidth: '130px',
                          textAlign: 'center',
                          marginRight: '0px'
                      }}
                  >
                      Kierownik
                  </label>
                  <select
                      className="form-select"
                      value={manager}
                      onChange={e=>setManager(e.target.value)}
                      style={{
                          flexGrow: 1,
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                          padding: '0.75rem 1rem',   // dopasowane do label
                          height: '100%'             // dopasowanie do label
                      }}
                  >
                      <option value="">Wybierz kierownika</option>
                      {allUsers.map((u,i)=> (<option key={i} value={u}>{u}</option>))}
                  </select>
              </div>


              <div className="row g-4">
              <div className="col-12 col-lg-6">
                  <div className="card shadow-sm h-100 d-flex flex-column">
                      <div className="card-header text-white" style={{ backgroundColor: "#0a2b4c", borderRadius: '0.25rem', padding: '0.75rem 1rem' }}>
                          <strong>Asystenci</strong>
                      </div>



                      <div className="card-body p-0">
                          <div className="table-responsive">
                              <table className="table table-sm table-hover mb-0 align-middle w-100" style={{ fontSize: "0.9rem" }}>
                                  <thead style={{position: "sticky", top: 0, zIndex: 1,}}>
                                  <tr>
                                      <th style={{ padding: "0.5rem 1rem", }}>Osoba</th>
                                      <th style={{ width: 120, padding: "0.5rem 1rem" }}>Akcja</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  {assistants.map((a, idx) => (
                                      <tr key={idx}>
                                          <td style={{ padding: "0.5rem 1rem" }}>{a}</td>
                                          <td style={{ padding: "0.5rem 1rem" }}>
                                              <button
                                                  className="btn btn-sm btn-outline-danger"
                                                  onClick={() => setAssistants(prev => prev.filter(x => x !== a))}
                                              >
                                                  Usuń
                                              </button>
                                          </td>
                                      </tr>
                                  ))}
                                  {assistants.length === 0 && (
                                      <tr>
                                          <td colSpan={2} className="text-muted text-center small py-3">
                                              Brak asystentów
                                          </td>
                                      </tr>
                                  )}
                                  </tbody>
                              </table>
                          </div>
                      </div>


                      <div className="card-footer d-flex justify-content-end">
                          <button
                              className="btn"
                              style={{
                                  backgroundColor: '#0a2b4c',
                                  color: '#ffffff',
                                  borderRadius: '0.35rem',
                                  padding: '0.5rem 1rem',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                                  border: 'none'
                              }}
                              onClick={addAssistant}
                          >
                              Dodaj asystenta
                          </button>
                      </div>
                </div>
              </div>

              <div className="col-12 col-lg-6">
                  <div className="card shadow-sm h-100 d-flex flex-column">
                      <div className="card-header text-white" style={{ backgroundColor: "#0a2b4c", borderRadius: '0.25rem', padding: '0.75rem 1rem' }}>
                          <strong>Klienci</strong>
                      </div>

                      <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-sm table-hover mb-0 align-middle" style={{ fontSize:'0.9rem' }}>
                          <thead style={{position: "sticky", top: 0, zIndex: 1,}}>
                          <tr>
                              <th style={{ padding: "0.5rem 1rem", }}>Osoba</th>
                              <th style={{ width: 120, padding: "0.5rem 1rem" }}>Akcja</th>
                          </tr>
                          </thead>
                        <tbody>
                          {clients.map((c,idx)=> (
                            <tr key={idx}>
                                <td style={{ padding: "0.5rem 1rem" }}>{c}</td>
                                <td style={{ padding: "0.5rem 1rem" }}>

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
                          <div className="card-footer d-flex justify-content-end">
                              <button
                                  className="btn"
                                  style={{
                                      backgroundColor: '#0a2b4c',
                                      color: '#ffffff',
                                      borderRadius: '0.35rem',
                                      padding: '0.5rem 1rem',
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                                      border: 'none'
                                  }}
                                  onClick={addClient}
                              >
                                  Dodaj klienta
                              </button>
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

      </div>
    </div>
  );
}

export default ProjektKonfiguracja;
