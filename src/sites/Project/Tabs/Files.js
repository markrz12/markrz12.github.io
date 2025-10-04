import React, { useRef, useState } from "react";

export default function FilesTable({ files, setFiles }) {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [newFile, setNewFile] = useState(null);
    const fileInputRef = useRef();

    const handleAddFile = () => {
        if (newFile?.name && newFile?.url) {
            setFiles([...files, { ...newFile, addedAt: new Date().toISOString() }]);
            setNewFile(null);
            setShowUploadModal(false);
        }
    };

    const handleRemoveFile = (fileToRemove) => {
        setFiles(files.filter((f) => f !== fileToRemove));
    };

    return (
        <div className="p-0">
            {/* Tabela plików */}
            <div className="table-responsive shadow-sm mb-3">
                <table className="table table-bordered table-hover align-middle mb-0" style={{ fontSize: "0.9rem" }}>
                    <thead className="table-light">
                    <tr>
                        <th style={{ width: "5%", textAlign: "center", border: "1px solid #dee2e6", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem" }}>Lp.</th>
                        <th style={{ width: "60%", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem" }}>Nazwa pliku</th>
                        <th style={{ width: "20%", textAlign: "center", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem" }}>Data dodania</th>
                        <th style={{ width: "15%", textAlign: "center", backgroundColor: "#0a2b4c", color: "#fff", padding: "0.75rem" }}>Akcje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {files.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center text-muted">Brak plików</td>
                        </tr>
                    ) : (
                        files.map((file, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                <td>{file.name}</td>
                                <td style={{ textAlign: "center" }}>{new Date(file.addedAt).toLocaleString()}</td>
                                <td style={{ textAlign: "center" }}>
                                    <div className="btn-group d-flex justify-content-center">
                                        <a href={file.url} download={file.name} className="btn btn-sm btn-outline-success">Pobierz</a>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveFile(file)}>Usuń</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Przyciski dodawania pliku */}
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>+ Dodaj plik</button>
            </div>

            {/* Modal dodawania pliku */}
            {showUploadModal && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ background: "rgba(0,0,0,0.3)", zIndex: 3000 }}
                    onClick={() => setShowUploadModal(false)}
                >
                    <div className="card p-3 shadow" style={{ width: 400 }} onClick={(e) => e.stopPropagation()}>
                        <h6 className="mb-3">Dodaj plik</h6>

                        {/* Drag & Drop / kliknięcie */}
                        <div
                            onDrop={(e) => {
                                e.preventDefault();
                                const droppedFile = e.dataTransfer.files[0];
                                if (droppedFile) setNewFile({ name: droppedFile.name, url: URL.createObjectURL(droppedFile) });
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => fileInputRef.current.click()}
                            className="border rounded p-3 mb-3 text-center text-muted"
                            style={{ cursor: "pointer" }}
                        >
                            Przeciągnij plik tutaj lub kliknij, aby wybrać
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    const selectedFile = e.target.files[0];
                                    if (selectedFile) setNewFile({ name: selectedFile.name, url: URL.createObjectURL(selectedFile) });
                                }}
                            />
                        </div>

                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Nazwa pliku"
                            value={newFile?.name || ""}
                            onChange={(e) => setNewFile({ ...newFile, name: e.target.value })}
                        />

                        <div className="d-flex justify-content-end gap-2">
                            <button className="btn btn-light" onClick={() => setShowUploadModal(false)}>Anuluj</button>
                            <button className="btn btn-primary" onClick={handleAddFile}>Dodaj</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}