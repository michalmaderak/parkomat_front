// src/pages/HomePage/HomePage.tsx
import React, { useEffect, useState } from "react";
import styles from "./HomePage.module.scss"; // Zachowujemy lub tworzymy style dla HomePage
import MapComponent from "../Map/Map"; // Popraw ścieżkę jeśli trzeba
import { MarkerData } from "../../types/map";
import { parksApi } from "../../api/parksApi";
import { Park } from "../../types/parks"; // Upewnij się, że ten typ istnieje i jest poprawny

const HomePage: React.FC = () => {
  // Stan dla pełnych danych parków (dla listy)
  const [parks, setParks] = useState<Park[]>([]);
  // Stan dla danych markerów (dla mapy)
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  // Stany ładowania i błędu, jak w TransactionsListPage
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchParkData = async () => {
      setIsLoading(true); // Rozpocznij ładowanie
      setError(''); // Zresetuj błąd
      try {
        // Pobierz dane parków JEDEN RAZ
        const parkData: Park[] = await parksApi.getAll();
        setParks(parkData); // Zapisz pełne dane dla listy

        // Przekształć dane parków na markery dla mapy
        const markerData: MarkerData[] = parkData.map((park: Park) => ({
          id: park.id,
          popupText: park.name, // Tekst w popupie markera
          position: [
            park.latitude,
            park.longitude
          ],
        }));
        setMarkers(markerData); // Zapisz dane dla markerów

      } catch (err: unknown) { // Użyj unknown dla lepszego typowania błędów
        console.error("Błąd podczas pobierania danych parków:", err);
        let errorMessage = "Nie udało się pobrać danych parków.";
        if (err instanceof Error) {
          errorMessage += ` Błąd: ${err.message}`;
        }
        setError(errorMessage);
        setParks([]); // Wyczyść dane w razie błędu
        setMarkers([]); // Wyczyść markery w razie błędu
      } finally {
        setIsLoading(false); // Zakończ ładowanie
      }
    };

    fetchParkData();
  }, []); // Pusta tablica zależności - uruchom tylko raz po zamontowaniu

  return (
    // Główny kontener dla strony
    <div className={styles.homePageContainer}>
      {/* Tytuł strony */}
      <h1 className={styles.pageTitle}>Park-o-mat - Znajdź swój parking</h1>

      {/* Kontener dla dwukolumnowego layoutu */}
      <div className={styles.contentWrapper}>

        {/* Lewa kolumna: Lista Parków */}
        <div className={styles.parkListContainer}>
          <h2>Wybierz Park Narodowy</h2>
          {isLoading ? (
            <p>Ładowanie listy parków...</p>
          ) : error ? (
            <p className={styles.error}>{error}</p> // Wyświetl błąd
          ) : parks.length === 0 ? (
            <p>Nie znaleziono żadnych parków.</p> // Obsługa braku danych
          ) : (
            <ul className={styles.parkList}>
              {parks.map(park => (
                <li key={park.id} className={styles.parkListItem}>
                  {/* Możesz dodać logo jeśli jest w danych Park */}
                  {/* {park.park_logo_link && <img src={park.park_logo_link} alt={park.name} className={styles.parkListLogo}/>} */}
                  <span className={styles.parkListName}>{park.name}</span>
                  {/* Możesz dodać inne informacje, np. adres */}
                  {/* <span className={styles.parkListAddress}>{park.address}</span> */}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Prawa kolumna: Mapa */}
        <div className={styles.mapContainer}>
          {isLoading ? (
            <p>Ładowanie mapy...</p> // Komunikat ładowania dla mapy
          ) : error ? (
            <p className={styles.error}>Nie można załadować mapy z powodu błędu.</p> // Komunikat błędu dla mapy
          ) : markers.length > 0 ? (
             // Renderuj mapę tylko jeśli są markery i nie ma błędu/ładowania
            <MapComponent markers={markers} />
          ) : (
             // Komunikat jeśli nie ma markerów (np. gdy parki nie mają koordynatów)
             !isLoading && <p>Brak danych do wyświetlenia na mapie.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;