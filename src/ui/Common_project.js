import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {BsCollection, BsPlayCircle, BsShieldCheck, BsGraphUp, BsListCheck, BsHouse, BsPersonGear, BsInfoCircle, BsClipboardCheck, BsChevronRight, BsGear, BsBell} from "react-icons/bs";

export function InitialsAvatar({ name = "Jan Użytkownik", size = 26 }) {
    const initials = String(name || "")
        .split(/\s|\.|-/).filter(Boolean).slice(0, 2)
        .map(s => s[0]?.toUpperCase()).join('') || '?';
    const dim = size;
    return (
        <div
            className="rounded-circle"
            aria-hidden="true"
            style={{
                width: dim,
                height: dim,
                background: '#e6edf5',
                color: '#0f2a3d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: dim > 24 ? '0.8rem' : '0.7rem',
                border: '1px solid #d7e3f2'
            }}
        >
            {initials}
        </div>
    );
}
export function Topbar({ breadcrumb, accountBtnRef, accountMenuRef, showAccount, setShowAccount, onLogout }){ const [openNotifications, setOpenNotifications] = useState(false); const notificationsPopRef = useRef(null); const notificationsBtnRef = useRef(null); useEffect(()=>{ function onDoc(e){ if(!openNotifications) return; const p=notificationsPopRef.current,b=notificationsBtnRef.current; if(p&&!p.contains(e.target)&&b&&!b.contains(e.target)) setOpenNotifications(false);} function onKey(e){ if(e.key==='Escape') setOpenNotifications(false);} document.addEventListener('mousedown',onDoc); document.addEventListener('keydown',onKey); return ()=>{ document.removeEventListener('mousedown',onDoc); document.removeEventListener('keydown',onKey); }; },[openNotifications]); return ( <div className="shadow-sm" style={{ backgroundColor:'var(--ndr-bg-topbar)', padding:'0.5rem' }}> <div className="d-flex align-items-center justify-content-between px-4 py-2"> <nav aria-label="breadcrumb"> <ol className="breadcrumb mb-0" style={{ color:'#fff', "--bs-breadcrumb-divider":"'/'", "--bs-breadcrumb-divider-color":'#fff' }}> {breadcrumb.map((item, idx)=> ( <li key={idx} className={"breadcrumb-item" + (item.active? ' active':'')} aria-current={item.active? 'page': undefined}> {item.to && !item.active? (<Link to={item.to} style={{ color:'#fff', textDecoration:'underline' }}>{item.label}</Link>): (<span style={{ color:'#fff' }}>{item.label}</span>)} </li> ))} </ol> </nav> <div className="d-flex align-items-center position-relative" style={{ gap:'0.25rem' }}> <Notifications open={openNotifications} setOpen={setOpenNotifications} popRef={notificationsPopRef} btnRef={notificationsBtnRef} /> <button ref={accountBtnRef} className="btn p-0 border-0" aria-haspopup="menu" aria-expanded={showAccount? 'true':'false'} onClick={()=>setShowAccount(v=>!v)} onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); setShowAccount(v=>!v);} }} title="Konto" style={{ padding:'2px 8px', border:'1px solid rgba(255,255,255,0.35)', borderRadius:999, color:'#fff', display:'flex', alignItems:'center', gap:6, background:'transparent' }} onMouseOver={(e)=>{ e.currentTarget.style.background='rgba(255,255,255,0.12)'; }} onMouseOut={(e)=>{ e.currentTarget.style.background='transparent'; }} > <InitialsAvatar name="Jan Użytkownik" size={26} /> <span aria-hidden="true" style={{ fontSize:12, opacity:0.9, lineHeight:1, transform:'translateY(1px)' }}>▾</span> </button> {showAccount && ( <div ref={accountMenuRef} className="card shadow-sm" style={{ position:'absolute', right:0, top:'100%', marginTop:'0.5rem', minWidth:260, zIndex:2000 }} role="menu" > <div className="card-body py-2"> <div className="d-flex align-items-center mb-2" style={{ gap:'0.5rem' }}> <InitialsAvatar name="Jan Użytkownik" size={28} /> <div> <div className="text-muted small mb-1" style={{ lineHeight:1 }}>Zalogowano jako</div> <div className="fw-semibold mb-1" style={{ lineHeight:1.1 }}>Jan Użytkownik</div> <div className="text-muted small">jan@example.com</div> </div> </div> <hr className="my-2" /> <button role="menuitem" className="dropdown-item btn btn-link text-start w-100 px-0 d-flex align-items-center" onClick={()=>setShowAccount(false)}> <span className="me-2">👤</span> Profil </button> <button role="menuitem" className="dropdown-item btn btn-link text-start w-100 px-0 d-flex align-items-center" onClick={()=>setShowAccount(false)}> <span className="me-2">⚙️</span> Ustawienia </button> <hr className="my-2" /> {onLogout ? ( <button role="menuitem" className="dropdown-item btn btn-link text-start w-100 px-0 text-danger d-flex align-items-center" onClick={onLogout}> <span className="me-2">🚪</span> Wyloguj </button> ) : ( <a role="menuitem" className="dropdown-item btn btn-link text-start w-100 px-0 text-danger d-flex align-items-center" href="/"> <span className="me-2">🚪</span> Wyloguj </a> )} </div> </div> )} </div> </div> </div> ); }

