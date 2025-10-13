import React, {useEffect, useRef, useState} from "react";
import {BsBell} from "react-icons/bs";

export function useDropdown() {
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
                fontSize: dim > 20 ? '0.9rem' : '0.7rem',
                border: '1px solid #d7e3f2'
            }}
        >
            {initials}
        </div>
    );
}

export function Notifications() {
    const { open, setOpen, btnRef, menuRef } = useDropdown();

    const notifications = [
        { id: 1, user: "Anna Kowalska", text: "Nowa wersja raportu dostępna", time: "2 min temu" },
        { id: 2, user: "Paweł Wiśniewski", text: "Projekt DR/2025/123456 zakończony", time: "1 godz. temu" },
    ];

    return (
        <div className="position-relative me-2">
            <button
                ref={btnRef}
                className="d-flex align-items-center justify-content-center"
                onClick={() => setOpen(v => !v)}
                style={{
                    width: 30,
                    height: 30,
                    background: "#e6edf5",
                    border: "1px solid #d7e3f2",
                    borderRadius: "50%",
                    cursor: "pointer",
                    position: "relative",
                    color: "#0f2a3d",
                }}
                title="Powiadomienia"
            >
                <BsBell size={32} />
                {notifications.length > 0 && (
                    <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                        style={{
                            background: "#b91c1c",
                            color: "#fff",
                            fontSize: "0.75rem",
                            padding: "0.25em 0.5em",
                        }}
                    >
                        {notifications.length}
                    </span>
                )}
            </button>

            {open && (
                <div
                    ref={menuRef}
                    className="shadow-sm"
                    style={{
                        position: "absolute",
                        right: 0,
                        top: "100%",
                        marginTop: "0.5rem",
                        minWidth: 280,
                        maxHeight: 300,
                        overflowY: "auto",
                        background: "#fff",
                        borderRadius: 12,
                        border: "1px solid #d7e3f2",
                        zIndex: 2000,
                    }}
                >
                    <div
                        className="px-3 py-2 fw-semibold"
                        style={{ borderBottom: "1px solid #e6edf5" }}
                    >
                        Powiadomienia
                    </div>
                    <ul className="list-unstyled mb-0">
                        {notifications.length === 0 && (
                            <li className="text-center py-3 text-muted small">Brak nowych powiadomień</li>
                        )}
                        {notifications.map((n) => (
                            <li
                                key={n.id}
                                className="d-flex align-items-center gap-2 px-3 py-2"
                                style={{
                                    transition: "background 0.2s",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #e6edf5",
                                }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f5f7fa")}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                            >
                                <InitialsAvatar name={n.user} size={27} />
                                <div className="d-flex flex-column">
                                    <span style={{ fontSize: "0.85rem" }}>{n.text}</span>
                                    <span className="text-muted" style={{ fontSize: "0.7rem" }}>{n.time}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
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