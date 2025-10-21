import React, { useState, useRef } from "react";

export default function FilesTable({ initialFiles }) {
    const [files, setFiles] = useState(initialFiles || []);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [newFile, setNewFile] = useState({ name: "", url: "" });
    const fileInputRef = useRef();

    const handleAddFile = () => {
        if (!newFile.name || !newFile.url) return;
        setFiles([
            ...files,
            { ...newFile, id: Date.now(), addedAt: new Date().toISOString() },
        ]);
        setNewFile({ name: "", url: "" });
        setShowUploadModal(false);
    };

    const handleRemoveFile = (fileId) => {
        setFiles(files.filter((f) => f.id !== fileId));
    };

    return (
        <div className="p-0">
            {/* Table */}
            <div className="table-responsive shadow-sm mb-3">
                <table
                    className="table table-hover table-sm mb-0 align-middle"
                    style={{ fontSize: "0.9rem" }}
                >
                    <thead className="table-light">
                    <tr>
                        <th
                            style={{
                                border: "1px solid #dee2e6",
                                width: "5%",
                                textAlign: "center",
                                backgroundColor: "#0a2b4c",
                                color: "#fff",
                                padding: "0.75rem",
                            }}
                        >
                            Lp.
                        </th>
                        <th
                            style={{
                                border: "1px solid #dee2e6",
                                width: "60%",
                                backgroundColor: "#0a2b4c",
                                color: "#fff",
                                padding: "0.75rem",
                            }}
                        >
                            Nazwa pliku
                        </th>
                        <th
                            style={{
                                border: "1px solid #dee2e6",
                                width: "20%",
                                textAlign: "center",
                                backgroundColor: "#0a2b4c",
                                color: "#fff",
                                padding: "0.75rem",
                            }}
                        >
                            Data dodania
                        </th>
                        <th
                            style={{
                                border: "1px solid #dee2e6",
                                width: "15%",
                                textAlign: "center",
                                backgroundColor: "#0a2b4c",
                                color: "#fff",
                                padding: "0.75rem",
                            }}
                        >
                            Akcje
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {files.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center text-muted">
                                Brak plików
                            </td>
                        </tr>
                    ) : (
                        files.map((file, index) => (
                            <tr key={file.id}>
                                <td style={{ border: "1px solid #dee2e6", textAlign: "center" }}>{index + 1}</td>
                                <td style={{ border: "1px solid #dee2e6", padding: "0.5rem 1rem" }}>{file.name}</td>
                                <td style={{ border: "1px solid #dee2e6", padding: "0.5rem 1rem" }}>
                                    {new Date(file.addedAt).toLocaleString("pl-PL", {
                                        dateStyle: "short",
                                        timeStyle: "short",
                                    })}
                                </td>
                                <td style={{ border: "1px solid #dee2e6", padding: "0.5rem 1rem" }}>
                                    <div className="btn-group">
                                        <a
                                            href={file.url}
                                            download={file.name}
                                            className="btn btn-sm btn-outline-success"
                                        >
                                            Pobierz
                                        </a>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleRemoveFile(file.id)}
                                        >
                                            Usuń
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Add File Button */}
            <div className="d-flex justify-content-end mt-2">
                <button
                    className="btn btn-primary"
                    onClick={() => setShowUploadModal(true)}
                >
                    + Dodaj plik
                </button>
            </div>

            {/* Modal */}
            {showUploadModal && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ background: "rgba(0,0,0,0.3)", zIndex: 3000 }}
                    onClick={() => setShowUploadModal(false)}
                >
                    <div
                        className="card p-3 shadow"
                        style={{ width: 400 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h6 className="mb-3">Dodaj plik</h6>
                        <div
                            onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer.files[0];
                                if (file)
                                    setNewFile({ name: file.name, url: URL.createObjectURL(file) });
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => fileInputRef.current.click()}
                            className="border rounded p-3 mb-3 text-center text-muted"
                            style={{ cursor: "pointer" }}
                        >
                            Przeciągnij plik tutaj lub kliknij
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file)
                                        setNewFile({ name: file.name, url: URL.createObjectURL(file) });
                                }}
                            />
                        </div>

                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Nazwa pliku"
                            value={newFile.name}
                            onChange={(e) => setNewFile({ ...newFile, name: e.target.value })}
                        />

                        <div className="d-flex justify-content-end gap-2">
                            <button
                                className="btn btn-light"
                                onClick={() => setShowUploadModal(false)}
                            >
                                Anuluj
                            </button>
                            <button className="btn btn-primary" onClick={handleAddFile}>
                                Dodaj
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
