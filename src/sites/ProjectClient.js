import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, Topbar } from "../ui/Common";

function ProjectClient(){
  const [search, setSearch] = useState("");
  const [showAccount, setShowAccount] = useState(false);
  const accountMenuRef = useRef(null); const accountBtnRef = useRef(null);
  const navigate = useNavigate();
  useEffect(()=>{ function onDoc(e){ if(!showAccount) return; const m=accountMenuRef.current,b=accountBtnRef.current; if(m&&!m.contains(e.target)&&b&&!b.contains(e.target)) setShowAccount(false);} function onKey(e){ if(e.key==='Escape') setShowAccount(false);} document.addEventListener('mousedown',onDoc); document.addEventListener('keydown',onKey); return ()=>{ document.removeEventListener('mousedown',onDoc); document.removeEventListener('keydown',onKey); }; },[showAccount]);

  return (
    <div className="d-flex min-vh-100" style={{ minHeight: '100vh' }}>
      <Sidebar search={search} setSearch={setSearch} />

      <div className="flex-grow-1 d-flex flex-column" style={{ overflow:'hidden' }}>
        <Topbar
          breadcrumb={[{label:'Home', to:'/'},{label:'Workspace', to:'/workspace'},{label:'Projekty', to:'/projekty'},{label:'Projekt: Klient', active:true}]}
          accountBtnRef={accountBtnRef}
          accountMenuRef={accountMenuRef}
          showAccount={showAccount}
          setShowAccount={setShowAccount}
          onLogout={()=>{ navigate('/'); setShowAccount(false); }}
        />

        <div className="flex-grow-1 bg-light d-flex pt-3 px-3" style={{ minHeight:0 }}>
          <ProjectClientForm onCreate={()=>navigate('/projekty')} />
        </div>

        <div className="px-3 py-2 text-end small text-muted">Sekcja klienta projektu</div>
      </div>
    </div>
  );
}

