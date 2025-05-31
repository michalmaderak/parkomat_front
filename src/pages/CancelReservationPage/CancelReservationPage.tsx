// src/pages/CancelReservationPage/CancelReservationPage.tsx
// ZMIEŃ NAZWĘ PLIKU Z LoginPage.tsx na CancelReservationPage.tsx
import React, { useState } from "react";
// useNavigate nie jest już potrzebny, chyba że chcesz nawigować po sukcesie/błędzie gdzieś indziej
// import { useNavigate } from "react-router-dom";
//import { reservationApi } from "../../api/reservationApi"; // Zaimportuj nowy serwis API
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import styles from "./CancelReservationPage.module.scss"; // Upewnij się, że nazwa pliku SCSS pasuje
// useAuth i login nie są już potrzebne w tym komponencie
// import { useAuth } from "../../context/AuthContext";

const CancelReservationPage: React.FC = () => {
  // const { login } = useAuth(); // Niepotrzebne
  // const navigate = useNavigate(); // Niepotrzebne (chyba że celowo)
  
  const [reservationCode, setReservationCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleCancelReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage(""); // Resetuj komunikat o sukcesie przy nowej próbie

    if (!reservationCode.trim()) {
      setError("Kod rezerwacji nie może być pusty.");
      return;
    }

    try {
      // Wywołaj nową funkcję API
      //await reservationApi.cancelByCode(reservationCode);

      // Ustaw komunikat o sukcesie
      setSuccessMessage(
        "Potwierdzenie anulowania rezerwacji zostało wysłane na adres e-mail powiązany z tą rezerwacją."
      );
      setReservationCode(""); // Wyczyść pole po sukcesie

    } catch (err) {
      console.error('Cancellation error:', err);
      let message = "Wystąpił nieznany błąd podczas anulowania rezerwacji.";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'string') {
        message = err;
      }
      // Możesz dodać bardziej szczegółową obsługę błędów specyficznych dla API
      setError(message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Anuluj Rezerwację</h2>
      <form onSubmit={handleCancelReservation} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="reservationCode">Wpisz kod rezerwacji:</label>
          <input
            id="reservationCode" // Dobra praktyka dla 'for' w label
            type="text" // Zmieniono z email na text
            value={reservationCode}
            onChange={(e) => setReservationCode(e.target.value)}
            required
            autoComplete="off" // Lepiej niż "username" dla kodu
            className={styles.input}
            placeholder="Np. XYZ123ABC"
          />
        </div>

        {error && <ErrorMessage message={error} />}
        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
        {/* Możesz chcieć ostylować successMessage, np. dodając klasę do pliku SCSS */}
        {/* np. styles.successMessage { color: green; margin-top: 10px; } */}

        <button type="submit" className={styles.button}>
          Anuluj rezerwację
        </button>
      </form>
    </div>
  );
};

export default CancelReservationPage;