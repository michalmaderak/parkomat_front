import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import styles from './ReservationSuccessModal.module.scss';

interface ReservationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string; // Adres e-mail, na który wysłano potwierdzenie
}

const ReservationSuccessModal: React.FC<ReservationSuccessModalProps> = ({ isOpen, onClose, email }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoHome = () => {
    onClose();
    navigate('/'); // Przekieruj na stronę główną
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.successIcon}>
          <CheckCircle size={80} color="#28a745" />
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
          <img src="/icons/return-arrow.svg" alt="Powrót" className={styles.returnArrow} /> 
        </button>
      </div>
    </div>
  );
};

export default ReservationSuccessModal;