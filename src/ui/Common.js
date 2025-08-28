import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle, FaBell } from "react-icons/fa";
import { BsHouse, BsPeople, BsFileText, BsFolder, BsPerson, BsGear } from "react-icons/bs";

export function Notifications(){
  const [open,setOpen]=useState(false);
  const popRef=useRef(null); const btnRef=useRef(null);
  useEffect(()=>{ function onDoc(e){ if(!open) return; const p=popRef.current,b=btnRef.current; if(p&&!p.contains(e.target)&&b&&!b.contains(e.target)) setOpen(false);} function onKey(e){ if(e.key==='Escape') setOpen(false);} document.addEventListener('mousedown',onDoc); document.addEventListener('keydown',onKey); return ()=>{ document.removeEventListener('mousedown',onDoc); document.removeEventListener('keydown',onKey); }; },[open]);
  return (
    <div className="position-relative me-2">
      <button ref={btnRef} className="btn btn-link p-0 border-0" aria-haspopup="menu" aria-expanded={open? 'true':'false'} title="Powiadomienia" onClick={()=>setOpen(v=>!v)} onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); setOpen(v=>!v);} }}>
        <FaBell size={24} color="#ffffff" style={{ transform:'translateY(-1px)' }} />
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
    <div className="d-flex flex-column text-white" style={{ width:220, flex:'0 0 220px', backgroundColor:'#0a2b4c', padding:'1rem' }}>
      <h5 style={{ marginBottom:0, marginTop:3 }}>Menu</h5>
      <hr style={{ borderColor:'#fff', marginTop:'0.8rem', marginBottom:'0.75rem' }} />
      <div className="my-2" style={{ marginTop:'1rem' }}>
        <input aria-label="Wyszukaj w menu" type="text" className="form-control form-control-sm" placeholder="Wyszukaj..." value={search} onChange={(e)=>setSearch(e.target.value)} />
      </div>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className={linkClass('/workspace')} to="/workspace" aria-current={isActive('/workspace')? 'page': undefined} style={activeStyle('/workspace')} title="Dashboard">
            <BsHouse className="me-2"/> Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link className={linkClass('/klienci')} to="/klienci" aria-current={isActive('/klienci')? 'page': undefined} style={activeStyle('/klienci')} title="Klienci">
            <BsPeople className="me-2"/> Klienci
          </Link>
        </li>
        <li className="nav-item">
          <Link className={linkClass('/szablony')} to="/szablony" aria-current={isActive('/szablony')? 'page': undefined} style={activeStyle('/szablony')} title="Szablony">
            <BsFileText className="me-2"/> Szablony
          </Link>
        </li>
        <li className="nav-item">
          <Link className={linkClass('/projekty')} to="/projekty" aria-current={isActive('/projekty')? 'page': undefined} style={activeStyle('/projekty')} title="Projekty">
            <BsFolder className="me-2"/> Projekty
          </Link>
        </li>
        <li className="nav-item">
          <Link className={linkClass('/uzytkownicy')} to="/uzytkownicy" aria-current={isActive('/uzytkownicy')? 'page': undefined} style={activeStyle('/uzytkownicy')} title="Użytkownicy">
            <BsPerson className="me-2"/> Użytkownicy
          </Link>
        </li>
      </ul>
      <div className="mt-auto">
        <ul className="nav flex-column">
          <li className="nav-item"><a className="nav-link text-white" href="#"><BsGear className="me-2"/> Admin</a></li>
        </ul>
      </div>
    </div>
  );
}

export function Topbar({ breadcrumb, accountBtnRef, accountMenuRef, showAccount, setShowAccount, onLogout }){
  return (
    <div className="shadow-sm" style={{ backgroundColor:'#005679', padding:'0.5rem' }}>
      <div className="d-flex align-items-center justify-content-between px-4 py-2">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0" style={{ color:'#fff', ['--bs-breadcrumb-divider']:"'/'", ['--bs-breadcrumb-divider-color']:'#fff' }}>
            {breadcrumb.map((item, idx)=> (
              <li key={idx} className={"breadcrumb-item" + (item.active? ' active':'')} aria-current={item.active? 'page': undefined}>
                {item.to && !item.active? (<Link to={item.to} style={{ color:'#fff', textDecoration:'underline' }}>{item.label}</Link>): (<span style={{ color:'#fff' }}>{item.label}</span>)}
              </li>
            ))}
          </ol>
        </nav>
        <div className="d-flex align-items-center position-relative" style={{ gap:'0.25rem' }}>
          <Notifications />
          <button ref={accountBtnRef} className="btn btn-link p-0 border-0" aria-haspopup="menu" aria-expanded={showAccount? 'true':'false'} onClick={()=>setShowAccount(v=>!v)} onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); setShowAccount(v=>!v);} }} title="Konto">
            <FaUserCircle size={24} color="#ffffff" />
          </button>
          {showAccount && (
            <div ref={accountMenuRef} className="card shadow-sm" style={{ position:'absolute', right:0, top:'100%', marginTop:'0.5rem', minWidth:220, zIndex:2000 }} role="menu">
              <div className="card-body py-2">
                <div className="d-flex align-items-center mb-2"><FaUserCircle size={28} className="me-2" /><div><div className="fw-semibold">Jan Użytkownik</div><div className="text-muted small">jan@example.com</div></div></div>
                <hr className="my-2" />
                <button className="dropdown-item btn btn-link text-start w-100 px-0" onClick={()=>setShowAccount(false)}>Profil</button>
                <button className="dropdown-item btn btn-link text-start w-100 px-0" onClick={()=>setShowAccount(false)}>Ustawienia</button>
                <hr className="my-2" />
                {onLogout ? (
                  <button className="dropdown-item btn btn-link text-start w-100 px-0 text-danger" onClick={onLogout}>Wyloguj</button>
                ) : (
                  <a className="dropdown-item btn btn-link text-start w-100 px-0 text-danger" href="/">Wyloguj</a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
