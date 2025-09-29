import React from "react";

export function timeAgo(input) {
    const now = new Date();
    const d = input instanceof Date ? input : new Date(input);
    const diffMs = now - d;
    const sec = Math.floor(diffMs / 1000);
    if (isNaN(sec)) return "";
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);
    const wk = Math.floor(day / 7);
    const mo = Math.floor(day / 30);
    const yr = Math.floor(day / 365);
    const plural = (n, s) => (n === 1 ? s[0] : n >= 2 && n <= 4 ? s[1] : s[2]);
    if (sec < 45) return "przed chwilą";
    if (min < 60) return `${min} ${plural(min, ["minutę", "minuty", "minut"])} temu`;
    if (hr < 24) return `${hr} ${plural(hr, ["godzinę", "godziny", "godzin"])} temu`;
    if (day < 7) return `${day} ${plural(day, ["dzień", "dni", "dni"])} temu`;
    if (wk < 5) return `${wk} ${plural(wk, ["tydzień", "tygodnie", "tygodni"])} temu`;
    if (mo < 12) return `${mo} ${plural(mo, ["miesiąc", "miesiące", "miesięcy"])} temu`;
    return `${yr} ${plural(yr, ["rok", "lata", "lat"])} temu`;
}

export function ProgressMeter({ percent }) {
    const pct = Math.max(0, Math.min(100, Math.round(percent)));

    return (
        <div className="d-flex align-items-center gap-2">
            <div
                style={{
                    flexGrow: 1,
                    height: 25,
                    backgroundColor: "#e0e0e0",
                    borderRadius: 12,
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: `${pct}%`,
                        height: "100%",
                        backgroundColor: "#005679",
                        transition: "width 0.3s ease",
                    }}
                />
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: 500, minWidth: 35 }}>{pct}%</span>
        </div>
    );
}
