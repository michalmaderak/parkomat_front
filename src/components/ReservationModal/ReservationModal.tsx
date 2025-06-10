// src/components/ReservationModal/ReservationModal.tsx
import React, { useState } from 'react';
import styles from './ReservationModal.module.scss';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReservation: (email: string) => void;
  totalSelectedVehicles: number;
  totalPrice: number; // NOWY PROP: Całkowita cena rezerwacji
  reservationMessage: string;
  parkingName: string;
  selectedDate: Date | null;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  onConfirmReservation,
  totalSelectedVehicles,
  totalPrice, // Użyj nowego propa
  reservationMessage,
  parkingName,
  selectedDate,
}) => {
  const [email, setEmail] = useState<string>('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirmReservation(email);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2>Potwierdź rezerwację</h2>

        <p className={styles.summaryText}>
          Rezerwujesz **{totalSelectedVehicles}** miejsce{totalSelectedVehicles !== 1 ? 'a' : ''} parkingowe w **{parkingName}**
          {selectedDate && <> na dzień **{selectedDate.toLocaleDateString()}**</>}.
        </p>

        {/* NOWY ELEMENT: Wyświetlanie całkowitej ceny */}
        <p className={styles.priceSummary}>
          Całkowity koszt rezerwacji: **{totalPrice.toFixed(2)} PLN**
        </p>

        <div className={styles.formGroup}>
          <label htmlFor="reservationEmail">Twój adres e-mail:</label>
          <input
            type="email"
            id="reservationEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Wprowadź swój e-mail"
            required
            className={styles.emailInput}
          />
        </div>

        <button
          className={styles.confirmButton}
          onClick={handleConfirm}
          disabled={!email.trim() || !/\S+@\S+\.\S+/.test(email)}
        >
          Zarezerwuj miejsce
        </button>

        {reservationMessage && (
          <p className={styles.messageText}>{reservationMessage}</p>
        )}
      </div>
    </div>
  );
};

export default ReservationModal;