export function Notifications({ open, setOpen, popRef, btnRef }) {
    return (
        <div className="position-relative me-2">
            <button
                ref={btnRef}
                className="btn p-0 d-inline-flex align-items-center justify-content-center border rounded-circle"
                aria-haspopup="menu"
                aria-expanded={open ? 'true' : 'false'}
                title="Powiadomienia"
                onClick={() => setOpen(v => !v)}
                style={{ width: 30, height: 30, borderColor: 'rgba(255,255,255,0.6)', borderWidth: '1.25px', background: 'transparent' }}
            >
                <BsBell size={18} color="#ffffff" />
            </button>
            {open && (
                <div ref={popRef} className="card shadow-sm" style={{ position: 'absolute', right: '100%', transform: 'translateX(8px)', top: '100%', marginTop: '0.5rem', minWidth: 260, zIndex: 2000 }}>
                    <div className="card-header py-2"><strong>Powiadomienia</strong></div>
                    <div className="card-body p-0" style={{ maxHeight: 280, overflowY: 'auto' }}>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item small">Brak nowych powiadomień</li>
                        </ul>
                    </div>
                    <div className="card-footer py-2 text-end">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setOpen(false)}>Zamknij</button>
                    </div>
                </div>
            )}
        </div>
    );
}



export function Sidebar({ search, setSearch }) {
    const location = useLocation();
    const isActive = (to) => {
        if (!to) return false;
        return location.pathname === to;
    };

    const linkClass = (to) => "nav-link text-white" + (isActive(to) ? " active" : "");
    const activeStyle = (to) => isActive(to) ? { background: 'rgba(255,255,255,0.12)', borderRadius: 4 } : undefined;

    const [openCategory, setOpenCategory] = useState(null);
    const [openSubmenu, setOpenSubmenu] = useState({});

    const menuItems = [
        { label: 'Lista Projektów', to: '/projekty', icon: <BsCollection className="me-2" /> },
        { label: 'Dashboard', to: '/projekty/r', icon: <BsHouse className="me-2" /> },
        { label: 'Użytkownicy', to: '/projekt-konfiguracja', icon: <BsPersonGear className="me-2" /> },
        { label: "Informacje", to: '/informacjeMSB', icon: <BsInfoCircle className="me-2" /> }
    ];

    const questionnaireCategories = useMemo(() => [
        {
            label: "I. Rozpoczęcie",
            icon: <BsPlayCircle className="me-2" />,
            questionnaires: [
                { name: 'I.1 Test niezależności kluczowego biegłego rewidenta', to: '/kwestionariusz-prosty' },
                { name: 'I.2 Test niezależności dla firmy audytorskiej', to: '/kwestionariusz-dynamiczny' },
                { name: 'I.3 Rola partnera odpowiedzialnego za zlecenie', to: '/kwestionariusz-tekstowy' },
                { name: 'I.4 Rozpoznanie zagrożenia', to: '/kwestionariusz-check' },
                { name: 'I.5 Wyznaczenie zespołu badającego', to: '/kwestionariusz' },
            ]
        },
        {
            label: "II. Ryzyko",
            icon: <BsShieldCheck className="me-2" />,
            questionnaires: [
                {
                    name: "II.1 Wstępne zagadnienia",
                    subQuestionnaires: [
                        { name: 'II.1.1 Plan badania', to: '/kwestionariusz-tabela' },
                        { name: 'II.1.2 Poznanie jednostki i otoczenia',  to: '/kwestionariusz' },
                        { name: 'II.1.3 Wstępny przegląd analityczny',  to: '/kwestionariusz' },
                        { name: 'II.1.4 Kontynuacja działalności',  to: '/kwestionariusz' },
                        { name: 'II.1.5 Ustalenie poziomów istotności',  to: '/kwestionariusz' },
                        { name: 'II.1.6 Bilans otwarcia / dane porównawcze',  to: '/kwestionariusz' },
                        { name: 'II.1.7 Odpowiedzialność dotycząca oszustw - lista kontrolna',  to: '/kwestionariusz' },
                        { name: 'II.1.8 Spotkania na etapie planowania', to: '/kwestionariusz' },
                        { name: 'II.1.9 Memorandum planowania badania',  to: '/kwestionariusz' },
                        { name: 'II.1.10 Przykładowa lista kontrolna dotycząca zbioru stałego', to: '/kwestionariusz' }
                    ]
                },
                {name: 'II.2 Podejście do ryzyka nieodłącznego',
                    subQuestionnaires: [
                        { name: 'II.3.1 Program badania', to: '/kwestionariusz' },
                        { name: 'II.3.2 Dokumentacja zrozumienia kontroli wewnętrznej jednostki', to: '/kwestionariusz' },
                        { name: 'II.3.3 Opis kluczowych procesów i działań kontrolnych', to: '/kwestionariusz' },
                        { name: 'II.3.4 Przegląd kontroli wewnętrznej',to: '/kwestionariusz' },
                        { name: 'II.3.5 Testy kontroli wewnętrznej', to: '/kwestionariusz' },
                        { name: 'II.3.6 Ocena kontroli wewnętrznej',  to: '/kwestionariusz' }
                    ]

                },

                {name: 'II.3 Ogólne podejście do kontroli wewnętrznej',
                    subQuestionnaires: [
                        { name: 'II.2.1 Identyfikacja i ocena ryzyka na poziomie sprawozdania finansowego', to: '/kwestionariusz' },
                        { name: 'II.2.2 Identyfikacja i ocena ryzyka na poziomie stwierdzeń',  to: '/kwestionariusz' },
                        { name: 'II.2.3 Identyfikacja i ocena ryzyka rozległego', to: '/kwestionariusz' }
                    ]

                },
                { name: "II.4 Macierz ryzyk", to: "/kwestionariusz" }
            ]
        },
        {
            label: "III. Badanie",
            icon: <BsGraphUp className="me-2" />,
            questionnaires: [
                { name: "III.1 Tabela testu rewizyjnego", to: "/kwestionariusz" },
                { name: "III.2 Wartości niematerialne i prawne",  to: "/kwestionariusz" },
                { name: "III.3 Rzeczowe aktywa stałe", to: "/kwestionariusz" },
                { name: "III.4 Inwestycje", to: "/kwestionariusz" },
                { name: "III.5 Zapasy", to: "/kwestionariusz" },
                { name: "III.6 Należności",  to: "/kwestionariusz" },
                { name: "III.7 Rozliczenia międzyokresowe", to: "/kwestionariusz" },
                { name: "III.8 Środki pieniężne",  to: "/kwestionariusz" },
                { name: "III.9 Kapitały (fundusze) własne",  to: "/kwestionariusz" },
                { name: "III.10 Rezerwy na zobowiązania warunkowe i zabezpieczenia",  to: "/kwestionariusz" },
                { name: "III.11 Zobowiązania, fundusze specjalne i rozliczenia międzyokresowe (pasywa)",  to: "/kwestionariusz" },
                { name: "III.12 Przychody", to: "/kwestionariusz" },
                { name: "III.13 Koszty", to: "/kwestionariusz" },
                { name: "III.14 Podatek dochodowy",  to: "/kwestionariusz" },
                { name: "III.15 Rachunek przepływów pieniężnych",  to: "/kwestionariusz" },
            ]
        },
        {
            label: "IV. Procedury",
            icon: <BsListCheck className="me-2" />,
            questionnaires: [
                { name: "IV.1 Zestawienie obrotów i sald", to: "/kwestionariusz" },
                { name: "IV.2 Podmioty powiązane", to: "/kwestionariusz" },
                { name: "IV.3 Przestrzeganie prawa i regulacji", to: "/kwestionariusz" },
                { name: "IV.4 Późniejsze zdarzenia", to: "/kwestionariusz" },
                { name: "IV.5 Kontynuacja działalności",  to: "/kwestionariusz" },
                { name: "IV.6 Sprawozdanie finansowe",to: "/kwestionariusz" },
                { name: "IV.7 Sprawozdanie z działalności",  to: "/kwestionariusz" },
            ]
        },
        {
            label: "V. Podsumowanie",
            icon: <BsClipboardCheck className="me-2" />,
            questionnaires: [
                { name: "V.1 Zagadnienia wymagające konsultacji",  to: "/kwestionariusz" },
                { name: "V.2 Końcowy przegląd analityczny - program badania", to: "/kwestionariusz" },
                { name: "V.3 Zbiorcze zestawienie zniekształceń", to: "/kwestionariusz" },
                { name: "V.4 Oświadczenia końcowe", to: "/kwestionariusz" },
                { name: "V.5 Sprawozdanie biegłego rewidenta - kwestie do rozważenia", to: "/kwestionariusz" },
                { name: "V.6 Komunikacja z osobami sprawującymi nadzór",  to: "/kwestionariusz" },
                { name: "V.7 Zakończenie badania zasadniczego i podsumowanie wyników badania",  to: "/kwestionariusz" },
                { name: "V.8 Kontrola jakości wykonania zlecenia",  to: "/kwetionariusz" },
                { name: "V.9 Lista spraw do rozważenia na przyszłość",  to: "/kwestionariusz" },
            ]
        }
    ], []);

    return (
        <div className="d-flex flex-column text-white" style={{ width: 240, flex: '0 0 240px', backgroundColor: 'var(--ndr-bg-sidebar)', padding: '1.25rem' }}>
            <h5 style={{ marginBottom: 0, marginTop: 3 }}>NDR</h5>
            <hr style={{ borderColor: '#fff', marginTop: '0.8rem', marginBottom: '0.75rem' }} />
            <div className="my-2" style={{ marginTop: '1rem' }}>
                <div className="input-group input-group-sm">
                    <input aria-label="Wyszukaj w menu" type="text" className="form-control" placeholder="Wyszukaj..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ borderColor: 'rgba(255,255,255,0.25)' }} />
                </div>

            </div>

            <ul className="nav flex-column">
                {menuItems.map((item, idx) => (
                    <li key={idx} className="nav-item">
                        <Link className={linkClass(item.to)} to={item.to || "#"} style={activeStyle(item.to)}>{item.icon} {item.label}</Link>
                    </li>
                ))}

                {questionnaireCategories.map((category, idx) => (
                    <li key={idx} className="nav-item">
                        <button className={`nav-link text-white w-100 text-start d-flex align-items-center ${openCategory === category.label ? 'active' : ''}`}
                                onClick={() => setOpenCategory(openCategory === category.label ? null : category.label)}
                        >
                            {category.icon} {category.label}
                            <BsChevronRight className="ms-auto" style={{ transform: openCategory === category.label ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease-in-out', fontSize: '0.7rem' }} />
                        </button>
                        {openCategory === category.label && (
                            <ul className="nav flex-column ps-3">
                                {category.questionnaires.map((q, qIdx) => (
                                    <li key={qIdx} className="nav-item">
                                        {q.subQuestionnaires ? (
                                            <>
                                                <button
                                                    className="nav-link text-white w-100 text-start d-flex align-items-center"
                                                    onClick={() => setOpenSubmenu(prev => ({ ...prev, [q.name]: !prev[q.name] }))}
                                                    style={{ fontSize: '0.8rem', paddingLeft: 0 }} // wyrównane do lewej
                                                >
                                                    {q.name}
                                                    <BsChevronRight
                                                        className="ms-auto"
                                                        style={{
                                                            transform: openSubmenu[q.name] ? 'rotate(90deg)' : 'none',
                                                            transition: 'transform 0.2s ease-in-out',
                                                            fontSize: '0.7rem' // mniejsza ikonka
                                                        }}
                                                    />
                                                </button>
                                                {openSubmenu[q.name] && (
                                                    <ul className="nav flex-column ps-3"> {/* sub-elementy mają lekki lewy padding */}
                                                        {q.subQuestionnaires.map((sub, subIdx) => (
                                                            <li key={subIdx} className="nav-item">
                                                                <Link
                                                                    className={linkClass(sub.to)}
                                                                    to={sub.to}
                                                                    style={{ fontSize: '0.75rem', paddingLeft: '0.5rem' }} // sub-elementy odsunięte
                                                                >
                                                                    {sub.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </>
                                        ) : (
                                            <Link className={linkClass(q.to)} to={q.to} style={{ fontSize: '0.85rem', paddingLeft: 0 }}>
                                                {q.name}
                                            </Link>
                                        )}

                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>

            <div className="mt-auto">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <button type="button" className="nav-link btn btn-link text-white p-0 text-start"><BsGear className="me-2" /> Admin</button>
                    </li>
                </ul>
            </div>
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
