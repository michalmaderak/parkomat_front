import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./HomePage.module.scss";
import MapComponent from "../Map/Map";
import { MarkerData } from "../../types/map";
import { parksApi } from "../../api/parksApi";
import { Park } from "../../types/parks";

const HomePage: React.FC = () => {
  const [parks, setParks] = useState<Park[]>([]);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchParkData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const parkData: Park[] = await parksApi.getAll();
        setParks(parkData);

        const markerData: MarkerData[] = parkData.map((park: Park) => ({
          id: park.id,
          popupText: park.name,
          position: [
            park.latitude,
            park.longitude
          ],
        }));
        setMarkers(markerData);

      } catch (err: unknown) {
        console.error("Błąd podczas pobierania danych parków:", err);
        let errorMessage = "Nie udało się pobrać danych parków.";
        if (err instanceof Error) {
          errorMessage += ` Błąd: ${err.message}`;
        }
        setError(errorMessage);
        setParks([]);
        setMarkers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParkData();
  }, []);

  return (
    <div className={styles.homePageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.parkListContainer}>
          <h2>Wybierz Park Narodowy</h2>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>Ładowanie listy parków...</p>
            </div>
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : parks.length === 0 ? (
            <p>Nie znaleziono żadnych parków.</p>
          ) : (
            <ul className={styles.parkList}>
              {parks.map(park => (
                <li key={park.id} className={styles.parkListItem}>
                  <Link to={`/parkpage/${park.id}`} className={styles.parkCard}>
                    <div className={styles.parkText}>
                      <h3 className={styles.parkName}>{park.name}</h3>
                      <p className={styles.parkQuote}>{park.sentence}</p>
                    </div>
                    <img
                      src={park.parkLogoLink}
                      alt={`Logo ${park.name}`}
                      className={styles.parkLogo}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.mapContainer}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>Ładowanie mapy...</p>
            </div>
          ) : error ? (
            <p className={styles.error}>Nie można załadować mapy z powodu błędu.</p>
          ) : markers.length > 0 ? (
            <MapComponent markers={markers} />
          ) : (
            !isLoading && <p>Brak danych do wyświetlenia na mapie.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;