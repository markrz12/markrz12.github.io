import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar, Topbar } from "../../ui/Common";
import { BsFileText, BsPeople, BsGeoAlt, BsBank, BsBuilding, BsClipboardCheck} from "react-icons/bs";

function ProjectClient() {
    const navigate = useNavigate();
    const location = useLocation();
    const { mode = "add", clientData = null } = location.state || {};
    const [editMode, setEditMode] = useState(false);


    const [selected, setSelected] = useState(clientData || null);
    const [krsQuery, setKrsQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [open, setOpen] = useState({
        rps: false,
        contact: false,
        oddzialy: false,
        dzialalnosc: false,
        organNadzoru: false,
        reprezentacja: false,
    });

    const [search, setSearch] = useState("");

    const toggle = (key) => setOpen(prev => ({ ...prev, [key]: !prev[key] }));

    const fetchFromKRS = async () => {
        if (!krsQuery) return alert("Podaj numer KRS");

        setLoading(true);
        setError("");

        try {
            const res = await axios.get(`https://api-krs.ms.gov.pl/api/krs/OdpisAktualny/${krsQuery}?rejestr=P&format=json`);
            const data = res.data.odpis;

            const dzial1 = data?.dane?.dzial1 || {};
            const dzial2 = data?.dane?.dzial2 || {};
            const dzial3 = data?.dane?.dzial3 || {};

            const processed = {
                krs: data?.naglowekA?.numerKRS || "Brak",
                dataRejestracjiWKRS: data?.naglowekA?.dataRejestracjiWKRS || "Brak",
                dataOstatniegoWpisu: data?.naglowekA?.dataOstatniegoWpisu || "Brak",
                forma: dzial1?.danePodmiotu?.formaPrawna || "Brak",
                regon: dzial1?.danePodmiotu?.identyfikatory?.regon || "Brak",
                nip: dzial1?.danePodmiotu?.identyfikatory?.nip || "Brak",
                name: dzial1?.danePodmiotu?.nazwa || "Brak",
                siedzibaIAdres: dzial1?.siedzibaIAdres || {},
                email: dzial1?.siedzibaIAdres?.adresPocztyElektronicznej || "Brak",
                www: dzial1?.siedzibaIAdres?.adresStronyInternetowej || "Brak",
                jednostkiTerenoweOddzialy: dzial1?.jednostkiTerenoweOddzialy?.length ? dzial1.jednostkiTerenoweOddzialy : "Brak",
                wspolnicySpzoo: dzial1?.wspolnicySpzoo || [],
                wspolnicyPartnerzy: dzial1?.wspolnicyPartnerzy || [],
                kapital: dzial1?.kapital?.wysokoscKapitaluZakladowego || {},
                organNadzoru: dzial2?.organNadzoru?.length ? dzial2.organNadzoru : "Brak",
                przedmiotPrzewazajacejDzialalnosci: dzial3?.przedmiotDzialalnosci?.przedmiotPrzewazajacejDzialalnosci || [],
                przedmiotPozostalejDzialalnosci: dzial3?.przedmiotDzialalnosci?.przedmiotPozostalejDzialalnosci || [],
            };

            setSelected(processed);
        } catch (err) {
            console.error(err);
            setError("Nie udało się pobrać danych z KRS.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!selected) return alert("Brak danych klienta!");
        try {
            if (mode === "add") {
                await axios.post(`http://localhost:5171/Clients`, selected);
            } else {
                await axios.put(`http://localhost:5171/Clients/${selected.id}`, selected);
            }
            navigate("/klienci");
        } catch (err) {
            console.error(err);
            alert(mode === "add" ? "Nie udało się dodać klienta." : "Nie udało się zaktualizować klienta.");
        }
    };

    const handleChange = (field, value) => {
        setSelected(prev => ({ ...prev, [field]: value }));
    };



    return (
        <div className="d-flex min-vh-100">
            <Sidebar search={search} setSearch={setSearch} />

            <div className="flex-grow-1 d-flex flex-column">
                <Topbar
                    breadcrumb={[
                        { label: "Workspace", to: "/workspace" },
                        { label: "Klienci", to: "/klienci" },
                        { label: mode === "add" ? "Dodaj klienta" : "Edytuj klienta", active: true },
                    ]}
                />

                <div className="flex-grow-1 bg-light d-flex pt-3 px-3">
                    <div className="container-fluid" style={{ maxWidth: 980 }}>
                        <div className="card shadow-sm">
                            <div className="card-body">

                                {/* KRS input */}
                                {mode === "add" && (
                                    <div className="d-flex flex-column flex-sm-row align-items-start gap-3 mb-3">
                                        <input
                                            className="form-control"
                                            placeholder="Podaj numer KRS"
                                            value={krsQuery}
                                            onChange={e => setKrsQuery(e.target.value)}
                                        />
                                        <button className="btn btn-outline-secondary" onClick={fetchFromKRS} disabled={loading} style={{ minWidth: 180 }}>
                                            {loading ? "Ładowanie..." : "Pobierz dane z KRS"}
                                        </button>
                                    </div>
                                )}

                                {error && <div className="text-danger mb-2">{error}</div>}

                                {selected && (
                                    <>

                                        <Section title={<><BsFileText className="me-2" /> Dane podmiotu</>} open={open.rps} toggle={() => toggle('rps')}>
                                            <Row label="Nazwa" value={selected.name} editMode={editMode} onChangeValue={val => handleChange("name", val)} />
                                            <Row label="KRS" value={selected.krs} label2="NIP" value2={selected.nip} editMode={editMode}
                                                 onChangeValue={val => handleChange("krs", val)}
                                                 onChangeValue2={val => handleChange("nip", val)}
                                            />
                                            <Row label="REGON" value={selected.regon} label2="Forma prawna" value2={selected.forma} editMode={editMode}
                                                 onChangeValue={val => handleChange("regon", val)}
                                                 onChangeValue2={val => handleChange("forma", val)}
                                            />
                                            <Row label="Data rejestracji" value={selected.dataRejestracjiWKRS} label2="Ostatni wpis" value2={selected.dataOstatniegoWpisu} editMode={editMode}
                                                 onChangeValue={val => handleChange("dataRejestracjiWKRS", val)}
                                                 onChangeValue2={val => handleChange("dataOstatniegoWpisu", val)}
                                            />
                                        </Section>


                                        <Section
                                            key="addr"
                                            open={open.addr}
                                            title={<><BsGeoAlt className="me-2"/> Adres</>}
                                            toggle={() => toggle('addr')}
                                        >
                                            {/* Siedziba */}
                                            {selected.siedzibaIAdres?.siedziba && (
                                                <>
                                                    <Row
                                                        label="Miasto"
                                                        value={selected.siedzibaIAdres.siedziba.miejscowosc}
                                                        editMode={editMode}
                                                        onChangeValue={val =>
                                                            setSelected(prev => ({
                                                                ...prev,
                                                                siedzibaIAdres: {
                                                                    ...prev.siedzibaIAdres,
                                                                    siedziba: { ...prev.siedzibaIAdres.siedziba, miejscowosc: val }
                                                                }
                                                            }))
                                                        }
                                                    />
                                                    <Row
                                                        label="Gmina"
                                                        value={selected.siedzibaIAdres.siedziba.gmina}
                                                        editMode={editMode}
                                                        onChangeValue={val =>
                                                            setSelected(prev => ({
                                                                ...prev,
                                                                siedzibaIAdres: {
                                                                    ...prev.siedzibaIAdres,
                                                                    siedziba: { ...prev.siedzibaIAdres.siedziba, gmina: val }
                                                                }
                                                            }))
                                                        }
                                                    />
                                                    <Row
                                                        label="Powiat"
                                                        value={selected.siedzibaIAdres.siedziba.powiat}
                                                        editMode={editMode}
                                                        onChangeValue={val =>
                                                            setSelected(prev => ({
                                                                ...prev,
                                                                siedzibaIAdres: {
                                                                    ...prev.siedzibaIAdres,
                                                                    siedziba: { ...prev.siedzibaIAdres.siedziba, powiat: val }
                                                                }
                                                            }))
                                                        }
                                                    />
                                                    <Row
                                                        label="Województwo"
                                                        value={selected.siedzibaIAdres.siedziba.wojewodztwo}
                                                        editMode={editMode}
                                                        onChangeValue={val =>
                                                            setSelected(prev => ({
                                                                ...prev,
                                                                siedzibaIAdres: {
                                                                    ...prev.siedzibaIAdres,
                                                                    siedziba: { ...prev.siedzibaIAdres.siedziba, wojewodztwo: val }
                                                                }
                                                            }))
                                                        }
                                                    />
                                                    <Row
                                                        label="Kraj"
                                                        value={selected.siedzibaIAdres.siedziba.kraj}
                                                        editMode={editMode}
                                                        onChangeValue={val =>
                                                            setSelected(prev => ({
                                                                ...prev,
                                                                siedzibaIAdres: {
                                                                    ...prev.siedzibaIAdres,
                                                                    siedziba: { ...prev.siedzibaIAdres.siedziba, kraj: val }
                                                                }
                                                            }))
                                                        }
                                                    />
                                                </>
                                            )}

                                            {/* Adres */}
                                            {selected.siedzibaIAdres?.adres && (
                                                <>
                                                    <Row
                                                        label="Ulica"
                                                        value={selected.siedzibaIAdres.adres.ulica}
                                                        editMode={editMode}
                                                        onChangeValue={val =>
                                                            setSelected(prev => ({
                                                                ...prev,
                                                                siedzibaIAdres: {
                                                                    ...prev.siedzibaIAdres,
                                                                    adres: { ...prev.siedzibaIAdres.adres, ulica: val }
                                                                }
                                                            }))
                                                        }
                                                    />
                                                    <Row
                                                        label="Nr domu"
                                                        value={selected.siedzibaIAdres.adres.nrDomu}
                                                        editMode={editMode}
                                                        onChangeValue={val =>
                                                            setSelected(prev => ({
                                                                ...prev,
                                                                siedzibaIAdres: {
                                                                    ...prev.siedzibaIAdres,
                                                                    adres: { ...prev.siedzibaIAdres.adres, nrDomu: val }
                                                                }
                                                            }))
                                                        }
                                                    />
                                                    <Row
                                                        label="Kod pocztowy"
                                                        value={selected.siedzibaIAdres.adres.kodPocztowy}
                                                        editMode={editMode}
                                                        onChangeValue={val =>
                                                            setSelected(prev => ({
                                                                ...prev,
                                                                siedzibaIAdres: {
                                                                    ...prev.siedzibaIAdres,
                                                                    adres: { ...prev.siedzibaIAdres.adres, kodPocztowy: val }
                                                                }
                                                            }))
                                                        }
                                                    />
                                                    <Row
                                                        label="Poczta"
                                                        value={selected.siedzibaIAdres.adres.poczta}
                                                        editMode={editMode}
                                                        onChangeValue={val =>
                                                            setSelected(prev => ({
                                                                ...prev,
                                                                siedzibaIAdres: {
                                                                    ...prev.siedzibaIAdres,
                                                                    adres: { ...prev.siedzibaIAdres.adres, poczta: val }
                                                                }
                                                            }))
                                                        }
                                                    />
                                                </>
                                            )}

                                            {/* Email & WWW */}
                                            <Row
                                                label="Email"
                                                value={selected.email}
                                                editMode={editMode}
                                                onChangeValue={val => setSelected(prev => ({ ...prev, email: val }))}
                                            />
                                            <Row
                                                label="WWW"
                                                value={selected.www}
                                                editMode={editMode}
                                                onChangeValue={val => setSelected(prev => ({ ...prev, www: val }))}
                                            />
                                        </Section>

                                        <Section
                                            title={<><BsPeople className="me-2"/> Wspólnicy</>}
                                            open={open.reprezentacja}
                                            toggle={() => toggle('reprezentacja')}
                                        >
                                            {/* Wspólnicy / Partnerzy komandytariusze */}
                                            {Array.isArray(selected.wspolnicyPartnerzy) && selected.wspolnicyPartnerzy.length > 0 && (
                                                <div className="mb-4 overflow-x-auto">
                                                    <table className="min-w-full border border-gray-400 text-sm table-auto">
                                                        <thead className="bg-gray-800 text-center text-white">
                                                        <tr>
                                                            <th className="border border-gray-400 px-2 py-1">Imię i nazwisko</th>
                                                            <th className="border border-gray-400 px-2 py-1">PESEL</th>
                                                            <th className="border border-gray-400 px-2 py-1">Komandytariusz</th>
                                                            <th className="border border-gray-400 px-2 py-1">Wysokość sumy komandytowej</th>
                                                            <th className="border border-gray-400 px-2 py-1">Wkład w umowie</th>
                                                            <th className="border border-gray-400 px-2 py-1">Wkład niepieniężny</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {selected.wspolnicyPartnerzy.map((w, i) => {
                                                            const fullName = `${w.imiona?.imie || "-"} ${w.imiona?.imieDrugie || ""} ${w.nazwisko?.nazwiskoICzlon || "-"}`.trim();
                                                            return (
                                                                <tr key={i} className="bg-gray-100 text-center">
                                                                    <td className="border border-gray-400 px-2 py-1">
                                                                        {editMode ? (
                                                                            <input
                                                                                className="form-control"
                                                                                value={fullName}
                                                                                onChange={e => {
                                                                                    const parts = e.target.value.split(" ");
                                                                                    setSelected(prev => {
                                                                                        const newArr = [...prev.wspolnicyPartnerzy];
                                                                                        newArr[i] = {
                                                                                            ...newArr[i],
                                                                                            imiona: {
                                                                                                ...newArr[i].imiona,
                                                                                                imie: parts[0] || "",
                                                                                                imieDrugie: parts[1] || ""
                                                                                            },
                                                                                            nazwisko: {
                                                                                                ...newArr[i].nazwisko,
                                                                                                nazwiskoICzlon: parts.slice(2).join(" ") || ""
                                                                                            }
                                                                                        };
                                                                                        return { ...prev, wspolnicyPartnerzy: newArr };
                                                                                    });
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            fullName
                                                                        )}
                                                                    </td>
                                                                    <td className="border border-gray-400 px-2 py-1">
                                                                        {editMode ? (
                                                                            <input
                                                                                className="form-control"
                                                                                value={w.identyfikator?.pesel || ""}
                                                                                onChange={e => {
                                                                                    setSelected(prev => {
                                                                                        const newArr = [...prev.wspolnicyPartnerzy];
                                                                                        newArr[i].identyfikator = { ...newArr[i].identyfikator, pesel: e.target.value };
                                                                                        return { ...prev, wspolnicyPartnerzy: newArr };
                                                                                    });
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            w.identyfikator?.pesel || "-"
                                                                        )}
                                                                    </td>
                                                                    <td className="border border-gray-400 px-2 py-1">
                                                                        {editMode ? (
                                                                            <select
                                                                                className="form-select"
                                                                                value={w.czyJestKomandytariuszem ? "Tak" : "Nie"}
                                                                                onChange={e => {
                                                                                    setSelected(prev => {
                                                                                        const newArr = [...prev.wspolnicyPartnerzy];
                                                                                        newArr[i].czyJestKomandytariuszem = e.target.value === "Tak";
                                                                                        return { ...prev, wspolnicyPartnerzy: newArr };
                                                                                    });
                                                                                }}
                                                                            >
                                                                                <option>Tak</option>
                                                                                <option>Nie</option>
                                                                            </select>
                                                                        ) : (
                                                                            w.czyJestKomandytariuszem ? "Tak" : "Nie"
                                                                        )}
                                                                    </td>
                                                                    <td className="border border-gray-400 px-2 py-1">
                                                                        {editMode ? (
                                                                            <input
                                                                                className="form-control"
                                                                                value={w.wysokoscSumyKomandytowej || ""}
                                                                                onChange={e => {
                                                                                    setSelected(prev => {
                                                                                        const newArr = [...prev.wspolnicyPartnerzy];
                                                                                        newArr[i].wysokoscSumyKomandytowej = e.target.value;
                                                                                        return { ...prev, wspolnicyPartnerzy: newArr };
                                                                                    });
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            w.wysokoscSumyKomandytowej || "-"
                                                                        )}
                                                                    </td>
                                                                    <td className="border border-gray-400 px-2 py-1">
                                                                        {editMode ? (
                                                                            <input
                                                                                className="form-control"
                                                                                value={w.wartoscWkladuWspolnikaWUmowie || ""}
                                                                                onChange={e => {
                                                                                    setSelected(prev => {
                                                                                        const newArr = [...prev.wspolnicyPartnerzy];
                                                                                        newArr[i].wartoscWkladuWspolnikaWUmowie = e.target.value;
                                                                                        return { ...prev, wspolnicyPartnerzy: newArr };
                                                                                    });
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            w.wartoscWkladuWspolnikaWUmowie || "-"
                                                                        )}
                                                                    </td>
                                                                    <td className="border border-gray-400 px-2 py-1">
                                                                        {editMode ? (
                                                                            <select
                                                                                className="form-select"
                                                                                value={w.wkladWspolnikaWUmowieCzyNiepieniezny ? "Tak" : "Nie"}
                                                                                onChange={e => {
                                                                                    setSelected(prev => {
                                                                                        const newArr = [...prev.wspolnicyPartnerzy];
                                                                                        newArr[i].wkladWspolnikaWUmowieCzyNiepieniezny = e.target.value === "Tak";
                                                                                        return { ...prev, wspolnicyPartnerzy: newArr };
                                                                                    });
                                                                                }}
                                                                            >
                                                                                <option>Tak</option>
                                                                                <option>Nie</option>
                                                                            </select>
                                                                        ) : (
                                                                            w.wkladWspolnikaWUmowieCzyNiepieniezny ? "Tak" : "Nie"
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}

                                            {/* Wspólnicy sp. z o.o. */}
                                            {Array.isArray(selected.wspolnicySpzoo) && selected.wspolnicySpzoo.length > 0 && (
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full border border-gray-400 text-sm table-auto">
                                                        <thead className="bg-gray-700 text-center">
                                                        <tr>
                                                            <th className="border border-gray-400 px-2 py-1">Nazwa / Imię i nazwisko</th>
                                                            <th className="border border-gray-400 px-2 py-1">PESEL / REGON / KRS</th>
                                                            <th className="border border-gray-400 px-2 py-1">Posiadane udziały</th>
                                                            <th className="border border-gray-400 px-2 py-1">Czy posiada całość udziałów?</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {selected.wspolnicySpzoo.map((w, i) => {
                                                            const isPerson = !!w.nazwisko;
                                                            const fullName = isPerson
                                                                ? `${w.imiona?.imie || "-"} ${w.imiona?.imieDrugie || ""} ${w.nazwisko?.nazwiskoICzlon || ""} ${w.nazwisko?.nazwiskoIICzlon || ""}`.trim()
                                                                : w.nazwa || "-";
                                                            const id = isPerson
                                                                ? w.identyfikator?.pesel || "-"
                                                                : w.identyfikator?.regon || w.krs?.krs || "-";

                                                            return (
                                                                <tr key={i} className="bg-gray-50 text-center">
                                                                    <td className="border border-gray-400 px-2 py-1">
                                                                        {editMode ? (
                                                                            <input
                                                                                className="form-control"
                                                                                value={fullName}
                                                                                onChange={e => {
                                                                                    const parts = e.target.value.split(" ");
                                                                                    setSelected(prev => {
                                                                                        const newArr = [...prev.wspolnicySpzoo];
                                                                                        newArr[i] = {
                                                                                            ...newArr[i],
                                                                                            imiona: { ...newArr[i].imiona, imie: parts[0] || "", imieDrugie: parts[1] || "" },
                                                                                            nazwisko: { ...newArr[i].nazwisko, nazwiskoICzlon: parts.slice(2).join(" ") || "" },
                                                                                            nazwa: isPerson ? undefined : e.target.value
                                                                                        };
                                                                                        return { ...prev, wspolnicySpzoo: newArr };
                                                                                    });
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            fullName
                                                                        )}
                                                                    </td>
                                                                    <td className="border border-gray-400 px-2 py-1">{id}</td>
                                                                    <td className="border border-gray-400 px-2 py-1">
                                                                        {editMode ? (
                                                                            <input
                                                                                className="form-control"
                                                                                value={w.posiadaneUdzialy || ""}
                                                                                onChange={e => {
                                                                                    setSelected(prev => {
                                                                                        const newArr = [...prev.wspolnicySpzoo];
                                                                                        newArr[i].posiadaneUdzialy = e.target.value;
                                                                                        return { ...prev, wspolnicySpzoo: newArr };
                                                                                    });
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            w.posiadaneUdzialy || "-"
                                                                        )}
                                                                    </td>
                                                                    <td className="border border-gray-400 px-2 py-1">
                                                                        {editMode ? (
                                                                            <select
                                                                                className="form-select"
                                                                                value={w.czyPosiadaCaloscUdzialow ? "Tak" : "Nie"}
                                                                                onChange={e => {
                                                                                    setSelected(prev => {
                                                                                        const newArr = [...prev.wspolnicySpzoo];
                                                                                        newArr[i].czyPosiadaCaloscUdzialow = e.target.value === "Tak";
                                                                                        return { ...prev, wspolnicySpzoo: newArr };
                                                                                    });
                                                                                }}
                                                                            >
                                                                                <option>Tak</option>
                                                                                <option>Nie</option>
                                                                            </select>
                                                                        ) : (
                                                                            w.czyPosiadaCaloscUdzialow ? "Tak" : "Nie"
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}

                                            {(!selected.wspolnicyPartnerzy?.length && !selected.wspolnicySpzoo?.length) && (
                                                <div>Brak wspólników / partnerów</div>
                                            )}
                                        </Section>


                                        <Section
                                            title={<><BsBank className="me-2" /> Kapitał</>}
                                            open={open.contact}
                                            toggle={() => toggle('contact')}
                                        >
                                            <div className="row g-0 border-bottom mb-1">
                                                <div className="col-12 col-md-3 bg-light border-end p-2 fw-bold">Kapitał zakładowy</div>
                                                <div className="col-12 col-md-9 p-2 d-flex gap-2">
                                                    {editMode ? (
                                                        <>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Wartość"
                                                                value={selected.kapital?.wartosc || ""}
                                                                onChange={e =>
                                                                    setSelected(prev => ({
                                                                        ...prev,
                                                                        kapital: { ...prev.kapital, wartosc: e.target.value }
                                                                    }))
                                                                }
                                                            />
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Waluta"
                                                                value={selected.kapital?.waluta || ""}
                                                                onChange={e =>
                                                                    setSelected(prev => ({
                                                                        ...prev,
                                                                        kapital: { ...prev.kapital, waluta: e.target.value }
                                                                    }))
                                                                }
                                                            />
                                                        </>
                                                    ) : (
                                                        (() => {
                                                            const val = selected.kapital?.wartosc;
                                                            if (!val) return "Brak";
                                                            // Convert string like "50 000,00" to number
                                                            const normalized = parseFloat(val.toString().replace(/\s/g, '').replace(',', '.'));
                                                            return isNaN(normalized)
                                                                ? "Brak"
                                                                : `${normalized.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${selected.kapital?.waluta || 'PLN'}`;
                                                        })()
                                                    )}
                                                </div>
                                            </div>
                                        </Section>


                                        <Section
                                            title={<><BsBuilding className="me-2" /> Oddziały</>}
                                            open={open.oddzialy}
                                            toggle={() => toggle('oddzialy')}
                                        >
                                            <div className="mb-2 d-flex justify-content-start">
                                                {editMode && (
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() =>
                                                            setSelected(prev => {
                                                                const newList = prev.jednostkiTerenoweOddzialy
                                                                    ? [...prev.jednostkiTerenoweOddzialy]
                                                                    : [];
                                                                newList.push({ siedziba: {}, adres: {}, nazwa: "" });
                                                                return { ...prev, jednostkiTerenoweOddzialy: newList };
                                                            })
                                                        }
                                                    >
                                                        Dodaj oddział
                                                    </button>
                                                )}
                                            </div>


                                            {Array.isArray(selected.jednostkiTerenoweOddzialy) && selected.jednostkiTerenoweOddzialy.length > 0 ? (
                                                <table className="min-w-full border border-gray-400 text-sm">
                                                    <thead className="bg-gray-300 font-semibold">
                                                    <tr>
                                                        <th className="border border-gray-400 px-2 py-1 text-left">Nazwa oddziału</th>
                                                        <th className="border border-gray-400 px-2 py-1 text-left">Ulica / nr</th>
                                                        <th className="border border-gray-400 px-2 py-1 text-left">Miasto</th>
                                                        <th className="border border-gray-400 px-2 py-1 text-left">Kod pocztowy</th>
                                                        <th className="border border-gray-400 px-2 py-1 text-left">Kraj</th>
                                                        {editMode && <th className="border border-gray-400 px-2 py-1 text-left">Akcje</th>}
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {selected.jednostkiTerenoweOddzialy.map((j, i) => {
                                                        const s = j.siedziba || {};
                                                        const a = j.adres || {};
                                                        return (
                                                            <tr key={i} className="bg-gray-100 odd:bg-white">
                                                                <td className="border border-gray-400 px-2 py-1">
                                                                    {editMode ? (
                                                                        <input
                                                                            className="form-control"
                                                                            value={j.nazwa || ""}
                                                                            onChange={e =>
                                                                                setSelected(prev => {
                                                                                    const newList = [...prev.jednostkiTerenoweOddzialy];
                                                                                    newList[i].nazwa = e.target.value;
                                                                                    return { ...prev, jednostkiTerenoweOddzialy: newList };
                                                                                })
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        j.nazwa || "Brak nazwy"
                                                                    )}
                                                                </td>
                                                                <td className="border border-gray-400 px-2 py-1">
                                                                    {editMode ? (
                                                                        <input
                                                                            className="form-control"
                                                                            value={a.ulica || ""}
                                                                            onChange={e =>
                                                                                setSelected(prev => {
                                                                                    const newList = [...prev.jednostkiTerenoweOddzialy];
                                                                                    newList[i].adres = { ...newList[i].adres, ulica: e.target.value };
                                                                                    return { ...prev, jednostkiTerenoweOddzialy: newList };
                                                                                })
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        a.ulica ? `${a.ulica} ${a.nrDomu || ""}`.trim() : "-"
                                                                    )}
                                                                </td>
                                                                <td className="border border-gray-400 px-2 py-1">
                                                                    {editMode ? (
                                                                        <input
                                                                            className="form-control"
                                                                            value={a.miejscowosc || s.miejscowosc || ""}
                                                                            onChange={e =>
                                                                                setSelected(prev => {
                                                                                    const newList = [...prev.jednostkiTerenoweOddzialy];
                                                                                    newList[i].adres = { ...newList[i].adres, miejscowosc: e.target.value };
                                                                                    return { ...prev, jednostkiTerenoweOddzialy: newList };
                                                                                })
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        a.miejscowosc || s.miejscowosc || "-"
                                                                    )}
                                                                </td>
                                                                <td className="border border-gray-400 px-2 py-1">
                                                                    {editMode ? (
                                                                        <input
                                                                            className="form-control"
                                                                            value={a.kodPocztowy || ""}
                                                                            onChange={e =>
                                                                                setSelected(prev => {
                                                                                    const newList = [...prev.jednostkiTerenoweOddzialy];
                                                                                    newList[i].adres = { ...newList[i].adres, kodPocztowy: e.target.value };
                                                                                    return { ...prev, jednostkiTerenoweOddzialy: newList };
                                                                                })
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        a.kodPocztowy || "-"
                                                                    )}
                                                                </td>
                                                                <td className="border border-gray-400 px-2 py-1">
                                                                    {editMode ? (
                                                                        <input
                                                                            className="form-control"
                                                                            value={a.kraj || s.kraj || ""}
                                                                            onChange={e =>
                                                                                setSelected(prev => {
                                                                                    const newList = [...prev.jednostkiTerenoweOddzialy];
                                                                                    newList[i].adres = { ...newList[i].adres, kraj: e.target.value };
                                                                                    return { ...prev, jednostkiTerenoweOddzialy: newList };
                                                                                })
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        a.kraj || s.kraj || "-"
                                                                    )}
                                                                </td>
                                                                {editMode && (
                                                                    <td className="border border-gray-400 px-2 py-1 text-center">
                                                                        <button
                                                                            className="btn btn-sm btn-outline-danger"
                                                                            onClick={() =>
                                                                                setSelected(prev => {
                                                                                    const newList = [...prev.jednostkiTerenoweOddzialy];
                                                                                    newList.splice(i, 1);
                                                                                    return { ...prev, jednostkiTerenoweOddzialy: newList };
                                                                                })
                                                                            }
                                                                        >
                                                                            Usuń
                                                                        </button>
                                                                    </td>
                                                                )}
                                                            </tr>
                                                        );
                                                    })}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                !editMode && (
                                                    <div className="mb-2">
                                                        Brak oddziałów.
                                                    </div>
                                                )
                                            )}
                                        </Section>


                                        <Section
                                            title={<><BsPeople className="me-2" /> Organ nadzoru</>}
                                            open={open.organNadzoru}
                                            toggle={() => toggle('organNadzoru')}
                                        >
                                            {Array.isArray(selected.organNadzoru) && selected.organNadzoru.length > 0 ? (
                                                selected.organNadzoru.map((o, i) => (
                                                    <div key={i} className="mb-4 border p-2 rounded">
                                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                                            <input
                                                                className="form-control me-2"
                                                                value={o.nazwa || ""}
                                                                placeholder="Nazwa organu"
                                                                disabled={!editMode}
                                                                onChange={e => {
                                                                    const val = e.target.value;
                                                                    setSelected(prev => {
                                                                        const organs = [...prev.organNadzoru];
                                                                        organs[i] = { ...organs[i], nazwa: val, sklad: organs[i].sklad || [] };
                                                                        return { ...prev, organNadzoru: organs };
                                                                    });
                                                                }}
                                                            />
                                                            {editMode && (
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => {
                                                                        setSelected(prev => {
                                                                            const organs = [...prev.organNadzoru];
                                                                            organs.splice(i, 1);
                                                                            return { ...prev, organNadzoru: organs };
                                                                        });
                                                                    }}
                                                                >
                                                                    Usuń organ
                                                                </button>
                                                            )}
                                                        </div>

                                                        {(Array.isArray(o.sklad) && o.sklad.length > 0) ? (
                                                            <table className="min-w-full border border-gray-400 text-sm mb-2">
                                                                <thead className="bg-gray-300 font-semibold">
                                                                <tr>
                                                                    <th className="border border-gray-400 px-2 py-1 text-left">Imię</th>
                                                                    <th className="border border-gray-400 px-2 py-1 text-left">Drugie imię</th>
                                                                    <th className="border border-gray-400 px-2 py-1 text-left">Nazwisko</th>
                                                                    <th className="border border-gray-400 px-2 py-1 text-left">PESEL</th>
                                                                    {editMode && <th className="border border-gray-400 px-2 py-1 text-left">Akcje</th>}
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                {o.sklad.map((m, j) => (
                                                                    <tr key={j} className="bg-gray-100 odd:bg-white">
                                                                        <td className="border border-gray-400 px-2 py-1">
                                                                            {editMode ? (
                                                                                <input
                                                                                    className="form-control"
                                                                                    value={m.imiona?.imie || ""}
                                                                                    onChange={e => {
                                                                                        const val = e.target.value;
                                                                                        setSelected(prev => {
                                                                                            const organs = [...prev.organNadzoru];
                                                                                            organs[i].sklad[j].imiona = { ...organs[i].sklad[j].imiona, imie: val };
                                                                                            return { ...prev, organNadzoru: organs };
                                                                                        });
                                                                                    }}
                                                                                />
                                                                            ) : (m.imiona?.imie || "-")}
                                                                        </td>
                                                                        <td className="border border-gray-400 px-2 py-1">
                                                                            {editMode ? (
                                                                                <input
                                                                                    className="form-control"
                                                                                    value={m.imiona?.imieDrugie || ""}
                                                                                    onChange={e => {
                                                                                        const val = e.target.value;
                                                                                        setSelected(prev => {
                                                                                            const organs = [...prev.organNadzoru];
                                                                                            organs[i].sklad[j].imiona = { ...organs[i].sklad[j].imiona, imieDrugie: val };
                                                                                            return { ...prev, organNadzoru: organs };
                                                                                        });
                                                                                    }}
                                                                                />
                                                                            ) : (m.imiona?.imieDrugie || "-")}
                                                                        </td>
                                                                        <td className="border border-gray-400 px-2 py-1">
                                                                            {editMode ? (
                                                                                <input
                                                                                    className="form-control"
                                                                                    value={m.nazwisko?.nazwiskoICzlon || ""}
                                                                                    onChange={e => {
                                                                                        const val = e.target.value;
                                                                                        setSelected(prev => {
                                                                                            const organs = [...prev.organNadzoru];
                                                                                            organs[i].sklad[j].nazwisko = { ...organs[i].sklad[j].nazwisko, nazwiskoICzlon: val };
                                                                                            return { ...prev, organNadzoru: organs };
                                                                                        });
                                                                                    }}
                                                                                />
                                                                            ) : (m.nazwisko?.nazwiskoICzlon || "-")}
                                                                        </td>
                                                                        <td className="border border-gray-400 px-2 py-1">
                                                                            {editMode ? (
                                                                                <input
                                                                                    className="form-control"
                                                                                    value={m.identyfikator?.pesel || ""}
                                                                                    onChange={e => {
                                                                                        const val = e.target.value;
                                                                                        setSelected(prev => {
                                                                                            const organs = [...prev.organNadzoru];
                                                                                            organs[i].sklad[j].identyfikator = { ...organs[i].sklad[j].identyfikator, pesel: val };
                                                                                            return { ...prev, organNadzoru: organs };
                                                                                        });
                                                                                    }}
                                                                                />
                                                                            ) : (m.identyfikator?.pesel || "-")}
                                                                        </td>
                                                                        {editMode && (
                                                                            <td className="border border-gray-400 px-2 py-1">
                                                                                <button
                                                                                    className="btn btn-sm btn-outline-danger"
                                                                                    onClick={() => {
                                                                                        setSelected(prev => {
                                                                                            const organs = [...prev.organNadzoru];
                                                                                            organs[i].sklad.splice(j, 1);
                                                                                            return { ...prev, organNadzoru: organs };
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    Usuń
                                                                                </button>
                                                                            </td>
                                                                        )}
                                                                    </tr>
                                                                ))}
                                                                </tbody>
                                                            </table>
                                                        ) : editMode ? (
                                                            <div>Brak członków organu.</div>
                                                        ) : null}

                                                        {editMode && (
                                                            <button
                                                                className="btn btn-sm btn-outline-primary mt-2"
                                                                onClick={() => {
                                                                    setSelected(prev => {
                                                                        const organs = Array.isArray(prev.organNadzoru) ? [...prev.organNadzoru] : [];
                                                                        if (organs.length === 0) {
                                                                            organs.push({ nazwa: "", sklad: [{ nazwisko: {}, imiona: {}, identyfikator: {} }] });
                                                                        } else {
                                                                            const firstOrgan = { ...organs[0] };
                                                                            firstOrgan.sklad = Array.isArray(firstOrgan.sklad) ? [...firstOrgan.sklad] : [];
                                                                            firstOrgan.sklad.push({ nazwisko: {}, imiona: {}, identyfikator: {} });
                                                                            organs[0] = firstOrgan;
                                                                        }
                                                                        return { ...prev, organNadzoru: organs };
                                                                    });
                                                                }}
                                                            >
                                                                Dodaj członka
                                                            </button>
                                                        )}
                                                    </div>
                                                ))
                                            ) : !editMode ? (
                                                <div>Brak organu nadzoru</div>
                                            ) : (
                                                <div className="mb-2">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary ms-2"
                                                        onClick={() => {
                                                            setSelected(prev => ({
                                                                ...prev,
                                                                organNadzoru: [{ nazwa: "", sklad: [] }]
                                                            }));
                                                        }}
                                                    >
                                                        Dodaj organ
                                                    </button>
                                                </div>
                                            )}
                                        </Section>

                                        <Section title={<><BsClipboardCheck className="me-2" /> Przedmiot działalności</>} open={open.dzialalnosc} toggle={() => toggle("dzialalnosc")}>
                                            <table className="min-w-full border border-gray-400 text-sm">
                                                <thead className="bg-gray-300 font-semibold">
                                                <tr>
                                                    <th className="border border-gray-400 px-2 py-1 text-left w-1/3"></th>
                                                    <th className="border border-gray-400 px-2 py-1 text-center w-10">Lp.</th>
                                                    <th className="border border-gray-400 px-2 py-1 text-left">Kod / Opis</th>
                                                    {editMode && <th className="border border-gray-400 px-2 py-1 text-center">Akcje</th>}
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {/* --- 1. Przedmiot przeważającej działalności --- */}
                                                <tr className="bg-gray-200 font-medium">
                                                    <td className="border border-gray-400 px-2 py-1">1. Przedmiot działalności przedsiębiorcy</td>
                                                    <td className="border border-gray-400 px-2 py-1 text-center">1</td>
                                                    <td className="border border-gray-400 px-2 py-1">
                                                        {editMode ? (
                                                            <div className="d-flex gap-1">
                                                                <input
                                                                    className="form-control form-control-sm"
                                                                    placeholder="Kod dział"
                                                                    value={selected.przedmiotPrzewazajacejDzialalnosci?.[0]?.kodDzial || ""}
                                                                    onChange={e => setSelected(prev => ({
                                                                        ...prev,
                                                                        przedmiotPrzewazajacejDzialalnosci: [{
                                                                            ...prev.przedmiotPrzewazajacejDzialalnosci?.[0],
                                                                            kodDzial: e.target.value
                                                                        }]
                                                                    }))}
                                                                />
                                                                <input
                                                                    className="form-control form-control-sm"
                                                                    placeholder="Kod klasa"
                                                                    value={selected.przedmiotPrzewazajacejDzialalnosci?.[0]?.kodKlasa || ""}
                                                                    onChange={e => setSelected(prev => ({
                                                                        ...prev,
                                                                        przedmiotPrzewazajacejDzialalnosci: [{
                                                                            ...prev.przedmiotPrzewazajacejDzialalnosci?.[0],
                                                                            kodKlasa: e.target.value
                                                                        }]
                                                                    }))}
                                                                />
                                                                <input
                                                                    className="form-control form-control-sm"
                                                                    placeholder="Kod podklasa"
                                                                    value={selected.przedmiotPrzewazajacejDzialalnosci?.[0]?.kodPodklasa || ""}
                                                                    onChange={e => setSelected(prev => ({
                                                                        ...prev,
                                                                        przedmiotPrzewazajacejDzialalnosci: [{
                                                                            ...prev.przedmiotPrzewazajacejDzialalnosci?.[0],
                                                                            kodPodklasa: e.target.value
                                                                        }]
                                                                    }))}
                                                                />
                                                                <input
                                                                    className="form-control form-control-sm"
                                                                    placeholder="Opis"
                                                                    value={selected.przedmiotPrzewazajacejDzialalnosci?.[0]?.opis || ""}
                                                                    onChange={e => setSelected(prev => ({
                                                                        ...prev,
                                                                        przedmiotPrzewazajacejDzialalnosci: [{
                                                                            ...prev.przedmiotPrzewazajacejDzialalnosci?.[0],
                                                                            opis: e.target.value
                                                                        }]
                                                                    }))}
                                                                />
                                                            </div>
                                                        ) : (
                                                            selected.przedmiotPrzewazajacejDzialalnosci?.length
                                                                ? selected.przedmiotPrzewazajacejDzialalnosci
                                                                    .map(p => [p.kodDzial, p.kodKlasa, p.kodPodklasa].filter(Boolean).join("/") + " - " + p.opis)
                                                                    .join("; ")
                                                                : "Brak"
                                                        )}
                                                    </td>
                                                </tr>

                                                {/* --- 2. Przedmiot pozostałej działalności --- */}
                                                {(selected.przedmiotPozostalejDzialalnosci?.length > 0 ? selected.przedmiotPozostalejDzialalnosci : [{}]).map((p, i) => (
                                                    <tr key={i} className="bg-gray-200 font-medium">
                                                        {i === 0 && (
                                                            <td className="border border-gray-400 px-2 py-1" rowSpan={selected.przedmiotPozostalejDzialalnosci?.length || 1}>
                                                                2. Przedmiot pozostałej działalności przedsiębiorcy
                                                            </td>
                                                        )}
                                                        <td className="border border-gray-400 px-2 py-1 text-center">{i + 1}</td>
                                                        <td className="border border-gray-400 px-2 py-1">
                                                            {editMode ? (
                                                                <div className="d-flex gap-1">
                                                                    <input
                                                                        className="form-control form-control-sm"
                                                                        placeholder="Kod dział"
                                                                        value={p.kodDzial || ""}
                                                                        onChange={e => setSelected(prev => {
                                                                            const arr = [...(prev.przedmiotPozostalejDzialalnosci || [])];
                                                                            arr[i] = { ...arr[i], kodDzial: e.target.value };
                                                                            return { ...prev, przedmiotPozostalejDzialalnosci: arr };
                                                                        })}
                                                                    />
                                                                    <input
                                                                        className="form-control form-control-sm"
                                                                        placeholder="Kod klasa"
                                                                        value={p.kodKlasa || ""}
                                                                        onChange={e => setSelected(prev => {
                                                                            const arr = [...(prev.przedmiotPozostalejDzialalnosci || [])];
                                                                            arr[i] = { ...arr[i], kodKlasa: e.target.value };
                                                                            return { ...prev, przedmiotPozostalejDzialalnosci: arr };
                                                                        })}
                                                                    />
                                                                    <input
                                                                        className="form-control form-control-sm"
                                                                        placeholder="Kod podklasa"
                                                                        value={p.kodPodklasa || ""}
                                                                        onChange={e => setSelected(prev => {
                                                                            const arr = [...(prev.przedmiotPozostalejDzialalnosci || [])];
                                                                            arr[i] = { ...arr[i], kodPodklasa: e.target.value };
                                                                            return { ...prev, przedmiotPozostalejDzialalnosci: arr };
                                                                        })}
                                                                    />
                                                                    <input
                                                                        className="form-control form-control-sm"
                                                                        placeholder="Opis"
                                                                        value={p.opis || ""}
                                                                        onChange={e => setSelected(prev => {
                                                                            const arr = [...(prev.przedmiotPozostalejDzialalnosci || [])];
                                                                            arr[i] = { ...arr[i], opis: e.target.value };
                                                                            return { ...prev, przedmiotPozostalejDzialalnosci: arr };
                                                                        })}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                [p.kodDzial, p.kodKlasa, p.kodPodklasa].filter(Boolean).join("/") + " - " + (p.opis || "Brak")
                                                            )}
                                                        </td>
                                                        {editMode && (
                                                            <td className="border border-gray-400 px-2 py-1 text-center">
                                                                <button
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={() => setSelected(prev => {
                                                                        const arr = [...(prev.przedmiotPozostalejDzialalnosci || [])];
                                                                        arr.splice(i, 1);
                                                                        return { ...prev, przedmiotPozostalejDzialalnosci: arr };
                                                                    })}
                                                                >
                                                                    Usuń
                                                                </button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}

                                                {/* Add new row button */}
                                                {editMode && (
                                                    <tr>
                                                        <td colSpan={editMode ? 5 : 4} className="text-center">
                                                            <button
                                                                className="btn btn-sm btn-outline-primary mt-1"
                                                                onClick={() => setSelected(prev => ({
                                                                    ...prev,
                                                                    przedmiotPozostalejDzialalnosci: [...(prev.przedmiotPozostalejDzialalnosci || []), { kodDzial: "", kodKlasa: "", kodPodklasa: "", opis: "" }]
                                                                }))}
                                                            >
                                                                Dodaj przedmiot pozostałej działalności
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )}
                                                </tbody>
                                            </table>
                                        </Section>




                                        <div className="d-flex justify-content-center align-items-center gap-2 mt-3 mb-2">
                                            <button
                                                className={`btn ${mode === "add" ? "btn-primary" : "btn-outline-primary"} px-4`}
                                                onClick={handleSave}
                                            >
                                                {mode === "add" ? "Dodaj klienta" : "Zaktualizuj dane klienta"}
                                            </button>

                                            <button
                                                className="btn btn-outline-secondary"
                                                onClick={() => setEditMode(prev => !prev)}
                                            >
                                                {editMode ? "Zakończ edycję" : "Edytuj"}
                                            </button>
                                        </div>



                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Section = ({ title, open, toggle, children }) => (
    <div className="mb-3">
        <button
            className="btn w-100 text-start d-flex align-items-center justify-content-between"
            onClick={toggle}
            style={{ backgroundColor: "#0a2b4c", color: "#fff", border: "none", padding: "0.5rem 1rem" }}
        >
            <span>{title}</span>
            <span aria-hidden>{open ? "▴" : "▾"}</span>
        </button>
        {open && <div className="border border-top-0 p-3 bg-white small">{children}</div>}
    </div>
);

const Row = ({ label, value, label2, value2, onChangeValue, onChangeValue2, editMode }) => (
    <div className="row g-0 border-bottom mb-1">
        {label && <div className="col-12 col-md-3 bg-light border-end p-2 fw-bold">{label}</div>}
        <div className="col-12 col-md-3 p-2">
            {editMode ? (
                <input
                    className="form-control"
                    value={value || ""}
                    onChange={e => onChangeValue(e.target.value)}
                />
            ) : (
                value
            )}
        </div>

        {label2 && <div className="col-12 col-md-3 bg-light border-end p-2 fw-bold">{label2}</div>}
        <div className="col-12 col-md-3 p-2">
            {editMode ? (
                <input
                    className="form-control"
                    value={value2 || ""}
                    onChange={e => onChangeValue2(e.target.value)}
                />
            ) : (
                value2
            )}
        </div>
    </div>
);




export default ProjectClient;
