import React, { useMemo, useState } from "react";
import { Sidebar} from "../../ui/Common_project.js";
import {Topbar } from "../../ui/Common.js";
import {Link} from "react-router-dom";

function ProjektKonfiguracja(){
  //const [search, setSearch] = useState("");

  const allUsers = useMemo(()=>[
    'Jan Kowalski','Anna Kowalska','Piotr Nowak','Ewa Jabłońska','Katarzyna Malinowska','Robert Kamiński','Janina Zielińska','Tomasz Nowak'
  ],[]);

  const [manager, setManager] = useState("");
  const [assistants, setAssistants] = useState([]);
  const [showAssistantPicker, setShowAssistantPicker] = useState(false);
  const [assistantChoice, setAssistantChoice] = useState("");
  const availableAssistantCandidates = useMemo(() => allUsers.filter(u => u !== manager && !assistants.includes(u)), [allUsers, manager, assistants]);

  const addAssistant = () => {
    setAssistantChoice("");
    setShowAssistantPicker(true);
  };

    const breadcrumb = [
        { label: 'Home', to: '/' },
        { label: 'Projekty', to: '/projekty' },
        { label: `Projekt`, active: true },
    ];

    const [search, setSearch] = useState('');

    const [questionnaires, setQuestionnaires] = useState([
        { id: 1, name: "Test niezależności kluczowego biegłego rewidenta", assigned: [] },
        { id: 2, name: "Test niezależności członka zespołu", assigned: [] },
        { id: 3, name: "Wyznaczenie zespołu badającego", assigned: [] }
    ]);

    const saveManager = () => {
        if (!manager) return alert("Wybierz kierownika!");

        setQuestionnaires(prev =>
            prev.map(q => {
                if (q.name === "Test niezależności kluczowego biegłego rewidenta") {
                    // nadpisz tylko aktualnym managerem
                    return { ...q, assigned: [manager] };
                }
                if (q.name === "Wyznaczenie zespołu badającego") {
                    // manager + obecni asystenci
                    const newAssigned = [manager, ...assistants];
                    return { ...q, assigned: newAssigned };
                }
                return q;
            })
        );

        alert(`Zapisano kierownika: ${manager}`);
    };

    const saveAssistants = () => {
        setQuestionnaires(prev =>
            prev.map(q => {
                if (q.name === "Test niezależności członka zespołu") {
                    return { ...q, assigned: [...assistants] };
                }
                if (q.name === "Wyznaczenie zespołu badającego") {
                    // manager + obecni asystenci
                    const newAssigned = [manager, ...assistants];
                    return { ...q, assigned: newAssigned };
                }
                return q;
            })
        );

        alert("Zapisano asystentów");
    };

    const [showAssignPicker, setShowAssignPicker] = useState(false);
    const [currentQId] = useState(null);
    const [userChoice, setUserChoice] = useState("");

    const handleAssignUser = () => {
        if(!userChoice) return;
        setQuestionnaires(prev => prev.map(q => {
            if(q.id === currentQId && !q.assigned.includes(userChoice)){
                return { ...q, assigned: [...q.assigned, userChoice] };
            }
            return q;
        }));
        setShowAssignPicker(false);
        setUserChoice("");
    };


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
            <h5 className="mb-4 mt-3">Konfiguracja użytkowników projektu</h5>

              <div className="mb-3 d-flex align-items-stretch" style={{ maxWidth: 650 }}>
                  <label
                      className="form-label mb-0 text-white fw-bold d-flex align-items-center justify-content-center"
                      style={{
                          backgroundColor: "#0a2b4c",
                          padding: "0.75rem 1rem",
                          borderTopLeftRadius: "0.25rem",
                          borderBottomLeftRadius: "0.25rem",
                          minWidth: "130px",
                          textAlign: "center",
                          marginRight: "0px",
                      }}
                  >
                      Kierownik
                  </label>

                  <select
                      className="form-select"
                      value={manager}
                      onChange={(e) => setManager(e.target.value)}
                      style={{
                          borderRadius: 0,
                          padding: "0.75rem 1rem",
                          width: "398px",
                          height: "100%", // dopasowanie do label
                      }}
                  >
                      <option value="">Wybierz kierownika</option>
                      {allUsers.map((u, i) => (
                          <option key={i} value={u}>
                              {u}
                          </option>
                      ))}
                  </select>

                  <button
                      className="btn btn-success fw-semibold"
                      style={{
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                          borderTopRightRadius: "0.25rem",
                          borderBottomRightRadius: "0.25rem",
                          padding: "0.75rem 1rem",
                          height: "100%", // dopasowanie do labela i selecta
                      }}
                      disabled={!manager}
                      onClick={saveManager}
                  >
                      Zapisz
                  </button>
              </div>



              <div className="row g-4">
                  <div className="col-12 col-lg-6 d-flex flex-column">
                      <div className="card shadow-sm h-100 d-flex flex-column">
                          {/* Nagłówek */}
                          <div className="card-header text-white" style={{ backgroundColor: "#0a2b4c", borderRadius: '0.25rem', padding: '0.75rem 1rem' }}>
                              <strong>Asystenci</strong>
                          </div>

                          {/* Tabela */}
                          <div className="card-body p-0 flex-grow-1">
                              <div className="table-responsive">
                                  <table className="table table-sm table-hover mb-0 align-middle w-100" style={{ fontSize: "0.9rem" }}>
                                      <thead style={{position: "sticky", top: 0, zIndex: 1}}>
                                      <tr>
                                          <th style={{ padding: "0.5rem 1rem" }}>Osoba</th>
                                          <th style={{ width: 120, padding: "0.5rem 1rem" }}>Akcja</th>
                                      </tr>
                                      </thead>
                                      <tbody>
                                      {assistants.map((a, idx) => (
                                          <tr key={idx}>
                                              <td style={{ padding: "0.5rem 1rem" }}>{a}</td>
                                              <td style={{ padding: "0.5rem 1rem" }}>
                                                  <button className="btn btn-sm btn-outline-danger" onClick={() => setAssistants(prev => prev.filter(x => x !== a))}>
                                                      Usuń
                                                  </button>
                                              </td>
                                          </tr>
                                      ))}
                                      {assistants.length === 0 && (
                                          <tr>
                                              <td colSpan={2} className="text-muted text-center small py-3">Brak asystentów</td>
                                          </tr>
                                      )}
                                      </tbody>
                                  </table>
                              </div>
                          </div>

                          {/* Footer z przyciskiem Dodaj */}
                          <div className="card-footer d-flex justify-content-end gap-2">
                              <button className="btn btn-dark fw-semibold" onClick={addAssistant}>
                                  + Dodaj asystenta
                              </button>
                              <button className="btn btn-success fw-semibold" onClick={saveAssistants} disabled={assistants.length===0}>
                                  Zatwierdź asystentów
                              </button>
                          </div>
                      </div>
                  </div>

                  <div className="col-12 col-lg-6">
                      <div className="card shadow-sm h-100 d-flex flex-column">
                          <div className="card-header text-white" style={{ backgroundColor: "#0a2b4c", borderRadius: '0.25rem', padding: '0.75rem 1rem' }}>
                              <strong> Przypisane kwestionariusze</strong>
                          </div>

                          <div className="card-body p-0">
                              <table className="table table-sm table-hover mb-0 align-middle w-100" style={{ fontSize: "0.9rem" }}>
                                  <thead>
                                  <tr>
                                      <th style={{ padding: "0.5rem 1rem", border: "1px solid #dee2e6",  }}>Nazwa</th>
                                      <th style={{ padding: "0.5rem 1rem", border: "1px solid #dee2e6",  }}>Przypisani użytkownicy</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  {questionnaires.map(q => (
                                      <tr key={q.id}>
                                          <td style={{ padding: "0.5rem 1rem", border: "1px solid #dee2e6",  }}>
                                              <Link to="/kwestionariusz" className="btn btn-sm" style={{textDecoration: "underline"}}>
                                                  {q.name}
                                              </Link>
                                          </td>
                                          <td style={{ padding: "0.5rem 1rem", border: "1px solid #dee2e6",  }}>{q.assigned.join(", ") || <span className="text-muted">Brak</span>}</td>
                                      </tr>
                                  ))}
                                  {questionnaires.length === 0 && (
                                      <tr>
                                          <td colSpan={3} className="text-center text-muted small py-3">Brak kwestionariuszy</td>
                                      </tr>
                                  )}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>


                  {showAssignPicker && (
                      <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background:"rgba(0,0,0,0.35)", zIndex:1050 }} onClick={()=>setShowAssignPicker(false)}>
                          <div className="card shadow" style={{ maxWidth:400, margin:"15vh auto", padding:0 }} onClick={e=>e.stopPropagation()}>
                              <div className="card-header d-flex justify-content-between align-items-center">
                                  <strong>Przypisz użytkownika</strong>
                                  <button className="btn btn-sm btn-outline-secondary" onClick={()=>setShowAssignPicker(false)}>Zamknij</button>
                              </div>
                              <div className="card-body">
                                  <select className="form-select" value={userChoice} onChange={e=>setUserChoice(e.target.value)}>
                                      <option value="">— wybierz —</option>
                                      {allUsers.map(u => <option key={u} value={u}>{u}</option>)}
                                  </select>
                              </div>
                              <div className="card-footer d-flex justify-content-end gap-2">
                                  <button className="btn btn-light" onClick={()=>setShowAssignPicker(false)}>Anuluj</button>
                                  <button className="btn btn-primary" onClick={handleAssignUser} disabled={!userChoice}>Dodaj</button>
                              </div>
                          </div>
                      </div>
                  )}

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