function ProjectClientForm({ onCreate }){
  const [krsQuery,setKrsQuery]=useState("");
  const [open,setOpen]=useState({ rps:true, wyk:false, zaw:false, addr:false, contact:false, repr:false });
  const [selected, setSelected] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const toggle=(k)=>setOpen(prev=>({...prev,[k]:!prev[k]}));

  // Mock KRS-like dataset (different data per entity)
  const DATA = React.useMemo(()=>[ 
    {
      name:'Acme Retail Sp. z o.o. (DEMO)',
      reg:'Rejestr Przedsiębiorców',
      krs:'0000000001', nip:'0000000000', regon:'00000000000000',
      form:'SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
      rps:{ wpis:'01.01.2020', wykreslenie:'-', ostatniaZmiana:'01.06.2025' },
      zaw:{ od:'-', do:'-' },
      addr:{ kraj:'POLSKA', woj:'lubelskie', powiat:'Nowy Powiat', gmina:'Nowa Gmina', miejscowosc:'Nowe Miasto', ulica:'ul. Przykładowa', nrDomu:'1', kod:'00-000' },
      contact:{ email:'kontakt@example.com', phone:'+48 11 111 11 11', www:'www.example.com' },
      repr:[{name:'Jan Demo', role:'Prezes Zarządu', sposob:'samodzielnie'}]
    },
    {
      name:'Tech Solutions Demo Sp. z o.o.', reg:'Rejestr Przedsiębiorców',
      krs:'0000000002', nip:'0000000001', regon:'00000000000001',
      form:'SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
      rps:{ wpis:'12.03.2020', wykreslenie:'-', ostatniaZmiana:'10.01.2025' },
      zaw:{ od:'01.02.2020', do:'31.05.2020' },
      addr:{ kraj:'POLSKA', woj:'mazowieckie', powiat:'m.st. Warszawa', gmina:'Warszawa', miejscowosc:'Warszawa', ulica:'ul. Prosta', nrDomu:'51', kod:'00-838' },
      contact:{ email:'biuro@example.com', phone:'+48 22 123 45 67', www:'www.example.com' },
      repr:[{name:'Anna Przykład', role:'Prezes Zarządu', sposob:'samodzielnie'},{name:'Marek Wzór', role:'Członek Zarządu', sposob:'łącznie z Prezesem'}]
    },
    {
      name:'Alfa Energia Demo S.A.', reg:'Rejestr Przedsiębiorców',
      krs:'0000000003', nip:'0000000002', regon:'000000002',
      form:'SPÓŁKA AKCYJNA',
      rps:{ wpis:'21.11.2021', wykreslenie:'-', ostatniaZmiana:'03.06.2025' },
      zaw:{ od:'-', do:'-' },
      addr:{ kraj:'POLSKA', woj:'śląskie', powiat:'Katowice', gmina:'Katowice', miejscowosc:'Katowice', ulica:'al. Korfantego', nrDomu:'2', kod:'40-004' },
      contact:{ email:'kontakt@example.com', phone:'+48 32 222 11 00', www:'www.example.com' },
      repr:[{name:'Tomasz Próbny', role:'Prezes', sposob:'samodzielnie'},{name:'Ewa Testowa', role:'Wiceprezes', sposob:'łącznie z Prezesem'}]
    }
  ], []);

  // Choose first as default
  React.useEffect(()=>{ if(!selected) setSelected(DATA[0]); },[selected, DATA]);

  // Live suggestions by name/nip/krs/regon
  React.useEffect(()=>{
    const q = krsQuery.trim().toLowerCase();
    if(!q){ setSuggestions([]); return; }
    const res = DATA.filter(e=> [e.name,e.nip,e.krs,e.regon].some(v=>String(v).toLowerCase().includes(q))).slice(0,5);
    setSuggestions(res);
  },[krsQuery, DATA]);

  const fetchFromKRS = () => {
    // Demo: pick first suggestion or cycle through dataset
    if(suggestions.length>0){ setSelected(suggestions[0]); return; }
    const idx = selected? (DATA.findIndex(d=>d===selected)+1)%DATA.length : 0;
    setSelected(DATA[idx]);
  };

  const entity = selected || DATA[0];

  return (
    <div className="container-fluid" style={{ maxWidth:980, width:'100%' }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Wybierz klienta</label>
            <div className="d-flex align-items-start flex-column flex-sm-row" style={{ gap:12 }}>
              <div className="w-100" style={{ maxWidth:520 }}>
                <div className="input-group">
                  <span className="input-group-text" aria-hidden>🔎</span>
                  <input aria-label="Podaj nazwę firmy, NIP, KRS lub REGON" className="form-control" placeholder="Podaj nazwę firmy, NIP lub KRS lub REGON" value={krsQuery} onChange={(e)=>setKrsQuery(e.target.value)} />
                </div>
                {suggestions.length>0 && (
                  <div className="list-group shadow-sm" role="listbox" style={{ position:'absolute', zIndex:10, maxWidth:520 }}>
                    {suggestions.map((s,i)=> (
                      <button key={i} type="button" className="list-group-item list-group-item-action" onClick={()=>{ setSelected(s); setKrsQuery(''); setSuggestions([]); }}>
                        <div className="fw-semibold" style={{ fontSize:'0.95rem' }}>{s.name}</div>
                        <div className="small text-muted">KRS: {s.krs} • NIP: {s.nip} • REGON: {s.regon}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-muted d-none d-sm-inline">lub</span>
              <button className="btn btn-outline-secondary" onClick={fetchFromKRS}>Pobierz dane z KRS</button>
            </div>
          </div>

          <hr />

          <div className="mb-2">
            <button className="btn w-100 text-start d-flex align-items-center justify-content-between" aria-expanded={open.rps} style={{ background:'#fff', border:'1px solid #ced4da' }} onClick={()=>toggle('rps')}>
              <span>Dane podmiotu</span>
              <span className="ms-2" aria-hidden>{open.rps? '▴':'▾'}</span>
            </button>
            {open.rps && (
              <div className="border border-top-0 p-3 bg-white small" role="region">
                <div className="table table-sm mb-0">
                  <div className="row g-0 border-bottom">
                    <div className="col-12 col-md-3 bg-light border-end p-2 small text-muted">Nazwa</div>
                    <div className="col-12 col-md-9 p-2">{entity.name}</div>
                  </div>
                  <div className="row g-0 border-bottom">
                    <div className="col-12 col-md-3 bg-light border-end p-2 small text-muted">Rejestr</div>
                    <div className="col-12 col-md-9 p-2">{entity.reg}</div>
                  </div>
                  <div className="row g-0 border-bottom">
                    <div className="col-6 col-md-3 bg-light border-end p-2 small text-muted">Numer KRS</div>
                    <div className="col-6 col-md-3 p-2">{entity.krs}</div>
                    <div className="col-6 col-md-3 bg-light border-end p-2 small text-muted">NIP</div>
                    <div className="col-6 col-md-3 p-2">{entity.nip}</div>
                  </div>
                  <div className="row g-0 border-bottom">
                    <div className="col-6 col-md-3 bg-light border-end p-2 small text-muted">REGON</div>
                    <div className="col-6 col-md-3 p-2">{entity.regon}</div>
                    <div className="col-12 col-md-3 bg-light border-end p-2 small text-muted">Forma prawna</div>
                    <div className="col-12 col-md-3 p-2">{entity.form}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {[
            {key:'wyk', title:'Wykreślenie z KRS', body: (
              <div className="row g-0">
                <div className="col-12 col-md-4 bg-light border-end p-2 small text-muted">Data wykreślenia</div>
                <div className="col-12 col-md-8 p-2">{entity.rps.wykreslenie || '-'}</div>
              </div>
            )},
            {key:'zaw', title:'Zawieszenie / wznowienie działalności', body: (
              <div className="row g-0">
                <div className="col-6 col-md-4 bg-light border-end p-2 small text-muted">Zawieszenie od</div>
                <div className="col-6 col-md-2 p-2">{entity.zaw.od || '-'}</div>
                <div className="col-6 col-md-4 bg-light border-end p-2 small text-muted">Wznowienie od</div>
                <div className="col-6 col-md-2 p-2">{entity.zaw.do || '-'}</div>
              </div>
            )},
            {key:'addr', title:'Siedziba i adres', body: (
              <div className="row g-0">
                <div className="col-12 col-md-3 bg-light border-end p-2 small text-muted">Kraj</div>
                <div className="col-12 col-md-3 p-2">{entity.addr.kraj}</div>
                <div className="col-12 col-md-3 bg-light border-end p-2 small text-muted">Województwo</div>
                <div className="col-12 col-md-3 p-2">{entity.addr.woj}</div>
                <div className="col-12 col-md-3 bg-light border-end p-2 small text-muted">Powiat</div>
                <div className="col-12 col-md-3 p-2">{entity.addr.powiat}</div>
                <div className="col-12 col-md-3 bg-light border-end p-2 small text-muted">Gmina</div>
                <div className="col-12 col-md-3 p-2">{entity.addr.gmina}</div>
                <div className="col-12 col-md-3 bg-light border-end p-2 small text-muted">Miejscowość</div>
                <div className="col-12 col-md-9 p-2">{entity.addr.miejscowosc}</div>
                <div className="col-12 col-md-3 bg-light border-end p-2 small text-muted">Ulica</div>
                <div className="col-12 col-md-3 p-2">{entity.addr.ulica}</div>
                <div className="col-12 col-md-3 bg-light border-end p-2 small text-muted">Nr domu</div>
                <div className="col-12 col-md-3 p-2">{entity.addr.nrDomu}</div>
                <div className="col-12 col-md-3 bg-light border-end p-2 small text-muted">Kod pocztowy</div>
                <div className="col-12 col-md-3 p-2">{entity.addr.kod}</div>
              </div>
            )},
            {key:'contact', title:'Dane kontaktowe', body: (
              <div className="row g-0">
                <div className="col-12 col-md-3 bg-light border-end p-2 small text-muted">Email</div>
                <div className="col-12 col-md-9 p-2"><a href={`mailto:${entity.contact.email}`}>{entity.contact.email}</a></div>
                <div className="col-12 col-md-3 bg-light border-end p-2 small text-muted">Telefon</div>
                <div className="col-12 col-md-9 p-2">{entity.contact.phone}</div>
                <div className="col-12 col-md-3 bg-light border-end p-2 small text-muted">WWW</div>
                <div className="col-12 col-md-9 p-2"><a href={`https://${entity.contact.www}`} target="_blank" rel="noreferrer">{entity.contact.www}</a></div>
              </div>
            )},
            {key:'repr', title:'Członkowie reprezentacji', body: (
              <div className="table-responsive">
                <table className="table table-sm table-striped mb-0">
                  <thead className="table-light"><tr><th>Imię i nazwisko</th><th>Funkcja</th><th>Sposób reprezentacji</th></tr></thead>
                  <tbody>
                    {entity.repr.map((p,i)=> (
                      <tr key={i}><td>{p.name}</td><td>{p.role}</td><td>{p.sposob}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          ].map(sec=> (
            <div key={sec.key} className="mb-2">
              <button className="btn w-100 text-start d-flex align-items-center justify-content-between" aria-expanded={open[sec.key]} style={{ background:'#fff', border:'1px solid #ced4da' }} onClick={()=>toggle(sec.key)}>
                <span>{sec.title}</span>
                <span className="ms-2" aria-hidden>{open[sec.key]? '▴':'▾'}</span>
              </button>
              {open[sec.key] && (
                <div className="border border-top-0 p-3 bg-white small" role="region">
                  {sec.body}
                </div>
              )}
            </div>
          ))}

          <div className="text-center mt-3">
            <button className="btn btn-primary" onClick={onCreate}>Utwórz projekt</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectClient;
