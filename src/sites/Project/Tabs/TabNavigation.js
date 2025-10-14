import React from "react";

export default function TabNavigation({ tabs, activeTab, setActiveTab }) {
    return (
        <div className="mt-0 px-1 d-flex align-items-center justify-content-start">
            <ul className="nav nav-tabs mb-0">
                {tabs.map((tab) => (
                    <li key={tab} className="nav-item">
                        <button
                            className="nav-link"
                            onClick={() => setActiveTab(tab)}
                            style={{
                                cursor: "pointer",
                                padding: "0.5rem 1rem",
                                borderRadius: "0px",
                                border: "none",
                                fontSize: "1rem",
                                backgroundColor: activeTab === tab ? "#0a2b4c" : "#f8f9fa",
                                color: activeTab === tab ? "#ffffff" : "#495057",
                                fontWeight: activeTab === tab ? 600 : 500,
                                transition: "all 0.2s ease-in-out",
                                borderTopLeftRadius: activeTab === tab ? "0.25rem" : "0px",
                                borderTopRightRadius: activeTab === tab ? "0.25rem" : "0px",
                            }}
                            onMouseEnter={(e) => {
                                if (activeTab !== tab) e.currentTarget.style.backgroundColor = "#e2e6ea";
                            }}
                            onMouseLeave={(e) => {
                                if (activeTab !== tab) e.currentTarget.style.backgroundColor = "#f8f9fa";
                            }}
                        >
                            {tab}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}