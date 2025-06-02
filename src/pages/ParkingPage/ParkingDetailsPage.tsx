// src/pages/ParkingDetailsPage/ParkingDetailsPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Dodaj Link, jeśli chcesz breadcrumbs
import styles from './ParkingDetailsPage.module.scss'; // Zmień nazwę pliku SCSS
import { Park } from '../../types/parks';
import { Parking } from '../../types/parkings';
import { User } from '../../types/user'; // Jeśli manager jest osobnym typem/pobierany osobno
import { parksApi } from '../../api/parksApi';
import { parkingsApi } from '../../api/parkingsApi';
import { managersApi } from '../../api/managersApi'; // Jeśli potrzebujesz pobrać managera osobno
import { PlaceGroup } from '../../types/placeGroup';
import SingleParkingMap from '../../components/Map/SingleParkingMap';
import DatePicker from '../../components/DatePicker/DatePicker';
const ParkingDetailsPage: React.FC = () => {
  const { parkingId } = useParams<{ parkingId: string }>(); // Teraz używamy parkingId

  const [parking, setParking] = useState<Parking | null>(null);
  const [relatedPark, setRelatedPark] = useState<Park | null>(null);
  const [manager, setManager] = useState<User | null>(null); // Stan dla danych managera

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!parkingId) {
      setError("Nieprawidłowy ID parkingu.");
      setIsLoading(false);
      return;
    }

     const fetchDetails = async () => {
      setIsLoading(true);
      setError('');
      try {
        const parkingData = await parkingsApi.getById(parkingId); // lub inna nazwa metody
        console.log("ParkingDetailsPage - Otrzymane dane parkingu z API:", JSON.stringify(parkingData, null, 2)); // Wyświetl ładnie sformatowany JSON
        setParking(parkingData);

        if (parkingData.park_id) {
          const parkDataResponse = await parksApi.getById(parkingData.park_id.toString());
          console.log("ParkingDetailsPage - Otrzymane dane parku z API:", JSON.stringify(parkDataResponse, null, 2));
          setRelatedPark(parkDataResponse);
        }

        // Logika dla managera - dostosuj do tego, jak backend zwraca dane managera
        if (parkingData.manager) { // Jeśli manager jest zagnieżdżony w parkingData
            console.log("ParkingDetailsPage - Dane managera (zagnieżdżone):", JSON.stringify(parkingData.manager, null, 2));
            setManager(parkingData.manager);
        } else if (parkingData.manager_id) { // Jeśli masz tylko manager_id i pobierasz osobno
            const managerDataResponse = await managersApi.getManagerById(parkingData.manager_id.toString());
            console.log("ParkingDetailsPage - Dane managera (osobno):", JSON.stringify(managerDataResponse, null, 2));
            setManager(managerDataResponse);
        } else {
            console.log("ParkingDetailsPage - Brak danych managera w odpowiedzi API.");
        }

      } catch (err: unknown) {
        console.error("ParkingDetailsPage - Błąd podczas pobierania danych:", err);
        let errorMessage = "Nie udało się pobrać szczegółów parkingu.";
        if (err instanceof Error) {
          errorMessage += ` Błąd: ${err.message}`;
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [parkingId]);

  if (isLoading) {
    return <p className={styles.loadingMessage}>Ładowanie informacji o parkingu...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (!parking) {
    return <p>Nie znaleziono parkingu.</p>;
  }
   const hasValidCoordinates = parking &&
                             typeof parking.latitude === 'number' &&
                             typeof parking.longitude === 'number' &&
                             !isNaN(parking.latitude) &&
                             !isNaN(parking.longitude);

  return (
    <div className={styles.parkingDetailsContainer}>
      {/* ... (istniejący nagłówek parku) ... */}
      {relatedPark && (
        <div className={styles.parkContext}>
          {/* ... */}
        </div>
      )}

      <div className={styles.parkingInfoGrid}>
        <div className={styles.parkingMedia}>
  <h3>{parking?.name}</h3>
  {parking.address && (
                      <p className={styles.parkingAddress}>{parking.address}</p> // Dodaj style dla adresu
                    )}
  {parking?.imageUrl && (
    <img
      src={parking.imageUrl}
      alt={`Zdjęcie parkingu ${parking?.name}`}
      className={styles.parkingImage}
    />
  )}
  {parking?.description && (
    <div className={styles.descriptionSection}>
      <h4>Opis parkingu:</h4>
      <p>{parking.description}</p>
    </div>
  )}
          {/* --- SEKCJA DLA GRUP MIEJSC --- */}
          {parking?.place_groups && parking.place_groups.length > 0 && (
            <div className={styles.placeGroupsSection}><br />
              <h4>Dostępne typy miejsc:</h4>
                {parking.place_groups?.map((group: PlaceGroup) => ( // TUTAJ DODALIŚMY ?.
                  <li key={group.group_id} className={styles.placeGroupItem}>
                    <span className={styles.placeGroupType}>{group.type}:</span>
                    <span className={styles.placeGroupQuantity}>{group.quantity} miejsc</span>
                  </li>
                ))}
            </div>
          )}
          {(!parking?.place_groups || parking.place_groups.length === 0) && (
             <div className={styles.placeGroupsSection}>
                <p>Brak informacji o typach miejsc dla tego parkingu.</p>
             </div>
          )}
          {/* --- KONIEC SEKCJI DLA GRUP MIEJSC --- */}
        </div>
{/* --- UŻYCIE NOWEGO KOMPONENTU MAPY --- */}
          {hasValidCoordinates ? (
            <div className={styles.mapContainerWrapper}> {/* Dodatkowy wrapper dla tytułu i mapy */}
              <h4>Lokalizacja na mapie:</h4>
              <SingleParkingMap
                latitude={parking.latitude ?? 0}
                longitude={parking.longitude ?? 0}
                popupText={parking.name}
                zoom={16} // Możesz dostosować zoom
                // mapHeight="400px" // Możesz nadpisać domyślną wysokość
              />
            </div>
          ) : (
            <div className={styles.mapContainerWrapper}>
                <p>Brak danych o lokalizacji do wyświetlenia mapy.</p>
            </div>
          )}
          {/* --- KONIEC KOMPONENTU MAPY --- */}
        {manager && ( // <--- Czy ten warunek jest na pewno TRUE, gdy manager ma dane?
  <div className={styles.managerInfo}>
    <h4>Informacje o managerze parkingu:</h4>
    <p>
      <strong>Imię i nazwisko:</strong> {manager?.firstName} {manager?.lastName}
    </p>
    <p>
      <strong>Email:</strong> <a href={`mailto:${manager?.email}`}>{manager?.email}</a>
    </p>
    <p>
      <strong>Telefon:</strong> <a href={`tel:${manager?.phoneNumber}`}>{manager?.phoneNumber}</a>
    </p>
  </div>
)}
 <DatePicker

              />

{!manager && parking?.manager_id && ( // Ten blok jest dla "ładowanie..."
  <div className={styles.managerInfo}>
    <p>Ładowanie informacji o managerze...</p>
  </div>
)}
 {!manager && !parking?.manager_id && ( // Ten blok jest dla "brak informacji"
  <div className={styles.managerInfo}>
    <p>Brak informacji o managerze.</p>
  </div>
)}
        {/* ... */}
      </div>
    </div>
  );
};

export default ParkingDetailsPage;