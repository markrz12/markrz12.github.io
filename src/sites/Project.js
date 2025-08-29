import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Sidebar, Topbar } from '../ui/Common';

function ProgressMini({ value }){
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="d-flex align-items-center" style={{ gap:'0.5rem', minWidth:180 }}>
      <div className="flex-grow-1 position-relative" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}
        style={{ height: 14, background: '#eaf0f6', borderRadius: 999, border: '1px solid #d2dbea', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.04)' }}>
        <div style={{ width: `${v}%`, height:'100%', borderRadius:999, background:'var(--ndr-bg-topbar)', position:'relative', transition:'width 300ms ease' }}>
          <span style={{ position:'absolute', right:-2, top:-2, bottom:-2, width:4, background:'#ffffff55', borderRadius:2 }} />
        </div>
      </div>
      <div className="small text-muted" style={{ width:40, textAlign:'right' }}>{v}%</div>
    </div>
  );
}

export default function Project(){
  const { id } = useParams();
  const [search, setSearch] = useState('');
  const [showAccount, setShowAccount] = useState(false);
  const accountMenuRef = useRef(null); const accountBtnRef = useRef(null);
  const navigate = useNavigate();

  useEffect(()=>{ function onDoc(e){ if(!showAccount) return; const m=accountMenuRef.current,b=accountBtnRef.current; if(m&&!m.contains(e.target)&&b&&!b.contains(e.target)) setShowAccount(false);} function onKey(e){ if(e.key==='Escape') setShowAccount(false);} document.addEventListener('mousedown',onDoc); document.addEventListener('keydown',onKey); return ()=>{ document.removeEventListener('mousedown',onDoc); document.removeEventListener('keydown',onKey); }; },[showAccount]);

  const kwests = [
    { name:'Kwestionariusz 1', code:'DR 14.1', progress: 80, to:'/kwestionariusz' },
    { name:'Kwestionariusz 2', code:'DR 14.2', progress: 45, to:'/kwestionariusz' },
    { name:'Kwestionariusz 4', code:'DR 14.4', progress: 70, to:'/kwestionariusz' },
    { name:'Kwestionariusz 5', code:'DR 14.5', progress: 20, to:'/kwestionariusz' },
  ];

  const breadcrumb = [
    { label:'Home', to:'/' },
    { label:'Projekty', to:'/projekty' },
    { label:`Projekt ${id}`, active:true }
  ];

  return (
    <div className="d-flex min-vh-100" style={{ minHeight: '100vh' }}>
      <Sidebar search={search} setSearch={setSearch} />
      <div className="flex-grow-1 d-flex flex-column" style={{ overflow:'hidden' }}>
        <Topbar breadcrumb={breadcrumb} accountBtnRef={accountBtnRef} accountMenuRef={accountMenuRef} showAccount={showAccount} setShowAccount={setShowAccount} onLogout={()=>{ navigate('/'); setShowAccount(false); }} />
        <div className="flex-grow-1 bg-light p-3" style={{ minHeight:0, overflow:'auto' }}>
          <div className="container-fluid" style={{ maxWidth: 1100 }}>
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap" style={{ gap:'0.5rem' }}>
              <h4 className="mb-0">Projekt {id}</h4>
              <Link className="btn btn-outline-secondary btn-sm" to="/projekty">↩ Wróć do projektów</Link>
            </div>

            <div className="card shadow-sm">
              <div className="card-header"><strong>Kwestionariusze</strong></div>
              <ul className="list-group list-group-flush">
                {kwests.map((k,i)=> (
                  <li key={i} className="list-group-item d-flex align-items-center justify-content-between flex-wrap" style={{ gap:'0.5rem' }}>
                    <div className="me-auto" style={{ minWidth:0 }}>
                      <div className="fw-semibold">{k.name}</div>
                      <div className="text-muted small">{k.code}</div>
                    </div>
                    <ProgressMini value={k.progress} />
                    <Link to={k.to} className="btn btn-sm btn-outline-primary" style={{ whiteSpace:'nowrap' }}>Otwórz</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
