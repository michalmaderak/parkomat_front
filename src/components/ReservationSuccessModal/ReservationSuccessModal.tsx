// src/components/ReservationSuccessModal/ReservationSuccessModal.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Do nawigacji
import { CheckCircle } from 'lucide-react'; // Ikona "kciuk w górę" lub inna ikona sukcesu
import styles from './ReservationSuccessModal.module.scss';

interface ReservationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void; // Funkcja do zamknięcia modalu
  email: string; // Adres e-mail, na który wysłano potwierdzenie
}

const ReservationSuccessModal: React.FC<ReservationSuccessModalProps> = ({ isOpen, onClose, email }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoHome = () => {
    onClose(); // Zamknij modal
    navigate('/'); // Przekieruj na stronę główną
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Możesz użyć grafiki kciuka w górę lub innej ikony */}
        <div className={styles.successIcon}>
          {/* Użycie ikony z lucide-react jako alternatywy dla obrazka */}
          <CheckCircle size={80} color="#28a745" />
          {/* Jeśli masz obrazek "kciuk w górę", możesz go tu wstawić, np.: */}
          {/* <img src="/path/to/your/thumb-up-image.png" alt="Sukces" /> */}
        </div>
        <h2 className={styles.successTitle}>Sukces!</h2>
        <p className={styles.successMessage}>
          Twoja rezerwacja została pomyślnie dodana!
        </p>
        <p className={styles.confirmationText}>
          Wysłaliśmy potwierdzenie na twój adres e-mail: <span className={styles.emailDisplay}>{email}</span>
        </p>
        <p className={styles.greeting}>Życzymy miłego pobytu :)</p>

        <button className={styles.homeButton} onClick={handleGoHome}>
          Powrót do strony głównej
          <img src="/icons/return-arrow.svg" alt="Powrót" className={styles.returnArrow} /> {/* Dodaj ikonę strzałki */}
        </button>
      </div>
    </div>
  );
};

export default ReservationSuccessModal;