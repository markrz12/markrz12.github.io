import React, { useState } from "react";

export default function Application() {
    const [expandedStep, setExpandedStep] = useState(1); // Krok 1 domyślnie rozwinięty

    const [submission, setSubmission] = useState({
        id: 1,
        title: "Wniosek audytowy - przykładowy",
        description: `Jestem przekonany/a, że:
1. Wszyscy członkowie zespołu zlecenia badania przestrzegają kodeksu etyki zawodowej, w szczególności wymogów dotyczących niezależności.
2. Niezależność firmy audytorskiej została pozytywnie zweryfikowana.
3. Wszystkie zagrożenia dla niezależności i obiektywizmu, a także środki zaradcze zostały wskazane i udokumentowane.
4. Osoby sprawujące nadzór zostały we właściwy sposób poinformowane o wszystkich znaczących faktach i kwestiach związanych z wszelkimi zagrożeniami dla naszej niezależności i obiektywizmu.
5. Nie ma żadnych powodów, z racji których firma audytorska nie powinna przyjąć zlecenia lub kontynuować zlecenie.
6. Zastosowano odpowiednie procedury dotyczące akceptacji i kontynuacji współpracy z danym klientem oraz zleceń badania oraz ustalono w związku z tym właściwe wnioski (MSB 220.12).
7. Nie uzyskano informacji, które, gdyby były wcześniej znane, wpłynęłyby na odmowę przyjęcia zlecenia badania (MSB 220.13).
Oświadczam, że kluczowy biegły rewident i firma audytorska przeznaczają wystarczającą ilość czasu i odpowiednie zasoby w celu właściwej realizacji zlecenia.
Ponadto oświadczam, że przed przyjęciem lub kontynuowaniem zlecenia badania oceniłem i udokumentowałem, że spełnione zostały wymogi, o których mowa w art. 74 ust. 1 ustawy o biegłych rewidentach.`,
        keyAuditor: "",
        date: "",
        file: null
    });

    const handleFileChange = (file) => setSubmission(prev => ({ ...prev, file }));

    const toggleStep = (step) => setExpandedStep(expandedStep === step ? null : step);

    const StepCard = ({ step, title, children }) => (
        <div className="card shadow-sm mb-1">
            <div
                className="card-header fw-semibold d-flex justify-content-between align-items-center"
                style={{ backgroundColor: "#0a2b4c", color: "#fff", cursor: "pointer", padding: "0.75rem" }}
                onClick={() => toggleStep(step)}
            >
                <span>{step}. {title}</span>
                <span>{expandedStep === step ? "▲" : "▼"}</span>
            </div>
            {expandedStep === step && (
                <div className="card-body">{children}</div>
            )}
        </div>
    );

    return (
        <div>
            {/* Krok 1 */}
            <StepCard step={1} title="Podgląd i pobranie wniosku">
                <div className="form-control mb-3" style={{fontSize: "0.9rem", whiteSpace: "pre-wrap", backgroundColor: "#f9fafb", border: "1px solid #dee2e6" }}>
                    {submission.description}
                </div>

                <div className="d-flex align-items-center gap-3 mb-3">
                    <span className="fw-semibold" style = {{fontSize: "0.9rem"}}>Kluczowy biegły rewident:</span>
                    <div className="form-control flex-grow-1" style={{ height:"37px", width: "300px", backgroundColor: "#f9fafb", border: "1px solid #dee2e6" }}>
                        {submission.keyAuditor || ""}
                    </div>
                    <span className="fw-semibold" style = {{fontSize: "0.9rem"}}>Data:</span>
                    <div className="form-control" style={{ height:"37px", width: "150px", backgroundColor: "#f9fafb", border: "1px solid #dee2e6" }}>
                        {submission.date || ""}
                    </div>
                </div>

                <div className="d-flex align-items-center gap-3 mb-2">
                    <span className="fw-semibold" style = {{fontSize: "0.9rem"}}>Osoba reprezentująca firmę audytorską:</span>
                    <div className="form-control flex-grow-1" style={{ height:"37px", width: "300px", backgroundColor: "#f9fafb", border: "1px solid #dee2e6" }}>
                        {submission.keyAuditor || ""}
                    </div>
                    <span className="fw-semibold" style = {{fontSize: "0.9rem"}}>Data:</span>
                    <div className="form-control" style={{ height:"37px", width: "150px", backgroundColor: "#f9fafb", border: "1px solid #dee2e6" }}>
                        {submission.date || ""}
                    </div>
                </div>

                <button className="btn btn-primary mb-1 mt-1">📄 Pobierz PDF</button>
            </StepCard>

            {/* Krok 2 */}
            <StepCard step={2} title="Podpisanie dokumentu">
                <p>Zeskanuj i podpisz pobrany dokument ręcznie lub elektronicznie.</p>
            </StepCard>

            {/* Krok 3 */}
            <StepCard step={3} title="Załaduj podpisany dokument">
                {!submission.file ? (
                    <div
                        className="border border-2 border-dashed p-4 text-center rounded"
                        style={{ cursor: "pointer", background: "#f8f9fa" }}
                        onClick={() => document.getElementById("fileInput").click()}
                    >
                        <p className="mb-1">Przeciągnij i upuść plik tutaj</p>
                        <p className="text-muted small">lub kliknij, aby wybrać plik z dysku</p>
                        <input
                            type="file"
                            id="fileInput"
                            className="d-none"
                            accept="application/pdf"
                            onChange={e => handleFileChange(e.target.files[0])}
                        />
                    </div>
                ) : (
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                        <span>📎 {submission.file.name}</span>
                        <span className="badge bg-success">Załadowano</span>
                    </div>
                )}
            </StepCard>

            <div className="text-end mb-4 mt-3">
                <button className="btn btn-success px-4" disabled={!submission.file}>
                     Zapisz i zakończ
                </button>
            </div>
        </div>
    );
}
