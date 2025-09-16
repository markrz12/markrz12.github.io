import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {BsPlayCircle, BsFileText, BsBarChart, BsLightbulb, BsShieldCheck, BsGear, BsChatDots, BsClipboardCheck, BsBell, BsHouse, BsPerson, BsChevronRight} from "react-icons/bs";

export function InitialsAvatar({ name="Jan Użytkownik", size=26 }){
  const initials = String(name || "")
    .split(/\s|\.|-/).filter(Boolean).slice(0,2)
    .map(s=>s[0]?.toUpperCase()).join('') || '?';
  const dim = size;
  return (
    <div className="rounded-circle" aria-hidden="true"
         style={{ width:dim, height:dim, background:'#e6edf5', color:'#0f2a3d', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600, fontSize: dim>24? '0.8rem':'0.7rem', border:'1px solid #d7e3f2' }}>
      {initials}
    </div>
  );
}

export function Notifications({ open, setOpen, popRef, btnRef }){
  return (
    <div className="position-relative me-2">
      <button
        ref={btnRef}
        className="btn p-0 d-inline-flex align-items-center justify-content-center border rounded-circle"
        aria-haspopup="menu"
        aria-expanded={open? 'true':'false'}
        title="Powiadomienia"
        onClick={()=>setOpen(v=>!v)}
        onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); setOpen(v=>!v);} }}
        style={{ width:30, height:30, borderColor:'rgba(255,255,255,0.6)', borderWidth:'1.25px', background:'transparent' }}
        onMouseOver={(e)=>{ e.currentTarget.style.background='rgba(255,255,255,0.12)'; }}
        onMouseOut={(e)=>{ e.currentTarget.style.background='transparent'; }}
        onFocus={(e)=>{ e.currentTarget.style.boxShadow='0 0 0 3px rgba(20,115,230,0.25)'; }}
        onBlur={(e)=>{ e.currentTarget.style.boxShadow='none'; }}
      >
        <BsBell size={18} color="#ffffff" />
      </button>
      {open && (
        <div ref={popRef} className="card shadow-sm" style={{ position:'absolute', right:'100%', transform:'translateX(8px)', top:'100%', marginTop:'0.5rem', minWidth:260, zIndex:2000 }}>
          <div className="card-header py-2"><strong>Powiadomienia</strong></div>
          <div className="card-body p-0" style={{ maxHeight:280, overflowY:'auto' }}>
            <ul className="list-group list-group-flush">
              <li className="list-group-item small">Brak nowych powiadomień</li>
            </ul>
          </div>
          <div className="card-footer py-2 text-end"><button className="btn btn-sm btn-outline-secondary" onClick={()=>setOpen(false)}>Zamknij</button></div>
        </div>
      )}
    </div>
  );
}

