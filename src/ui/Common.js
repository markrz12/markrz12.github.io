import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {BsHouse, BsPeople, BsFileText, BsFolder, BsPerson, BsGear, BsBell,} from "react-icons/bs";

// 🔹 wspólny hook do obsługi dropdownów
function useDropdown() {
    const [open, setOpen] = useState(false);
    const btnRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const handleClick = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                btnRef.current &&
                !btnRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        const handleKey = (e) => e.key === "Escape" && setOpen(false);

        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, [open]);

    return { open, setOpen, btnRef, menuRef };
}

// 🔹 Avatar z inicjałami
export function InitialsAvatar({ name = "Jan Użytkownik", size = 26 }) {
    const initials =
        String(name || "")
            .split(/\s|\.|-/)
            .filter(Boolean)
            .slice(0, 2)
            .map((s) => s[0]?.toUpperCase())
            .join("") || "?";

    return (
        <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
                width: size,
                height: size,
                background: "#e6edf5",
                color: "#0f2a3d",
                fontWeight: 600,
                fontSize: size > 24 ? "0.8rem" : "0.7rem",
                border: "1px solid #d7e3f2",
            }}
        >
            {initials}
        </div>
    );
}

// 🔹 Dropdown powiadomień
export function Notifications() {
    const { open, setOpen, btnRef, menuRef } = useDropdown();

    return (
        <div className="position-relative me-2">
            <button
                ref={btnRef}
                className="btn p-0 d-flex align-items-center justify-content-center border rounded-circle"
                onClick={() => setOpen((v) => !v)}
                style={{ width: 30, height: 30, background: "transparent" }}
            >
                <BsBell size={18} color="#fff" />
            </button>

            {open && (
                <div
                    ref={menuRef}
                    className="card shadow-sm"
                    style={{
                        position: "absolute",
                        right: 0,
                        top: "100%",
                        marginTop: "0.5rem",
                        minWidth: 260,
                        zIndex: 2000,
                    }}
                >
                    <div className="card-header py-2">
                        <strong>Powiadomienia</strong>
                    </div>
                    <div className="card-body p-0" style={{ maxHeight: 280, overflowY: "auto" }}>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item small">Brak nowych powiadomień</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

// 🔹 Dropdown konta
function AccountMenu({ onLogout }) {
    const { open, setOpen, btnRef, menuRef } = useDropdown();

    return (
        <div className="position-relative">
            <button
                ref={btnRef}
                className="btn p-0 border-0 d-flex align-items-center gap-2"
                onClick={() => setOpen((v) => !v)}
                style={{
                    padding: "2px 8px",
                    border: "1px solid rgba(255,255,255,0.35)",
                    borderRadius: 999,
                    color: "#fff",
                    background: "transparent",
                }}
            >
                <InitialsAvatar name="Jan Użytkownik" size={26} />
                <span style={{ fontSize: 12, opacity: 0.9 }}>▾</span>
            </button>

            {open && (
                <div
                    ref={menuRef}
                    className="card shadow-sm"
                    style={{
                        position: "absolute",
                        right: 0,
                        top: "100%",
                        marginTop: "0.5rem",
                        minWidth: 260,
                        zIndex: 2000,
                    }}
                >
                    <div className="card-body py-2">
                        <div className="d-flex align-items-center mb-2 gap-2">
                            <InitialsAvatar name="Jan Użytkownik" size={28} />
                            <div>
                                <div className="text-muted small">Zalogowano jako</div>
                                <div className="fw-semibold">Jan Użytkownik</div>
                                <div className="text-muted small">jan@example.com</div>
                            </div>
                        </div>
                        <hr />
                        <button className="dropdown-item btn btn-link text-start w-100 px-0">
                            👤 Profil
                        </button>
                        <button className="dropdown-item btn btn-link text-start w-100 px-0">
                            ⚙️ Ustawienia
                        </button>
                        <hr />
                        {onLogout ? (
                            <button
                                className="dropdown-item btn btn-link text-start w-100 px-0 text-danger"
                                onClick={onLogout}
                            >
                                🚪 Wyloguj
                            </button>
                        ) : (
                            <a
                                className="dropdown-item btn btn-link text-start w-100 px-0 text-danger"
                                href="/"
                            >
                                🚪 Wyloguj
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// 🔹 Sidebar
export function Sidebar({ search, setSearch }) {
    const location = useLocation();
    const isActive = (to) => location.pathname.startsWith(to);

    const links = [
        { to: "/workspace", icon: <BsHouse />, label: "Dashboard" },
        { to: "/klienci", icon: <BsPeople />, label: "Klienci" },
        { to: "/szablony", icon: <BsFileText />, label: "Szablony" },
        { to: "/projekty", icon: <BsFolder />, label: "Projekty" },
        { to: "/uzytkownicy", icon: <BsPerson />, label: "Użytkownicy" },
    ];

    return (
        <div
            className="d-flex flex-column text-white"
            style={{
                width: 240,
                flex: "0 0 240px",
                background: "var(--ndr-bg-sidebar)",
                padding: "1.25rem",
            }}
        >
            <h5 className="mt-1 mb-0">NDR</h5>
            <hr className="my-3" />
            <input
                type="text"
                className="form-control form-control-sm mb-3"
                placeholder="Wyszukaj..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <ul className="nav flex-column">
                {links.map((link) => (
                    <li key={link.to} className="nav-item">
                        <Link
                            to={link.to}
                            className="nav-link text-white d-flex align-items-center"
                            style={
                                isActive(link.to)
                                    ? { background: "rgba(255,255,255,0.12)", borderRadius: 4 }
                                    : {}
                            }
                        >
                            <span className="me-2">{link.icon}</span> {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="mt-auto">
                <button className="nav-link btn btn-link text-white p-0 text-start">
                    <BsGear className="me-2" /> Admin
                </button>
            </div>
        </div>
    );
}

// 🔹 Topbar
export function Topbar({ breadcrumb, onLogout }){
    const [openNotifications, setOpenNotifications] = useState(false);

    const [showAccount, setShowAccount] = useState(false);
    const accountBtnRef = useRef(null);
    const accountMenuRef = useRef(null);

    const notificationsPopRef = useRef(null);
    const notificationsBtnRef = useRef(null);

    // obsługa powiadomień
    useEffect(() => {
        if (!openNotifications) return;

        const handleClick = (e) => {
            if (
                notificationsPopRef.current &&
                !notificationsPopRef.current.contains(e.target) &&
                notificationsBtnRef.current &&
                !notificationsBtnRef.current.contains(e.target)
            ) {
                setOpenNotifications(false);
            }
        };

        const handleKey = (e) => {
            if (e.key === "Escape") setOpenNotifications(false);
        };

        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);

        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, [openNotifications]);

// obsługa konta
    useEffect(() => {
        if (!showAccount) return;

        const handleClick = (e) => {
            if (
                accountMenuRef.current &&
                !accountMenuRef.current.contains(e.target) &&
                accountBtnRef.current &&
                !accountBtnRef.current.contains(e.target)
            ) {
                setShowAccount(false);
            }
        };

        const handleKey = (e) => {
            if (e.key === "Escape") setShowAccount(false);
        };

        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);

        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, [showAccount]);


    return (
        <div className="shadow-sm" style={{ backgroundColor:'var(--ndr-bg-topbar)', padding:'0.5rem' }}>
            <div className="d-flex align-items-center justify-content-between px-4 py-2">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0" style={{ color:'#fff', "--bs-breadcrumb-divider":"'/'", "--bs-breadcrumb-divider-color":'#fff' }}>
                        {breadcrumb.map((item, idx)=> (
                            <li key={idx} className={"breadcrumb-item" + (item.active? ' active':'')} aria-current={item.active? 'page': undefined}>
                                {item.to && !item.active? (<Link to={item.to} style={{ color:'#fff', textDecoration:'underline' }}>{item.label}</Link>): (<span style={{ color:'#fff' }}>{item.label}</span>)}
                            </li> ))}
                    </ol>
                </nav>
                <div className="d-flex align-items-center position-relative" style={{ gap:'0.25rem' }}>
                    <Notifications open={openNotifications} setOpen={setOpenNotifications} popRef={notificationsPopRef} btnRef={notificationsBtnRef} />
                    <button ref={accountBtnRef} className="btn p-0 border-0" aria-haspopup="menu" aria-expanded={showAccount? 'true':'false'} onClick={()=>setShowAccount(v=>!v)}
                            onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); setShowAccount(v=>!v);} }} title="Konto"
                            style={{ padding:'2px 8px', border:'1px solid rgba(255,255,255,0.35)',
                                borderRadius:999, color:'#fff',
                                display:'flex', alignItems:'center',
                                gap:6, background:'transparent' }}
                            onMouseOver={(e)=>{ e.currentTarget.style.background='rgba(255,255,255,0.12)'; }}
                            onMouseOut={(e)=>{ e.currentTarget.style.background='transparent'; }} >
                        <InitialsAvatar name="Jan Użytkownik" size={26} />
                        <span aria-hidden="true"
                              style={{ fontSize:12, opacity:0.9, lineHeight:1, transform:'translateY(1px)' }}>▾
                        </span>
                    </button>
                    {showAccount && ( <div ref={accountMenuRef} className="card shadow-sm"
                                           style={{ position:'absolute', right:0, top:'100%', marginTop:'0.5rem', minWidth:260,
                                               zIndex:2000 }} role="menu" > <div className="card-body py-2">
                        <div className="d-flex align-items-center mb-2" style={{ gap:'0.5rem' }}>
                            <InitialsAvatar name="Jan Użytkownik" size={28} /> <div> <div className="text-muted small mb-1"
                                                                                          style={{ lineHeight:1 }}>Zalogowano jako</div>
                            <div className="fw-semibold mb-1" style={{ lineHeight:1.1 }}>Jan Użytkownik</div>
                            <div className="text-muted small">jan@example.com</div> </div> </div> <hr className="my-2" />
                        <button role="menuitem" className="dropdown-item btn btn-link text-start w-100 px-0 d-flex align-items-center"
                                onClick={()=>setShowAccount(false)}> <span className="me-2">👤</span> Profil </button>
                        <button role="menuitem" className="dropdown-item btn btn-link text-start w-100 px-0 d-flex align-items-center"
                                onClick={()=>setShowAccount(false)}> <span className="me-2">⚙️</span> Ustawienia </button>
                        <hr className="my-2" /> {onLogout ? (
                            <button role="menuitem" className="dropdown-item btn btn-link text-start w-100 px-0 text-danger d-flex align-items-center" onClick={onLogout}>
                                <span className="me-2">🚪</span> Wyloguj </button>) : (
                                    <a role="menuitem" className="dropdown-item btn btn-link text-start w-100 px-0 text-danger d-flex align-items-center" href="/">
                                        <span className="me-2">🚪</span> Wyloguj </a> )}
                    </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
}

