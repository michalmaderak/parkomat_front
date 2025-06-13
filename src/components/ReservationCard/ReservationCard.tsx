import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Trash2, Minus } from 'lucide-react';
import styles from './ReservationCard.module.scss';
import { PlaceGroup } from '../../types/placeGroup';

interface ReservationCardProps {
  selectedVehicles: Record<string, number>;
  onRemoveVehicle: (type: string) => void;
  onDecreaseVehicle: (type: string) => void;
  totalSelectedVehicles: number;
  totalSelectedSpotPrices: number;
  onOpenReservationModal: () => void; // Nowy prop do otwierania modalu
  parkingPlaceGroups: PlaceGroup[];
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  selectedVehicles,
  onRemoveVehicle,
  onDecreaseVehicle,
  totalSelectedVehicles,
  totalSelectedSpotPrices,
  onOpenReservationModal,
  parkingPlaceGroups,
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
            <><div className={styles.reservationTotal}>
            łącznie: <span>{totalSelectedVehicles} miejsc parkingowych</span>
          </div><div className={styles.reservationTotal}>
            do zapłaty: <span>{totalSelectedSpotPrices}</span>  złotych
            </div></>
        )}
        <button
          className={styles.goToReservationButton}
          onClick={onOpenReservationModal}
          disabled={!isReservationPossible} // Aktywny tylko, gdy wybrano pojazdy
        >
          Przejdź do rezerwacji
        </button>
      </CardContent>
    </Card>
  );
};

export default ReservationCard;