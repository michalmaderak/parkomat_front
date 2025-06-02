// src/pages/ParkPage/ParkPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './ParkPage.module.scss';
import { Park } from '../../types/parks';
import { Parking } from '../../types/parkings';
import { parksApi } from '../../api/parksApi';
import { parkingsApi } from '../../api/parkingsApi';

const ParkPage: React.FC = () => {
  const { parkId } = useParams<{ parkId: string }>(); // Pobierz parkId z URL

  const [park, setPark] = useState<Park | null>(null);
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [isLoadingPark, setIsLoadingPark] = useState<boolean>(true);
  const [isLoadingParkings, setIsLoadingParkings] = useState<boolean>(true);
  const [errorPark, setErrorPark] = useState<string>('');
  const [errorParkings, setErrorParkings] = useState<string>('');

  useEffect(() => {
    if (!parkId) {
      setErrorPark("Nieprawidłowy ID parku.");
      setIsLoadingPark(false);
      setIsLoadingParkings(false); // Również zatrzymaj ładowanie parkingów
      return;
    }

    const fetchParkDetails = async () => {
      setIsLoadingPark(true);
      setErrorPark('');
      try {
        const parkData = await parksApi.getById(parkId);
        setPark(parkData);
      } catch (err: unknown) {
        console.error("Błąd podczas pobierania danych parku:", err);
        let errorMessage = "Nie udało się pobrać danych parku.";
        if (err instanceof Error) {
          errorMessage += ` Błąd: ${err.message}`;
        }
        setErrorPark(errorMessage);
        setPark(null);
      } finally {
        setIsLoadingPark(false);
      }
    };

    const fetchParkings = async () => {
      setIsLoadingParkings(true);
      setErrorParkings('');
      try {
        const parkingsData = await parkingsApi.getParkingsByParkId(parkId);
        console.log("ParkPage - Otrzymane parkingi z API:", JSON.stringify(parkingsData, null, 2));
        setParkings(parkingsData);
      } catch (err: unknown) {
        console.error("Błąd podczas pobierania parkingów:", err);
        let errorMessage = "Nie udało się pobrać listy parkingów.";
        if (err instanceof Error) {
          errorMessage += ` Błąd: ${err.message}`;
        }
        setErrorParkings(errorMessage);
        setParkings([]);
      } finally {
        setIsLoadingParkings(false);
      }
    };

    fetchParkDetails();
    fetchParkings();

  }, [parkId]); // Efekt uruchamia się ponownie, gdy parkId się zmieni

  if (isLoadingPark || isLoadingParkings) {
    return <p>Ładowanie danych...</p>;
  }

    return (
    <div className={styles.parkPageContainer}>
      {errorPark && <p className={styles.error}>{errorPark}</p>}

      <div className={styles.grid}>
        <div className={styles.parkHeader}>
          {park ? (
            <>
              <img
                src={park.parkLogoLink}
                alt={`Logo ${park.name}`}
                className={styles.parkLogo}
              />
              <h1>{park.name}</h1>
            </>
          ) : (
            !isLoadingPark && <p>Nie znaleziono informacji o parku.</p>
          )}
        </div>

        <div className={styles.search}>
          {/* Możesz tu wstawić input wyszukiwania */}
          <input type="text" placeholder="Szukaj parkingu..." />
        </div>

        <div className={styles.tags}>
          <p className={styles.tagTitle}>filtruj według</p>
          <div className={styles.filterGroup}>
            <p className={styles.filterTitle}>Pojazd:</p>
            <label><input type="checkbox" /> Samochód osobowy</label>
            <label><input type="checkbox" /> Autobus</label>
            <label><input type="checkbox" /> Motocykl</label>
          </div>

          <div className={styles.filterGroup}>
            <p className={styles.filterTitle}>Typ miejsca:</p>
            <label><input type="checkbox" /> Bez dachu</label>
            <label><input type="checkbox" /> Zadaszony</label>
          </div>

          {/* <div className={styles.filterGroup}>
            <p className={styles.filterTitle}>Blisko atrakcji:</p>
            <label><input type="checkbox" /> </label>
          </div> */}
        </div>

        <div className={styles.parkingsSection}>
          <h2>Parkingi</h2>
          {errorParkings && <p className={styles.error}>{errorParkings}</p>}
          {!isLoadingParkings && parkings.length === 0 && !errorParkings && (
            <p>Brak dostępnych parkingów dla tego parku.</p>
          )}
          {parkings.length > 0 && (
            <ul className={styles.parkingList}>
              {parkings.map((parking) => (
                <li key={parking.parking_id} className={styles.parkingItem}>
                  {/* Wyświetlanie zdjęcia parkingu */}
                  {parking.imageUrl && (
                    <img
                      src={parking.imageUrl}
                      alt={`Zdjęcie parkingu ${parking.name}`}
                      className={styles.parkingImage} // Dodaj style dla obrazka
                    />
                  )}
                  <div className={styles.parkingInfo}> {/* Kontener na tekst, aby lepiej ułożyć z obrazkiem */}
                    <h3>{parking.name}</h3>
                    {/* Wyświetlanie adresu parkingu */}
                    {parking.address && (
                      <p className={styles.parkingAddress}>{parking.address}</p> // Dodaj style dla adresu
                    )}
                    {/* Istniejące info o współrzędnych */}
                    {/* {parking.latitude !== null && parking.longitude !== null && (
                      <p>Współrzędne: {parking.latitude}, {parking.longitude}</p>
                    )} */}
                    {/* Użyj Link zamiast window.location.href dla lepszej nawigacji SPA */}
                    <Link to={`/parking/${parking.parking_id}`} className={styles.reserveButtonLink}>
                      <button className={styles.reserveButton}>
                        Przejdź do rezerwacji
                      </button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );

};

export default ParkPage;