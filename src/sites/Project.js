import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Sidebar, Topbar } from '../ui/Common_project.js';
import {BsChevronRight} from "react-icons/bs";


function ProgressMini({ value }) {
    const v = Math.max(0, Math.min(100, Math.round(value)));
    return (
        <div className="d-flex align-items-center" style={{ gap: '0.5rem', minWidth: 180 }}>
            <div
                className="flex-grow-1 position-relative"
                role="progressbar"
                aria-valuenow={v}
                aria-valuemin={0}
                aria-valuemax={100}
                style={{
                    height: 14,
                    background: '#eaf0f6',
                    borderRadius: 999,
                    border: '1px solid #d2dbea',
                    boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.04)',
                }}
            >
                <div
                    style={{
                        width: `${v}%`,
                        height: '100%',
                        borderRadius: 999,
                        background: 'var(--ndr-bg-topbar)',
                        position: 'relative',
                        transition: 'width 300ms ease',
                    }}
                >
          <span
              style={{
                  position: 'absolute',
                  right: -2,
                  top: -2,
                  bottom: -2,
                  width: 4,
                  background: '#ffffff55',
                  borderRadius: 2,
              }}
          />
                </div>
            </div>
            <div className="small text-muted" style={{ width: 40, textAlign: 'right' }}>
                {v}%
            </div>
        </div>
    );
}

// Rekurencyjna funkcja renderująca sekcje
function RenderSection({ section, level = 0 }) {
    const [open, setOpen] = useState(false);
    const indent = { marginLeft: `${level * 20}px` };

    return (
        <div style={{padding: "3px" }}>
            {section.label && (
                <div
                    onClick={() => setOpen(!open)}
                    className="fw-semibold"
                    style={{borderRadius: '0.35rem', backgroundColor: '#f7f9fa'}}>

                    <span>{section.label}</span>
                    <BsChevronRight
                        style={{
                            marginLeft: '0.4rem',
                            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease-in-out',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>
            )}

            {open && section.items && section.items.map((item, idx) => (
                <div
                    key={idx}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 6,
                        padding: 7,
                        background: '#f7f9fa',
                        ...indent
                    }}>
                    <div>{item.name}</div>
                    <div className="d-flex align-items-center gap-2">
                        <ProgressMini value={item.progress} />
                        <Link
                            to={item.to}
                            className="btn btn-sm"
                            style={{
                                backgroundColor: '#005679',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '0.35rem',
                                padding: '0.25rem 0.75rem'
                            }}
                        >
                            Otwórz
                        </Link>
                    </div>
                </div>
            ))}

            {open && section.sections && section.sections.map((subsection, idx) => (
                <RenderSection key={idx} section={subsection} level={level + 1} />
            ))}
        </div>
    );
}



