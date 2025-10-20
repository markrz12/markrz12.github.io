import React from "react";
import { useEffect, useRef, useState } from "react";


export default function Application({ initialSubmission }) {
    const [submission, setSubmission] = useState({
        description: initialSubmission?.description || "",
        members: (initialSubmission?.roles || []).map(role => ({ role, name: "", date: "" })),
        file: null,
    });


    const [isOpen, setIsOpen] = useState(true);

    const toggleOpen = () => setIsOpen(prev => !prev);

    const handleFileChange = (file) => {
        setSubmission(prev => ({ ...prev, file }));
    };

    function AutoResizeTextarea({ value }) {
        const textareaRef = useRef(null);

        useEffect(() => {
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto"; // reset height
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // set to scrollHeight
            }
        }, [value]);

        return (
            <textarea
                ref={textareaRef}
                className="form-control"
                style={{ fontSize: "0.9rem", whiteSpace: "pre-wrap", overflow: "hidden" }}
                value={value}
                readOnly
            />
        );
    }

    return (
        <div className="container p-0">
            <div className="card mb-3 shadow-sm">
                <div
                    className="card-header fw-semibold d-flex justify-content-between align-items-center"
                    style={{ cursor: "pointer", backgroundColor: "#0a2b4c", color: "#fff" }}
                    onClick={toggleOpen}
                >
                    <span>Podgląd wniosku</span>
                    <span>{isOpen ? "▲" : "▼"}</span>
                </div>

                {isOpen && (
                    <div className="card-body">
                        <div className="mb-3">
                            <AutoResizeTextarea value={submission.description} />

                        </div>

                        {submission.members.map((member, index) => (
                            <div key={index} className="row mb-3 g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">{member.role}:</label>
                                    <input
                                        className="form-control"
                                        value={member.name || ""}
                                        placeholder=""
                                        readOnly
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-semibold">Data:</label>
                                    <input
                                        className="form-control"
                                        value={member.date || ""}
                                        placeholder=""
                                        readOnly
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mb-3">
                <button className="btn btn-primary mb-3 me-3">📄 Pobierz PDF</button>

                <label className="form-label fw-semibold d-block mb-1">Załaduj podpisany dokument:</label>
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
                            onChange={(e) => handleFileChange(e.target.files[0])}
                        />
                    </div>
                ) : (
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                        <span>📎 {submission.file.name}</span>
                        <span className="badge bg-success">Załadowano</span>
                    </div>
                )}
            </div>

            <div className="text-end">
                <button className="btn btn-success px-4" disabled={!submission.file}>
                    Zapisz i zakończ
                </button>
            </div>
        </div>
    );
}
