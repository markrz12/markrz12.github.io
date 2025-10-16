import React, { useState } from "react";
import { Sidebar} from "../../../ui/Common_project.js";
import {Topbar } from "../../../ui/Common.js";
import { timeAgo, ProgressMeter } from "../../Functions";
import TabNavigation from "../Tabs/TabNavigation";
import { BsPaperclip, BsX } from "react-icons/bs";
import FilesTable from "../Tabs/Files";
import RequestsTable from "../Tabs/Request";
import ActivityLog from "../Tabs/Activitylog";
import Application from "../Tabs/Application";
import { InitialsAvatar} from "../../../ui/common_function";


function KwestionariuszRyzyka() {
    const [activeTab, setActiveTab] = useState("Salda kont");
    const [riskChangeComment, setRiskChangeComment] = useState("");
    const [files, setFiles] = useState([]);
    const [logs] = useState([
        { date: "2025-09-24 14:32", user: "Kamil Miłosz", action: "Dodał komentarz", details: "Komentarz do pytania 3" },
        { date: "2025-09-23 10:15", user: "Janina Kowalska", action: "Zatwierdził odpowiedź", details: "Pytanie 1" },
        { date: "2025-09-22 09:00", user: "Anna Nowak", action: "Dodał plik", details: "umowa-najmu.pdf" },
    ]);

    const [requests, setRequests] = useState(() => {
        const now = new Date();
        const earlier = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        return [
            {
                id: 1, type: "Wyciąg bankowy", desc: "Wyciągi za Q2 2025 (miesięczne zestawienia)", due: "2025-09-05",
                status: "Oczekiwanie", createdAt: earlier.toISOString(), lastReminderAt: null, receivedAt: null, urgent: false
            },
            {
                id: 2, type: "Umowa najmu", desc: "Aktualna umowa wraz z aneksami", due: "2025-09-10",
                status: "Otrzymano", createdAt: earlier.toISOString(), lastReminderAt: earlier.toISOString(),
                receivedAt: now.toISOString(), receivedFile: { name: "umowa-najmu.pdf", url: "#" }, urgent: true
            },
        ];
    });

    const tabs = ["Salda kont", "Prezentacja i ujawnienia", "Cele badania", "Program badania", "Wniosek", "Zapotrzebowanie", "Pliki", "Dziennik"];

    const [saldaKont, setSaldaKont] = useState([
        {id:1,
            nazwa: "Oszacowane ryzyko nieodłączne (RN) na poziomie stwierdzeń",
            I: "Średnie",
            PiO: "Średnie",
            Ko: "Średnie",
            WiP: "Średnie",
            komentarz: "",
            sporzadzil: null,
            data: null,
            plik: null,
            type: "select",
        },
        {id:2,
            nazwa: "Oszacowane ryzyko kontroli (RK) na poziomie stwierdzeń",
            I: "Średnie",
            PiO: "Średnie",
            Ko: "Średnie",
            WiP: "Średnie",
            komentarz: "",
            sporzadzil: null,
            data: null,
            plik: null,
            type: "select",
        },
        {id:3,
            nazwa: "Oszacowane ryzyko istotnego zniekształcenia na poziomie stwierdzeń",
            I: "Średnie",
            PiO: "Średnie",
            Ko: "Średnie",
            WiP: "Średnie",
            komentarz: "",
            sporzadzil: null,
            data: null,
            plik: null,
            type: "select",
        },
        {id:4,
            nazwa: "Podsumowanie proponowanej reakcji na ryzyko – wybór kategorii\n" +
                "procedur badania (jeżeli podjąłeś decyzję o wykonaniu danej\n" +
                "kategorii, z niżej wskazanych, procedur wstaw znak „x”\n" +
                "w odpowiednie pola dotyczące stwierdzenia)\n",
            I: "Średnie",
            PiO: "Średnie",
            Ko: "Średnie",
            WiP: "Średnie",
            komentarz: "",
            sporzadzil: null,
            data: null,
            plik: null,
            type: "select",
        },
        {id:5,
            nazwa: "I. Szczegółowe procedury wiarygodności – podstawowe",
            I: false,
            PiO: false,
            Ko: false,
            WiP: false,
            komentarz: "",
            sporzadzil: null,
            data: null,
            plik: null,
            type: "checkbox",
        },
        {id:6,
            nazwa: "II. Szczegółowe procedury wiarygodności – dostosowane do\n" +
                "konkretnych czynników ryzyka (nadużycia, znaczące ryzyka\n" +
                "itp.)\n",
            I: false,
            PiO: false,
            Ko: false,
            WiP: false,
            komentarz: "",
            sporzadzil: null,
            data: null,
            plik: null,
            type: "checkbox",
        },
        {id:7,
            nazwa: "III. Analityczne procedury wiarygodności\n",
            I: false,
            PiO: false,
            Ko: false,
            WiP: false,
            komentarz: "",
            sporzadzil: null,
            data: null,
            plik: null,
            type: "checkbox",
        },
        {id:8,
            nazwa: "IV. Testy kontroli (skuteczność działania kontroli wewnętrznej)",
            I: false,
            PiO: false,
            Ko: false,
            WiP: false,
            komentarz: "",
            sporzadzil: null,
            data: null,
            plik: null,
            type: "checkbox",
        },
    ]);

    const [prezentacja, setPrezentacja] = useState([
        {id:1,
            nazwa: "Oszacowane ryzyko nieodłączne (RN) na poziomie stwierdzeń",
            WoPiO: "Średnie",
            Ko : "Średnie",
            KiZ: "Średnie",
            DiW: "Średnie",
            komentarz: "",
            sporzadzil: null,
            data: null,
            plik: null,
            type: "select",
        },
        {id:2,
            nazwa: "Oszacowane ryzyko kontroli (RK) na poziomie stwierdzeń",
            WoPiO: "Średnie",
            Ko : "Średnie",
            KiZ: "Średnie",
            DiW: "Średnie",
            komentarz: "",
            sporzadzil: null,
            data: null,
            plik: null,
            type: "select",
        },
        {id:3,
            nazwa: "Oszacowane ryzyko istotnego zniekształcenia na poziomie stwierdzeń",
            WoPiO: "Średnie",
            Ko : "Średnie",
            KiZ: "Średnie",
            DiW: "Średnie",
            komentarz: "",
            sporzadzil: null,
            data: null,
            plik: null,
            type: "select",
        },
        {id:4,
            nazwa: "Podsumowanie proponowanej reakcji na ryzyko – wybór kategorii procedur badania (jeżeli podjąłeś decyzję o wykonaniu danej \n" +
            "kategorii, z niżej wskazanych, procedur wstaw znak „x” w odpowiednie pola dotyczące stwierdzenia)",
            WoPiO: "Średnie",
            Ko : "Średnie",
            KiZ: "Średnie",
            DiW: "Średnie",
            komentarz: "",
            sporzadzil: null,
            data: null,
            plik: null,
            type: "select",
        },
        {id:5,
            nazwa: "I. Szczegółowe procedury wiarygodności – podstawowe",
            WoPiO: false,
            Ko : false,
            KiZ: false,
            DiW: false,
            komentarz: "",
            sporzadzil: null,
            data: null,
            plik: null,
            type: "checkbox",
        },
        {id:6,
            nazwa: "II. Szczegółowe procedury wiarygodności – dostosowane do\n" +
                "konkretnych czynników ryzyka (nadużycia, znaczące ryzyka\n" +
                "itp.)",
            WoPiO: false,
            Ko : false,
            KiZ: false,
            DiW: false,
            komentarz: "",
            sporzadzil: null,
            data: null,
            plik: null,
            type: "checkbox",
        },
        {id:7,
            nazwa: "III. Analityczne procedury wiarygodności",
            WoPiO: false,
            Ko : false,
            KiZ: false,
            DiW: false,
            komentarz: "",
            sporzadzil: null,
            data: null,
            plik: null,
            type: "checkbox",
        },
        {id:8,
            nazwa: "IV. Testy kontroli (skuteczność działania kontroli wewnętrznej)",
            WoPiO: false,
            Ko : false,
            KiZ: false,
            DiW: false,
            komentarz: "",
            sporzadzil: null,
            data: null,
            plik: null,
            type: "checkbox",
        },
    ]);

    const [celeBadania] = useState([
        {
            nr: 1,
            nazwa: `Przy przeprowadzaniu badania sprawozdania finansowego twoim celem jest uzyskanie wystarczającej pewności, czy sprawozdanie finansowe jako całość nie zawiera istotnego zniekształcenia, niezależnie od tego, czy zostało ono spowodowane błędem lub oszustwem, co umożliwi ci wyrażenie opinii o tym, czy sprawozdanie finansowe jest, we wszystkich istotnych aspektach, sporządzone zgodnie z mającymi zastosowanie ramowymi założeniami sprawozdawczości finansowej.
W związku z tym powinieneś zrealizować poniższe cele, które pozwolą ci osiągnąć określonypowyżej cel ogólny.

Pamiętaj, że twoim celem jest uzyskanie wystarczających i odpowiednich dowodów badania ocenionego ryzyka istotnego zniekształcenia dzięki zaprojektowaniu i zastosowaniu odpowiednich do tego ryzyka reakcji.

Upewnij się, że wartości niematerialne i prawne są prawidłowo wykazane w sprawozdaniu finansowym zgodnie z odpowiednimi przepisami prawa i przyjętymi zasadami (polityką) rachunkowości.`,
            kolumny: ["I", "PiO", "Ko", "WiP"],
        },
        {
            nr: 2,
            nazwa: `Upewnij się, że ujęte w sprawozdaniu finansowym wartości niematerialne i prawne istnieją i klient ma do nich ważny tytuł prawny.`,
            kolumny: ["I", "PiO"],
        },
        {
            nr: 3,
            nazwa: `Upewnij się, że wycena wartości niematerialnych i prawnych jest zgodna z zasadami (polityką) rachunkowości klienta i zasady te stosowane są w sposób ciągły.`,
            kolumny: ["WiP"],
        },
        {
            nr: 4,
            nazwa: `Upewnij się, że zwiększenie stanu wartości niematerialnych i prawnych jest zasadne, a ich zbycie zostało prawidłowo zarejestrowane.`,
            kolumny: ["Ko"],
        },
        {
            nr: 5,
            nazwa: `Upewnij się, że wobec wartości niematerialnych i prawnych, podlegających amortyzacji, zastosowano prawidłowe stawki amortyzacji, w sposób:
(a) zasadny i właściwy;
(b) zgodny z podejściem zastosowanym w poprzednim roku.`,
            kolumny: ["WiP"],
        },
        {
            nr: 6,
            nazwa: `Upewnij się, że utworzono odpis aktualizujący z tytułu utraty wartości.`,
            kolumny: ["WiP"],
        },
        {
            nr: 7,
            nazwa: `Upewnij się, że w sprawozdaniu finansowym:
- obszar został poprawnie zaprezentowany,
- poprawnie ujawniono zastosowane zasady wyceny,
- poprawnie i kompletnie przedstawiono wymagane przepisami i standardami rachunkowości ujawnienia związane z tym obszarem.`,
            kolumny: ["WoPiO", "Ko", "KiZ", "DiW"],
        },
    ]);

    const [programBadania, setProgramBadania] = useState([
        {
            nr: 1,
            nazwa: `Przejrzyj memorandum planowania badania, a także zestawienie oceny ryzyka oraz plan doboru próby dla tego obszaru.
Upewnij się, że poniższe testy zostały odpowiednio dostosowane do okoliczności i rozpoznanego ryzyka.
Wszelkie zmiany w planowanym podejściu powinny zostać odnotowane.`,
            osiagnieteCele: "1",
            msb: "330(6)",
            zalaczniki: null,
            sporzadzil: null,
            data: null

        },
        {
            nr: 2,
            nazwa: `Jeżeli dopiero nawiązałeś współpracę z klientem i po raz pierwszy badasz jego sprawozdanie finansowe,
w związku z twoją odpowiedzialnością względem stanów początkowych, wykonaj procedury, które pozwolą ci upewnić się, że:
(a) stany początkowe nie zawierają zniekształceń, które istotnie wpływają na sprawozdanie finansowe za bieżący rok,
(b) zostały zastosowane prawidłowe zasady (polityka) rachunkowości do stanów początkowych i były one stosowane w sposób ciągły lub prawidłowo rozliczone i zaprezentowane zgodnie z zasadami rachunkowości.`,
            osiagnieteCele: "1",
            msb: "510(3,5-9) " +
                "710(5)",
            zalaczniki: null,
            sporzadzil: null,
            data: null

        },
        {
            nr: 3,
            nazwa: `W zależności od specyfiki pozycji (obszaru sprawozdania finansowego) zaprojektuj i przeprowadź procedury badania odpowiadające ocenie ryzyka istotnego zniekształcenia spowodowanego oszustwem na poziomie stwierdzeń.
W tym celu możesz posłużyć się załącznikiem nr 2 do MSB 240 zawierającym przykłady procedur badania.
Kierownictwo jest w wyjątkowej sytuacji, która umożliwia mu popełnienie oszustwa z racji możliwości manipulowania zapisami księgowymi i sporządzania nacechowanych oszustwem sprawozdań finansowych poprzez obchodzenie kontroli, które w innych sytuacjach wydają się działać skutecznie.
Ryzyko to występuje we wszystkich jednostkach. Pamiętaj o odpowiednim zaprojektowaniu i przeprowadzeniu odpowiednich procedur badania.`,
            osiagnieteCele: "1",
            msb: "330(6) 240(30-33) 330(21)",
            zalaczniki: null,
            sporzadzil: null,
            data: null

        },
        {
            nr: 4,
            nazwa: "Przygotuj tabelę wiodącą kont księgowych i uzgodnij ją z bilansem.",
            osiagnieteCele: "1",
            msb: "330(20,30) 710(7)",
            zalaczniki: null,
            sporzadzil: null,
            data: null

        },
        {
            nr: 5,
            nazwa: `Oceń adekwatność zasad (polityki) rachunkowości w odniesieniu do wartości niematerialnych i prawnych.
Upewnij, że polityka rachunkowości jest zbieżna ze standardami rachunkowości i obowiązującymi przepisami prawa.`,
            osiagnieteCele: "1",
            msb: "330(6)",
            zalaczniki: null,
            sporzadzil: null,
            data: null

        },
        {
            nr: 6,
            nazwa: `Uzyskaj rejestr (wykaz sald kont ksiąg pomocniczych) wartości niematerialnych i prawnych i:
i. uzgodnij rejestr do księgi głównej;
ii. uzgodnij bilans otwarcia ze sprawozdaniem finansowym z poprzedniego roku;
iii. przygotuj komentarz z objaśnieniem struktury wartości niematerialnych i prawnych oraz porównaniem do poprzednich lat i twoich oczekiwań.`,
            osiagnieteCele: "1",
            msb: "330(20,30) 500(9) 710(7) 520(5,7)",
            zalaczniki: null,
            sporzadzil: null,
            data: null

        },
        {
            nr: 7,
            nazwa: `Uzyskaj lub przygotuj odrębne zestawienia dla:
i. zwiększenia stanu w każdej z grup;
ii. zmniejszeń w każdej z grup.
Uzgodnij to zestawienie do tabeli ruchu wartości niematerialnych i prawnych.`,
            osiagnieteCele: "4\n" +
                "Ko",
            msb: "330(20) 500(9)",
            zalaczniki: null,
            sporzadzil: null,
            data: null

        },
        {
            nr: 8,
            nazwa: `Załącz do dokumentacji roboczej zestawienie identyfikujące wybrane przez ciebie dowody badania dotyczące zwiększeń lub załącz kopie tych dokumentów.
Upewnij się, że we właściwym momencie rozpoczęto naliczać odpisy amortyzacyjne.`,
            osiagnieteCele: "3, 4, 5\n" +
                "WiP, Ko",
            msb: "330(20)",
            zalaczniki: null,
            sporzadzil: null,
            data: null

        },
        {
            nr: 9,
            nazwa: `Załącz do dokumentacji roboczej zestawienie identyfikujące wybrane przez ciebie dowody badania dotyczące zmniejszeń lub załącz kopie tych dokumentów.
Upewnij się, że we właściwym momencie zakończano naliczać odpisy amortyzacyjne.`,
            osiagnieteCele: "4\n" +
                "Ko",
            msb: "330(20)",
            zalaczniki: null,
            sporzadzil: null,
            data: null
        },
        {
            nr: 10,
            nazwa: `Przeanalizuj stawki amortyzacyjne:
- w świetle zdarzeń, do których doszło w trakcie roku,
- w powiązaniu z zasadami (polityką) rachunkowości,
- rozważ, czy są one adekwatne i odpowiadają racjonalnie określonemu okresowi ekonomicznej użyteczności.
Pamiętaj, że procedurę twojej weryfikacji istotnych szacunków należy odpowiednio udokumentować.`,
            osiagnieteCele: "5\n" +
                "WiP",
            msb: "330(20) 520(5,7)",
            zalaczniki: null,
            sporzadzil: null,
            data: null
        },
        {
            nr: 11,
            nazwa: `Uzgodnij sumę kosztów amortyzacji z kwotą ujętą w rachunku zysków i strat.`,
            osiagnieteCele: "7\n" +
                "WoPiO, Ko,\n" +
                "KiZ, DiW",
            msb: "330(20,30)",
            zalaczniki: null,
            sporzadzil: null,
            data: null
        },
        {
            nr: 12,
            nazwa: `Zbadaj akty własności i upewnij się, że klient posiada ważne tytuły prawne.`,
            osiagnieteCele: "2\n" +
                "I, PiO",
            msb: "330(20)",
            zalaczniki: null,
            sporzadzil: null,
            data: null
        },
        {
            nr: 13,
            nazwa: `Zastanów się, czy nie wystąpiły przesłanki trwałej utraty wartości i porozmawiaj na ten temat z kierownictwem.
Jeżeli wystąpiły takie przesłanki upewnij się, że klient właściwie zareagował w tej sytuacji.
Dokonaj analizy wykonanego przez kierownictwo testu na utratę wartości pod kątem weryfikacji przyjętych w nim założeń, danych oraz arytmetycznej poprawności obliczeń i logiczności rozumowania odzwierciedlonego w teście.
Upewnij się, że w przypadku trwałej utraty wartości odpisy aktualizujące, będące wartością szacunkową, zostały ustalone na racjonalnym poziomie oraz zgodnie ze stosowanymi przez klienta zasadami (polityką) rachunkowości.
Pamiętaj, że procedurę twojej weryfikacji istotnych szacunków należy odpowiednio udokumentować.`,
            osiagnieteCele: "3, 6\n" +
                "WiP",
            msb: "330(20) 500(9) 540(12-22)",
            zalaczniki: null,
            sporzadzil: null,
            data: null
        },
        {
            nr: 14,
            nazwa: `Zapoznaj się z uzasadnieniem dla skapitalizowania poniesionych wydatków i upewnij się, że jest to słuszne, konsekwentnie stosowane i zgodne z odpowiednimi standardami rachunkowości.
Uzyskaj aktualne prognozy dochodów i zysków, np. dla prac badawczo-rozwojowych i podobnych kategorii wartości niematerialnych i prawnych.`,
            osiagnieteCele: "3, 6\n" +
                "WiP",
            msb: "330(20) 540(12-22)",
            zalaczniki: null,
            sporzadzil: null,
            data: null
        },
        {
            nr: 15,
            nazwa: `Uzgodnij obszar z innymi powiązanymi obszarami:
- bilansu,
- rachunku zysków i strat,
- rachunku przepływów pieniężnych,
- informacją dodatkową,
- podatkiem dochodowym od osób prawnych oraz podatkiem odroczonym.`,
            osiagnieteCele: "7\n" +
                "WoPiO, Ko,\n" +
                "KiZ, DiW",
            msb: "330(20,30)",
            zalaczniki: null,
            sporzadzil: null,
            data: null
        },
        {
            nr: 16,
            nazwa: `Upewnij się, że dana pozycja (obszar sprawozdania finansowego) została prawidło zaprezentowana w sprawozdaniu finansowym.`,
            osiagnieteCele: "7\n" +
                "WoPiO, Ko,\n" +
                "KiZ, DiW",
            msb: "330(24)",
            zalaczniki: null,
            sporzadzil: null,
            data: null
        },
        {
            nr: 17,
            nazwa: `Upewnij się, że wszystkie wymagane przepisami i standardami rachunkowości ujawnienia dotyczące danej pozycji (obszaru sprawozdania finansowego), w tym te dotyczące zabezpieczeń ustanowionych na majątku klienta, zostały prawidłowo i kompletnie ujęte.`,
            osiagnieteCele: "7\n" +
                "WoPiO, Ko,\n" +
                "KiZ, DiW",
            msb: "330(24)",
            zalaczniki: null,
            sporzadzil: null,
            data: null
        },
        {
            nr: 18,
            nazwa: `Jeżeli uznasz to za odpowiednie przeprowadź dodatkowe testy, aby uzyskać pewność, że zostały spełnione wytyczne wyznaczone na etapie planowania oraz cele badania.`,
            osiagnieteCele: "",
            msb: "330(28) 500(6)",
            zalaczniki: null,
            sporzadzil: null,
            data: null
        },
        {
            nr: 19,
            nazwa: `Na koniec zastanów się, czy wykonane przez ciebie procedury i zebrane dowody badania są odpowiednie i wystarczające w odpowiedzi na oszacowany poziom ryzyka i istotności?`,
            osiagnieteCele: "",
            msb: "330(26)",
            zalaczniki: null,
            sporzadzil: null,
            data: null
        },
    ]);

    const handleRowChange = (index, field, value) => {
        const updated = [...saldaKont];
        updated[index][field] = value;
        setSaldaKont(updated);
    };

    const handleFileChange = (index, value) => {
        const updated = [...saldaKont];
        updated[index].plik = value;
        setSaldaKont(updated);
    };

    return (
        <div className="d-flex min-vh-100">
            <Sidebar />
            <div
                className="flex-grow-1 d-flex flex-column"
                style={{ overflow: "hidden" }}
            >
                <Topbar
                    breadcrumb={[
                        { label: "Home", to: "/" },
                        { label: "Kwestionariusz ryzyka", active: true },
                    ]}
                />

                <div className="px-3 py-2 mt-2 mb-1 border-bottom d-flex justify-content-between align-items-center flex-wrap">
                    <div className="d-flex align-items-baseline gap-2 flex-wrap">
                        <h4 className="fw-semibold mb-0">DR/2025/123456</h4>
                        <span className="fs-5 text-secondary">Alphatech Sp. z o.o.</span>
                    </div>
                    <div className="text-muted gap-4" style={{ fontSize: "0.9rem" }}>
                        <div>Kierownik: Jan Kowalski</div>
                        <div>Okres: 01.01.2025 – 31.12.2025</div>
                    </div>
                </div>

                <div className="mb-2 mt-2 px-3 d-flex align-items-center justify-content-between">
                    <h5 className="fw-semibold fs-5 mb-2 mt-2">
                        III.2 Wartości niematerialne i prawne
                    </h5>
                    <div style={{ width: "250px", minWidth: "150px" }}>
                        <ProgressMeter percent={70} />
                    </div>
                </div>

                <TabNavigation
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                <div className="px-3 flex-grow-1 overflow-auto">
                    {activeTab === "Salda kont" && (
                        <div className="table-responsive">
                            <table
                                className="table table-bordered table-sm align-middle"
                                style={{ fontSize: "0.85rem" }}
                            >
                                <thead className="table-light">
                                <tr>
                                    <th style={{ ...headerStyle, width: "23%" }}>Stwierdzenie</th>
                                    {["I", "PiO", "Ko", "WiP"].map((col) => (
                                        <th key={col} style={{...headerStyle, width: "9.5%"}}>
                                            {col}
                                        </th>
                                    ))}
                                    <th style={{...headerStyle, width: "11%"}}>Załącznik</th>
                                    <th style={{...headerStyle}}>Komentarz</th>
                                    <th style={headerStyle}>Sporządził</th>
                                </tr>
                                </thead>
                                <tbody>
                                {saldaKont.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{...tdDescription}} >{item.nazwa}</td>
                                        {["I", "PiO", "Ko", "WiP"].map((col) => (
                                            <td
                                                key={col}
                                                style={{...tdCenter, textAlign: item.type === "checkbox" ? "center" : "left" }}
                                            >
                                                {item.type === "select" ? (
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={item[col]}
                                                        style={{fontSize: "0.82rem"}}
                                                        onChange={(e) =>
                                                            handleRowChange(index, col, e.target.value)
                                                        }
                                                    >
                                                        <option>Wysokie</option>
                                                        <option>Średnie</option>
                                                        <option>Niskie</option>
                                                    </select>
                                                ) : (
                                                    <input
                                                        type="checkbox"
                                                        checked={item[col]}
                                                        onChange={(e) =>
                                                            handleRowChange(index, col, e.target.checked)
                                                        }
                                                    />
                                                )}
                                            </td>
                                        ))}

                                        {/* Załącznik */}
                                        <td style={{...tdCenter}}>
                                            {!item.plik ? (
                                                <label className="btn btn-sm btn-outline-secondary mb-0">
                                                    <BsPaperclip className="me-1" /> Dodaj plik
                                                    <input
                                                        type="file"
                                                        style={{ display: "none" }}
                                                        onChange={(e) =>
                                                            handleFileChange(index, e.target.files[0])
                                                        }
                                                    />
                                                </label>
                                            ) : (
                                                <div className="d-flex align-items-center gap-2">
                                                    <BsPaperclip />
                                                    <span className="small">{item.plik.name}</span>
                                                    <button
                                                        className="btn btn-sm btn-light border"
                                                        onClick={() => handleFileChange(index, null)}
                                                    >
                                                        <BsX />
                                                    </button>
                                                </div>
                                            )}
                                        </td>

                                        {/* Komentarz */}
                                        <td style={{...tdCenter}}>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder="Komentarz"
                                                value={item.komentarz}
                                                onChange={(e) =>
                                                    handleRowChange(index, "komentarz", e.target.value)
                                                }
                                            />
                                        </td>

                                        {/* Sporządził */}
                                        <td
                                            style={{
                                                textAlign: "center",
                                                border: "1px solid #dee2e6",
                                                fontSize: "0.80rem",
                                            }}
                                        >
                                            <div
                                                className="d-flex align-items-center justify-content-center"
                                                style={{ gap: "0.5rem" }}
                                            >
                                                {item.sporzadzil && item.sporzadzil !== "_" ? (
                                                    <>
                                                        <InitialsAvatar name={item.sporzadzil} size={23} />
                                                        <span className="text-muted small">
          {item.data ? timeAgo(new Date(item.data)) : ""}
        </span>
                                                    </>
                                                ) : (
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        style={{ margin: "0 auto" }}
                                                        onClick={() =>
                                                            setSaldaKont((prev) =>
                                                                prev.map((rw) =>
                                                                    rw.id === item.id
                                                                        ? {
                                                                            ...rw,
                                                                            sporzadzil: "Jan Kowalski", // albo np. dynamicznie pobrany user
                                                                            data: new Date().toISOString(),
                                                                        }
                                                                        : rw
                                                                )
                                                            )
                                                        }
                                                    >
                                                        Zatwierdź
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {activeTab === "Prezentacja i ujawnienia" && (
                        <div className="table-responsive">
                            <table
                                className="table table-bordered table-sm align-middle"
                                style={{ fontSize: "0.85rem" }}
                            >
                                <thead className="table-light">
                                <tr>
                                    <th style={{ ...headerStyle, width: "23%" }}>Stwierdzenie</th>
                                    {["WoPiO", "Ko", "KiZ", "DiW"].map((col) => (
                                        <th key={col} style={{...headerStyle,width: "9.5%"}}>
                                            {col}
                                        </th>
                                    ))}
                                    <th style={{...headerStyle, width: "11%"}}>Załącznik</th>
                                    <th style={headerStyle}>Komentarz</th>
                                    <th style={headerStyle}>Sporządził</th>
                                </tr>
                                </thead>
                                <tbody>
                                {prezentacja.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{...tdDescription}}>{item.nazwa}</td>
                                        {["WoPiO", "Ko", "KiZ", "DiW"].map((col) => (
                                            <td
                                                key={col}
                                                style={{...tdCenter, textAlign: item.type === "checkbox" ? "center" : "left" }}>
                                                {item.type === "select" ? (
                                                    <select
                                                        className="form-select form-select-sm"
                                                        style={{fontSize: "0.82rem"}}
                                                        value={item[col]}
                                                        onChange={(e) => {
                                                            const updated = [...prezentacja];
                                                            updated[index][col] = e.target.value;
                                                            setPrezentacja(updated);
                                                        }}
                                                    >
                                                        <option>Wysokie</option>
                                                        <option>Średnie</option>
                                                        <option>Niskie</option>
                                                    </select>
                                                ) : (
                                                    <input
                                                        type="checkbox"
                                                        checked={item[col]}
                                                        onChange={(e) => {
                                                            const updated = [...prezentacja];
                                                            updated[index][col] = e.target.checked;
                                                            setPrezentacja(updated);
                                                        }}
                                                    />
                                                )}
                                            </td>
                                        ))}

                                        {/* Załącznik */}
                                        <td style={{...tdCenter, textAlign: "center", width: "10%" }}>
                                            {!item.plik ? (
                                                <label className="btn btn-sm btn-outline-secondary mb-0">
                                                    <BsPaperclip className="me-1" /> Dodaj plik
                                                    <input
                                                        type="file"
                                                        style={{ display: "none" }}
                                                        onChange={(e) => {
                                                            const updated = [...prezentacja];
                                                            updated[index].plik = e.target.files[0];
                                                            setPrezentacja(updated);
                                                        }}
                                                    />
                                                </label>
                                            ) : (
                                                <div className="d-flex align-items-center gap-2">
                                                    <BsPaperclip />
                                                    <span className="small">{item.plik.name}</span>
                                                    <button
                                                        className="btn btn-sm btn-light border"
                                                        onClick={() => {
                                                            const updated = [...prezentacja];
                                                            updated[index].plik = null;
                                                            setPrezentacja(updated);
                                                        }}
                                                    >
                                                        <BsX />
                                                    </button>
                                                </div>
                                            )}
                                        </td>

                                        {/* Komentarz */}
                                        <td style ={{...tdCenter}}>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder="Komentarz"
                                                value={item.komentarz}
                                                onChange={(e) => {
                                                    const updated = [...prezentacja];
                                                    updated[index].komentarz = e.target.value;
                                                    setPrezentacja(updated);
                                                }}
                                            />
                                        </td>

                                        {/* Sporządził */}
                                        <td style={{textAlign: "center", border: "1px solid #dee2e6", fontSize: "0.80rem",}}>
                                            <div className="d-flex align-items-center justify-content-center"
                                                style={{ gap: "0.5rem" }}>
                                                {item.sporzadzil && item.sporzadzil !== "_" ? (
                                                    <>
                                                        <InitialsAvatar name={item.sporzadzil} size={23} />
                                                        <span className="text-muted small">
                                                            {item.data ? timeAgo(new Date(item.data)) : ""}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        style={{ margin: "0 auto" }}
                                                        onClick={() =>
                                                            setPrezentacja((prev) =>
                                                                prev.map((rw) =>
                                                                    rw.id === item.id
                                                                        ? {
                                                                            ...rw,
                                                                            sporzadzil: "Jan Kowalski", // albo np. dynamicznie pobrany user
                                                                            data: new Date().toISOString(),
                                                                        }
                                                                        : rw
                                                                )
                                                            )
                                                        }
                                                    >
                                                        Zatwierdź
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {activeTab === "Cele badania" && (
                        <div className="table-responsive">
                            <table
                                className="table table-bordered table-sm align-middle"
                                style={{ fontSize: "0.85rem" }}>
                                <thead className="table-light">
                                <tr>
                                    <th style={{ ...headerStyle, width: "2%" }}>Lp.</th>
                                    <th style={{ ...headerStyle, width: "65%" }}>Badane stwierdzenie</th>
                                    <th style={headerStyle}>Powiązane obszary</th>
                                </tr>
                                </thead>
                                <tbody>
                                {celeBadania.map((cel, index) => (
                                    <tr key={index}>
                                        <td style={tdCenter}>{cel.nr}</td>
                                        <td style={{ ...tdDescription, whiteSpace: "pre-line"}}>{cel.nazwa}</td>
                                        <td style={tdCenter}>{cel.kolumny.join(", ")}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {activeTab === "Program badania" && (
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm" style={{ fontSize: "0.85rem" }}>
                                <thead>
                                <tr>
                                    <th style={{ ...headerStyle}}>Nr</th>
                                    <th style={{ ...headerStyle}}>Nazwa</th>
                                    <th style={{ ...headerStyle}}>Osiągnięte cele</th>
                                    <th style={{ ...headerStyle}}>MSB</th>
                                    <th style={{ ...headerStyle}}>Załączniki</th>
                                    <th style={{ ...headerStyle}}>Inicjały</th>
                                </tr>
                                </thead>
                                <tbody>
                                {programBadania.map((item, index) => (
                                    <tr key={item.nr}>
                                        <td style={{...tdCenter, width: "1%" }}>{item.nr}</td>
                                        <td style={{...tdDescription, whiteSpace: "pre-line", width: "40%" }}>{item.nazwa}</td>
                                        <td style={{ ...tdCenter, width: "10%" ,whiteSpace: "pre-line" }}>{item.osiagnieteCele}</td>
                                        <td style={{ ...tdCenter, width: "10%"}} >{item.msb}</td>
                                        <td style={{...tdCenter, width: "13%" }}>
                                            {!item.plik ? (
                                                <label className="btn btn-sm btn-outline-secondary mb-0">
                                                    <BsPaperclip className="me-1" /> Dodaj plik
                                                    <input
                                                        type="file"
                                                        style={{ display: "none" }}
                                                        onChange={(e) => {
                                                            const updated = [...programBadania];
                                                            updated[index].plik = e.target.files[0]; // teraz index jest dostępny
                                                            setProgramBadania(updated);
                                                        }}
                                                    />
                                                </label>
                                            ) : (
                                                <div className="d-flex align-items-center gap-2">
                                                    <BsPaperclip />
                                                    <span className="small">{item.plik.name}</span>
                                                    <button
                                                        className="btn btn-sm btn-light border"
                                                        onClick={() => {
                                                            const updated = [...programBadania];
                                                            updated[index].plik = null;
                                                            setProgramBadania(updated);
                                                        }}
                                                    >
                                                        <BsX />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td style={{...tdCenter, textAlign: "center", border: "1px solid #dee2e6", fontSize: "0.80rem",}}>
                                            <div className="d-flex align-items-center justify-content-center"
                                                 style={{ gap: "0.5rem" }}>
                                                {item.sporzadzil && item.sporzadzil !== "_" ? (
                                                    <>
                                                        <InitialsAvatar name={item.sporzadzil} size={23} />
                                                        <span className="text-muted small">
                                                            {item.data ? timeAgo(new Date(item.data)) : ""}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        style={{ margin: "0 auto" }}
                                                        onClick={() =>
                                                            setProgramBadania((prev) =>
                                                                prev.map((rw) =>
                                                                    rw.nr === item.nr
                                                                        ? {
                                                                            ...rw,
                                                                            sporzadzil: "Jan Kowalski", // albo np. dynamicznie pobrany user
                                                                            data: new Date().toISOString(),
                                                                        }
                                                                        : rw
                                                                )
                                                            )
                                                        }
                                                    >
                                                        Zatwierdź
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <div className="d-flex align-items-start gap-3 my-2">
                                <div className="d-flex flex-column flex-md-row align-items-start mb-3 p-3 rounded border bg-white shadow-sm"
                                     style={{ gap: "1rem" }}>
                                    <label
                                        className="fw-semibold"
                                        style={{
                                            flex: "1%",
                                            minWidth: 100,
                                            fontSize: "0.95rem",
                                            color: "#0a2b4c",
                                            padding: "0.35rem",
                                        }}
                                    >
                                        Czy wstępnie oszacowany przez ciebie poziom ryzyka uległ zmianie?
                                        Jeżeli tak, wyjaśnij tę sytuację i podejmij decyzję,
                                        czy w odpowiedzi na zmieniony poziom ryzyka decydujesz się
                                        na wykonanie innych, dodatkowych procedur badania.
                                    </label>
                                <div style={{ flex: 1}}>
                                    <textarea
                                        className="form-control form-control-sm"
                                        placeholder="Wpisz swoją odpowiedź..."
                                        value={riskChangeComment}
                                        onChange={(e) => setRiskChangeComment(e.target.value)}
                                        rows={4}
                                        style={{ fontSize: "0.85rem" }}/>
                                </div>
                            </div>
                            </div>


                        </div>
                    )}
                    {activeTab === "Zapotrzebowanie" && <RequestsTable requests={requests} setRequests={setRequests} />}
                    {activeTab === "Pliki" && <FilesTable files={files} setFiles={setFiles} />}
                    {activeTab === "Dziennik" && (
                        <div className="p-0 flex-grow-1" style={{ overflow: "auto" }}>
                            <ActivityLog logs={logs} />
                        </div>
                    )}
                    {activeTab === "Wniosek" && <Application />}
                </div>
                <div className="d-flex justify-content-between p-2 border-top mt-2" style={{ backgroundColor:'var(--ndr-bg-topbar)' }}>
                    <button className="btn btn-outline-light">«« Poprzedni kwestionariusz</button>
                    <button className="btn btn-outline-light">Następny kwestionariusz »»</button>
                </div>
            </div>
        </div>
    );
}

const headerStyle = {border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem",};
const tdCenter = { textAlign: "center", border: "1px solid #dee2e6",padding: "0.75rem", };
const tdDescription = { border: "1px solid #dee2e6", fontSize: "0.85rem", paddingLeft: "1rem", paddingTop:"0.5rem", paddingBottom:"0.5rem" };

export default KwestionariuszRyzyka;
