// src/components/ParkList/ParkList.tsx  (Zmień nazwę pliku i folderu)
import React, { useEffect, useState } from "react";
import styles from "./ParkList.module.scss"; // Możesz też zmienić nazwę pliku SCSS
import graphqlClient from "../../api/graphClient"; // Upewnij się, że ścieżka jest poprawna
// Importuj toast, jeśli chcesz używać powiadomień o błędach
// import { toast } from "react-toastify";

// Zdefiniuj typ dla obiektu Park na podstawie Twojego query
interface Park {
  park_id: number; // Zakładam, że ID jest liczbą
  name: string;
  park_logo_link: string;
}

const ParkList: React.FC = () => {
  // Zmieniono nazwę stanu i typ
  const [parks, setParks] = useState<Park[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Usunięto stany związane z edycją/usuwaniem transakcji
  // Usunięto useBalance

  // Funkcja do pobierania parków
  const fetchParks = async () => {
    // Użyj zapytania GraphQL dla parków
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
    setLoading(true); // Ustaw ładowanie przy każdym pobieraniu
    setError(""); // Zresetuj błąd

    try {
      // Wywołaj klienta GraphQL
      // Zakładam, że graphqlClient zwraca obiekt typu { data?: YourDataType, errors?: GraphQLError[] }
      const response = await graphqlClient(query);

      // Sprawdź, czy odpowiedź zawiera błędy GraphQL
      if (response?.errors && response.errors.length > 0) {
        console.error("GraphQL Errors:", response.errors);
        // Ustaw komunikat błędu na podstawie pierwszego błędu GraphQL lub generyczny
        setError(response.errors[0]?.message || "Wystąpił błąd podczas pobierania danych z serwera.");
        setParks([]); // Wyczyść dane w przypadku błędu
        // Opcjonalnie: pokaż toast z błędem
        // response.errors.forEach((err: { message: string }) => toast.error(err.message));
        return; // Przerwij dalsze przetwarzanie
      }

      // Sprawdź, czy odpowiedź zawiera dane i poprawne pole (np. 'parks')
      // Dostosuj 'response?.data?.parks' do faktycznej struktury odpowiedzi Twojego API
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
      // Opcjonalnie: pokaż toast z błędem
      // toast.error(message);
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
  if (error) return <p className={styles.error}>Błąd: {error}</p>; // Użyj klasy CSS dla błędu

  // Wyświetl listę parków, jeśli nie ma ładowania i błędów
  return (
    // Zmień nazwę klasy CSS, jeśli plik SCSS też został zmieniony
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
              <th>ID Parku</th> {/* Opcjonalnie możesz wyświetlić ID */}
              {/* Możesz dodać kolumnę 'Akcje' jeśli planujesz edycję/usuwanie */}
              {/* <th>Akcje</th> */}
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
                      className={styles.parkLogo} // Dodaj style dla rozmiaru logo
                    />
                  ) : (
                    <span>Brak logo</span> // Coś, jeśli linku do logo nie ma
                  )}
                </td>
                <td>{park.name}</td>
                <td>{park.park_id}</td> {/* Opcjonalnie */}
                {/* <td>
                  <button>Edytuj</button>
                  <button>Usuń</button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ParkList;