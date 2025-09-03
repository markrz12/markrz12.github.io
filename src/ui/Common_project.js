import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsHouse, BsFileText, BsFolder, BsPerson, BsGear, BsBell } from "react-icons/bs";

export function InitialsAvatar({ name="Jan Użytkownik", size=26 }){
    const initials = String(name||"")
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

export function Notifications(){
    const [open,setOpen]=useState(false);
    const popRef=useRef(null); const btnRef=useRef(null);
    useEffect(()=>{ function onDoc(e){ if(!open) return; const p=popRef.current,b=btnRef.current; if(p&&!p.contains(e.target)&&b&&!b.contains(e.target)) setOpen(false);} function onKey(e){ if(e.key==='Escape') setOpen(false);} document.addEventListener('mousedown',onDoc); document.addEventListener('keydown',onKey); return ()=>{ document.removeEventListener('mousedown',onDoc); document.removeEventListener('keydown',onKey); }; },[open]);
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

export function Sidebar({ search, setSearch }){
    const location = useLocation();
    const isActive = (to) => location.pathname.startsWith(to);
    const linkClass = (to) => "nav-link text-white" + (isActive(to) ? "" : "");
    const activeStyle = (to) => isActive(to) ? { background: 'rgba(255,255,255,0.12)', borderRadius: 4 } : undefined;
    return (
        <div className="d-flex flex-column text-white" style={{ width:240, flex:'0 0 240px', backgroundColor:'var(--ndr-bg-sidebar)', padding:'1.25rem' }}>
            <h5 style={{ marginBottom:0, marginTop:3 }}>NDR</h5>
            <hr style={{ borderColor:'#fff', marginTop:'0.8rem', marginBottom:'0.75rem' }} />
            <div className="my-2" style={{ marginTop:'1rem' }}>
                <div className="input-group input-group-sm">
                    <input aria-label="Wyszukaj w menu" type="text" className="form-control" placeholder="Wyszukaj..." value={search} onChange={(e)=>setSearch(e.target.value)} style={{ borderColor:'rgba(255,255,255,0.25)' }} />
                </div>
            </div>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link className={linkClass('/workspace')} to="/workspace" aria-current={isActive('/workspace')? 'page': undefined} style={activeStyle('/workspace')} title="Dashboard">
                        <BsHouseDoor className="me-2"/> Dashboard
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className={linkClass('/uzytkownicy')} to="/uzytkownicy" aria-current={isActive('/uzytkownicy')? 'page': undefined} style={activeStyle('/uzytkownicy')} title="Użytkownicy">
                        <BsPerson className="me-2"/> Użytkownicy
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-white" to="#" title="Rozpoczęcie">
                        <BsPlayCircle className="me-2" /> Rozpoczęcie
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link text-white" to="#" title="Oświadczenie">
                        <BsFileText className="me-2" /> Oświadczenie
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link text-white" to="#" title="Analizy">
                        <BsBarChart className="me-2" /> Analizy
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link text-white" to="#" title="Strategia">
                        <BsLightbulb className="me-2" /> Strategia
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link text-white" to="#" title="Poziom Ryzyka">
                        <BsShieldCheck className="me-2" /> Poziom Ryzyka
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link text-white" to="#" title="Procedury">
                        <BsGear className="me-2" /> Procedury
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link text-white" to="#" title="Komunikacja">
                        <BsChatDots className="me-2" /> Komunikacja
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link text-white" to="#" title="Podsumowanie">
                        <BsClipboardCheck className="me-2" /> Podsumowanie
                    </Link>
                </li>

            </ul>
            <div className="mt-auto">
                <ul className="nav flex-column">
                    <li className="nav-item"><button type="button" className="nav-link btn btn-link text-white p-0 text-start"><BsGear className="me-2"/> Admin</button></li>
                </ul>
            </div>
        </div>
    );
}

export function Topbar({ breadcrumb, accountBtnRef, accountMenuRef, showAccount, setShowAccount, onLogout }){
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
                    <Notifications />
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