export default function Project() {
    const { id } = useParams();
    const [search, setSearch] = useState('');
    const [showAccount, setShowAccount] = useState(false);
    const accountMenuRef = useRef(null);
    const accountBtnRef = useRef(null);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('I. Czynności wstępne');

    useEffect(() => {
        function onDoc(e) {
            if (!showAccount) return;
            const m = accountMenuRef.current, b = accountBtnRef.current;
            if (m && !m.contains(e.target) && b && !b.contains(e.target)) setShowAccount(false);
        }
        function onKey(e) { if (e.key === 'Escape') setShowAccount(false); }
        document.addEventListener('mousedown', onDoc);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDoc);
            document.removeEventListener('keydown', onKey);
        };
    }, [showAccount]);

    const tabData = useMemo(() => [
        {
            label: 'I. Czynności wstępne',
            questionnaires: [
                { name:'I.1 Test niezależności kluczowego biegłego rewidenta', code:'', progress: 70, to:'/kwestionariusz' },
                { name:'I.2 Test niezależności dla firmy audytorskiej', code:'', progress: 80, to:'/kwestionariusz' },
                { name:'I.3 Rola partnera odpowiedzialnego za zlecenie', code:'', progress: 30, to:'/kwestionariusz' },
                { name:'I.4 Rozpoznanie zagrożenia', code:'', progress: 20, to:'/kwestionariusz' },
                { name:'I.5 Wyznaczenie zespołu badającego', code:'', progress: 70, to:'/kwestionariusz' },
            ],
        },
        {
            label: 'II. Oszacowanie Ryzyka',
            sections: [
                {
                    label: 'II.1 Wstępne zagadnienia',
                    items: [
                        { name: 'II.1.1 Plan badania', code: 'DR 14.2', progress: 0, to: '/kwestionariusz' },
                        { name: 'II.1.2 Poznanie jednostki i otoczenia', code: 'DR 14.3', progress: 0, to: '/kwestionariusz' },
                        { name: 'II.1.3 Wstępny przegląd analityczny', code: 'DR 14.4', progress: 0, to: '/kwestionariusz' },
                        { name: 'II.1.4 Kontynuacja działalności', code: 'DR 14.5', progress: 0, to: '/kwestionariusz' },
                        { name: 'II.1.5 Ustalenie poziomów istotności', code: 'DR 14.6', progress: 0, to: '/kwestionariusz' },
                        { name: 'II.1.6 Bilans otwarcia / dane porównawcze', code: 'DR 14.7', progress: 0, to: '/kwestionariusz' },
                        { name: 'II.1.7 Odpowiedzialność dotycząca oszustw - lista kontrolna', code: 'DR 14.8', progress: 0, to: '/kwestionariusz' },
                        { name: 'II.1.8 Spotkania na etapie planowania', code: 'DR 14.9', progress: 0, to: '/kwestionariusz' },
                        { name: 'II.1.9 Memorandum planowania badania', code: 'DR 14.10', progress: 0, to: '/kwestionariusz' },
                        { name: 'II.1.10 Przykładowa lista kontrolna dotycząca zbioru stałego', code: 'DR 14.11', progress: 0, to: '/kwestionariusz' }
                    ]
                },
                {
                    label: 'II.2 Podejście do ryzyka nieodłącznego',
                    items: [
                        { name: 'II.2.1 Identyfikacja i ocena ryzyka na poziomie sprawozdania finansowego', code: 'DR 14.12', progress: 0, to: '/kwestionariusz' },
                        { name: 'II.2.2 Identyfikacja i ocena ryzyka na poziomie stwierdzeń', code: 'DR 14.13', progress: 0, to: '/kwestionariusz' },
                        { name: 'II.2.3 Identyfikacja i ocena ryzyka rozległego', code: 'DR 14.14', progress: 0, to: '/kwestionariusz' }
                    ]
                },
                {
                    label: 'II.3 Ogólne podejście do kontroli wewnętrznej',
                    items: [
                        { name: 'II.3.1 Program badania', code: 'DR 14.15', progress: 0, to: '/kwestionariusz' },
                        { name: 'II.3.2 Dokumentacja zrozumienia kontroli wewnętrznej jednostki', code: 'DR 14.16', progress: 0, to: '/kwestionariusz' },
                        { name: 'II.3.3 Opis kluczowych procesów i działań kontrolnych', code: 'DR 14.17', progress: 0, to: '/kwestionariusz' },
                        { name: 'II.3.4 Przegląd kontroli wewnętrznej', code: 'DR 14.18', progress: 0, to: '/kwestionariusz' },
                        { name: 'II.3.5 Testy kontroli wewnętrznej', code: 'DR 14.19', progress: 0, to: '/kwestionariusz' },
                        { name: 'II.3.6 Ocena kontroli wewnętrznej', code: 'DR 14.20', progress: 0, to: '/kwestionariusz' }
                    ]
                },
                {
                    label: 'II.4. Macierz ryzyk',
                    items: [
                        { name: 'II.4 Macierz ryzyk', code: 'DR 14.21', progress: 0, to: '/kwestionariusz' }
                    ]
                }
            ]
        },
        {
            label: "III. Reakcja na ryzyko - Badanie",
            questionnaires: [
                { name: "III.1 Tabela testu rewizyjnego", code: "DR 15.1", progress: 0, to: "/kwestionariusz" },
                { name: "III.2 Wartości niematerialne i prawne", code: "DR 15.2", progress: 0, to: "/kwestionariusz" },
                { name: "III.3 Rzeczowe aktywa stałe", code: "DR 15.3", progress: 0, to: "/kwestionariusz" },
                { name: "III.4 Inwestycje", code: "DR 15.4", progress: 0, to: "/kwestionariusz" },
                { name: "III.5 Zapasy", code: "DR 15.5", progress: 0, to: "/kwestionariusz" },
                { name: "III.6 Należności", code: "DR 15.6", progress: 0, to: "/kwestionariusz" },
                { name: "III.7 Rozliczenia międzyokresowe", code: "DR 15.7", progress: 0, to: "/kwestionariusz" },
                { name: "III.8 Środki pieniężne", code: "DR 15.8", progress: 0, to: "/kwestionariusz" },
                { name: "III.9 Kapitały (fundusze) własne", code: "DR 15.9", progress: 0, to: "/kwestionariusz" },
                { name: "III.10 Rezerwy na zobowiązania warunkowe i zabezpieczenia", code: "DR 15.10", progress: 0, to: "/kwestionariusz" },
                { name: "III.11 Zobowiązania, fundusze specjalne i rozliczenia międzyokresowe (pasywa)", code: "DR 15.11", progress: 0, to: "/kwestionariusz" },
                { name: "III.12 Przychody", code: "DR 15.12", progress: 0, to: "/kwestionariusz" },
                { name: "III.13 Koszty", code: "DR 15.13", progress: 0, to: "/kwestionariusz" },
                { name: "III.14 Podatek dochodowy", code: "DR 15.14", progress: 0, to: "/kwestionariusz" },
                { name: "III.15 Rachunek przepływów pieniężnych", code: "DR 15.15", progress: 0, to: "/kwestionariusz" },
            ]
        },
        {
            label: "IV. Pozostałe procedury",
            questionnaires: [
                { name: "IV.1 Zestawienie obrotów i sald", code: "DR 16.1", progress: 0, to: "/kwestionariusz" },
                { name: "IV.2 Podmioty powiązane", code: "DR 16.2", progress: 0, to: "/kwestionariusz" },
                { name: "IV.3 Przestrzeganie prawa i regulacji", code: "DR 16.3", progress: 0, to: "/kwestionariusz" },
                { name: "IV.4 Późniejsze zdarzenia", code: "DR 16.4", progress: 0, to: "/kwestionariusz" },
                { name: "IV.5 Kontynuacja działalności", code: "DR 16.5", progress: 0, to: "/kwestionariusz" },
                { name: "IV.6 Sprawozdanie finansowe", code: "DR 16.6", progress: 0, to: "/kwestionariusz" },
                { name: "IV.7 Sprawozdanie z działalności", code: "DR 16.7", progress: 0, to: "/kwestionariusz" },
            ]
        },
        {
            label: "V. Podsumowanie",
            questionnaires: [
                { name: "V.1 Zagadnienia wymagające konsultacji", code: "DR 17.1", progress: 0, to: "/kwestionariusz" },
                { name: "V.2 Końcowy przegląd analityczny - program badania", code: "DR 17.2", progress: 0, to: "/kwestionariusz" },
                { name: "V.3 Zbiorcze zestawienie zniekształceń", code: "DR 17.3", progress: 0, to: "/kwestionariusz" },
                { name: "V.4 Oświadczenia końcowe", code: "DR 17.4", progress: 0, to: "/kwestionariusz" },
                { name: "V.5 Sprawozdanie biegłego rewidenta - kwestie do rozważenia", code: "DR 17.5", progress: 0, to: "/kwestionariusz" },
                { name: "V.6 Komunikacja z osobami sprawującymi nadzór", code: "DR 17.6", progress: 0, to: "/kwestionariusz" },
                { name: "V.7 Zakończenie badania zasadniczego i podsumowanie wyników badania", code: "DR 17.7", progress: 0, to: "/kwestionariusz" },
                { name: "V.8 Kontrola jakości wykonania zlecenia", code: "DR 17.8", progress: 0, to: "/kwestionariusz" },
                { name: "V.9 Lista spraw do rozważenia na przyszłość", code: "DR 17.9", progress: 0, to: "/kwestionariusz" },
            ]
        },
        // ... inne zakładki III, IV, V
    ], []);

    const breadcrumb = [
        { label: 'Home', to: '/' },
        { label: 'Projekty', to: '/projekty' },
        { label: `Projekt ${id}`, active: true },
    ];


    return (
        <div className="d-flex min-vh-100">
            <Sidebar search={search} setSearch={setSearch} />
            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: 'hidden' }}>
                <Topbar
                    breadcrumb={breadcrumb}
                    accountBtnRef={accountBtnRef}
                    accountMenuRef={accountMenuRef}
                    showAccount={showAccount}
                    setShowAccount={setShowAccount}
                    onLogout={() => { navigate('/'); setShowAccount(false); }}
                />

                <div className="flex-grow-1 bg-light p-3" style={{ minHeight: 0, overflow: 'auto' }}>
                    <div className="container-fluid" style={{ maxWidth: 1100 }}>
                        <h4 className="mb-4">Projekt {id}</h4>

                        <div className="card shadow-sm">
                            {/* Karty Tabów w nagłówku */}
                            <div className="card-header p-0" style={{ backgroundColor: '#0a2b4c' }}>
                                <div className="d-flex">
                                    {tabData.map((tab, idx) => (
                                        <button
                                            key={idx}
                                            className={`flex-grow-1 text-center py-2 fw-semibold`}
                                            style={{
                                                color: activeTab === tab.label ? '#ffffff' : '#cfd8dc',
                                                backgroundColor: activeTab === tab.label ? '#005679' : 'transparent',
                                                border: 'none',
                                                transition: '0.2s',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => setActiveTab(tab.label)}
                                            onMouseEnter={e => { if (activeTab !== tab.label) e.currentTarget.style.backgroundColor = '#004b63'; }}
                                            onMouseLeave={e => { if (activeTab !== tab.label) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Treść aktywnego taba */}
                            <div className="card-body p-3">
                                {tabData.map((tab, idx) =>
                                    activeTab === tab.label ? (
                                        <div key={idx} className="d-flex flex-column gap-3">
                                            {tab.sections
                                                ? tab.sections.map((section, sidx) => (
                                                    <div
                                                        key={sidx}
                                                        className="p-2 shadow-sm"
                                                        style={{ borderRadius: '0.35rem', backgroundColor: '#f7f9fa' }}
                                                    >
                                                        <RenderSection section={section} />
                                                    </div>
                                                ))
                                                : tab.questionnaires
                                                    ? tab.questionnaires.map((q, qidx) => (
                                                        <div
                                                            key={qidx}
                                                            className="d-flex align-items-center justify-content-between p-2 shadow-sm"
                                                            style={{ borderRadius: '0.35rem', backgroundColor: '#f7f9fa' }}
                                                        >
                                                            <div className="fw-semibold">{q.name}</div>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <ProgressMini value={q.progress} />
                                                                <Link
                                                                    to={q.to}
                                                                    className="btn btn-sm"
                                                                    style={{
                                                                        backgroundColor: '#005679',
                                                                        color: '#ffffff',
                                                                        border: 'none',
                                                                        borderRadius: '0.35rem',
                                                                        padding: '0.25rem 0.75rem'
                                                                    }}
                                                                >
                                                                    Otwórz
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ))
                                                    : null}
                                        </div>
                                    ) : null
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
