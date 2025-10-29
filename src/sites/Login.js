import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

// function Login() {
//     const navigate = useNavigate();
//
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         navigate("/workspace"); // przekierowanie po zalogowaniu
//     };

function Login() {
    const navigate = useNavigate();
    // Stan dla przechowywania danych logowania
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // Stan dla obsługi błędów
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Resetowanie błędów przy każdej próbie

        try {
            const response = await fetch("http://kkrzeminski-nuc:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: email, // Wysyłanie emaila z stanu
                    password: password, // Wysyłanie hasła z stanu
                }),
            });

            // Sprawdzenie, czy odpowiedź jest poprawna (np. status 200-299)
            if (response.ok) {
                // Załóżmy, że serwer zwraca dane użytkownika lub token
                const data = await response.json();
                console.log("Zalogowano pomyślnie:", data);
                // Tutaj można zapisać token do Local Storage/Cookies
                const token = data.token;

                if (token) {
                    // Zapis tokena w ciasteczkach. Token wygaśnie za 7 dni (expires: 7)
                    Cookies.set("authToken", token, {
                        expires: 7,
                        secure: false, // Zalecane w produkcji (tylko przez HTTPS)
                        sameSite: 'Strict' // Zalecane dla bezpieczeństwa
                    });
                    console.log("Token zapisany w cookies.");
                }
                // Przekierowanie po pomyślnym zalogowaniu
                navigate("/workspace");
            } else {
                // Obsługa błędu, jeśli status to np. 401 Unauthorized
                const errorData = await response.json();
                setError(errorData.message || "Błąd logowania. Spróbuj ponownie.");
                console.error("Błąd odpowiedzi serwera:", response.status, errorData);
            }
        } catch (err) {
            // Obsługa błędów sieciowych (np. brak połączenia)
            setError("Nie udało się połączyć z serwerem. Sprawdź adres URL i status serwera.");
            console.error("Błąd sieci lub fetch:", err);
        }
    };

    return (
        <div className="d-flex min-vh-100 justify-content-center align-items-center bg-light" style={{ minHeight: '100vh' }}>
            <div className="card p-4 shadow" style={{ width: "350px" }}>
                <h3 className="text-center mb-2">Logowanie</h3>
                <p className="text-center text-muted mt-1">
                    <span>Zaloguj się aby kontynuować</span>
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email"
                               className="form-control"
                               placeholder="Wpisz email"
                               required
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Hasło</label>
                        <input type="password"
                               className="form-control"
                               placeholder="Wpisz hasło"
                               required
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <p className="text-start mb-3">
                        Nie pamiętasz hasła? <button type="button" className="btn btn-link p-0 align-baseline">Kliknij tutaj</button>
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
                    Nie masz konta? <button type="button" className="btn btn-link p-0 align-baseline">Zarejestruj się</button>
                </p>
            </div>
        </div>
    );
}

export default Login;