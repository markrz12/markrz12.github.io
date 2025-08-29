import React, { useMemo, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sidebar, Topbar } from "../ui/Common";

function Badge({ children }){ return <span className="badge bg-light text-dark border rounded-pill" style={{ fontWeight:400 }}>{children}</span>; }

function statusStyle(status){
  // Subtle tag styles using palette
  const base = { color:'#0f2a3d', border:'1px solid #dde6f1', fontWeight:400 };
  switch(status){
    case 'Zatwierdzone':
      return { ...base, background:'rgba(0,177,143,0.12)', borderColor:'rgba(0,177,143,0.35)' };
    case 'W trakcie':
      return { ...base, background:'rgba(0,86,121,0.10)', borderColor:'rgba(0,86,121,0.30)' };
    case 'Odrzucone':
      return { ...base, background:'rgba(220,53,69,0.10)', borderColor:'rgba(220,53,69,0.30)' };
    case 'Do zatwierdzenia':
      return { ...base, background:'rgba(255,193,7,0.12)', borderColor:'rgba(255,193,7,0.35)' };
    default:
      return { ...base, background:'#f8f9fb' };
  }
}

function ProgressMeter({ percent }){
  const pct = Math.max(0, Math.min(100, Math.round(percent)));
  const trackStyle = {
    height: 24,
    background: '#f4f7fb',
    border: '1px solid #e2e8f3',
    borderRadius: 999,
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
    width: '100%',
    maxWidth: 520,
    margin: '0 auto'
  };
  const fillStyle = {
    width: `${pct}%`,
    height: '100%',
    borderRadius: 999,
    background: 'linear-gradient(90deg, var(--ndr-mint), var(--ndr-teal))',
    transition: 'width 300ms ease',
    position: 'relative'
  };
  const labelStyle = { position:'absolute', left:'50%', top:'50%', transform:'translate(-50%, -50%)', fontSize:'0.8rem', color:'#fff', fontWeight:600 };
  return (
    <div className="d-flex align-items-center justify-content-center">
      <div className="position-relative" style={trackStyle} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} role="progressbar">
        <div style={fillStyle} />
        <div style={labelStyle}>{pct}%</div>
      </div>
    </div>
  );
}