export function Topbar({ breadcrumb, accountBtnRef, accountMenuRef, showAccount, setShowAccount, onLogout }){
  const [openNotifications, setOpenNotifications] = useState(false);
  const notificationsPopRef = useRef(null);
  const notificationsBtnRef = useRef(null);

  useEffect(()=>{
    function onDoc(e){ if(!openNotifications) return; const p=notificationsPopRef.current,b=notificationsBtnRef.current; if(p&&!p.contains(e.target)&&b&&!b.contains(e.target)) setOpenNotifications(false);}
    function onKey(e){ if(e.key==='Escape') setOpenNotifications(false);}
    document.addEventListener('mousedown',onDoc);
    document.addEventListener('keydown',onKey);
    return ()=>{ document.removeEventListener('mousedown',onDoc); document.removeEventListener('keydown',onKey); };
  },[openNotifications]);

  return (
    <div className="shadow-sm" style={{ backgroundColor:'var(--ndr-bg-topbar)', padding:'0.5rem' }}>
      <div className="d-flex align-items-center justify-content-between px-4 py-2">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0" style={{ color:'#fff', "--bs-breadcrumb-divider":"'/'", "--bs-breadcrumb-divider-color":'#fff' }}>
            {breadcrumb.map((item, idx)=> (
              <li key={idx} className={"breadcrumb-item" + (item.active? ' active':'')} aria-current={item.active? 'page': undefined}>
                {item.to && !item.active? (<Link to={item.to} style={{ color:'#fff', textDecoration:'underline' }}>{item.label}</Link>): (<span style={{ color:'#fff' }}>{item.label}</span>)}
              </li>
            ))}
          </ol>
        </nav>
        <div className="d-flex align-items-center position-relative" style={{ gap:'0.25rem' }}>
          <Notifications open={openNotifications} setOpen={setOpenNotifications} popRef={notificationsPopRef} btnRef={notificationsBtnRef} />
          <button
            ref={accountBtnRef}
            className="btn p-0 border-0"
            aria-haspopup="menu"
            aria-expanded={showAccount? 'true':'false'}
            onClick={()=>setShowAccount(v=>!v)}
            onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); setShowAccount(v=>!v);} }}
            title="Konto"
            style={{ padding:'2px 8px', border:'1px solid rgba(255,255,255,0.35)', borderRadius:999, color:'#fff', display:'flex', alignItems:'center', gap:6, background:'transparent' }}
            onMouseOver={(e)=>{ e.currentTarget.style.background='rgba(255,255,255,0.12)'; }}
            onMouseOut={(e)=>{ e.currentTarget.style.background='transparent'; }}
          >
            <InitialsAvatar name="Jan Użytkownik" size={26} />
            <span aria-hidden="true" style={{ fontSize:12, opacity:0.9, lineHeight:1, transform:'translateY(1px)' }}>▾</span>
          </button>
          {showAccount && (
            <div
              ref={accountMenuRef}
              className="card shadow-sm"
              style={{ position:'absolute', right:0, top:'100%', marginTop:'0.5rem', minWidth:260, zIndex:2000 }}
              role="menu"
            >
              <div className="card-body py-2">
                <div className="d-flex align-items-center mb-2" style={{ gap:'0.5rem' }}>
                  <InitialsAvatar name="Jan Użytkownik" size={28} />
                  <div>
                    <div className="text-muted small mb-1" style={{ lineHeight:1 }}>Zalogowano jako</div>
                    <div className="fw-semibold mb-1" style={{ lineHeight:1.1 }}>Jan Użytkownik</div>
                    <div className="text-muted small">jan@example.com</div>
                  </div>
                </div>
                <hr className="my-2" />
                <button role="menuitem" className="dropdown-item btn btn-link text-start w-100 px-0 d-flex align-items-center" onClick={()=>setShowAccount(false)}>
                  <span className="me-2">👤</span> Profil
                </button>
                <button role="menuitem" className="dropdown-item btn btn-link text-start w-100 px-0 d-flex align-items-center" onClick={()=>setShowAccount(false)}>
                  <span className="me-2">⚙️</span> Ustawienia
                </button>
                <hr className="my-2" />
                {onLogout ? (
                  <button role="menuitem" className="dropdown-item btn btn-link text-start w-100 px-0 text-danger d-flex align-items-center" onClick={onLogout}>
                    <span className="me-2">🚪</span> Wyloguj
                  </button>
                ) : (
                  <a role="menuitem" className="dropdown-item btn btn-link text-start w-100 px-0 text-danger d-flex align-items-center" href="/">
                    <span className="me-2">🚪</span> Wyloguj
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ search, setSearch }) {
  const location = useLocation();
  const isActive = (to) => location.pathname.startsWith(to);
  const linkClass = (to) => "nav-link text-white" + (isActive(to) ? " active" : "");
  const activeStyle = (to) => isActive(to) ? { background: 'rgba(255,255,255,0.12)', borderRadius: 4 } : undefined;

    const questionnaireCategories = useMemo(() => [
        {
            label: 'Rozpoczęcie',
            icon: <BsPlayCircle className="me-2" />,
            questionnaires: [
                { name: 'DR 1. Zapis dokumentacji w wersji elektronicznej', to: '/kwestionariusz' },
                { name: 'DR 2. Wybór Audytora', to: '/kwestionariusz' },
            ]
        },
        {
            label: 'Oświadczenie',
            icon: <BsFileText className="me-2" />,
            questionnaires: [
                { name: 'DR 14.2', to: '/kwestionariusz' },
            ]
        },
        {
            label: 'Analizy',
            icon: <BsBarChart className="me-2" />,
            questionnaires: [
                { name: 'DR 14.3', to: '/kwestionariusz' },
            ]
        },
        {
            label: 'Strategia',
            icon: <BsLightbulb className="me-2" />,
            questionnaires: [
                { name: 'DR 14.4', to: '/kwestionariusz' },
            ]
        },
        {
            label: 'Poziom Ryzyka',
            icon: <BsShieldCheck className="me-2" />,
            questionnaires: [
                { name: 'DR 14.5', to: '/kwestionariusz' },
            ]
        },
        {
            label: 'Procedury',
            icon: <BsGear className="me-2" />,
            questionnaires: []
        },
        {
            label: 'Komunikacja',
            icon: <BsChatDots className="me-2" />,
            questionnaires: []
        },
        {
            label: 'Podsumowanie',
            icon: <BsClipboardCheck className="me-2" />,
            questionnaires: []
        },
    ], []);

    const [openCategory, setOpenCategory] = useState(null); // State to manage which category is open

    const menuItems = [
        { label: 'Dashboard', to: '/projekty/r', icon: <BsHouse className="me-2" /> },
        { label: 'Użytkownicy', to: '/projekt-konfiguracja', icon: <BsGear className="me-2" /> },
    ];


  return (
    <div className="d-flex flex-column text-white" style={{ width:240, flex:'0 0 240px', backgroundColor:'var(--ndr-bg-sidebar)', padding:'1.25rem' }}>
      <h5 style={{ marginBottom:0, marginTop:3 }}>NDR</h5>
      <hr style={{ borderColor:'#fff', marginTop:'0.8rem', marginBottom:'0.75rem' }} />
      <div className="my-2" style={{ marginTop:'1rem' }}>
        <div className="input-group input-group-sm">
          <input aria-label="Wyszukaj w menu" type="text" className="form-control" placeholder="Wyszukaj..." value={search} onChange={(e)=>setSearch(e.target.value)} style={{ borderColor:'rgba(255,255,255,0.25)' }} />
        </div>
          <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap">
              <Link
                  className="btn btn-light btn-sm"
                  to="/projekty"
                  style={{
                      color: "#000",
                      minWidth: "200px",
                      fontWeight: 500,
                  }}
              >
                  ↩ Wróć do projektów
              </Link>
          </div>

      </div>
      <ul className="nav flex-column">
        {menuItems.map((item, idx) => (
          <li key={idx} className="nav-item">
            <Link className={linkClass(item.to)} to={item.to} aria-current={isActive(item.to) ? 'page' : undefined} style={activeStyle(item.to)} title={item.label}>
              {item.icon} {item.label}
            </Link>
          </li>
        ))}
        {questionnaireCategories.map((category, idx) => (
          <li key={`cat-${idx}`} className="nav-item">
            <button
              className={`nav-link text-white w-100 text-start d-flex align-items-center ${openCategory === category.label ? 'active' : ''}`}
              onClick={() => setOpenCategory(openCategory === category.label ? null : category.label)}
              style={activeStyle(category.label)}
            >
              {category.icon} {category.label}
              <BsChevronRight className="ms-auto" style={{ transform: openCategory === category.label ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease-in-out', fontSize: '0.75rem' }} />
            </button>
            {openCategory === category.label && category.questionnaires.length > 0 && (
              <ul className="nav flex-column ps-4">
                {category.questionnaires.map((q, qIdx) => (
                  <li key={`q-${qIdx}`} className="nav-item">
                    <Link className={linkClass(q.to)} to={q.to} aria-current={isActive(q.to) ? 'page' : undefined} style={{ ...activeStyle(q.to), fontSize: '0.8rem' }} title={q.name}>
                      {q.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <ul className="nav flex-column">
          <li className="nav-item"><button type="button" className="nav-link btn btn-link text-white p-0 text-start"><BsGear className="me-2"/> Admin</button></li>
        </ul>
      </div>
    </div>
  );
}

export function SectionHeader({ title, action, subtitle }){
  return (
    <div className="d-flex align-items-end justify-content-between flex-wrap gap-2 mb-2">
      <div>
        <h5 className="mb-0">{title}</h5>
        {subtitle && (<div className="text-muted small">{subtitle}</div>)}
      </div>
      {action && (
        <div className="ms-auto" style={{ whiteSpace:'nowrap' }}>
          {action}
        </div>
      )}
    </div>
  );
}


export function CloseX({ size=20, title='Zamknij', ariaLabel, className='', style={}, onClick }){
  const dim = size;
  const fontSize = Math.max(10, Math.round(dim * 0.6));
  const baseStyle = {
    width: dim,
    height: dim,
    lineHeight: 1,
    fontSize,
    fontWeight: 600,
    color: '#0f2a3d',
    background: '#ffffff',
    borderColor: '#d7e3f2',
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
    transition: 'background-color 120ms ease, box-shadow 120ms ease, transform 80ms ease',
  };
  const merged = { ...baseStyle, ...style };
  return (
    <button
      type="button"
      className={"btn p-0 d-inline-flex align-items-center justify-content-center rounded-circle border " + className}
      style={merged}
      title={title}
      aria-label={ariaLabel || title}
      onClick={onClick}
      onMouseDown={(e)=>{ e.currentTarget.style.transform = 'scale(0.96)'; }}
      onMouseUp={(e)=>{ e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseLeave={(e)=>{ e.currentTarget.style.transform = 'scale(1)'; }}
      onFocus={(e)=>{ e.currentTarget.style.boxShadow = '0 0 0 3px rgba(20,115,230,0.25), 0 1px 2px rgba(0,0,0,0.06)'; }}
      onBlur={(e)=>{ e.currentTarget.style.boxShadow = baseStyle.boxShadow; }}
      onMouseOver={(e)=>{ e.currentTarget.style.background = '#f6f9ff'; }}
      onMouseOut={(e)=>{ e.currentTarget.style.background = baseStyle.background; }}
    >
      ×
    </button>
  );
}