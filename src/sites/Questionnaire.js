import React, { useMemo, useRef, useState, useEffect } from "react";
import { Sidebar, Topbar, CloseX, InitialsAvatar } from "../ui/Common";

function timeAgo(input){
  const now = new Date();
  const d = (input instanceof Date)? input : new Date(input);
  const diffMs = now - d;
  const sec = Math.floor(diffMs/1000);
  if (isNaN(sec)) return '';
  const min = Math.floor(sec/60);
  const hr = Math.floor(min/60);
  const day = Math.floor(hr/24);
  const wk = Math.floor(day/7);
  const mo = Math.floor(day/30);
  const yr = Math.floor(day/365);
  const plural = (n, s) => n===1? s[0] : (n>=2 && n<=4? s[1] : s[2]);
  if (sec < 45) return 'przed chwilą';
  if (min < 60) return `${min} ${plural(min, ['minutę','minuty','minut'])} temu`;
  if (hr < 24) return `${hr} ${plural(hr, ['godzinę','godziny','godzin'])} temu`;
  if (day < 7) return `${day} ${plural(day, ['dzień','dni','dni'])} temu`;
  if (wk < 5) return `${wk} ${plural(wk, ['tydzień','tygodnie','tygodni'])} temu`;
  if (mo < 12) return `${mo} ${plural(mo, ['miesiąc','miesiące','miesięcy'])} temu`;
  return `${yr} ${plural(yr, ['rok','lata','lat'])} temu`;
}


