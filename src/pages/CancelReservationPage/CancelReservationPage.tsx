import React, { useState } from "react";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import styles from "./CancelReservationPage.module.scss";

const API_BASE_URL = 'http://localhost:8080/api';

const CancelReservationPage: React.FC = () => {
    const [reservationCode, setReservationCode] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleCancelReservation = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsLoading(true);

        if (!reservationCode.trim()) {
            setError("Kod rezerwacji nie może być pusty.");
            setIsLoading(false);
            return;
        }

        try {
           
            const response = await fetch(`${API_BASE_URL}/reservations/${reservationCode}`, {
                method: 'DELETE', // Metoda HTTP to DELETE
            });

            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Nieznany błąd serwera.' }));
                throw new Error(errorData.message || response.statusText);
            }

            setSuccessMessage(
                "Potwierdzenie anulowania rezerwacji zostało wysłane na adres e-mail powiązany z tą rezerwacją."
            );
            setReservationCode(""); // Wyczyść pole po sukcesie

        } catch (err: any) {
            console.error('Błąd anulowania rezerwacji:', err);
            let message = "Wystąpił nieznany błąd podczas anulowania rezerwacji.";

            if (err instanceof Error) {
                message = err.message;
            } else if (typeof err === 'string') {
                message = err;
            }
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Anuluj Rezerwację</h2>
            <form onSubmit={handleCancelReservation} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="reservationCode">Wpisz kod rezerwacji:</label>
                    <input
                        id="reservationCode"
                        type="text"
                        value={reservationCode}
                        onChange={(e) => setReservationCode(e.target.value)}
                        required
                        autoComplete="off"
                        className={styles.input}
                        placeholder="Np. XYZ123ABC"
                        disabled={isLoading}
                    />
                </div>

                {error && <ErrorMessage message={error} />}
                {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

                <button type="submit" className={styles.button} disabled={isLoading}>
                    {isLoading ? "Anulowanie..." : "Anuluj rezerwację"}
                </button>
            </form>
        </div>
    );
};

export default CancelReservationPage;