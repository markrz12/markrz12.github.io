import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {BsHouse, BsPeople, BsFileText, BsFolder, BsPerson, BsGear} from "react-icons/bs";
import { InitialsAvatar, Notifications, } from "../ui/common_function";
import Cookies from "js-cookie";


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
export function Topbar({ breadcrumb = [], onLogout }) {
    const [openNotifications, setOpenNotifications] = useState(false);
    const [showAccount, setShowAccount] = useState(false);
    const [email, setEmail] = useState("");

    const accountBtnRef = useRef(null);
    const accountMenuRef = useRef(null);
    const notificationsBtnRef = useRef(null);
    const notificationsPopRef = useRef(null);

    // Load email from cookies
    useEffect(() => {
        const storedEmail = Cookies.get("userEmail");
        if (storedEmail) setEmail(storedEmail);
    }, []);

    // Notifications dropdown
    useEffect(() => {
        if (!openNotifications) return;
        const handleClickOutside = (e) => {
            if (
                notificationsPopRef.current &&
                !notificationsPopRef.current.contains(e.target) &&
                notificationsBtnRef.current &&
                !notificationsBtnRef.current.contains(e.target)
            ) {
                setOpenNotifications(false);
            }
        };
        const handleKey = (e) => e.key === "Escape" && setOpenNotifications(false);
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKey);
        };
    }, [openNotifications]);

    // Account dropdown
    useEffect(() => {
        if (!showAccount) return;
        const handleClickOutside = (e) => {
            if (
                accountMenuRef.current &&
                !accountMenuRef.current.contains(e.target) &&
                accountBtnRef.current &&
                !accountBtnRef.current.contains(e.target)
            ) {
                setShowAccount(false);
            }
        };
        const handleKey = (e) => e.key === "Escape" && setShowAccount(false);
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKey);
        };
    }, [showAccount]);

    // Logout
    const handleLogout = () => {
        Cookies.remove("authToken");
        Cookies.remove("userEmail");
        if (onLogout) onLogout();
        // Przekieruj do strony logowania (root)
        window.location.href = "http://localhost:3000/";}

    return (
        <div className="shadow-sm" style={{ backgroundColor: "var(--ndr-bg-topbar)", padding: "0.5rem" }}>
            <div className="d-flex align-items-center justify-content-between px-4 py-2">

                {/* Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol
                        className="breadcrumb mb-0"
                        style={{
                            color: "#fff",
                            "--bs-breadcrumb-divider": "'/'",
                            "--bs-breadcrumb-divider-color": "#fff",
                        }}
                    >
                        {breadcrumb.map((item, idx) => (
                            <li
                                key={idx}
                                className={`breadcrumb-item${item.active ? " active" : ""}`}
                                aria-current={item.active ? "page" : undefined}
                            >
                                {item.to && !item.active ? (
                                    <Link
                                        to={item.to}
                                        style={{ color: "#fff", textDecoration: "underline" }}
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span style={{ color: "#fff" }}>{item.label}</span>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>

                {/* Right side */}
                <div className="d-flex align-items-center position-relative" style={{ gap: "0.3rem" }}>
                    <Notifications
                        open={openNotifications}
                        setOpen={setOpenNotifications}
                        popRef={notificationsPopRef}
                        btnRef={notificationsBtnRef}
                    />

                    <button
                        ref={accountBtnRef}
                        className="btn p-0 border-0"
                        aria-haspopup="menu"
                        aria-expanded={showAccount ? "true" : "false"}
                        onClick={() => setShowAccount((v) => !v)}
                        title="Konto"
                        style={{
                            padding: "2px 8px",
                            border: "1px solid rgba(255,255,255,0.35)",
                            borderRadius: 999,
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            background: "transparent",
                        }}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
                        }
                        onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                        <InitialsAvatar name={email || "Użytkownik"} size={31} />
                        <span
                            aria-hidden="true"
                            style={{
                                fontSize: 12,
                                opacity: 0.9,
                                lineHeight: 1,
                                transform: "translateY(1px)",
                            }}
                        >
                            ▾
                        </span>
                    </button>

                    {showAccount && (
                        <div
                            ref={accountMenuRef}
                            className="card shadow-lg border-0"
                            style={{
                                position: "absolute",
                                right: 0,
                                top: "100%",
                                marginTop: "0.5rem",
                                minWidth: 260,
                                zIndex: 2000,
                                borderRadius: "1rem",
                            }}
                            role="menu"
                        >
                            <div className="card-body p-3">
                                <div className="d-flex align-items-center mb-3" style={{ gap: "0.75rem" }}>
                                    <InitialsAvatar name={email || "Użytkownik"} size={36} />
                                    <div>
                                        <div className="text-muted small">Zalogowano jako</div>
                                        <div className="fw-semibold">{email || "Użytkownik"}</div>
                                    </div>
                                </div>

                                <hr className="my-1" />

                                <button
                                    role="menuitem"
                                    onClick={handleLogout}
                                    className="w-100 text-start"
                                    style={{
                                        border: "none",
                                        background: "transparent",
                                        padding: "0.5rem 1rem",
                                        borderRadius: "0.3rem",
                                        color: "#dc3545",
                                        fontWeight: 500,
                                        cursor: "pointer",
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(220,53,69,0.1)")}
                                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                >
                                    Wyloguj
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


