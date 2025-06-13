import React, { useEffect, useState } from "react";
import styles from "./ParkList.module.scss";
import graphqlClient from "../../api/graphClient"; 


interface Park {
  park_id: number;
  name: string;
  park_logo_link: string;
}

const ParkList: React.FC = () => {

  const [parks, setParks] = useState<Park[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchParks = async () => {

    const query = `
      query GetParks { # Dobrze jest nazywać zapytania
        # WAŻNE: Upewnij się, że 'parks' to poprawna nazwa pola w Twoim schemacie GraphQL
        # Może to być np. 'allParks', 'getParks' itp. Sprawdź schemę!
        parks {
         park_id
         name
         park_logo_link
        }
      }
    `;
    setLoading(true); 
    setError(""); // Zresetuj błąd

    try {
      // Wywołaj klienta GraphQL
      const response = await graphqlClient(query);

      if (response?.errors && response.errors.length > 0) {
        console.error("GraphQL Errors:", response.errors);

        setError(response.errors[0]?.message || "Wystąpił błąd podczas pobierania danych z serwera.");
        setParks([]); // Wyczyść dane w przypadku błędu
        return;
      }


      const parksData = response?.data?.parks || [];
      setParks(parksData);

    } catch (err) { // Obsługa błędów sieciowych lub innych błędów klienta
      console.error("Fetch Parks Network/Client Error:", err);
      let message = "Nie udało się pobrać listy parków.";
      if (err instanceof Error) {
        message = `${message} Błąd: ${err.message}`;
      }
      setError(message);
      setParks([]); // Wyczyść dane w przypadku błędu

    } finally {
      setLoading(false); // Zawsze wyłączaj ładowanie
    }
  };

  // Uruchom pobieranie danych po zamontowaniu komponentu
  useEffect(() => {
    fetchParks();
  }, []); // Pusta tablica zależności oznacza wykonanie tylko raz

  // --- Renderowanie ---

  if (loading) return <p>Ładowanie listy parków...</p>;
  // Poprawione wyświetlanie błędu
  if (error) return <p className={styles.error}>Błąd: {error}</p>;

  // Wyświetl listę parków, jeśli nie ma ładowania i błędów
  return (
    <div className={styles["park-list"]}>
      <h2>Lista Parków</h2>
      {parks.length === 0 ? (
        <p>Nie znaleziono żadnych parków.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Logo</th>
              <th>Nazwa</th>
              <th>ID Parku</th> 
            </tr>
          </thead>
          <tbody>
            {/* Iteruj po stanie 'parks' */}
            {parks.map((park) => (
              <tr key={park.park_id}>
                <td>
                  {/* Wyświetl logo jako obrazek */}
                  {park.park_logo_link ? (
                    <img
                      src={park.park_logo_link}
                      alt={`Logo ${park.name}`}
                      className={styles.parkLogo}
                    />
                  ) : (
                    <span>Brak logo</span>
                  )}
                </td>
                <td>{park.name}</td>
                <td>{park.park_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ParkList;