function statusBadgeClass(status){
  const s = String(status||'').toLowerCase();
  if (s.includes('otrzymano') || s.includes('zatwierdzone') || s.includes('zaakcept')) return 'badge bg-success-subtle text-dark border';
  if (s.includes('oczek') || s.includes('w trakcie') || s.includes('pending')) return 'badge bg-warning-subtle text-dark border';
  if (s.includes('odrz')) return 'badge bg-danger-subtle text-dark border';
  return 'badge bg-secondary-subtle text-dark border';
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
    maxWidth: 720,
    margin: '0 auto'
  };
  const fillStyle = {
    width: `${pct}%`,
    height: '100%',
    borderRadius: 999,
    background: 'linear-gradient(90deg, #0a2b4c, #005679, #008491)',
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
  const [answers, setAnswers] = useState({});
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
  const [showReqModal, setShowReqModal] = useState(false);
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
  const cancelRequest = (id) => {
    // Remove the request from the list instead of marking as canceled
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const rows = useMemo(()=>[
    { id:1, q:'Czy oświadczenie kierownika jednostki jest kompletne?', author:'KM', approver:'MM', date:'2025-08-20', status:'Zatwierdzone', sent:['📎','✖'], recv:['❌','📥'] },
    { id:2, q:'Czy strategia i plan badania są spójne z informacją o księgowości i systemie kontroli wewnętrznej jednostki?', author:'KK', approver:'MM', date:'2025-08-21', status:'Zatwierdzone', sent:['📎'], recv:['✔'] },
    { id:3, q:'Czy dokumentacja badania jest objęta spisem?', author:'KM', approver:'—', date:'2025-08-22', status:'Do zatwierdzenia', sent:[], recv:[] },
    { id:4, q:'Czy sprawozdanie z badania zawiera wszystkie wymagane elementy?', author:'KM', approver:'—', date:'2025-08-23', status:'W trakcie', sent:[], recv:[] },
    { id:5, q:'Czy z dokumentacji wynika, że badający zbadał transakcje z jednostkami powiązanymi?', author:'KM', approver:'—', date:'2025-08-24', status:'Odrzucone', sent:[], recv:[] },
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
                  <button ref={docBtnRef} className="btn btn-outline-secondary btn-sm rounded-circle" aria-haspopup="menu" aria-expanded={showDocMenu? 'true':'false'} title="Więcej" onClick={()=>setShowDocMenu(v=>!v)} onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); setShowDocMenu(v=>!v);} }} style={{ width:28, height:28, lineHeight:1 }}>
                    ...
                  </button>
                </div>
                {showDocMenu && (
                  <div ref={docMenuRef} className="card shadow-sm" style={{ position:'absolute', right:0, top:'100%', marginTop:'0.5rem', minWidth:220, zIndex:2000 }} role="menu">
                    <div className="card-body p-0">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                          <button className="btn btn-link p-0 align-baseline text-decoration-underline small" style={{ fontSize: '0.85em' }} onClick={()=>setShowDocMenu(false)}>Otwórz dokument</button>
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
                <table className="table table-sm table-hover align-middle mb-0" style={{ fontSize:'0.92rem', verticalAlign:'middle' }}>
                  <thead className="table-light" style={{ position:'sticky', top:0, zIndex:1, boxShadow:'0 2px 4px rgba(0,0,0,0.04)' }}>
                    <tr>
                      <th style={{ width: 40 }}>#</th>
                      <th style={{ width: '40%' }}>Opis</th>
                      <th style={{ width: 200 }}>Odpowiedź</th>
                      <th style={{ width: 160 }}>Sporządził</th>
                      <th style={{ width: 160 }}>Zatwierdził</th>
                    </tr>
                  </thead>
                  <tbody style={{ scrollBehavior:'smooth' }}>
                    {rows.map((r)=> (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td style={{ whiteSpace:'normal' }}><span id={`q-label-${r.id}`}>{r.q}</span></td>
                        <td>
                          <div className="d-flex align-items-center" role="radiogroup" aria-labelledby={`q-label-${r.id}`} style={{ gap:'0.5rem' }}>
                            <div className="form-check form-check-inline mb-0">
                              <input
                                className="form-check-input"
                                type="radio"
                                name={`ans-${r.id}`}
                                id={`a1-${r.id}`}
                                checked={answers[r.id]==='TAK'}
                                onChange={()=>{}}
                                onClick={() => setAnswers(prev => (prev[r.id]==='TAK' ? { ...prev, [r.id]: undefined } : { ...prev, [r.id]: 'TAK' }))}
                              />
                              <label className="form-check-label" htmlFor={`a1-${r.id}`}>Tak</label>
                            </div>
                            <div className="form-check form-check-inline mb-0">
                              <input
                                className="form-check-input"
                                type="radio"
                                name={`ans-${r.id}`}
                                id={`a2-${r.id}`}
                                checked={answers[r.id]==='NIE'}
                                onChange={()=>{}}
                                onClick={() => setAnswers(prev => (prev[r.id]==='NIE' ? { ...prev, [r.id]: undefined } : { ...prev, [r.id]: 'NIE' }))}
                              />
                              <label className="form-check-label" htmlFor={`a2-${r.id}`}>Nie</label>
                            </div>
                            <div className="form-check form-check-inline mb-0">
                              <input
                                className="form-check-input"
                                type="radio"
                                name={`ans-${r.id}`}
                                id={`a3-${r.id}`}
                                checked={answers[r.id]==='ND'}
                                onChange={()=>{}}
                                onClick={() => setAnswers(prev => (prev[r.id]==='ND' ? { ...prev, [r.id]: undefined } : { ...prev, [r.id]: 'ND' }))}
                              />
                              <label className="form-check-label" htmlFor={`a3-${r.id}`}>N/D</label>
                            </div>
                            <CloseX
                              size={20}
                              className="ms-1 me-2"
                              title="Wyczyść odpowiedź"
                              ariaLabel={`Wyczyść odpowiedź dla pytania ${r.id}`}
                              onClick={()=> setAnswers(prev => ({ ...prev, [r.id]: undefined }))}
                            />
                          </div>
                        </td>
                        <td style={{ fontSize:'0.82rem' }}>
                          <div className="d-flex align-items-center" style={{ gap:'0.375rem' }}>
                            <InitialsAvatar name={r.author} size={24} />
                            <span className="text-muted small" style={{ whiteSpace:'nowrap' }}>{timeAgo(new Date(r.date))}</span>
                          </div>
                        </td>
                        <td style={{ fontSize:'0.82rem' }}>
                          <div className="d-flex align-items-center" style={{ gap:'0.375rem' }}>
                            {r.approver && r.approver !== '—' && (<InitialsAvatar name={r.approver} size={24} />)}
                            {r.approver && r.approver !== '—' && (
                              <span className="text-muted small" style={{ whiteSpace:'nowrap' }}>{timeAgo(new Date(r.date))}</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Under-table controls, placed inside the same scroll container to sit right under the table */}
                <div className="px-3 py-2 border-top bg-white" style={{ position:'sticky', bottom:0, zIndex:2, boxShadow:'0 -2px 6px rgba(0,0,0,0.06)' }}>
                  <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-sm" style={{ backgroundColor:'var(--ndr-mint)', borderColor:'var(--ndr-mint)', color:'#fff', boxShadow:'0 2px 4px rgba(0,0,0,0.08)' }}>Zatwierdź wszystko</button>
                  </div>
                  <div className="mt-4" style={{ marginTop: '3rem' }}>
                    <ProgressMeter percent={70} />
                    <div className="d-flex align-items-center mt-5" style={{ width:'100%', marginTop: '3rem', position:'relative' }}>
                                          <div className="position-absolute start-0">
                                            <button className="btn btn-sm btn-outline-secondary" title="Poprzedni kwestionariusz" aria-label="Poprzedni kwestionariusz" onClick={()=>window.location.href='/kwestionariusz'} style={{ minWidth:120 }}>««</button>
                                          </div>
                                          <div className="flex-grow-1" />
                                          <div className="position-absolute end-0">
                                            <button className="btn btn-sm btn-outline-secondary" title="Następny kwestionariusz" aria-label="Następny kwestionariusz" onClick={()=>window.location.href='/kwestionariusz'} style={{ minWidth:120 }}>»»</button>
                                          </div>
                                        </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="d-none d-lg-block" style={{ width:520, paddingLeft:12 }}>
            <div className="card shadow-sm h-100 d-flex flex-column" style={{ overflow:'hidden' }}>
              <div className="card-header d-flex align-items-center justify-content-between">
                <strong>Szczegóły</strong>
              </div>
              <div className="card-body" style={{ overflowY:'auto' }}>
                {/* Dokumenty first */}
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="fw-semibold">Dokumenty</div>
                  <button type="button" className="btn btn-link p-0 align-baseline small text-decoration-underline">Zobacz wszystkie</button>
                </div>
                <div className="card shadow-sm" style={{ fontSize:'0.85rem' }}>
                  <ul className="list-group list-group-flush">
                    {[{
                      name:'Employee master.csv', date:'2024-09-24', entity:'Entity Name', type:'Procurement'
                    },{
                      name:'Strategy.pdf', date:'2024-09-24', entity:'Entity Name', type:'HR'
                    },{
                      name:'Financial Statement.pdf', date:'2024-09-21', entity:'Entity Name', type:'Finance'
                    }].map((d, i)=> (
                      <li key={i} className="list-group-item d-flex align-items-center" style={{ gap:'0.75rem' }}>
                        <div className="d-flex align-items-center flex-grow-1" style={{ gap:'0.75rem' }}>
                          <span className="badge bg-light text-dark border">PDF</span>
                          <div className="me-auto">
                            <div className="fw-semibold" style={{ fontSize:'0.9em' }}>
                              <button type="button" className="btn btn-link p-0 align-baseline text-decoration-underline">{d.name}</button>
                            </div>
                            <div className="text-muted" style={{ fontSize:'0.85em' }}>{timeAgo(new Date(d.date))}</div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <hr />

                {/* Zapotrzebowanie second */}
                <div className="mb-2">
                  <button
                    className="btn btn-primary btn-sm w-100"
                    onClick={()=>setShowReqModal(true)}
                    title="Zgłoś zapotrzebowanie"
                    aria-label="Zgłoś zapotrzebowanie (otwiera formularz)"
                    style={{ padding: '0.3rem 0.5rem' }}
                  >
                    Zgłoś zapotrzebowanie
                  </button>

                </div>
                {showReqModal && (
                  <div
                    className="position-fixed top-0 start-0 w-100 h-100"
                    style={{ background:"rgba(0,0,0,0.35)", zIndex:3000 }}
                    onClick={()=>setShowReqModal(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Formularz zgłoszenia zapotrzebowania"
                  >
                    <div
                      className="card shadow"
                      style={{ maxWidth:600, margin:"12vh auto", padding:0 }}
                      onClick={(e)=>e.stopPropagation()}
                    >
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <strong>Zgłoś zapotrzebowanie</strong>
                        <button className="btn btn-sm btn-outline-secondary" onClick={()=>setShowReqModal(false)}>Zamknij</button>
                      </div>
                      <div className="card-body">
                        <div className="mb-2">
                          <label className="form-label mb-1 small">Typ dokumentu</label>
                          <select
                            autoFocus
                            className="form-select form-select-sm"
                            value={reqForm.type}
                            onChange={(e)=>setReqForm({...reqForm, type:e.target.value})}
                          >
                            <option>Wyciąg bankowy</option>
                            <option>Umowa najmu</option>
                            <option>Polityka rachunkowości</option>
                            <option>Inne</option>
                          </select>
                        </div>
                        <div className="mb-2">
                          <label className="form-label mb-1 small">Opis (opcjonalnie)</label>
                          <textarea
                            className="form-control form-control-sm"
                            rows={3}
                            value={reqForm.desc}
                            onChange={(e)=>setReqForm({...reqForm, desc:e.target.value})}
                            placeholder="Np. wyciągi za Q3 2025, wszystkie rachunki..."
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label mb-1 small">Termin</label>
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            value={reqForm.due}
                            onChange={(e)=>setReqForm({...reqForm, due:e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="card-footer d-flex justify-content-end gap-2">
                        <button className="btn btn-light" onClick={()=>setShowReqModal(false)}>Anuluj</button>
                        <button className="btn btn-primary" onClick={()=>{ addRequest(); setShowReqModal(false); }}>Zgłoś</button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="card mb-2" style={{ fontSize:'0.9rem' }} aria-label="Lista zapotrzebowań">
                  <div className="card-header py-2"><strong style={{ fontSize:'0.95em' }}>Lista zapotrzebowań</strong></div>
                  <ul className="list-group list-group-flush">
                    {requests.length === 0 && (
                      <li className="list-group-item small text-muted"></li>
                    )}
                    {requests.map(r => (
                      <li key={r.id} className="list-group-item">
                        <div className="d-flex flex-column">
                          <div className="d-flex align-items-center" style={{ gap:'0.5rem' }}>
                            <span className={statusBadgeClass(r.status)} style={{ whiteSpace:'nowrap' }}>{r.status}</span>
                            <span className="fw-semibold" style={{ whiteSpace:'nowrap' }}>{r.type}</span>
                          </div>
                          {r.desc && (<div className="small text-muted" style={{ wordBreak:'break-word', overflowWrap:'anywhere' }}>{r.desc}</div>)}
                          <div className="small text-muted" aria-label="Szczegóły terminu i historii">
                            {r.due ? `Termin: ${r.due}` : ''}
                            {r.createdAt && (<div>• Wysłano: {timeAgo(new Date(r.createdAt))}</div>)}
                            {r.lastReminderAt && (<div>• Przypomnienie: {timeAgo(new Date(r.lastReminderAt))}</div>)}
                            {r.receivedAt && (<div>• Otrzymano: {timeAgo(new Date(r.receivedAt))}</div>)}
                            {r.receivedFile && (
                              <div className="mt-1 small">
                                <span className="badge bg-light text-dark border me-1">PDF</span>
                                <a href={r.receivedFile.url || '#'} target="_blank" rel="noreferrer" className="text-decoration-underline">
                                  {r.receivedFile.name || 'plik.pdf'}
                                </a>
                              </div>
                            )}
                          </div>
                          <div className="mt-2 d-flex flex-wrap align-items-center" style={{ gap:'0.375rem' }} aria-label={`Akcje dla: ${r.type}`}>
                            <button className="btn btn-sm btn-outline-secondary" onClick={()=>sendReminder(r.id)} disabled={r.status==='Otrzymano'}>Przypomnij</button>
                            <button className="btn btn-outline-danger btn-sm" onClick={()=>cancelRequest(r.id)} disabled={r.status==='Otrzymano'}>Anuluj</button>
                          </div>

                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <hr />

                {/* Uwagi third */}
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
                  <div style={{ width:32, height:32, display:'flex', alignItems:'center' }}>
                    <InitialsAvatar name="Anna Kowalska" size={28} />
                  </div>
                  <div className="flex-grow-1" style={{ fontSize:'0.8rem' }}>
                    <div className="d-flex align-items-center" style={{ gap:6 }}>
                      <div className="text-muted" style={{ fontSize:'0.78rem' }}>{timeAgo(new Date('2025-08-29T13:20:00'))}</div>
                    </div>
                    <div className="mt-1" style={{ fontSize:'0.82rem' }}><span className="fw-semibold">Nowy komentarz</span> od <span className="fw-semibold">Anna Kowalska</span></div>
                    <div className="mt-2 p-3" style={{ background:'#f6f9ff', border:'1px solid #e5ecf7', borderRadius:12, color:'#0f2a3d', fontSize:'0.72rem', lineHeight:1.2 }}>
                      Formularz kontaktowy powinien zostać zaktualizowany.
                    </div>
                  </div>
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
