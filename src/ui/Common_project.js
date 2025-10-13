import React, { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {BsCollection, BsPlayCircle, BsShieldCheck, BsGraphUp, BsListCheck, BsPersonGear, BsInfoCircle, BsClipboardCheck, BsChevronRight, BsGear} from "react-icons/bs";

export function Sidebar({ search, setSearch, project }) { // <-- accept project as prop
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
        {
            label: 'Dashboard',
            to: project ? `/projekty/${encodeURIComponent(project.id)}` : '/projekty', // no literal ':id'
            icon: <BsPlayCircle className="me-2" />
        },
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
