// src/pages/LoginPage/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import styles from "./Login.Page.module.scss";
import { useAuth } from "../../context/AuthContext";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await authApi.login({ email, password });

      // Upewnij się, że odpowiedź zawiera token (opcjonalne, ale dobra praktyka)
      // Zakładając, że authApi.login zwraca obiekt z polem token lub rzuca błąd
      if (typeof response?.token !== 'string' || !response.token) {
         // Jeśli spodziewasz się, że API ZAWSZE zwraca token lub rzuca błąd,
         // możesz to uprościć. Ale jeśli API może zwrócić coś innego w razie sukcesu,
         // to sprawdzenie jest dobre.
         // W tym przypadku, jeśli API zwraca { token: "..." } lub rzuca błąd,
         // to sprawdzenie może być nadmiarowe, jeśli obsługa błędów API jest w catch.
         // Można przyjąć, że jeśli doszło tu bez błędu, to token jest OK.
         // Uproszczona wersja:
         // if (!response?.token) {
          throw new Error("Brak tokenu w odpowiedzi serwera lub nieprawidłowa odpowiedź");
         // }
      }


      login(response.token);
      navigate("/parkpage");

    } catch (err) { // Zmieniono 'error: any' na 'err' (typ domyślnie unknown)
      console.error('Login error:', err);

      // Sprawdź typ błędu przed próbą dostępu do .message
      let message = "Wystąpił nieznany błąd podczas logowania"; // Domyślna wiadomość
      if (typeof err === 'string') {
          message = err; // Jeśli błąd jest stringiem
      } else if (err instanceof Error) {
          message = err.message; // Jeśli błąd jest instancją Error
      } else if (typeof err === 'object' && err !== null && 'message' in err && typeof err.message === 'string') {
          // Obsługa niestandardowych obiektów błędów, które mają pole 'message'
          message = err.message;
      }
      // Możesz dodać więcej warunków 'else if' dla innych typów błędów,
      // np. specyficznych błędów z Twojego API, jeśli je definiujesz.

      setError(message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Logowanie</h2>
      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username" // Dobra praktyka dla pola email/login
            className={styles.input}
          />
           {/* Przeniesiono ErrorMessage poza input dla lepszej struktury */}
        </div>
         {/* Wyświetlaj błąd związany z emailem/hasłem w jednym miejscu lub pod odpowiednim polem */}
         {error && <ErrorMessage message={error} />}
        <div className={styles.formGroup}>
          <label>Hasło:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password" // Dobra praktyka dla pola hasła logowania
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>
          Zaloguj
        </button>
      </form>
    </div>
  );
};

export default LoginPage;