function Kwestionariusz(){
  const [search,setSearch]=useState("");
  const [showAccount,setShowAccount]=useState(false);
  const accountMenuRef=useRef(null); const accountBtnRef=useRef(null);
  useEffect(()=>{ function onDoc(e){ if(!showAccount) return; const m=accountMenuRef.current,b=accountBtnRef.current; if(m&&!m.contains(e.target)&&b&&!b.contains(e.target)) setShowAccount(false);} function onKey(e){ if(e.key==='Escape') setShowAccount(false);} document.addEventListener('mousedown',onDoc); document.addEventListener('keydown',onKey); return ()=>{ document.removeEventListener('mousedown',onDoc); document.removeEventListener('keydown',onKey); }; },[showAccount]);

  // Rollup menu like Powiadomienia for document actions
  const [showDocMenu, setShowDocMenu] = useState(false);
  const docMenuRef = useRef(null);
  const docBtnRef = useRef(null);
  useEffect(()=>{
    function onDoc(e){ if(!showDocMenu) return; const m=docMenuRef.current,b=docBtnRef.current; if(m&&!m.contains(e.target)&&b&&!b.contains(e.target)) setShowDocMenu(false); }
    function onKey(e){ if(e.key==='Escape') setShowDocMenu(false); }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return ()=>{ document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  },[showDocMenu]);

  const [reqForm, setReqForm] = useState({ type:'Wyciąg bankowy', desc:'', due:'' });
  const [requests, setRequests] = useState(()=>{
    const now = new Date();
    const earlier = new Date(now.getTime() - 24*60*60*1000);
    return [
      {
        id: 1,
        type: 'Wyciąg bankowy',
        desc: 'Wyciągi za Q2 2025 (miesięczne zestawienia)',
        due: '2025-09-05',
        status: 'Oczekiwanie',
        createdAt: earlier.toISOString(),
        lastReminderAt: null,
        receivedAt: null
      },
      {
        id: 2,
        type: 'Umowa najmu',
        desc: 'Aktualna umowa wraz z aneksami',
        due: '2025-09-10',
        status: 'Otrzymano',
        createdAt: earlier.toISOString(),
        lastReminderAt: earlier.toISOString(),
        receivedAt: now.toISOString(),
        receivedFile: { name: 'umowa-najmu.pdf', url: '#' }
      }
    ];
  });

  const addRequest = () => {
    const type = String(reqForm.type || '').trim();
    const desc = String(reqForm.desc || '').trim();
    const due = String(reqForm.due || '').trim();
    if (!type && !desc) { alert('Wybierz typ lub wpisz opis zapotrzebowania'); return; }
    const now = new Date();
    const id = (requests[requests.length-1]?.id || 0) + 1;
    setRequests(prev => [...prev, {
      id,
      type: type || 'Inne',
      desc,
      due,
      status: 'Oczekiwanie',
      createdAt: now.toISOString(),
      lastReminderAt: null,
      receivedAt: null
    }]);
    setReqForm({ type:'Wyciąg bankowy', desc:'', due:'' });
  };

  const sendReminder = (id) => {
    const ts = new Date().toISOString();
    setRequests(prev => prev.map(r => r.id === id ? { ...r, lastReminderAt: ts } : r));
  };
  const markReceived = (id) => {
    const ts = new Date().toISOString();
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Otrzymano', receivedAt: ts, receivedFile: r.receivedFile || { name: 'dokument.pdf', url: '#' } } : r));
  };
  const cancelRequest = (id) => {
    // Remove the request from the list instead of marking as canceled
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const rows = useMemo(()=>[
    { id:1, q:'Czy oświadczenie kierownika jednostki jest kompletne?', author:'KM', approver:'MM', date:'2025-08-20', status:'Zatwierdzone', sent:['📎','✖'], recv:['❌','📥'] },
    { id:2, q:'Czy strategia i plan badania są spójne z informacją o księgowości i systemie kontroli wewnętrznej jednostki?', author:'KK', approver:'MM', date:'2025-08-21', status:'Zatwierdzone', sent:['📎'], recv:['✔'] },
    { id:3, q:'Czy dokumentacja badania jest objęta spisem?', author:'KM', approver:'—', date:'2025-08-22', status:'Do zatwierdzenia', sent:[], recv:[] },
    { id:4, q:'Czy sprawozdanie z badania zawiera wszystkie wymagane elementy?', author:'KM', approver:'—', date:'2025-08-23', status:'W trakcie', sent:[], recv:[] },
    { id:5, q:'Czy z dokumentacji wynika, że badający zbadał transakcje z jednostkami powiązanymi', author:'KM', approver:'—', date:'2025-08-24', status:'Odrzucone', sent:[], recv:[] },
  ],[]);

  return (
    <div className="d-flex min-vh-100" style={{ minHeight:'100vh' }}>
      <Sidebar search={search} setSearch={setSearch} />
      <div className="flex-grow-1 d-flex flex-column" style={{ overflow:'hidden' }}>
        <Topbar
          breadcrumb={[{label:'Home', to:'/'},{label:'Projekty', to:'/projekty'},{label:'Kwestionariusz DR14.0', active:true}]}
          accountBtnRef={accountBtnRef}
          accountMenuRef={accountMenuRef}
          showAccount={showAccount}
          setShowAccount={setShowAccount}
        />

        <div className="flex-grow-1 bg-light d-flex pt-2 px-2" style={{ minHeight:0 }}>
          {/* Main content */}
          <div className="flex-grow-1 d-flex flex-column" style={{ minWidth:0 }}>
            <div className="card shadow-sm h-100 d-flex flex-column" style={{ overflow:'hidden' }}>
              <div className="card-header d-flex align-items-center justify-content-between position-relative">
                <strong>Kwestionariusz DR 14.9 - protokół kontroli jakości</strong>
                <div className="d-flex align-items-center" style={{ gap:'0.5rem' }}>
                  <button ref={docBtnRef} className="btn btn-light btn-sm" aria-haspopup="menu" aria-expanded={showDocMenu? 'true':'false'} title="Więcej" onClick={()=>setShowDocMenu(v=>!v)} onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); setShowDocMenu(v=>!v);} }}>
                    ...
                  </button>
                </div>
                {showDocMenu && (
                  <div ref={docMenuRef} className="card shadow-sm" style={{ position:'absolute', right:0, top:'100%', marginTop:'0.5rem', minWidth:220, zIndex:2000 }} role="menu">
                    <div className="card-body p-0">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                          <a href="#" target="_blank" rel="noreferrer" className="text-decoration-underline" onClick={()=>setShowDocMenu(false)}>Otwórz dokument</a>
                        </li>
                      </ul>
                    </div>
                    <div className="card-footer py-2 text-end">
                      <button className="btn btn-sm btn-outline-secondary" onClick={()=>setShowDocMenu(false)}>Zamknij</button>
                    </div>
                  </div>
                )}
              </div>
              <div className="table-responsive flex-grow-1" style={{ overflow:'auto' }}>
                <table className="table table-sm align-middle mb-0" style={{ fontSize:'0.92rem', verticalAlign:'middle' }}>
                  <thead className="table-light" style={{ position:'sticky', top:0, zIndex:1, boxShadow:'0 2px 4px rgba(0,0,0,0.04)' }}>
                    <tr>
                      <th style={{ width: 40 }}>#</th>
                      <th style={{ width: '36%' }}>Opis</th>
                      <th style={{ width: 200 }}>Odpowiedź</th>
                      <th style={{ width: 140 }}>Sporządził</th>
                      <th style={{ width: 140 }}>Zatwierdził</th>
                      <th style={{ width: 140 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r)=> (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td style={{ whiteSpace:'normal' }}>{r.q}</td>
                        <td>
                          <div className="d-flex align-items-center" style={{ gap:'0.5rem' }}>
                            <div className="form-check form-check-inline mb-0">
                              <input className="form-check-input" type="radio" name={`ans-${r.id}`} id={`a1-${r.id}`} />
                              <label className="form-check-label" htmlFor={`a1-${r.id}`}>Tak</label>
                            </div>
                            <div className="form-check form-check-inline mb-0">
                              <input className="form-check-input" type="radio" name={`ans-${r.id}`} id={`a2-${r.id}`} />
                              <label className="form-check-label" htmlFor={`a2-${r.id}`}>Nie</label>
                            </div>
                            <div className="form-check form-check-inline mb-0">
                              <input className="form-check-input" type="radio" name={`ans-${r.id}`} id={`a3-${r.id}`} />
                              <label className="form-check-label" htmlFor={`a3-${r.id}`}>N/D</label>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize:'0.82rem' }}>
                          <div className="d-flex align-items-center" style={{ gap:'0.375rem' }}>
                            <Badge>{r.author}</Badge>
                            <span className="text-muted small" style={{ whiteSpace:'nowrap' }}>{r.date}</span>
                          </div>
                        </td>
                        <td style={{ fontSize:'0.82rem' }}>
                          <div className="d-flex align-items-center" style={{ gap:'0.375rem' }}>
                            <Badge>{r.approver}</Badge>
                            {r.approver && r.approver !== '—' && (
                              <span className="text-muted small" style={{ whiteSpace:'nowrap' }}>{r.date}</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="badge" style={statusStyle(r.status)}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Under-table controls, placed inside the same scroll container to sit right under the table */}
                <div className="px-3 py-1 border-top bg-white" style={{ position:'sticky', bottom:0, zIndex:2, boxShadow:'0 -2px 6px rgba(0,0,0,0.03)' }}>
                  <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-sm" style={{ backgroundColor:'var(--ndr-mint)', borderColor:'var(--ndr-mint)', color:'#fff' }}>Zatwierdź wszystko</button>
                  </div>
                  <div className="mt-4" style={{ marginTop: '3rem' }}>
                    <ProgressMeter percent={70} />
                    <div className="d-flex align-items-center justify-content-between mt-5" style={{ maxWidth:520, margin:'0 auto', marginTop: '3rem' }}>
                      <button className="btn btn-sm btn-outline-secondary" title="Poprzedni kwestionariusz" aria-label="Poprzedni kwestionariusz" onClick={()=>window.location.href='/kwestionariusz'} style={{ minWidth:120 }}>««</button>
                      <button className="btn btn-sm btn-outline-secondary" title="Następny kwestionariusz" aria-label="Następny kwestionariusz" onClick={()=>window.location.href='/kwestionariusz'} style={{ minWidth:120 }}>»»</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="d-none d-lg-block" style={{ width:520, paddingLeft:12 }}>
            <div className="card shadow-sm h-100 d-flex flex-column" style={{ overflow:'hidden' }}>
              <div className="card-header">
                <strong>Szczegóły</strong>
              </div>
              <div className="card-body" style={{ overflowY:'auto' }}>
                <div className="fw-semibold mb-2">Uwagi</div>
                <div className="mb-2">

                  <div className="input-group input-group-sm">
                    <textarea className="form-control" rows={3} placeholder="Napisz komentarz..." />
                  </div>
                  <div className="d-flex justify-content-end mt-3 mb-3">
                    <button className="btn btn-sm btn-primary">Dodaj komentarz</button>
                  </div>
                </div>
                {/* Comment item inspired by the provided design */}
                <div className="d-flex align-items-start mb-3" style={{ gap:'0.75rem' }}>
                  <div className="rounded-circle bg-light border" style={{ width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                    <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>🦜</span>
                  </div>
                  <div className="flex-grow-1" style={{ fontSize:'0.8rem' }}>
                    <div className="d-flex align-items-center" style={{ gap:6 }}>
                      <div className="text-muted" style={{ fontSize:'0.78rem' }}>August 29, 2025 at 1:20 PM</div>
                    </div>
                    <div className="mt-1" style={{ fontSize:'0.82rem' }}><span className="fw-semibold">Nowy komentarz</span> od <span className="fw-semibold">Użytkownik</span></div>
                    <div className="mt-2 p-3" style={{ background:'#f6f9ff', border:'1px solid #e5ecf7', borderRadius:12, color:'#0f2a3d', fontSize:'0.72rem', lineHeight:1.2 }}>
                      Formularz kontaktowy powinien zostać zaktualizowany.
                    </div>
                  </div>
                </div>

                <hr />
                <div className="fw-semibold mb-2">Zapotrzebowanie na dokument</div>

                <div className="card mb-2">
                  <div className="card-body p-2">
                    <div className="row g-2">
                      <div className="col-12">
                        <label className="form-label mb-1 small">Typ dokumentu</label>
                        <select className="form-select form-select-sm" value={reqForm.type} onChange={(e)=>setReqForm({...reqForm, type:e.target.value})}>
                          <option>Wyciąg bankowy</option>
                          <option>Umowa najmu</option>
                          <option>Polityka rachunkowości</option>
                          <option>Inne</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label mb-1 small">Opis (opcjonalnie)</label>
                        <textarea className="form-control form-control-sm" rows={2} value={reqForm.desc} onChange={(e)=>setReqForm({...reqForm, desc:e.target.value})} placeholder="Np. wyciągi za Q3 2025, wszystkie rachunki..."></textarea>
                      </div>
                      <div className="col-12 col-sm-6">
                        <label className="form-label mb-1 small">Termin</label>
                        <input type="date" className="form-control form-control-sm" value={reqForm.due} onChange={(e)=>setReqForm({...reqForm, due:e.target.value})} />
                      </div>
                      <div className="col-12 d-grid">
                        <button className="btn btn-primary btn-sm" onClick={addRequest}>Dodaj zapotrzebowanie</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card mb-2" style={{ fontSize:'0.9rem' }}>
                  <div className="card-header py-2"><strong style={{ fontSize:'0.95em' }}>Lista zapotrzebowań</strong></div>
                  <ul className="list-group list-group-flush">
                    {requests.length === 0 && (
                      <li className="list-group-item small text-muted">Brak zapotrzebowań</li>
                    )}
                    {requests.map(r => (
                      <li key={r.id} className="list-group-item">
                        <div className="d-flex flex-column">
                          <div className="d-flex align-items-center" style={{ gap:'0.5rem' }}>
                            <span className="badge bg-secondary-subtle text-dark border" style={{ whiteSpace:'nowrap' }}>{r.status}</span>
                            <span className="fw-semibold" style={{ whiteSpace:'nowrap' }}>{r.type}</span>
                          </div>
                          {r.desc && (<div className="small text-muted" style={{ wordBreak:'break-word', overflowWrap:'anywhere' }}>{r.desc}</div>)}
                          <div className="small text-muted">
                            {r.due ? `Termin: ${r.due}` : ''}
                            {r.createdAt && (<div>• Wysłano: {new Date(r.createdAt).toLocaleString()}</div>)}
                            {r.lastReminderAt && (<div>• Przypomnienie: {new Date(r.lastReminderAt).toLocaleString()}</div>)}
                            {r.receivedAt && (<div>• Otrzymano: {new Date(r.receivedAt).toLocaleString()}</div>)}
                            {r.receivedFile && (
                              <div className="mt-1 small">
                                <span className="badge bg-light text-dark border me-1">PDF</span>
                                <a href={r.receivedFile.url || '#'} target="_blank" rel="noreferrer" className="text-decoration-underline">
                                  {r.receivedFile.name || 'plik.pdf'}
                                </a>
                              </div>
                            )}
                          </div>
                          <div className="mt-2 d-flex flex-wrap" style={{ gap:'0.375rem' }}>
                            <button className="btn btn-outline-secondary btn-sm" onClick={()=>sendReminder(r.id)} disabled={r.status==='Otrzymano'}>Przypomnij</button>
                            <button className="btn btn-outline-danger btn-sm" onClick={()=>cancelRequest(r.id)} disabled={r.status==='Otrzymano'}>Anuluj</button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <hr />
                {/* Recently Uploaded Entity Documents – right sidebar version */}
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="fw-semibold">Dokumenty</div>
                  <a href="#" className="small text-decoration-underline">Zobacz wszystkie</a>
                </div>
                <div className="card shadow-sm" style={{ fontSize:'0.85rem' }}>
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
                            <div className="fw-semibold" style={{ fontSize:'0.9em' }}>{d.name}</div>
                            <div className="text-muted" style={{ fontSize:'0.85em' }}>{d.date}</div>
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
      </div>
    </div>
  );
}

export default Kwestionariusz;
