// src/pages/ParkingDetailsPage/ParkingDetailsPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Dodaj Link, jeśli chcesz breadcrumbs
import styles from './ParkingDetailsPage.module.scss'; // Zmień nazwę pliku SCSS
import { Park } from '../../types/parks';
import { Parking } from '../../types/parkings';
import { Manager } from '../../types/manager'; // Jeśli manager jest osobnym typem/pobierany osobno
import { parksApi } from '../../api/parksApi';
import { parkingsApi } from '../../api/parkingsApi';
import { managersApi } from '../../api/managersApi'; // Jeśli potrzebujesz pobrać managera osobno

const ParkingDetailsPage: React.FC = () => {
  const { parkingId } = useParams<{ parkingId: string }>(); // Teraz używamy parkingId

  const [parking, setParking] = useState<Parking | null>(null);
  const [relatedPark, setRelatedPark] = useState<Park | null>(null);
  const [manager, setManager] = useState<Manager | null>(null); // Stan dla danych managera

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

  return (
    <div className={styles.parkingDetailsContainer}>
      {/* Nagłówek z logo i nazwą parku (jeśli jest) */}
      {relatedPark && (
        <div className={styles.parkContext}>
          <Link to={`/parkpage/${relatedPark.id}`} className={styles.parkLink}>
            <img
              src={relatedPark.parkLogoLink}
              alt={`Logo ${relatedPark.name}`}
              className={styles.parkContextLogo}
            />
            <h2>{relatedPark.name}</h2>
          </Link>
        </div>
      )}

      <div className={styles.parkingInfoGrid}>
        {/* Lewa kolumna: Zdjęcie i Opis Parkingu */}
        <div className={styles.parkingMedia}>
          <h3>{parking.name}</h3>
          {parking.imageUrl && (
            <img
              src={parking.imageUrl}
              alt={`Zdjęcie parkingu ${parking.name}`}
              className={styles.parkingImage}
            />
          )}
          {parking.description && (
            <div className={styles.descriptionSection}>
              <h4>Opis parkingu:</h4>
              <p>{parking.description}</p>
            </div>
          )}
           {/* Możesz tu dodać inne informacje o parkingu, np. współrzędne, pojemność itp. */}
           {parking.latitude !== null && parking.longitude !== null && (
            <p className={styles.coordinates}>Współrzędne: {parking.latitude}, {parking.longitude}</p>
          )}
        </div>

        {/* Prawa kolumna: Informacje o Managerze */}
        {manager && (
          <div className={styles.managerInfo}>
            <h4>Informacje o managerze parkingu:</h4>
            <p>
              <strong>Imię i nazwisko:</strong> {manager.firstName} {manager.lastName}
            </p>
            <p>
              <strong>Email:</strong> <a href={`mailto:${manager.email}`}>{manager.email}</a>
            </p>
            <p>
              <strong>Telefon:</strong> <a href={`tel:${manager.phoneNumber}`}>{manager.phoneNumber}</a>
            </p>
          </div>
        )}
        {!manager && parking.manager_id && (
          <div className={styles.managerInfo}>
            <p>Ładowanie informacji o managerze...</p>
          </div>
        )}
         {!manager && !parking.manager_id && (
          <div className={styles.managerInfo}>
            <p>Brak informacji o managerze.</p>
          </div>
        )}
      </div>

      {/* Możesz tu dodać sekcję rezerwacji, jeśli jest potrzebna */}
      {/* <div className={styles.reservationSection}>
        <h3>Zarezerwuj miejsce</h3>
        <p>Formularz rezerwacji...</p>
      </div> */}
    </div>
  );
};

export default ParkingDetailsPage;