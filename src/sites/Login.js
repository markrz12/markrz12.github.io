import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/workspace"); // przekierowanie po zalogowaniu
    };

    return (
        <div className="d-flex min-vh-100 justify-content-center align-items-center bg-light" style={{ minHeight: '100vh' }}>
            <div className="card p-4 shadow" style={{ width: "350px" }}>
                <h3 className="text-center mb-2">Logowanie</h3>
                <p className="text-center text-muted mt-1">
                    <a>Zaloguj się aby kontynuować</a>
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" placeholder="Wpisz email" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Hasło</label>
                        <input type="password" className="form-control" placeholder="Wpisz hasło" required />
                    </div>
                    <p className="text-start mb-3">
                        Nie pamiętasz hasła? <a href="#">Kliknij tutaj</a>
                    </p>
                    <button type="submit" className="btn btn-primary w-100 mb-3">Zaloguj</button>

                    <div className="d-flex align-items-center my-3">
                        <hr className="flex-grow-1" />
                        <span className="mx-2 text-muted small">lub</span>
                        <hr className="flex-grow-1" />
                    </div>

                    <button type="button" className="btn btn-secondary w-100">
                        Zaloguj kontem Office 365
                    </button>
                </form>

                <p className="text-start text-muted mt-3">
                    Nie masz konta? <a href="#">Zarejestruj się</a>
                </p>
            </div>
        </div>
    );
}

export default Login;