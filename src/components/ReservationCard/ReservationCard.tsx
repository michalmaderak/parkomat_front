// src/components/ReservationCard/ReservationCard.tsx
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Trash2, Minus } from 'lucide-react';
import styles from './ReservationCard.module.scss';

interface ReservationCardProps {
  selectedVehicles: Record<string, number>;
  onRemoveVehicle: (type: string) => void;
  onDecreaseVehicle: (type: string) => void;
  totalSelectedVehicles: number;
  onOpenReservationModal: () => void; // Nowy prop do otwierania modalu
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  selectedVehicles,
  onRemoveVehicle,
  onDecreaseVehicle,
  totalSelectedVehicles,
  onOpenReservationModal, // Używamy nowego propa
}) => {
  const isReservationPossible = totalSelectedVehicles > 0; // Warunek, kiedy przycisk powinien być aktywny

  return (
    <Card className={styles.reservationCard}>
      <CardContent className={styles.reservationContent}>
        <div className={styles.reservationHeader}>REZERWUJĘ</div>
        <div className={styles.reservationList}>
          {Object.entries(selectedVehicles).length > 0 ? (
            <div className={styles.selectedVehiclesList}>
              <h4>Wybrane pojazdy:</h4>
              <ul>
                {Object.entries(selectedVehicles).map(([type, count]) => (
                  <li key={type} className={styles.selectedVehicleItem}>
                    <span>{type}: {count}</span>
                    <div className={styles.actions}>
                      <button
                        onClick={() => onDecreaseVehicle(type)}
                        className={styles.actionButton}
                        title={`Odejmij jeden ${type}`}
                      >
                        <Minus size={16} />
                      </button>
                      <button
                        onClick={() => onRemoveVehicle(type)}
                        className={styles.actionButton}
                        title={`Usuń wszystkie ${type}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <p className={styles.totalSelected}>Łącznie wybranych: {totalSelectedVehicles}</p>
            </div>
          ) : (
            <p className={styles.noSelection}>Brak wybranych pojazdów.</p>
          )}
        </div>
        {totalSelectedVehicles > 0 && (
            <div className={styles.reservationTotal}>
              łącznie: <span>{totalSelectedVehicles} miejsce parkingowe{totalSelectedVehicles !== 1 ? 'we' : ''}</span>
            </div>
        )}
        {/* Nowy przycisk "Przejdź do rezerwacji" */}
        <button
          className={styles.goToReservationButton}
          onClick={onOpenReservationModal} // Wywołujemy prop, który otworzy modal
          disabled={!isReservationPossible} // Aktywny tylko, gdy wybrano pojazdy
        >
          Przejdź do rezerwacji
        </button>
      </CardContent>
    </Card>
  );
};

export default ReservationCard;